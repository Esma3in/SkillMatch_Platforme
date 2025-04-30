<?php

namespace App\Http\Controllers;

use App\Models\Candidate;
use App\Models\ProfileCandidate;
use App\Models\SocialMedia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class ProfileSettingsController extends Controller
{
    /**
     * Update candidate profile settings
     */
    public function updateProfile(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'candidate_id' => 'required|exists:candidates,id',
            'username' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone_number' => 'nullable|string|max:20',
            'biography' => 'nullable|string|max:500',
            'photo' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'social_media' => 'nullable|array',
            'social_media.facebook' => 'nullable|string|max:255',
            'social_media.twitter' => 'nullable|string|max:255',
            'social_media.discord' => 'nullable|string|max:255',
            'social_media.linkedin' => 'nullable|string|max:255',
            'social_media.github' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Update candidate basic info
        $candidate = Candidate::findOrFail($request->candidate_id);
        $candidate->name = $request->username;
        $candidate->email = $request->email;
        $candidate->save();

        // Get or create profile
        $profile = ProfileCandidate::firstOrCreate(
            ['candidate_id' => $request->candidate_id],
            ['field' => '', 'localisation' => '', 'phoneNumber' => '']
        );

        // Update profile fields
        $profile->phoneNumber = $request->phone_number;
        $profile->description = $request->biography;

        // Handle photo upload
        if ($request->hasFile('photo')) {
            // Delete old photo if exists
            if ($profile->photoProfil) {
                Storage::disk('public')->delete($profile->photoProfil);
            }

            $photoPath = $request->file('photo')->store('images', 'public');
            $profile->photoProfil = $photoPath;
        }

        $profile->save();

        // Handle social media links
        if ($request->has('social_media')) {
            foreach ($request->social_media as $platform => $url) {
                if (!empty($url)) {
                    SocialMedia::updateOrCreate(
                        [
                            'candidate_id' => $request->candidate_id,
                            'platform' => $platform
                        ],
                        ['url' => $url]
                    );
                }
            }
        }

        return response()->json([
            'message' => 'Profile settings updated successfully',
            'data' => [
                'candidate' => $candidate,
                'profile' => $profile,
                'social_media' => $this->getSocialMedia($request->candidate_id)
            ]
        ], 200);
    }

    /**
     * Get candidate profile settings
     */
    public function getProfileSettings($id)
    {
        $candidate = Candidate::findOrFail($id);
        $profile = ProfileCandidate::where('candidate_id', $id)->first();
        $socialMedia = $this->getSocialMedia($id);

        return response()->json([
            'candidate' => $candidate,
            'profile' => $profile,
            'social_media' => $socialMedia
        ]);
    }

    /**
     * Get social media links for a candidate
     */
    private function getSocialMedia($candidateId)
    {
        $socialMedia = SocialMedia::where('candidate_id', $candidateId)->get();
        $formattedSocialMedia = [];

        foreach ($socialMedia as $platform) {
            $formattedSocialMedia[$platform->platform] = $platform->url;
        }

        return $formattedSocialMedia;
    }

    /**
     * Change password
     */
    public function changePassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'candidate_id' => 'required|exists:candidates,id',
            'current_password' => 'required|string',
            'new_password' => 'required|string|min:8|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $candidate = Candidate::findOrFail($request->candidate_id);

        // Verify current password
        if (!password_verify($request->current_password, $candidate->password)) {
            return response()->json(['error' => 'Current password is incorrect'], 401);
        }

        // Update password
        $candidate->password = bcrypt($request->new_password);
        $candidate->save();

        return response()->json(['message' => 'Password updated successfully'], 200);
    }

    /**
     * Delete profile picture
     */
    public function deleteProfilePicture(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'candidate_id' => 'required|exists:candidates,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $profile = ProfileCandidate::where('candidate_id', $request->candidate_id)->first();

        if ($profile && $profile->photoProfil) {
            Storage::disk('public')->delete($profile->photoProfil);
            $profile->photoProfil = null;
            $profile->save();
        }

        return response()->json(['message' => 'Profile picture deleted successfully'], 200);
    }
}
