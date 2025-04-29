<?php

namespace App\Http\Controllers;

use App\Models\Qcm;
use Illuminate\Http\Request;

class QcmController extends Controller
{
    public function index()
    {
        $qcms = Qcm::all();
        return response()->json($qcms);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'question' => 'required|string',
            'option_a' => 'required|string',
            'option_b' => 'required|string',
            'option_c' => 'required|string',
            'option_d' => 'required|string',
            'correct_option' => 'required|in:A,B,C,D',
        ]);

        $qcm = Qcm::create($validated);
        return response()->json($qcm, 201);
    }

    public function show(Qcm $qcm)
    {
        return response()->json($qcm);
    }

    public function update(Request $request, Qcm $qcm)
    {
        $validated = $request->validate([
            'question' => 'sometimes|required|string',
            'option_a' => 'sometimes|required|string',
            'option_b' => 'sometimes|required|string',
            'option_c' => 'sometimes|required|string',
            'option_d' => 'sometimes|required|string',
            'correct_option' => 'sometimes|required|in:A,B,C,D',
        ]);

        $qcm->update($validated);
        return response()->json($qcm);
    }

    public function destroy(Qcm $qcm)
    {
        $qcm->delete();
        return response()->json(['message' => 'QCM deleted successfully']);
    }
}
