<?php

namespace App\Http\Controllers;

use App\Models\Company;
use App\Models\Candidate;
use App\Models\ProfileCandidate;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpKernel\Profiler\Profile;

class CandidateController extends Controller
{

    public function CompaniesMatched($id) {
        $candidate = Candidate::with(['skills'])->findOrFail($id);
        Log::info($candidate);
        $candidateSkillIds = $candidate->skills->pluck('id')->toArray();
        Log::info($candidateSkillIds);
        $companies = Company::with(['skills', 'profile'])->get();
        Log::info($companies);
        $companiesSuggested = [];
    
        foreach ($companies as $company) {
            $companySkillIds = $company->skills->pluck('id')->toArray();
            Log::info($companySkillIds);
            if (count(array_intersect($candidateSkillIds, $companySkillIds)) > 0) {
                $companiesSuggested[] = $company;
            }
        }
    
        return response()->json($companiesSuggested, 200);
    }
    public function store(Request $request){
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:candidates,email',
            'password' => 'required|min:6',
        ]);
    
        // You might want to hash the password:
        $validated['password'] = bcrypt($validated['password']);
        

        $candidate = Candidate::create($validated);
    
            session()->put('candidate_id',$candidate->id);
            return response()->json($candidate->id, 201);

    }

    // profile candidate
    public function storeProfile(Request $request)
    {
        // Validate the request data
        $validated = $request->validate([
            'firstName' => 'required|string|max:255',
            'lastName' => 'required|string|max:255',
            'phone' => 'required|string|regex:/^\+?[0-9\s\-]{6,20}$/',
            'file' => 'required|file|mimes:pdf,doc,docx|max:2048', // Max 2MB
            'projects' => 'required|string',
            'location' => 'required|string|max:255',
            'photoProfile' => 'required|image|mimes:jpeg,png,jpg|max:2048', // Max 2MB
        ]);

        // Handle file uploads
        $photoPath = $request->file('photoProfile')->store('photos', 'public');
        $filePath = $request->file('file')->store('files', 'public');

        // Create a new CandidateProfile record
        $profile = ProfileCandidate::create([
            'first_name' => $validated['firstName'],
            'last_name' => $validated['lastName'],
            'phoneNumber' => $validated['phone'],
            'file' => $filePath,
            'projects' => $validated['projects'],
            'location' => $validated['location'],
            'photoProfil' => $photoPath,
        ]);

        // Return a success response
        return response()->json([
            'message' => 'Profile created successfully!',
            'data' => $profile,
        ], 201);
    }
}
