<?php

use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ChallengeController;

//Route::get('/', function () {
//    return ['Laravel' => app()->version()];
//});

//problems list
Route::get('/challenges', [ChallengeController::class, 'index'])->name('challenges.index');

