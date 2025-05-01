<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ToolsController extends Controller
{
    /**
     * Get all tools
     */
    public function index()
    {
        $tools = DB::table('tools')->get();

        return response()->json([
            'success' => true,
            'data' => $tools
        ]);
    }
}
