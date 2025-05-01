<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CandidateCoursesController extends Controller
{
    /**
     * Get all candidate courses
     */
    public function index()
    {
        $courses = DB::table('candidate_courses')->get();

        return response()->json([
            'success' => true,
            'data' => $courses
        ]);
    }
}
