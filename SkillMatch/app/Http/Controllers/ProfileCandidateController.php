<?php

namespace App\Http\Controllers;

use App\Models\Candidate;
use App\Models\ProfileCandidate;
use Illuminate\Http\Request;

class ProfileCandidateController extends Controller
{
    public function EditDescription(Request $request)
    {
        $credentials = $request->validate([
            'candidate_id' => 'required|exists:candidates,id',
            'description' => 'required|min:10',
        ]);
    
        ProfileCandidate::where('candidate_id', $credentials['candidate_id'])->update([
            'description' => $credentials['description']
        ]);
    
        return response()->json(['message' => 'Description updated successfully.'], 200);
    }
    
}
