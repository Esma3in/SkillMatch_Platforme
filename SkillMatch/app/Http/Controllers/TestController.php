<?php

namespace App\Http\Controllers;

use App\Models\Test;
use App\Models\Company;
use Illuminate\Http\Request;

class TestController extends Controller
{
    public function GetTestsCompanieSelected($id)
    {
        $company = Company::find($id);
        
        if (!$company) {
            return response()->json(['error' => 'Company not found'], 404);
        }
    
        // Eager load the skill relationship
        $tests = $company->tests()->with([ 'company', 'skill'])->paginate(10);
    
        if ($tests->isEmpty()) {
            return response()->json(['error' => 'Test not found'], 404);
        }
    
        return response()->json($tests, 200);
    }
    public function getTest($id){
        $test = Test::with(['qcm','steps','skill','prerequisites'])->find($id);


        if(!$test){
            return response()->json('test not found',404);
        }

        return response()->json($test,200); 
    }
}
