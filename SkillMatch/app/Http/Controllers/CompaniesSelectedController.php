<?php

namespace App\Http\Controllers;

use App\Models\Candidate;
use App\Models\ProfileCompany;

use Illuminate\Http\Request;
use App\Models\CompaniesSelected;

class CompaniesSelectedController extends Controller
{
    public function CompaniesSelected($candidate_id, Request $request)
    {
        // Check if the user is authenticated
        $user = $request->user();


        // Find the candidate by ID
        $candidate = Candidate::find($candidate_id);
        if (!$candidate) {
            return response()->json(['error' => 'Candidate not found'], 404);
        }

        // Ensure the authenticated user matches the candidate
        if ($user!== $candidate->id) {
            return response()->json(['error' => 'Unauthorized. You can only access your own data.'], 403);
        }

        try {
            $selectedCompanies = ProfileCompany::where('candidate_id', $candidate->id)
                ->with('company') // Eager load the related Company model
                ->get()
                ->map(function ($profile) {
                    return [
                        'id' => $profile->id,
                        'candidate_id' => $profile->candidate_id,
                        'company_id' => $profile->company_id,
                        'company_name' => $profile->company->name ?? $profile->reasonSocial,
                        'roadmap_id' => $profile->roadmap_id ?? null,
                        'selected_date' => $profile->selected_date ?? $profile->DateCreation ?? now()->toDateString(),
                        'description' => $profile->company->description ?? 'No description available',
                        'location' => $profile->address ?? $profile->company->location ?? 'Unknown',
                        'website' => $profile->company->website ?? 'https://example.com',
                        'sector' => $profile->company->sector ?? 'Technology',
                        'email' => $profile->email,
                        'nbEmployers' => $profile->nbEmployers,
                        'capital' => $profile->capital,
                        'status' => $profile->status
                    ];
                });

            if ($selectedCompanies->isEmpty()) {
                return response()->json(['message' => 'No selected companies found'], 200);
            }

            return response()->json($selectedCompanies);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch selected companies: ' . $e->getMessage()], 500);
        }
    }
}
