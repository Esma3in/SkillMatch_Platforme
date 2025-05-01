<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SkillsRoadmapController extends Controller
{
    /**
     * Get all roadmap skills
     */
    public function index()
    {
        $skills = DB::table('roadmap_skills')->get();

        return response()->json([
            'success' => true,
            'data' => $skills
        ]);
    }
}
