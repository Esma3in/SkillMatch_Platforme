<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Company;
use App\Models\Candidate;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Models\Administrator;
use App\Models\CompanyDocument;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Cookie;

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
    $validated = $request->validate([
        'email' => 'required|email|exists:users,email',
        'password' => 'required|min:8',
    ]);

    $user = User::where('email', $validated['email'])->first();

    if (!$user || !Hash::check($validated['password'], $user->password)) {
        return response()->json(['message' => 'Email or password incorrect'], 401);
    }

    session()->put('user', $user);

    // Create role-specific payload
    $payload = [];
    switch ($user->role) {
        case 'admin':
            $admin = Administrator::where('user_id', $user->id)->first();
            if (!$admin) return response()->json(['message' => 'Admin not found'], 404);
            $payload = ['admin' => $admin, 'role' => 'admin'];
            break;

        case 'candidate':
            $candidate = Candidate::where('user_id', $user->id)->first();
            if (!$candidate) return response()->json(['message' => 'Candidate not found'], 404);
            $payload = ['candidate' => $candidate, 'role' => 'candidate'];
            break;

        case 'company':
            $company = Company::where('user_id', $user->id)->first();
            if (!$company) return response()->json(['message' => 'Company not found'], 404);
            $payload = ['company' => $company, 'role' => 'company'];
            break;

        default:
            return response()->json(['message' => 'Invalid role'], 400);
    }

    $response = response()->json($payload);

    if ($request->remember_me) {
        $response->cookie('email', $user->email, 60)
                 ->cookie('password', $validated['password'], 60);
    }

    return $response;
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

   public function getCookie(Request $request)
{
    $email = $request->cookie('email');
    $password = $request->cookie('password');

    if ($email && $password) {
        return response()->json([
            'email' => $email,
            'password' => $password
        ]);
    }

    return response()->json(['message' => 'Cookies not found'], 404);
}
public function getSession(Request $request)
{
    $user = session('user');
    return response()->json($user);
}
public function sendEmailDesactiveAccount(Request $request)
{
    try {
        // Validate the incoming request
        $validated = $request->validate([
            'email' => 'required|email|exists:users,email'
        ]);

        $userEmail = $validated['email'];
        
        // Find the user by email
        $user = User::where('email', $userEmail)->first();
        
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User not found'
            ], 404);
        }

        // Admin email - you can set this in your .env file
        $adminEmail = env('ADMIN_EMAIL');
        
        // Email data
        $emailData = [
            'user_name' => $user->name ?? 'User',
            'user_email' => $user->email,
            'request_date' => now()->format('Y-m-d H:i:s'),
            'user_id' => $user->id
        ];

        // Send email to admin
        Mail::send('emails.deactivate-account-request', $emailData, function ($message) use ($adminEmail, $userEmail) {
            $message->to($adminEmail)
                    ->subject('Account Deactivation Request')
                    ->replyTo($userEmail);
        });

        // Optional: Log the request
        Log::info('Account deactivation request', [
            'user_id' => $user->id,
            'user_email' => $userEmail,
            'timestamp' => now()
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Deactivation request sent to administrator successfully'
        ], 200);

    } catch (\Illuminate\Validation\ValidationException $e) {
        return response()->json([
            'success' => false,
            'message' => 'Validation failed',
            'errors' => $e->errors()
        ], 422);
        
    } catch (\Exception $e) {
        Log::error('Error sending deactivation email: ' . $e->getMessage());
        
        return response()->json([
            'success' => false,
            'message' => 'Failed to send deactivation request. Please try again later.'
        ], 500);
    }
}

public function sendAppeal(Request $request)
{
    try {
        // Validate the incoming request
        $validated = $request->validate([
            'email' => 'required|email|exists:users,email',
            'appeal' => 'required|string|min:10|max:2000'
        ]);

        $userEmail = $validated['email'];
        $appealMessage = $validated['appeal'];
        
        // Find the user by email
        $user = User::where('email', $userEmail)->first();
        
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User not found'
            ], 404);
        }

        // Admin email - you can set this in your .env file
        $adminEmail = env('ADMIN_EMAIL');
        
        // Email data
        $emailData = [
            'user_name' => $user->name ?? 'User',
            'user_email' => $user->email,
            'user_id' => $user->id,
            'appeal_message' => $appealMessage,
            'request_date' => now()->format('Y-m-d H:i:s'),
            'appeal_preview' => Str::limit($appealMessage, 100)
        ];

        // Send email to admin
        Mail::send('emails.user-appeal', $emailData, function ($message) use ($adminEmail, $userEmail, $user) {
            $message->to($adminEmail)
                    ->subject('User Appeal - ' . ($user->name ?? 'User Account'))
                    ->replyTo($userEmail, $user->name ?? 'User');
        });

        // Optional: Store the appeal in database for tracking
        // You might want to create an appeals table for this
        /*
        Appeal::create([
            'user_id' => $user->id,
            'user_email' => $userEmail,
            'message' => $appealMessage,
            'status' => 'pending',
            'submitted_at' => now()
        ]);
        */

        // Log the appeal request
        Log::info('User appeal submitted', [
            'user_id' => $user->id,
            'user_email' => $userEmail,
            'appeal_length' => strlen($appealMessage),
            'timestamp' => now()
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Your appeal has been sent to the administrator successfully. You will receive a response soon.'
        ], 200);

    } catch (\Illuminate\Validation\ValidationException $e) {
        return response()->json([
            'success' => false,
            'message' => 'Validation failed',
            'errors' => $e->errors()
        ], 422);
        
    } catch (\Exception $e) {
        Log::error('Error sending appeal email: ' . $e->getMessage());
        
        return response()->json([
            'success' => false,
            'message' => 'Failed to send appeal. Please try again later.'
        ], 500);
    }
}

}
