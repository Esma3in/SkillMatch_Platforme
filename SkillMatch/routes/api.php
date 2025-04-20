<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CompanyController;
use App\Http\Controllers\CandidateController;
use App\Http\Middleware\EnsureSessionStarted;

// Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
//     return $request->user();
// });
Route::get('/sanctum/csrf-cookie', function () {
    return response()->json(['csrf' => csrf_token()]);
});



//candidate Routes :

Route::post('/store/candidate',[CandidateController::class,'store']);
Route::get('/candidate/suggestedcompanies/{id}',[CandidateController::class,'CompaniesMatched']);
Route::get('/candidate/companies/all',[CompanyController::class,'index']);


