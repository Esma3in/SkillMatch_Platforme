<?php

namespace App\Http\Controllers;

use App\Models\Company;
use Illuminate\Http\Request;

class CompanyController extends Controller
{
    public function index(){
        $companies = Company::with(['skills','profile'])->get();
        return response()->json($companies,200);
    }
}
