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
    public function storeProfile(Request $request)
    {

        $validated = $request->validate([
            'field' => 'required|string|max:255',
            'lastName' => 'required|string|max:255',
            'phone' => 'required|string|regex:/^\+?[0-9\s\-]{6,20}$/',
            'file' => 'required|file|mimes:pdf,doc,docx|max:2048',
            'projects' => 'required|string',
            'location' => 'required|string|max:255',
            'photoProfile' => 'required|image|mimes:jpeg,png,jpg|max:2048',
            'candidate_id' => 'required'
        ]);

        $photoPath = $request->file('photoProfile')->store('images', 'public');
        $filePath = $request->file('file')->store('files', 'public');

        $profile = ProfileCandidate::create([

            'field' => $validated['field'],
            'last_name' => $validated['lastName'],
            'phoneNumber' => $validated['phone'],
            'file' => $filePath,
            'projects' => $validated['projects'],
            'localisation' => $validated['location'],
            'photoProfil' => $photoPath,
            'candidate_id' => $validated['candidate_id']
        ]);

        return response()->json([
            'message' => 'Profile created successfully!',
            'data' => $profile,
        ], 201);
    }

}
