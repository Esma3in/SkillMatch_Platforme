<?php

use App\Models\Company;
use App\Models\Problem;

use App\Models\Candidate;
use App\Models\ProfileCandidate;

use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TestController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\BadgeController;
use App\Http\Controllers\SkillController;
use App\Http\Controllers\toolsController;
use App\Http\Controllers\CompanyController;
use App\Http\Controllers\ProblemController;
use App\Http\Controllers\RoadmapController;
use App\Http\Controllers\LanguageController;
use App\Http\Controllers\CandidateController;
use App\Http\Controllers\ChallengeController;
use App\Http\Controllers\dahsboardcontroller;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ExperienceController;
use App\Http\Controllers\AllCandidateController;
use App\Http\Controllers\prerequisitesController;
use App\Http\Controllers\QcmForRoadmapController;
use App\Http\Controllers\skillsRoadmapController;
use App\Http\Controllers\ProfileCompanyController;

use App\Http\Controllers\CompanyDocumentController;
use App\Http\Controllers\LeetcodeProblemController;
use App\Http\Controllers\ProfileSettingsController;

use App\Http\Controllers\candidateCoursesController;
use App\Http\Controllers\ProfileCandidateController;
use App\Http\Controllers\CandidateSelectedController;
use App\Http\Controllers\CompaniesSelectedController;
use App\Http\Controllers\ListTestForCompanyController;

// CSRF Token Route
Route::get('/sanctum/csrf-cookie', function () {
    return response()->json(['csrf' => csrf_token()]);
});

// Roadmap Progress Routes
Route::post('/roadmap/progress', [RoadmapController::class, 'saveRoadmapProgress']);
Route::get('/roadmap/progress/{roadmap_id}/{candidate_id}', [RoadmapController::class, 'getRoadmapProgress']);

// Handle OPTIONS requests for CORS preflight
Route::options('/{any}', function () {
    return response()->json([], 200);
})->where('any', '.*');


Route::post('/signUp', [UserController::class, 'SignUp']);
Route::post('/signin', [UserController::class, 'SignIn']);

// Candidate Routes
Route::get('/candidate/CV/{id}', [CandidateController::class, 'printCV']);

Route::post('/profiles', [CandidateController::class, 'storeProfile']);
Route::get('/candidate/suggestedcompanies/{id}', [CandidateController::class, 'CompaniesMatched']);
Route::get('/candidate/companies/all', [CompanyController::class, 'index']);
Route::get('/ProfileCandidate/{id}', [CandidateController::class, 'GetProfile']);
Route::post('/candidate/NewLanguage', [LanguageController::class, 'store']);
Route::put('/candidate/setdescription', [ProfileCandidateController::class, 'EditDescription']);
Route::get('/logout', [CandidateController::class, 'Logout']);
Route::get('/candidate/{id}',[CandidateController::class,'getCandidate']);
Route::get('/candidate/companyInfo/{id}',[CompanyController::class,'GetCompany']);



// get the selected companies by an candidate :
Route::get('/selected/companies/{candidate_id}' , [CompaniesSelectedController::class , 'CompaniesSelected']);
// Experience Routes
Route::post('/experiences', [ExperienceController::class, 'store']);
Route::get('/experiences/candidate/{candidateId}', [ExperienceController::class, 'getExperiencesByCandidate']);

// Skill Routes
Route::post('/skills', [SkillController::class, 'store']);

Route::get('/skills/candidate/{candidateId}', [SkillController::class, 'getSkillsByCandidate']);
// Education Routes
Route::post('/education' , [ProfileCandidateController::class , 'storeEducation']);
Route::get("/education/candidate/{candidateId}" , [ProfileCandidateController::class   ,"getEducationByCandidate"]);
// Challenge Routes
Route::get('/challenges', [ChallengeController::class, 'index'])->name('challenges.index');
Route::get('/challenges/{challenge}', [ChallengeController::class, 'show']);
Route::get('/challenges/{challenge}/problems', [ChallengeController::class, 'getProblems']);
Route::get('/serie-challenges/{skill}', [ChallengeController::class, 'getSerieChallenges']);

// Enhanced Challenge Routes
Route::prefix('training')->group(function () {
    // Public routes
    Route::get('challenges', [ChallengeController::class, 'index']);
    Route::get('challenges/{challenge}', [ChallengeController::class, 'show']);
    Route::get('challenges/{challenge}/problems', [ChallengeController::class, 'getProblems']);

    // Candidate routes
    Route::post('challenges/{challenge}/start', [ChallengeController::class, 'startChallenge']);
    Route::post('challenges/{challenge}/update-progress', [ChallengeController::class, 'updateProgress']);
    Route::get('certificates/{certificateId}', [ChallengeController::class, 'getCertificate']);
    Route::get('candidates/{candidateId}/certificates', [ChallengeController::class, 'getCandidateCertificates']);
    Route::get('challenges/{challenge}/enrollment/{candidateId}', [ChallengeController::class, 'getEnrollmentStatus']);

    // Admin routes
    Route::prefix('admin')->group(function () {
        Route::get('challenges', [ChallengeController::class, 'getAdminChallenges']);
        Route::post('challenges', [ChallengeController::class, 'store']);
        Route::put('challenges/{challenge}', [ChallengeController::class, 'update']);
        Route::delete('challenges/{challenge}', [ChallengeController::class, 'destroy']);
    });
});

// Problem Routes (retained for backward compatibility, remove if not needed)
Route::get('/problems', [ProblemController::class, 'index']);
Route::get('/serie-problems/{skill}', [ProblemController::class, 'getSerieProblems']);

// Profile Settings Routes
Route::get('/candidate/settings/{id}', [ProfileSettingsController::class, 'getProfileSettings']);
Route::post('/candidate/settings/update', [ProfileSettingsController::class, 'updateProfile']);
Route::post('/candidate/settings/change-password', [ProfileSettingsController::class, 'changePassword']);
Route::post('/candidate/settings/delete-profile-picture', [ProfileSettingsController::class, 'deleteProfilePicture']);

//company SELECTED
Route::post('/selected/company/{id}', [CompaniesSelectedController::class, 'selectCompany']);

//Candidate Test Routes:
Route::get('/candidate/company/{id}/tests', [TestController::class, 'GetTestsCompanySelected']);
Route::get('/candidate/test/{id}',[TestController::class,'getTest']);
Route::post('/results/store',[TestController::class,'storeResult']);
Route::get('/candidate/{candidate_id}/result/test/{TestId}',[TestController::class,'getResult']);
// Create test for company
    Route::post('/tests/company/create', [TestController::class, 'store']);

    // Fetch QCMs
    Route::get('/qcms/company', [TestController::class, 'getQcms']);

    // Fetch Companies
    Route::get('/companies/company', [TestController::class, 'getCompanies']);

    // Fetch Skills
    Route::get('/skills/company', [TestController::class, 'getSkills']);

//selected candidates for companby :
Route::delete('/company/delete/candidate/selected',[CandidateSelectedController::class,'delete']);
Route::get('/company/{id}/candidates/selected',[CandidateSelectedController::class,'getSelectedcandidates']);


//profile company:
Route::post('/company/store/profile',[ProfileCompanyController::class,'store']);
Route::get('/company/profile/{company_id}',[CompanyController::class,'getProfile']);

// get roadmap
Route::get('/roadmaps/{roadmap_id}', [RoadmapController::class, 'getCompleteRoadmap']);


Route::get('/prerequisites', [prerequisitesController::class, 'index']);
Route::get('/tools', [toolsController::class, 'index']);
Route::get('/candidate-courses', [candidateCoursesController::class, 'index']);
Route::get('/roadmap-skills', [skillsRoadmapController::class, 'index']);

//companies related
Route::get('/selected/companies/{candidate_id}', [CompaniesSelectedController::class, 'getSelectedCompaniess']);

// skills of an companyId
Route::get('/skills/company/{companyId}' , [CompaniesSelectedController::class , 'getSkillsByCompany']);
// genrate roadmap
Route::post('/create-roadmap' , [RoadmapController::class , 'generateRoadmap']);

//qcm for roadmap
Route::get('/qcm/roadmap/{id}', [QcmForRoadmapController::class, 'index']);
Route::post('/createQcm', [QcmForRoadmapController::class, 'ccreateQcm']);

//All candidate for company
Route::get('/Allcandidates', [AllCandidateController::class, 'index']);
Route::get('/Allcandidates/{id}', [AllCandidateController::class, 'show']);
Route::put('/Allcandidates/{id}/accept', [AllCandidateController::class, 'accept']);
Route::put('/Allcandidates/{id}/reject', [AllCandidateController::class, 'reject']);

//Tests Routes for company
// Test routes
//Route::get('/tests/company/index', [ListTestForCompanyController::class, 'index']);
//Route::get('/tests/{id}/candidates/company/solved', [ListTestForCompanyController::class, 'getSolvedCandidates']);
//Route::delete('/tests/company/delete', [ListTestForCompanyController::class, 'deleteAll']);
//Route::delete('/tests/{id}/company/destroy', [ListTestForCompanyController::class, 'destroy']);

Route::get('/tests/ch', [ListTestForCompanyController::class, 'index']);
Route::get('/tests/{id}/ch', [ListTestForCompanyController::class, 'show']);
Route::delete('/tests/{id}/ch', [ListTestForCompanyController::class, 'destroy']);
Route::delete('/tests/ch/destroy', [ListTestForCompanyController::class, 'destroyMultiple']);
Route::get('/tests/{id}/resolved-by/ch', [ListTestForCompanyController::class, 'getResolvedByDetails']);
Route::get('/tests/filter/ch', [ListTestForCompanyController::class, 'filter']);

// Candidate filtering routes
Route::get('/candidates/filter', [CandidateController::class, 'filterCandidates']);
Route::post('/notifications', [CandidateController::class, 'storeNotificationForFilter']);

// Create skills company
Route::post('/skills/create/company', [CompanyController::class, 'storeSkills']);







// candidate Roadmap Routes
Route::get('/roadmap/{roadmap_id}/prerequisites', [RoadmapController::class, 'getPrerequisites']);

// admin routes

// Route::get('/admin',[CandidateController::class],'index')->name('admin.index');
Route::get('/admin/CanidatesList',[CandidateController::class,'AllCandidates']);
Route::post('/admin/CanidatesList/setstate',[CandidateController::class,'setstate']);

Route::get('/admin/CompaniesList',[CompanyController::class,'AllCompanies']);
Route::post('/admin/CompaniesList/setstate',[CompanyController::class,'setstate']);

// Document management routes
Route::get('/admin/documents/companies', [CompanyDocumentController::class, 'index']);
Route::get('/admin/documents/company/{companyId}', [CompanyDocumentController::class, 'getCompanyDocuments']);
Route::get('/admin/documents', [CompanyDocumentController::class, 'getAllDocuments']);
Route::get('/admin/documents/filter-options', [CompanyDocumentController::class, 'getFilterOptions']);
Route::post('/admin/documents/upload', [CompanyDocumentController::class, 'upload']);
Route::post('/admin/documents/validate/{id}', [CompanyDocumentController::class, 'validateDocument']);
Route::post('/admin/documents/invalidate/{id}', [CompanyDocumentController::class, 'invalidateDocument']);
Route::post('/admin/documents/status/{id}', [CompanyDocumentController::class, 'updateStatus']);
Route::get('/admin/documents/download/{id}', [CompanyDocumentController::class, 'download']);
Route::get('/admin/documents/preview/{id}', [CompanyDocumentController::class, 'preview']);
Route::delete('/admin/documents/{id}', [CompanyDocumentController::class, 'destroy']);

Route::get('/admin/UsersList',[UserController::class,'getBannedUsers']);
Route::post('/admin/Users/setstate',[UserController::class,'setstate']);
Route::post('/admin/Users/delete',[UserController::class,'deleteUser']);
Route::post('/admin/Users/unban',[UserController::class,'unbanUser']);

// Admin Dashboard Stats
Route::get('/admin/stats/users',[UserController::class,'getUserStats']);
Route::get('/admin/stats/problems',[LeetcodeProblemController::class,'getStats']);
Route::get('/admin/recent-activity',[UserController::class,'getRecentActivity']);

// Detailed user information for admin
Route::get('/admin/candidates/{id}', [CandidateController::class, 'getDetailedCandidate']);
Route::get('/admin/companies/{id}', [CompanyController::class, 'getDetailedCompany']);

Route::get('/admin/candidates/{id}', [CandidateController::class, 'show']);
Route::get('/admin/companies/{id}', [CompanyController::class, 'show']);

// Route::get('/admin/CompaniesList',[AdminConroller::class],'Companies')->name('admin.CompaniesList');

// Route::get('/admin/CanidatsList/Canidate/{id}',[AdminConroller::class],'Candidate')->name('admin.index');

Route::get('/roadmap/{companyId}' , [CompaniesSelectedController::class  , 'getSkillsData']);

Route::get('/dashboard/companies/selected/{candidate_id}', [DashboardController::class, 'countSelectedCompanies']);

Route::get('/dashboard/companies/selected-data/{candidate_id}', [DashboardController::class, 'getSelectedCompaniesForCandidate']);
Route::get('/dashboard/roadmap/completed/{candidate_id}', [DashboardController::class, 'countCompletedRoadmaps']);
Route::get('/dashboard/companies/matched/{candidate_id}', [DashboardController::class, 'countMatchedCompaniesBySkill']);
Route::get('/dashboard/badges/{candidate_id}', [DashboardController::class, 'countBadges']);
Route::get('/dashboard/all/roadmaps/{candidate_id}', [DashboardController::class, 'countAllRoadmaps']);
Route::get('/candidate/{candidate_id}/roadmaps-progress', [DashboardController::class, 'getRoadmapsProgressWithCandidates']);
Route::get('/candidate/{candidate_id}/selected-companies', [DashboardController::class, 'getSelectedCompanies']);
Route::get('/candidate/{candidate_id}/company-data', [DashboardController::class, 'getFullCandidateCompanyData']);
Route::get('/candidate/{candidate_id}/challenges-progress', [DashboardController::class, 'getCandidateChallenges']);
Route::get('/candidate/{candidate_id}/test-progress', [DashboardController::class, 'getTestsByCandidate']);
Route::get('/notifications/{candidate_id}' , [CandidateController::class , "getNotifications"]);
Route::put('/notifications/{id}/read'  , [CandidateController::class , "markasRead"]);


Route::get('/badges/{candidate_id}' , [BadgeController::class , 'getBadges']);
Route::post('/qcm/saveResults',[QcmForRoadmapController::class ,"saveResults"]);
Route::get('/qcmForRoadmap/{qcmForRoadmapId}',[BadgeController::class, 'QcmResult']);

//create test company
Route::post('/create/tests/company', [CompanyController::class, 'storeTests']);

// Get all skills :
 Route::get('/skills/all' , [SkillController::class , 'allSkills']);

 Route::post('/create/badge' ,[BadgeController::class  , 'createBadge']);

Route::get('/roadmap/details/{id}' ,[RoadmapController::class , 'details']);
Route::get("/company/candidate-roadmap/{roadmap_id}" , [RoadmapController::class , "getSelectedCompanyForCandidate"]);


 Route::post('/create/badge' ,[BadgeController::class  , 'createBadge']);

Route::get('/roadmap/details/{id}' ,[RoadmapController::class , 'details']);

Route::post("/createQcm" ,[QcmForRoadmapController::class  , "createQcm"]);
Route::get("/roadmap/qcm/{id}" ,[QcmForRoadmapController::class , "getIdRoadmap"]);

Route::get("/all" , [CompanyController::class , "all"]);

// LeetCode Problems Routes
Route::get('/leetcode/problems', [LeetcodeProblemController::class, 'index']);
Route::get('/leetcode/problems/{id}', [LeetcodeProblemController::class, 'show']);

// Add delete route for LeetCode problems
Route::delete('/leetcode/problems/{id}', [LeetcodeProblemController::class, 'destroy'])
    ->withoutMiddleware(['csrf']);

// Add update route for LeetCode problems
Route::match(['put', 'options'], '/leetcode/problems/{id}', [LeetcodeProblemController::class, 'update'])
    ->withoutMiddleware(['csrf']);

// Route for creating problems with OPTIONS support for CORS
Route::match(['post', 'options'], '/leetcode/problems', [LeetcodeProblemController::class, 'store'])
    ->withoutMiddleware(['csrf']); // Disable CSRF for this route

// Fix the submission route to handle both POST and OPTIONS requests properly
Route::match(['post', 'options'], '/leetcode/problems/{id}/submit', [LeetcodeProblemController::class, 'submitSolution'])
    ->name('leetcode.submit')
    ->withoutMiddleware(['csrf']); // Disable CSRF for this route

Route::get('/leetcode/problems/{id}/submissions', [LeetcodeProblemController::class, 'getSubmissions']);

// Add a test route for debugging
Route::post('/leetcode/test-submit', [LeetcodeProblemController::class, 'testSubmission']);

// Debug endpoint - accepts any method
Route::any('/leetcode/debug/{id?}', [LeetcodeProblemController::class, 'debugRequest'])
    ->withoutMiddleware(['csrf']);

// Admin routes for challenges (direct access)
Route::prefix('admin')->group(function () {
    Route::get('challenges', [ChallengeController::class, 'getAdminChallenges']);
    Route::post('challenges', [ChallengeController::class, 'store']);
    Route::put('challenges/{challenge}', [ChallengeController::class, 'update']);
    Route::delete('challenges/{challenge}', [ChallengeController::class, 'destroy']);
});

// Add training admin challenge routes
Route::prefix('training/admin')->group(function () {
    Route::get('/challenges', [ChallengeController::class, 'getAdminChallenges']);
    Route::post('/challenges', [ChallengeController::class, 'store']);
    Route::put('/challenges/{challenge}', [ChallengeController::class, 'update']);
    Route::delete('/challenges/{challenge}', [ChallengeController::class, 'destroy']);
});
