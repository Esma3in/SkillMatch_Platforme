<?php
namespace App\Http\Controllers;
use App\Models\Challenge;
use App\Models\Problem;
use Illuminate\Http\Request;

class ChallengeController extends Controller
{
    public function index()
    {
        $challenges = Challenge::with('skill')
        ->withCount('candidates')
        ->paginate(10);
        return response()->json($challenges);
    }

    public function show(Challenge $challenge)
    {
        $challenge->load('skill');

        if (request()->expectsJson()) {
            return response()->json($challenge);
        }

        $problems = $challenge->problems()->with('skill')->get();
        return view('challenges.show', compact('challenge', 'problems'));
    }

    // New method to get problems related to a specific challenge
    public function getProblems(Challenge $challenge)
    {
        $problems = $challenge->problems()->with('skill')->get();

        // If the challenge doesn't have any directly linked problems,
        // get problems with the same skill and level
        if ($problems->isEmpty()) {
            $problems = Problem::with('skill')
                ->where('skill_id', $challenge->skill_id)
                ->where('level', $challenge->level)
                ->get();
        }

        return response()->json($problems);
    }

    // New method to redirect or proxy to training_app for challenge resolution
    public function resolve(Challenge $challenge)
    {
        // Assume training_app is accessible at http://localhost:3000 (adjust as needed)
        // Pass challenge id and skill info as query params
        $baseUrl = 'http://localhost:3000';
        $problems = $challenge->problems()->with('skill')->get();
        $problemId = $problems->first() ? $problems->first()->id : null;
        $skillName = $challenge->skill ? $challenge->skill->name : null;
        $url = $baseUrl . '/solve?challenge_id=' . $challenge->id;
        if ($problemId) {
            $url .= '&problem_id=' . $problemId;
        }
        if ($skillName) {
            $url .= '&skill=' . urlencode($skillName);
        }
        // Optionally, generate a signed token for security
        // $token = Str::random(32); // or JWT, etc.
        // $url .= '&token=' . $token;
        return response()->json(['redirect_url' => $url]);
    }
}
