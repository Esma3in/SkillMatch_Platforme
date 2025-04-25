<?php


use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CompanyController;
use App\Http\Controllers\LanguageController;
use App\Http\Controllers\CandidateController;
use App\Http\Controllers\ProfileCandidateController;
use App\Models\ProfileCandidate;

// Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
//     return $request->user();
// });
Route::get('/sanctum/csrf-cookie', function () {
    return response()->json(['csrf' => csrf_token()]);
});



//candidate Routes :

Route::post('/candidate/signUp',[CandidateController::class,'SignUp']);
Route::post('/candidate/signin',[CandidateController::class,'SignIn']);
Route::get('/logout',[CandidateController::class,'Logout']);


Route::Post('/profiles' , [ProfileCandidateController:: class , 'storeProfile']);
Route::get('/candidate/suggestedcompanies/{id}',[CandidateController::class,'CompaniesMatched']);
Route::get('/candidate/companies/all',[CompanyController::class,'index']);

Route::post('/candidate/NewLanguage',[LanguageController::class,'store']);
Route::put('/candidate/setdescription',[ProfileCandidateController::class,'EditDescription']);

Route::get('/candidate/CV/{id}',[CandidateController::class,'printCV']);


Route::get('/candidate/companyInfo/{id}',[CompanyController::class,'GetCompany']);
Route::get('/candidate/{id}',[CandidateController::class,'getCandidate']);