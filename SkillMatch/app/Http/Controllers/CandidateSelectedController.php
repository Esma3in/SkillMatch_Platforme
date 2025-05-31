<?php

namespace App\Http\Controllers;

use App\Models\Company;
use Illuminate\Http\Request;
use App\Models\CandidateSelected;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class CandidateSelectedController extends Controller
{
    public function getSelectedCandidates(Request $request)
    {
        $companyId = $request->query('company_id');

        $company = Company::withCount('selectedCandidates')
            ->with([
                'selectedCandidates.candidate' => function ($query) {
                    $query->select('id', 'name', 'email');
                },
                'selectedCandidates.candidate.profile' => function ($query) {
                    $query->select(
                        'id',
                        'candidate_id',
                        'last_name',
                        'field',
                        'localisation',
                        'phoneNumber',
                        'photoProfil',
                        'experience',
                        'formation',
                        'competenceList',
                        'description',
                        'projects',
                        'file'
                    );
                },
                'selectedCandidates.candidate.tests'
            ])
            ->where('id', $companyId)
            ->first();

        return response()->json($company);
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
