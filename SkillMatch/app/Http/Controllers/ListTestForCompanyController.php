<?php

namespace App\Http\Controllers;

use App\Models\Qcm;
use App\Models\Test;
use App\Models\Skill;
use App\Models\Company;
use App\Models\Candidate;
use Illuminate\Http\Request;

class ListTestForCompanyController extends Controller
{
    public function index(Request $request)
    {
        $perPage = $request->get('per_page', 10);
        $companyId = $request->get('company_id');

        // Construction de la requête avec filtrage par company_id
        $query = Test::with(['qcm', 'company', 'skill']);

        // Filtrer par company_id si fourni
        if ($companyId) {
            $query->where('company_id', $companyId);
        }

        $tests = $query->orderBy('created_at', 'desc')->paginate($perPage);

        $tests->getCollection()->transform(function ($test) {
            // On récupère les résultats liés à ce test via le qcm_id
            $results = \App\Models\Result::with('candidate')
                ->where('qcm_for_roadmapId', $test->qcm_id)
                ->get();

            $test->resolved_by_count = $results->count();
            $test->resolved_by_details = $results->map(function ($result) {
                return [
                    'id' => $result->candidate->id,
                    'name' => $result->candidate->name,
                    'email' => $result->candidate->email,
                    'score' => $result->score,
                    'completed_at' => $result->created_at,
                ];
            });

            return $test;
        });

        return response()->json([
            'success' => true,
            'data' => $tests->items(),
            'pagination' => [
                'current_page' => $tests->currentPage(),
                'last_page' => $tests->lastPage(),
                'per_page' => $tests->perPage(),
                'total' => $tests->total(),
                'from' => $tests->firstItem(),
                'to' => $tests->lastItem()
            ]
        ]);
    }

    public function show($id)
    {
        $test = Test::with(['qcm', 'company', 'skill', 'steps'])->find($id);

        if (!$test) {
            return response()->json([
                'success' => false,
                'message' => 'Test not found'
            ], 404);
        }

        $results = \App\Models\Result::with('candidate')
            ->where('qcm_for_roadmapId', $test->qcm_id)
            ->get();

        $resolvedByDetails = $results->map(function ($result) {
            return [
                'id' => $result->candidate->id,
                'name' => $result->candidate->name,
                'email' => $result->candidate->email,
                'score' => $result->score,
                'completed_at' => $result->created_at,
                'formatted_date' => $result->created_at->format('M j, Y'),
            ];
        });

        $test->resolved_by_count = $resolvedByDetails->count();
        $test->resolved_by_details = $resolvedByDetails;

        return response()->json([
            'success' => true,
            'data' => $test
        ]);
    }

    public function destroy($id)
    {
        try {
            $test = Test::find($id);

            if (!$test) {
                return response()->json([
                    'success' => false,
                    'message' => 'Test not found'
                ], 404);
            }

            $test->delete();

            return response()->json([
                'success' => true,
                'message' => 'Test deleted successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error deleting test: ' . $e->getMessage()
            ], 500);
        }
    }

    public function destroyMultiple(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'integer|exists:tests,id'
        ]);

        try {
            $query = Test::whereIn('id', $request->ids);

            $deletedCount = $query->delete();

            return response()->json([
                'success' => true,
                'message' => "{$deletedCount} tests deleted successfully"
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error deleting tests: ' . $e->getMessage()
            ], 500);
        }
    }

    public function getResolvedByDetails($testId)
    {
        $test = Test::find($testId);

        if (!$test) {
            return response()->json([
                'success' => false,
                'message' => 'Test not found'
            ], 404);
        }

        $resolvedByDetails = $test->candidate()
            ->select(
                'candidates.id',
                'candidates.name',
                'candidates.email',
                'candidates.state'
            )
            ->withPivot('score', 'created_at', 'updated_at')
            ->get()
            ->map(function ($candidate) {
                return [
                    'candidate_id' => $candidate->id,
                    'name' => $candidate->name,
                    'email' => $candidate->email,
                    'state' => $candidate->state,
                    'score' => $candidate->pivot->score,
                    'completed_at' => $candidate->pivot->created_at,
                    'updated_at' => $candidate->pivot->updated_at,
                    'formatted_date' => $candidate->pivot->created_at->format('M j, Y'),
                    'formatted_time' => $candidate->pivot->created_at->format('H:i')
                ];
            });

        return response()->json([
            'success' => true,
            'test_id' => $testId,
            'test_title' => $test->objective,
            'total_resolved' => $resolvedByDetails->count(),
            'resolved_by' => $resolvedByDetails
        ]);
    }

    public function filter(Request $request)
    {
        $query = Test::with(['qcm', 'company', 'skill', 'candidate']);

        // Toujours filtrer par company_id si fourni
        if ($request->has('company_id') && $request->company_id) {
            $query->where('company_id', $request->company_id);
        }

        if ($request->has('skill_id') && $request->skill_id) {
            $query->where('skill_id', $request->skill_id);
        }

        if ($request->has('level') && $request->level) {
            $query->whereHas('qcm', function($q) use ($request) {
                $q->where('level', $request->level);
            });
        }

        $perPage = $request->get('per_page', 10);
        $tests = $query->orderBy('created_at', 'desc')->paginate($perPage);

        $tests->getCollection()->transform(function ($test) {
            $test->resolved_by_count = $test->candidate()->count();
            return $test;
        });

        return response()->json([
            'success' => true,
            'data' => $tests->items(),
            'pagination' => [
                'current_page' => $tests->currentPage(),
                'last_page' => $tests->lastPage(),
                'per_page' => $tests->perPage(),
                'total' => $tests->total()
            ]
        ]);
    }
}
