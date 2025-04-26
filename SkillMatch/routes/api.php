<?php


use App\Models\Problem;
use App\Models\ProfileCandidate;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CompanyController;
use App\Http\Controllers\ProblemController;
use App\Http\Controllers\LanguageController;
use App\Http\Controllers\CandidateController;
use App\Http\Controllers\ChallengeController;
use App\Http\Controllers\ProfileCandidateController;

// Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
//     return $request->user();
// });
Route::get('/sanctum/csrf-cookie', function () {
    return response()->json(['csrf' => csrf_token()]);
});



//candidate Routes :
Route::get('/candidate/CV/{id}',[CandidateController::class,'printCV']);
Route::post('/candidate/signUp',[CandidateController::class,'SignUp']);
Route::Post('/profiles' , [CandidateController:: class , 'storeProfile']);
Route::get('/candidate/suggestedcompanies/{id}',[CandidateController::class,'CompaniesMatched']);
Route::get('/candidate/companies/all',[CompanyController::class,'index']);
Route::get('/ProfileCandidate/{id}',[CandidateController::class,'GetProfile']);
Route::post('/candidate/NewLanguage',[LanguageController::class,'store']);
Route::put('/candidate/setdescription',[ProfileCandidateController::class,'EditDescription']);
// Problems routes
Route::get('/problems', [ProblemController::class, 'index']);
Route::get('/serie-problems/{skill}', [ProblemController::class, 'getSerieProblems']);

// Challenges routes
Route::get('/challenges', [ChallengeController::class, 'index']);
Route::get('/challenges/{challenge}', [ChallengeController::class, 'show']);
Route::get('/challenges/{challenge}/problems', [ChallengeController::class, 'getProblems']);






Route::post('/candidate/signin',[CandidateController::class,'SignIn']);
Route::get('/logout',[CandidateController::class,'Logout']);

