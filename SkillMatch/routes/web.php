<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CandidateController;

Route::get('/', function () {
    return view('welcome');
});
