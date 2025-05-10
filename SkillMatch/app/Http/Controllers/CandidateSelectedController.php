<?php

namespace App\Http\Controllers;

use App\Models\Company;
use Illuminate\Http\Request;
use App\Models\CandidateSelected;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class CandidateSelectedController extends Controller
{
    public function getSelectedCandidates($id)
{
    $company = Company::find($id);

    if (!$company) {
        return response()->json(['message' => 'Company not found'],404);
    }

    // Eager load candidate profile
    $candidates = $company->candidates_selected()->with(['profile','badges'])->paginate(10);

    if ($candidates->isEmpty()) {
        return response()->json(['message' => 'You don\'t select any candidates'],404);
    }

    return response()->json($candidates);
}

public function delete(Request $request)
{
    $validated = $request->validate([
        'company_id'   => 'required',
        'candidate_id' => 'required',
    ]);

    try {
        $deleted = DB::table('candidate_selecteds')
            ->where('candidate_id', $validated['candidate_id'])
            ->where('company_id', $validated['company_id'])
            ->delete();

        if ($deleted) {
            return response()->json([
                'message' => 'Candidate selection successfully deleted.'
            ], 200);
        }

        return response()->json([
            'message' => 'No matching record found to delete.'
        ], 404);

    } catch (\Exception $e) {
        Log::error('Deletion failed: ' . $e->getMessage());

        return response()->json([
            'message' => 'An error occurred while deleting the record.',
            'error' => $e->getMessage()
        ], 500);
    }
}

}
