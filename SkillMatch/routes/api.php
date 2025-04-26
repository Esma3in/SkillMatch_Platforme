<?php


use App\Http\Controllers\SkillController;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CompanyController;
use App\Http\Controllers\LanguageController;
use App\Http\Controllers\CandidateController;
use App\Http\Controllers\ExperienceController;
use App\Http\Controllers\ProfileCandidateController;
use App\Models\ProfileCandidate;

// Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
//     return $request->user();
// });
Route::get('/sanctum/csrf-cookie', function () {
    return response()->json(['csrf' => csrf_token()]);
});



//candidate Routes :
Route::get('/candidate/CV/{id}',[CandidateController::class,'printCV']);
Route::post('/store/candidate',[CandidateController::class,'store']);
Route::Post('/profiles' , [CandidateController:: class , 'storeProfile']);
Route::get('/candidate/suggestedcompanies/{id}',[CandidateController::class,'CompaniesMatched']);
Route::get('/candidate/companies/all',[CompanyController::class,'index']);
Route::get('/ProfileCandidate/{id}',[CandidateController::class,'GetProfile']);
Route::post('/candidate/NewLanguage',[LanguageController::class,'store']);
Route::put('/candidate/setdescription',[ProfileCandidateController::class,'EditDescription']);
// Experience routes
Route::post('/experiences', [ExperienceController::class, 'store']);
Route::post('/skills', [SkillController::class , 'store'] );
Route::get('/skills/candidate/{candidateId}', [SkillController::class, 'getSkillsByCandidate']);

Route::get('/experiences/candidate/{candidateId}', [ExperienceController::class, 'getExperiencesByCandidate']);





