<?php

namespace App\Http\Controllers;

use App\Models\Badge;
use Illuminate\Http\Request;

class BadgeController extends Controller
{
   public function  getBadges($candidate_id){
    $badges = Badge::with("QcmForRoadmap")->get();
    return response()->json($badges);
   }
}
