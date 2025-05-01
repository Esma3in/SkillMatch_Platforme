<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Company;
use App\Models\Candidate;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function SignUp(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:8',
            'role'=>'required',
        ]);


        $validated['password'] = Hash::make($validated['password']);

        $user = User::create($validated);

        switch ($validated['role']) {
            case 'candidate':
                $candidate = Candidate::create([
                    'user_id'=>$user->id,
                    'name'=>$validated['name'],
                    'email'=>$validated['email'],
                    'password'=>$validated['password']
                ]);
                return response()->json($candidate, 201);
                break;
                case 'company':
                    $company =Company::create([
                        'user_id'=>$user->id,
                        'name'=>$validated['name'],
                    ]);
                    return response()->json($company, 201);
                    break;
        }        
    }
}
