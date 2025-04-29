<?php

use App\Models\Problem;
use App\Models\ProfileCandidate;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\SkillController;

use App\Http\Controllers\CompanyController;
use App\Http\Controllers\ProblemController;
use App\Http\Controllers\LanguageController;
use App\Http\Controllers\CandidateController;
use App\Http\Controllers\ChallengeController;
use App\Http\Controllers\ExperienceController;
use App\Http\Controllers\ProfileCandidateController;

// CSRF Token Route
Route::get('/sanctum/csrf-cookie', function () {
    return response()->json(['csrf' => csrf_token()]);
});

// Candidate Routes
Route::get('/candidate/CV/{id}', [CandidateController::class, 'printCV']);
Route::post('/candidate/signUp', [CandidateController::class, 'SignUp']);
Route::post('/profiles', [CandidateController::class, 'storeProfile']);
Route::get('/candidate/suggestedcompanies/{id}', [CandidateController::class, 'CompaniesMatched']);
Route::get('/candidate/companies/all', [CompanyController::class, 'index']);
Route::get('/ProfileCandidate/{id}', [CandidateController::class, 'GetProfile']);
Route::post('/candidate/NewLanguage', [LanguageController::class, 'store']);
Route::put('/candidate/setdescription', [ProfileCandidateController::class, 'EditDescription']);
Route::post('/candidate/signin', [CandidateController::class, 'SignIn']);
Route::get('/logout', [CandidateController::class, 'Logout']);
Route::get('/candidate/{id}',[CandidateController::class,'getCandidate']);
Route::get('/candidate/companyInfo/{id}',[CompanyController::class,'GetCompany']);

// Experience Routes
Route::post('/experiences', [ExperienceController::class, 'store']);
Route::get('/experiences/candidate/{candidateId}', [ExperienceController::class, 'getExperiencesByCandidate']);

// Skill Routes
Route::post('/skills', [SkillController::class, 'store']);
Route::get('/skills/candidate/{candidateId}', [SkillController::class, 'getSkillsByCandidate']);

// Challenge Routes
Route::get('/challenges', [ChallengeController::class, 'index'])->name('challenges.index');
Route::get('/challenges/{challenge}', [ChallengeController::class, 'show']);
Route::get('/challenges/{challenge}/problems', [ChallengeController::class, 'getProblems']);
Route::get('/serie-challenges/{skill}', [ChallengeController::class, 'getSerieChallenges']);

// Problem Routes (retained for backward compatibility, remove if not needed)
Route::get('/problems', [ProblemController::class, 'index']);
Route::get('/serie-problems/{skill}', [ProblemController::class, 'getSerieProblems']);