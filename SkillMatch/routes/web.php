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

Route::get('/ai-diagnostic', function () {
    $apiKey = env('GEMINI_API_KEY', '');
    $mockMode = env('AI_USE_MOCK_RESPONSES', false);
    $appEnv = env('APP_ENV', 'unknown');

    $apiKeyStatus = !empty($apiKey) ? 'Configured (starting with: ' . substr($apiKey, 0, 5) . '...)' : 'Not configured';
    $mockModeStatus = $mockMode ? 'Enabled' : 'Disabled';

    return view('ai-diagnostic', [
        'apiKeyStatus' => $apiKeyStatus,
        'mockModeStatus' => $mockModeStatus,
        'appEnv' => $appEnv
    ]);
});

