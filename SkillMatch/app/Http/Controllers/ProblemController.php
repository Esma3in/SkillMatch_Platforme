<?php

namespace App\Http\Controllers;

use App\Models\Problem;
use Illuminate\Http\Request;

class ProblemController extends Controller
{
    public function index(Request $request)
    {
        $problems = Problem::with(['skill', 'candidates'])->paginate(10);

        if ($request->expectsJson()) {
            return response()->json($problems);
        }

        return view('problems.index', compact('problems'));
    }

    //get serie problems
    public function getSerieProblems($skill)
    {
        $problems = Problem::with('skill')
            ->whereHas('skill', function ($query) use ($skill) {
                $query->where('name', $skill);
            })
            ->get();

        return response()->json($problems);
    }


}
