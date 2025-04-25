<?php

namespace App\Http\Controllers;

use App\Models\Language;
use Exception;
use Illuminate\Http\Request;

use function Laravel\Prompts\error;

class LanguageController extends Controller
{
    public function store(Request $request)
    {
        try {
           $credentials = $request->validate([
                'candidate_id' => 'required|exists:candidates,id',
                'language' => 'required|string|max:255|unique:languages,language,NULL,id,candidate_id,' . $request->candidate_id,
                'level' => 'required|string|max:255'
            ]);
            
    
            Language::create($credentials);
    
            return response()->json([
                'message' => 'Language added successfully!'
            ], 200);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        }
    }
    
}
