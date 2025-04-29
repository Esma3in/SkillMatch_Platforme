<?php

namespace App\Http\Controllers;

use App\Models\Company;
use Illuminate\Http\Request;

class TestController extends Controller
{
    public function GetTestCompanieSelected($id)
{
    $company = Company::find($id);
    
    if (!$company) {
        return response()->json(['error' => 'Company not found'], 404);
    }

    $test = $company->tests()->with(['step', 'qcm', 'company'])->get();

    if (!$test) {
        return response()->json(['error' => 'Test not found'], 404);
    }

    return response()->json($test, 200);
}

}
