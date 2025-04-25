<?php

namespace App\Http\Controllers;

use App\Models\Challenge;
use Illuminate\Http\Request;

class ChallengeController extends Controller
{
    public function index(Request $request)
    {
        if ($request->expectsJson()) {
            // Pagination API avec relations
            $challenges = Challenge::with(['skill', 'candidates'])->paginate(10);
            return response()->json($challenges);
        }

        // Requête web (HTML)
        $challenges = Challenge::with('skill')->get();
        return view('challenges.index', compact('challenges'));
    }
    //get serie challenges
    public function getSerieChallenges($skill)
    {
        $challenges = Challenge::with('skill')
            ->whereHas('skill', function ($query) use ($skill) {
                $query->where('name', $skill);
            })
            ->get();

        return response()->json($challenges);
    }


}
