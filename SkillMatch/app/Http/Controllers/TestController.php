<?php

namespace App\Http\Controllers;

use App\Models\Qcm;
use App\Models\Test;
use App\Models\Skill;
use App\Models\Result;
use App\Models\Company;
use App\Models\Candidate;
use Illuminate\Http\Request;

class TestController extends Controller
{
    public function GetTestsCompanySelected($id)
    {
        $company = Company::find($id);

        if (!$company) {
            return response()->json(['error' => 'Company not found'], 404);
        }

        // Eager load the skill relationship
        $tests = $company->tests()->with(['company', 'skill'])->paginate(10);

        if ($tests->isEmpty()) {
            return response()->json('This company dont have any test for now', 404);
        }

        return response()->json($tests, 200);
    }
    public function getTest($id)
    {
        $test = Test::with(['qcm', 'steps', 'skill'])->find($id);


        if (!$test) {
            return response()->json('test not found', 404);
        }
        return response()->json($test, 200);
    }

    public function storeResult(Request $request)
    {
        $validated = $request->validate([
            'candidate_id' => 'required|exists:candidates,id',
            'test_id' => 'required|exists:tests,id',
            'answer' => 'required|string',
        ]);
        $result = Result::where('candidate_id',$request->candidate_id)->where('test_id',$request->TestId)->first();

       if($result){
        return response()->json(['message'=>'the test are resolved'],401);
       }

        // Eager load the qcm relation
        $test = Test::with('qcm')->find($validated['test_id']);

        if (!$test) {
            return response()->json(['message' => 'Test not found.'], 404);
        }

        // Ensure qcm exists and has the correct_answer field
        if (!$test->qcm || !isset($test->qcm->corrected_option)) {
            return response()->json(['message' => 'Correct answer not found in test QCM.'], 400);
        }

        $correct_answer = $test->qcm->corrected_option;
        $score = $validated['answer'] === $correct_answer ? 100 : 0;

        Result::create([
            'candidate_id' => $validated['candidate_id'],
            'test_id' => $validated['test_id'],
            'score' => $score,
            'candidateAnswer' => $validated['answer'],
            'correctAnswer' => $correct_answer,
        ]);

        return response()->json([
            'message' => 'Your response has been registered.',
            'score' => $score
        ], 200);
    }


    public function getResult($candidate_id,$TestId){
        $test = Test::find($TestId);
        $candidate = Candidate::find($candidate_id);
        $results = Result::where('candidate_id',$candidate_id)->where('test_id',$TestId)->first();

        if(!$results){
            return response()->json(['message'=>'result not found'],401);
        }

        return response()->json(['candidate'=>$candidate,'result'=>$results,'test'=>$test]);
    }




    //for company
    /**
     * Get paginated list of tests
     */
    public function index(Request $request)
    {
        $tests = Test::with(['skill', 'candidate'])
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return response()->json([
            'tests' => $tests,
        ]);
    }

    /**
     * Get candidates who solved a specific test
     */
    public function getSolvedCandidates($id)
    {
        $test = Test::findOrFail($id);
        $candidates = $test->candidate()->get();

        return response()->json([
            'candidates' => $candidates,
        ]);
    }

    /**
     * Delete all tests
     */
    public function deleteAll()
    {
        // You might want to add authorization check here
        Test::truncate();
        // Or if you want to delete only tests for a specific company
        // Test::where('company_id', auth()->user()->company_id)->delete();

        return response()->json([
            'message' => 'All tests have been deleted successfully',
        ]);
    }

    /**
     * Create a new test
     */
    public function store(Request $request)
    {
        // Validate request data
        $validatedData = $request->validate([
            'objective' => 'required|string|max:255',
            'prerequisites' => 'nullable|string',
            'tools_required' => 'nullable|string',
            'before_answer' => 'nullable|string',
            'qcm_id' => 'nullable|exists:qcms,id',
            'company_id' => 'required|exists:companies,id',
            'skill_id' => 'required|exists:skills,id',
        ]);

        try {
            // Create the test
            $test = Test::create([
                'objective' => $validatedData['objective'],
                'prerequisites' => $validatedData['prerequisites'],
                'tools_required' => $validatedData['tools_required'],
                'before_answer' => $validatedData['before_answer'],
                'qcm_id' => $validatedData['qcm_id'],
                'company_id' => $validatedData['company_id'],
                'skill_id' => $validatedData['skill_id'],
            ]);

            // Attach the skill to the test_skills pivot table
            if (isset($validatedData['skill_id'])) {
                $test->skills()->attach($validatedData['skill_id']);
            }

            return response()->json([
                'message' => 'Test created successfully',
                'test' => $test->load(['company', 'skill', 'qcm']),
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to create test',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get a list of all QCMs
     */
    public function getQcms()
    {
        try {
            $qcms = Qcm::select('id', 'question')->get();
            return response()->json($qcms, 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to fetch QCMs',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get a list of all companies
     */
    public function getCompanies()
    {
        try {
            $companies = Company::select('id', 'name')->get();
            return response()->json($companies, 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to fetch companies',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get a list of all skills
     */
    public function getSkills()
    {
        try {
            $skills = Skill::select('id', 'name')->get();
            return response()->json($skills, 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to fetch skills',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Delete a specific test
     */
    public function destroy($id)
    {
        $test = Test::findOrFail($id);
        $test->delete();

        return response()->json([
            'message' => 'Test deleted successfully',
        ]);
    }
}
