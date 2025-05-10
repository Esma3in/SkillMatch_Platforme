<?php

namespace App\Http\Controllers;

use App\Models\Administrator;
use App\Models\User;
use App\Models\Company;
use App\Models\Candidate;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function SignUp(Request $request)
    {
        // Validate important fields
        $validatedImportentfields = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:8',
            'role' => 'required|in:candidate,company', // Added validation for role to only accept 'candidate' or 'company'
        ]);

        // Hash the password before storing
        $validatedImportentfields['password'] = Hash::make($validatedImportentfields['password']);

        // Create the user
        $user = User::create($validatedImportentfields);

        // Check the role and create the related data
        switch ($validatedImportentfields['role']) {
            case 'candidate':
                // Create candidate record
                $candidate = Candidate::create([
                    'user_id' => $user->id,
                    'name' => $validatedImportentfields['name'],
                    'email' => $validatedImportentfields['email'],
                    'password' => $validatedImportentfields['password']
                ]);
                return response()->json($candidate, 201);

            case 'company':
                // Validate secondary fields for companies
                $validatedSecondaryfields = $request->validate([
                    'sector' => 'required|string|max:255',
                    'file' => 'required|mimes:pdf,docx|max:10240', // Added max size to files
                    'logo' => 'required|mimes:png,jpg,jpeg|max:2048', // Max size for logo image
                ]);

                // Handle file upload for the company sector file and logo
                $filePath = $request->file('file')->store('files', 'public');
                $logoPath = $request->file('logo')->store('images', 'public');

                // Create company record
                $company = Company::create([
                    'user_id' => $user->id,
                    'name' => $validatedImportentfields['name'],
                    'file' => $filePath,
                    'logo' => $logoPath,
                    'sector' => $validatedSecondaryfields['sector']
                ]);
                return response()->json($company, 201);

            default:
                // If role is not recognized, return an error
                return response()->json(['error' => 'Invalid role'], 400);
        }
    }

    public function SignIn(Request $request)
    {
        // Validate input
        

        if($request->role==='admin'){
            $validated = $request->validate([
                'email' => 'required|email|exists:administrators,email',
                'password' => 'required|min:8',
                'role' => 'required|in:admin',
            ]);
            $admin = Administrator::where('email',$validated['email'])->first();
            if (!$admin || !Hash::check($validated['password'], $admin->password)) {
                return response()->json(['message' => 'Email or password incorrect'], 401);
            }
            return response()->json(['admin'=>$admin,'role'=>$validated['role']],200);
        }else{
            $validated = $request->validate([
                'email' => 'required|email|exists:users,email',
                'password' => 'required|min:8',
                'role' => 'required|in:candidate,company',
            ]);
   // Retrieve the user by email
        $user = User::where('email', $validated['email'])->first();

        // Check if user exists and if the password is correct
        if (!$user || !Hash::check($validated['password'], $user->password)) {
            return response()->json(['message' => 'Email or password incorrect'], 401);
        }

        // Check user role and return corresponding data
        switch ($validated['role']) {
            case 'candidate':
                $candidate = Candidate::where('user_id', $user->id)->first(); // Use first() to get a single record
                if (!$candidate) {
                    return response()->json(['message' => 'Candidate not found'], 404);
                }
                return response()->json(['candidate' => $candidate, 'role' => $validated['role']], 200); // Return candidate data

            case 'company':
                $company = Company::where('user_id', $user->id)->first(); // Use first() to get a single record
                if (!$company) {
                    return response()->json(['message' => 'Company not found'], 404);
                }
                return response()->json(['company' => $company, 'role' => $validated['role']], 200); 
                
            }
            return response()->json(['user'=>$user->id], 400);
        }
        
    }
    public function getBannedUsers()
        {
            // Get banned candidates
            $bannedCandidates = User::where('role', 'candidate')
                ->whereHas('candidate', function ($query) {
                    $query->where('state', 'banned');
                })
                ->with('candidate')
                ->get();

            // Get banned companies
            $bannedCompanies = User::where('role', 'company')
                ->whereHas('company', function ($query) {
                    $query->where('state', 'banned');
                })
                ->with('company')
                ->get();

            // Merge both collections
            $Users = $bannedCandidates->merge($bannedCompanies);

            return response()->json($Users, 200);
    }
    public function setstate(Request $request)
        {
            $request->validate([
                'user_id' => 'required',  // We're using user_id here
                'state' => 'required|in:waiting,banned',
            ]);

            // Find the user by user_id (foreign key)
            $user = User::where('id', $request->user_id)->first();

            if (!$user) {
                return response()->json(['error' => 'User not found'], 404);
            }

            // Check the user's role and update the state in the related model (Candidate or Company)
            if ($user->role === 'candidate') {
                // Fetch the candidate using the user_id
                $candidate = $user->candidate; // Relation assumed to be defined

                if (!$candidate) {
                    return response()->json(['error' => 'Candidate not found'], 404);
                }

                // Update the candidate's state
                $candidate->update(['state' => $request->state]);

            } elseif ($user->role === 'company') {
                // Fetch the company using the user_id
                $company = $user->company; // Relation assumed to be defined

                if (!$company) {
                    return response()->json(['error' => 'Company not found'], 404);
                }

                // Update the company's state
                $company->update(['state' => $request->state]);
            } else {
                return response()->json(['error' => 'Invalid user role'], 400);
            }

            return response()->json(['message' => 'User state updated successfully'], 200);
        }


}
