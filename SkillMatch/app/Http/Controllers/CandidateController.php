<?php

namespace App\Http\Controllers;

use App\Models\Candidate;
use Illuminate\Http\Request;

class CandidateController extends Controller
{
    public function store(Request $request){
        $credentials =$request->validate([
            'name'=>'required',
            'dateInscription'=>'required',
            'files'=>'required',
        ] );
        $candidate = Candidate::create($credentials);
        return response()->json($candidate,200);
    }
}
