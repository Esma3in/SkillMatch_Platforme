<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class RoadmapController extends Controller
{
    // get prequisties 
    public function getPrerequisites($roadmap_id) {
        $prerequisites = DB::table('prerequisites')
            ->where('roadmap_id', $roadmap_id)
            ->get();
        return response()->json([
            'roadmap_id' => $roadmap_id,
            'candidate_id' => $prerequisites->first()->candidate_id ?? null,
            'prerequisites' => $prerequisites
        ]);
    }

    // get candidate courses 
    public function getCandidateCourses($roadmap_id){}
}
