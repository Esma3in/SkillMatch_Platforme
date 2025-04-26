<?php


<<<<<<< HEAD
use App\Models\Problem;
=======
<<<<<<< HEAD
use App\Http\Controllers\SkillController;
=======
>>>>>>> 0dbc4cb5bfc3ee232f9241d095233197bacb99ef
use App\Models\ProfileCandidate;
>>>>>>> fa3f744cbad371bdbe2cc88d5019366be22012f5
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CompanyController;
use App\Http\Controllers\ProblemController;
use App\Http\Controllers\LanguageController;
use App\Http\Controllers\CandidateController;
<<<<<<< HEAD
use App\Http\Controllers\ExperienceController;
=======
use App\Http\Controllers\ChallengeController;
>>>>>>> fa3f744cbad371bdbe2cc88d5019366be22012f5
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
<<<<<<< HEAD
// Problems routes
Route::get('/problems', [ProblemController::class, 'index']);
Route::get('/serie-problems/{skill}', [ProblemController::class, 'getSerieProblems']);

// Challenges routes
Route::get('/challenges', [ChallengeController::class, 'index']);
Route::get('/challenges/{challenge}', [ChallengeController::class, 'show']);
Route::get('/challenges/{challenge}/problems', [ChallengeController::class, 'getProblems']);

=======
<<<<<<< HEAD
// Experience routes
Route::post('/experiences', [ExperienceController::class, 'store']);
Route::post('/skills', [SkillController::class , 'store'] );
Route::get('/skills/candidate/{candidateId}', [SkillController::class, 'getSkillsByCandidate']);

Route::get('/experiences/candidate/{candidateId}', [ExperienceController::class, 'getExperiencesByCandidate']);
=======
//problems list
Route::get('/challenges', [ChallengeController::class, 'index'])->name('challenges.index');
//serieChallenges
Route::get('/serie-challenges/{skill}', [ChallengeController::class, 'getSerieChallenges']);
>>>>>>> fa3f744cbad371bdbe2cc88d5019366be22012f5
>>>>>>> 0dbc4cb5bfc3ee232f9241d095233197bacb99ef





Route::post('/candidate/signin',[CandidateController::class,'SignIn']);
Route::get('/logout',[CandidateController::class,'Logout']);

