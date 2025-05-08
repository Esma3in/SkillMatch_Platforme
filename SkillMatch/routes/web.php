<?php

use App\Models\Problem;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProblemController;
use App\Http\Controllers\ChallengeController;
use App\Http\Controllers\AllCandidateController;

//Route::get('/', function () {
//    return ['Laravel' => app()->version()];
//});

//problems list
Route::get('/problems', [ProblemController::class, 'index'])->name('problems.index');

//listOfChallenges
Route::get('/listofchallenges', [ChallengeController::class, 'index'])->name('listofchallenges.index');
Route::get('/challenges/{challenge}', [ChallengeController::class, 'show'])->name('challenges.show');




// All candidate for company
Route::get('/candidates', [AllCandidateController::class, 'index'])->name('candidates.index');
Route::get('/candidates/{id}', [AllCandidateController::class, 'show']);
Route::put('/candidates/{id}/accept', [AllCandidateController::class, 'accept']);
Route::put('/candidates/{id}/reject', [AllCandidateController::class, 'reject']);

