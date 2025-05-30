<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Company;
use App\Models\Candidate;
use Illuminate\Http\Request;
use App\Models\Administrator;
use App\Models\CompanyDocument;
use Illuminate\Support\Facades\Log;
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


        // Check the role and create the related data
        switch ($validatedImportentfields['role']) {
            case 'candidate':
                // Create candidate record
                $user = User::create($validatedImportentfields);
                $candidate = Candidate::create([
                    'user_id' => $user->id,
                    'name' => $validatedImportentfields['name'],
                    'email' => $validatedImportentfields['email'],
                    'password' => $validatedImportentfields['password']
                ]);
                return response()->json($candidate, 201);

            case 'company':
                // Create company record
                $user = User::create($validatedImportentfields);
                $company = Company::create([
                    'user_id' => $user->id,
                    'name' => $validatedImportentfields['name'],
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

        $validated = $request->validate([
            'email' => 'required|email|exists:users,email',
            'password' => 'required|min:8',
        ]);
        // Retrieve the user by email
        $user = User::where('email', $validated['email'])->first();

        // Check if user exists and if the password is correct
        if (!$user || !Hash::check($validated['password'], $user->password)) {
            return response()->json(['message' => 'Email or password incorrect'], 401);
        }
        Log::info($user);

        // Check user role and return corresponding data
        switch ($user->role) {
            case 'admin':
                $admin = Administrator::where('user_id', $user->id)->first(); // Use first() to get a single record
                if (!$admin) {
                    return response()->json(['message' => 'admin not found'], 404);
                }
                return response()->json(['admin' => $admin, 'role' => $user->role], 200); // Return candidate data
            case 'candidate':
                $candidate = Candidate::where('user_id', $user->id)->first(); // Use first() to get a single record
                if (!$candidate) {
                    return response()->json(['message' => 'Candidate not found'], 404);
                }
                return response()->json(['candidate' => $candidate, 'role' => $user->role], 200); // Return candidate data

            case 'company':
                $company = Company::where('user_id', $user->id)->first(); // Use first() to get a single record
                if (!$company) {
                    return response()->json(['message' => 'Company not found'], 404);
                }
                return response()->json(['company' => $company, 'role' => $user->role], 200);
        }
        return response()->json(['user' => $user->id], 400);
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

    public function deleteUser(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
        ]);

        // Find the user
        $user = User::find($request->user_id);

        if (!$user) {
            return response()->json(['error' => 'User not found'], 404);
        }

        // Check the user's role and delete the related model
        if ($user->role === 'candidate') {
            // Delete the candidate
            if ($user->candidate) {
                $user->candidate->delete();
            }
        } elseif ($user->role === 'company') {
            // Delete the company
            if ($user->company) {
                $user->company->delete();
            }
        }

        // Delete the user
        $user->delete();

        return response()->json(['message' => 'User deleted successfully'], 200);
    }

    public function unbanUser(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
        ]);

        // Find the user
        $user = User::find($request->user_id);

        if (!$user) {
            return response()->json(['error' => 'User not found'], 404);
        }

        // Check the user's role and update the state in the related model
        if ($user->role === 'candidate') {
            // Update the candidate's state
            if ($user->candidate) {
                $user->candidate->update(['state' => 'active']);
            } else {
                return response()->json(['error' => 'Candidate not found'], 404);
            }
        } elseif ($user->role === 'company') {
            // Update the company's state
            if ($user->company) {
                $user->company->update(['state' => 'active']);
            } else {
                return response()->json(['error' => 'Company not found'], 404);
            }
        } else {
            return response()->json(['error' => 'Invalid user role'], 400);
        }

        return response()->json(['message' => 'User unbanned successfully'], 200);
    }

    /**
     * Get statistics about users for admin dashboard
     */
    public function getUserStats()
    {
        // Count total users
        $totalUsers = User::count();

        // Count companies
        $totalCompanies = User::where('role', 'company')->count();

        // Count candidates
        $totalCandidates = User::where('role', 'candidate')->count();

        // Count banned users
        $bannedCandidates = User::where('role', 'candidate')
            ->whereHas('candidate', function ($query) {
                $query->where('state', 'banned');
            })->count();

        $bannedCompanies = User::where('role', 'company')
            ->whereHas('company', function ($query) {
                $query->where('state', 'banned');
            })->count();

        $bannedUsers = $bannedCandidates + $bannedCompanies;

        return response()->json([
            'totalUsers' => $totalUsers,
            'totalCompanies' => $totalCompanies,
            'totalCandidates' => $totalCandidates,
            'bannedUsers' => $bannedUsers
        ]);
    }

    /**
     * Get recent activity for admin dashboard
     * Returns activities sorted in descending order (newest first)
     * The frontend may reverse this order if ascending display (oldest first) is needed
     */
    public function getRecentActivity()
    {
        // Get recent user registrations
        $recentUsers = User::with(['candidate', 'company'])
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get()
            ->map(function ($user) {
                $data = [
                    'type' => 'user_joined',
                    'time' => $user->created_at->diffForHumans(),
                ];

                if ($user->role === 'candidate' && $user->candidate) {
                    $data['user'] = $user->candidate->name;
                    $data['role'] = 'candidate';
                } elseif ($user->role === 'company' && $user->company) {
                    $data['company'] = $user->company->name;
                    $data['type'] = 'company_joined';
                }

                return $data;
            });

        // Get recently banned users
        $recentBanned = User::with(['candidate', 'company'])
            ->whereHas('candidate', function ($query) {
                $query->where('state', 'banned');
            })
            ->orWhereHas('company', function ($query) {
                $query->where('state', 'banned');
            })
            ->orderBy('updated_at', 'desc')
            ->take(3)
            ->get()
            ->map(function ($user) {
                $data = [
                    'type' => 'user_banned',
                    'time' => $user->updated_at->diffForHumans(),
                    'reason' => 'Policy violation' // This would come from a real reason field in your database
                ];

                if ($user->role === 'candidate' && $user->candidate) {
                    $data['user'] = $user->candidate->name;
                } elseif ($user->role === 'company' && $user->company) {
                    $data['user'] = $user->company->name;
                }

                return $data;
            });

        // Combine activities and sort by time (most recent first)
        $activities = $recentUsers->concat($recentBanned)
            ->sortByDesc(function ($activity) {
                // Parse the human-readable time back to a timestamp for sorting
                // This is a simplified approach, you may want to use the actual timestamps
                return strtotime(str_replace(' ago', '', $activity['time']));
            })
            ->values()
            ->take(10);

        return response()->json($activities);
    }
}
