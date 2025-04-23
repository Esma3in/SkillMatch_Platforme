<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;




class EnsureSessionStarted
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): \Symfony\Component\HttpFoundation\Response  $next
     * @return \Symfony\Component\HttpFoundation\Response
     */

    public function handle(Request $request, Closure $next)
    {
        if (!session()->has('candidate_id')) {
              
            return response()->json(['message' => 'You are not connected'], 401); // 🔁 Use 401 Unauthorized
        }
    }

}