<?php

namespace App\Http\Controllers;

use Mpdf\Mpdf;
use App\Models\Company;
use App\Models\Candidate;
use Illuminate\Http\Request;
use App\Models\ProfileCandidate;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Hash;

class CandidateController extends Controller
{



    public function CompaniesMatched($id)
    {
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
    public function SignUp(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:candidates,email',
            'password' => 'required|min:8',
        ]);

        $validated['password'] = Hash::make($validated['password']);

        $candidate = Candidate::create($validated);

        return response()->json($candidate, 201);
    }

    public function SignIn(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email|exists:candidates,email',
            'password' => 'required|min:8',
        ]);

        $candidate = Candidate::where('email', $validated['email'])->first();

        if (!$candidate || !Hash::check($validated['password'], $candidate->password)) {
            return response()->json(['message' => 'Email or password incorrect'], 401);
        }

        session()->put('candidate_id', $candidate->id);
        return response()->json(['id' => $candidate->id], 200);
    }
    public function Logout()
    {
        session()->forget('candidate_id'); // Remove the candidate ID from session
        session()->invalidate(); // Invalidate the session
        session()->regenerateToken(); // Regenerate the CSRF token for security

        return response()->json(['message' => 'Successfully logged out'], 200);
    }


    public function storeProfile(Request $request)
    {

        $validated = $request->validate([
            'field' => 'required|string|max:255',
            'lastName' => 'required|string|max:255',
            'phone' => 'required|string|regex:/^\+?[0-9\s\-]{6,20}$/',
            'file' => 'required|file|mimes:pdf,doc,docx|max:2048', // Max 2MB
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

    public function GetProfile($id)
    {
        $candidate = Candidate::with(['profile', 'languages'])->find($id);

        return response()->json($candidate, 200);
    }

    public function printCV($id)
    {
        ini_set('memory_limit', '256M');


        $candidate = Candidate::with(['profile', 'languages'])->find($id);


        if (!$candidate) {
            return response()->json(['error' => 'Candidate not found'], 404);
        }

        $mpdf = new \Mpdf\Mpdf();

        $html = '
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <title>Candidate CV</title>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 0;
                    padding: 0;
                    background-color: #f3f4f6;
                    color: #333;
                }
                .container {
                    max-width: 800px;
                    margin: 20px auto;
                    padding: 20px;
                    background-color: white;
                    border-radius: 8px;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                }
                .header {
                    display: flex;
                    justify-content: space-between;
                    border-bottom: 2px solid #ddd;
                    padding-bottom: 20px;
                    margin-bottom: 20px;
                }
                .header .info {
                    flex: 1;
                }
                .header img {
                    border-radius: 50%;
                    width: 100px;
                    height: 100px;
                    object-fit: cover;
                }
                h1 {
                    font-size: 24px;
                    margin-bottom: 5px;
                }
                h2 {
                    font-size: 20px;
                    margin-bottom: 10px;
                }
                .contact-info p, .bio p {
                    margin: 5px 0;
                }
                .languages ul {
                    padding-left: 20px;
                }
                .languages li {
                    margin: 5px 0;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <div class="info">
                        <h1>' . $candidate->name . ' ' . $candidate->profile->last_name . '</h1>
                        <h2>' . $candidate->profile->field . '</h2>
                    </div>';

        if ($candidate->profile->photoProfil) {
            $html .= '<img src="' . storage_path('/app/public/' . $candidate->profile->photoProfil) . '" alt="Profile Photo">';
        }

        $html .= '</div>
                <div class="contact-info">
                    <h2>Contact Information</h2>
                    <p><strong>Email:</strong> ' . $candidate->email . '</p>
                    <p><strong>Phone:</strong> ' . $candidate->profile->phoneNumber . '</p>
                    <p><strong>Location:</strong> ' . $candidate->profile->localisation . '</p>
                </div>
    
                <div class="languages">
                    <h2>Languages</h2>
                    <ul>';

        foreach ($candidate->languages as $language) {
            $html .= '<li>' . $language->language . ' - <span>' . $language->level . '</span></li>';
        }

        $html .= '</ul>
                </div>
    
                <div class="bio">
                    <h2>Bio</h2>
                    <p>' . nl2br(e($candidate->profile->description)) . '</p>
                </div>
            </div>
        </body>
        </html>';


        $mpdf->WriteHTML($html);
        return response($mpdf->Output('Candidate_info' . $id, 'I'))
            ->header('Content-Type', 'application/pdf')
            ->header('Content-Disposition', 'attachment; filename="candidate_cv.pdf"');
    }
}
