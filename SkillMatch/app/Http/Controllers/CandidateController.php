<?php

namespace App\Http\Controllers;

use App\Models\Candidate;
use Illuminate\Http\Request;

class CandidateController extends Controller
{
    public function store(Request $request){
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:candidates,email',
            'password' => 'required|min:6',
        ]);
    
        // You might want to hash the password:
        $validated['password'] = bcrypt($validated['password']);
    
        $candidate = Candidate::create($validated);
    
        return response()->json($candidate, 201);
    }
}
