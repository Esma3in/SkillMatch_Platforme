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

    public function GetCompany($id){
        $company = Company::with(['profile','skills','tests','ceo'])->find($id);
        if($company){
            return response()->json($company,200);
        }else{
            return response()->json(['message'=>'company Not found'],404);
        }
    }
}
