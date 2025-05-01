<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PrerequisitesController extends Controller
{
    /**
     * Get all prerequisites, optionally filtered by skill_id
     */
    public function index(Request $request)
    {
        $skillId = $request->query('skill_id');

        $query = DB::table('prerequisites');

        if ($skillId) {
            $query->where('skill_id', $skillId);
        }

        $prerequisites = $query->get();

        return response()->json([
            'success' => true,
            'data' => $prerequisites
        ]);
    }
}
