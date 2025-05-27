<?php

namespace App\Http\Controllers;

use App\Models\Company;
use App\Models\CompanyDocument;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class CompanyDocumentController extends Controller
{
    /**
     * Get all companies with their documents
     * With optional filtering
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        try {
            $query = Company::query()->with(['profile']);

            // Log the initial query count
            Log::info("Initial companies count: " . $query->count());

            // Filter documents by search term, document type, or status
            $query->with(['documents' => function($query) use ($request) {
                // Apply document filters if provided
                if ($request->has('search')) {
                    $search = $request->get('search');
                    $query->where('document_type', 'like', "%{$search}%");
                }

                if ($request->has('document_type')) {
                    $query->where('document_type', $request->get('document_type'));
                }

                if ($request->has('status')) {
                    $query->where('status', $request->get('status'));
                }
            }]);

            // Filter companies by name
            if ($request->has('company_name')) {
                $query->where('name', 'like', "%{$request->get('company_name')}%");
            }

            // Get the companies
            $companies = $query->get();

            // Log companies count and data
            Log::info("Companies found: " . $companies->count());

            foreach ($companies as $company) {
                Log::info("Company ID: {$company->id}, Name: {$company->name}, Documents count: " . $company->documents->count());
            }

            // Filter out companies with no matching documents when filters are applied
            if ($request->has('search') || $request->has('document_type') || $request->has('status')) {
                $companies = $companies->filter(function($company) {
                    return $company->documents->isNotEmpty();
                });

                // Log filtered results
                Log::info("Companies after filtering: " . $companies->count());
            }

            // Get pagination parameters
            $perPage = $request->get('per_page', 10); // Default 10 items per page
            $page = $request->get('page', 1);

            // Paginate the filtered results
            $paginator = collect($companies->values())->forPage($page, $perPage);
            $total = $companies->count();

            // Log paginated results
            Log::info("Companies after pagination: " . $paginator->count());

            return response()->json([
                'data' => $paginator->values(),
                'meta' => [
                    'current_page' => (int)$page,
                    'per_page' => (int)$perPage,
                    'total' => $total,
                    'total_pages' => ceil($total / $perPage),
                ]
            ], 200);
        } catch (\Exception $e) {
            Log::error('Error fetching company documents: ' . $e->getMessage());
            Log::error('Exception stack trace: ' . $e->getTraceAsString());
            return response()->json(['error' => 'Failed to retrieve companies and documents'], 500);
        }
    }

    /**
     * Get all documents with pagination and filtering
     * This endpoint returns documents directly, not nested within companies
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getAllDocuments(Request $request)
    {
        try {
            $query = CompanyDocument::query()
                ->with(['company' => function($query) {
                    $query->with('profile');
                }]);

            // Apply filters if provided
            if ($request->has('search')) {
                $search = $request->get('search');
                $query->where('document_type', 'like', "%{$search}%");
            }

            if ($request->has('document_type')) {
                $query->where('document_type', $request->get('document_type'));
            }

            if ($request->has('status')) {
                $query->where('status', $request->get('status'));
            }

            // Filter by company name if provided
            if ($request->has('company_name')) {
                $companyName = $request->get('company_name');
                $query->whereHas('company', function($q) use ($companyName) {
                    $q->where('name', 'like', "%{$companyName}%");
                });
            }

            // Paginate the results
            $perPage = $request->get('per_page', 10);
            $documents = $query->orderBy('created_at', 'desc')
                ->paginate($perPage);

            return response()->json($documents, 200);
        } catch (\Exception $e) {
            Log::error('Error fetching documents: ' . $e->getMessage());
            Log::error('Exception stack trace: ' . $e->getTraceAsString());
            return response()->json(['error' => 'Failed to retrieve documents'], 500);
        }
    }

    /**
     * Get document filter options (for dropdowns)
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getFilterOptions()
    {
        try {
            // Get all unique document types
            $documentTypes = CompanyDocument::select('document_type')
                ->distinct()
                ->orderBy('document_type')
                ->pluck('document_type');

            // Get status options
            $statusOptions = CompanyDocument::getStatusOptions();

            return response()->json([
                'documentTypes' => $documentTypes,
                'statusOptions' => $statusOptions
            ], 200);
        } catch (\Exception $e) {
            Log::error('Error fetching filter options: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to retrieve filter options'], 500);
        }
    }

    /**
     * Get documents for a specific company
     *
     * @param int $companyId
     * @return \Illuminate\Http\JsonResponse
     */
    public function getCompanyDocuments($companyId)
    {
        $company = Company::with('documents')->find($companyId);

        if (!$company) {
            return response()->json(['message' => 'Company not found'], 404);
        }

        return response()->json($company, 200);
    }

    /**
     * Upload a document for a company
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function upload(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'company_id' => 'required|exists:companies,id',
            'document_type' => 'required|string|max:255',
            'document' => 'required|file|mimes:pdf,doc,docx,txt|max:10240', // 10MB max, added txt for testing
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        if ($request->hasFile('document')) {
            $file = $request->file('document');
            $path = $file->store('company_documents', 'public');

            $document = CompanyDocument::create([
                'company_id' => $request->company_id,
                'document_type' => $request->document_type,
                'file_path' => $path,
                'is_validated' => false,
                'status' => 'pending'
            ]);

            return response()->json([
                'message' => 'Document uploaded successfully',
                'document' => $document
            ], 201);
        }

        return response()->json(['message' => 'No file uploaded'], 400);
    }

    /**
     * Update document status (valid or invalid)
     *
     * @param \Illuminate\Http\Request $request
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:valid,invalid'
        ]);

        $document = CompanyDocument::find($id);

        if (!$document) {
            return response()->json(['message' => 'Document not found'], 404);
        }

        $document->status = $request->status;
        $document->is_validated = ($request->status === 'valid'); // Keep is_validated field in sync
        $document->validated_at = now();
        $document->validated_by = Auth::id();
        $document->save();

        $statusMessage = $request->status === 'valid' ? 'validated' : 'invalidated';

        return response()->json([
            'message' => "Document {$statusMessage} successfully",
            'document' => $document
        ], 200);
    }

    /**
     * Validate a document (legacy method for backward compatibility)
     *
     * @param \Illuminate\Http\Request $request
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function validateDocument(Request $request, $id)
    {
        $request->merge(['status' => 'valid']);
        return $this->updateStatus($request, $id);
    }

    /**
     * Invalidate a document
     *
     * @param \Illuminate\Http\Request $request
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function invalidateDocument(Request $request, $id)
    {
        $request->merge(['status' => 'invalid']);
        return $this->updateStatus($request, $id);
    }

    /**
     * Download a document
     *
     * @param int $id
     * @return \Symfony\Component\HttpFoundation\BinaryFileResponse|\Illuminate\Http\JsonResponse
     */
    public function download($id)
    {
        $document = CompanyDocument::find($id);

        if (!$document) {
            return response()->json(['message' => 'Document not found'], 404);
        }

        $path = storage_path('app/public/' . $document->file_path);

        if (!file_exists($path)) {
            return response()->json(['message' => 'File not found'], 404);
        }

        return response()->download($path);
    }

    /**
     * Delete a document
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        $document = CompanyDocument::find($id);

        if (!$document) {
            return response()->json(['message' => 'Document not found'], 404);
        }

        // Delete file from storage
        Storage::disk('public')->delete($document->file_path);

        // Delete record from database
        $document->delete();

        return response()->json(['message' => 'Document deleted successfully'], 200);
    }

    /**
     * Preview a document (display in browser rather than download)
     *
     * @param int $id
     * @return \Illuminate\Http\Response|\Illuminate\Http\JsonResponse
     */
    public function preview($id)
    {
        $document = CompanyDocument::find($id);

        if (!$document) {
            return response()->json(['message' => 'Document not found'], 404);
        }

        $path = storage_path('app/public/' . $document->file_path);

        if (!file_exists($path)) {
            return response()->json(['message' => 'File not found'], 404);
        }

        // Get file extension to determine content type
        $extension = pathinfo($document->file_path, PATHINFO_EXTENSION);

        // Set content type based on file extension
        $contentType = 'application/octet-stream'; // Default

        switch (strtolower($extension)) {
            case 'pdf':
                $contentType = 'application/pdf';
                break;
            case 'doc':
                $contentType = 'application/msword';
                break;
            case 'docx':
                $contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
                break;
            case 'txt':
                $contentType = 'text/plain';
                break;
            case 'jpg':
            case 'jpeg':
                $contentType = 'image/jpeg';
                break;
            case 'png':
                $contentType = 'image/png';
                break;
        }

        // Return the file with the appropriate content type
        // This will display in the browser instead of downloading
        return response()->file($path, [
            'Content-Type' => $contentType,
            'Content-Disposition' => 'inline; filename="' . basename($document->file_path) . '"',
        ]);
    }
}
