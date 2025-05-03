<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\QcmForRoadmap;
use Illuminate\Support\Facades\DB;

class QcmForRoadmapController extends Controller
{
    //get qcm for roadmap
    public function index($id){
        $results = DB::table('qcm_for_roadmaps')
        ->join('roadmaps', 'qcm_for_roadmaps.skill_id', '=', 'roadmaps.skill_id')
        ->select('qcm_for_roadmaps.*', 'roadmaps.*')
        ->where('qcm_for_roadmaps.skill_id', $id)
        ->get();
        return response()->json($results);
    }
}
