<?php

use App\Http\Controllers\CandidateController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});
Route::get('/sanctum/csrf-cookie', function () {
    return response()->json(['csrf' => csrf_token()]);
});



//candidate Routes :


Route::get('/candidate/suggestedcompanies/{id}',[CandidateController::class,'CompaniesMatched']);


