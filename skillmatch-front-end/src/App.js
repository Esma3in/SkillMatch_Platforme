import { BrowserRouter as Router,Routes,Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SignPages from './pages/SignPages';
import Candidates from './Espaces/Candidate.jsx';
import ProfileCandidat from './pages/ProfileCandidate.jsx';
import CompaniesMatching from './pages/CompaniesMatching.jsx';
import ChallengeList from './pages/Challenge';
import ChallengeDetail from './pages/ChallengeDetail';
import Certificate from './pages/certificate';
import AdminChallenges from './pages/manage/challenges.jsx';
import StudyWithAI from './pages/StudyWithAI.jsx';
import SeriesChallenge from './pages/SerieChallenges'
import ProfileSettings from './pages/Settings.js';
import CompanyProfileForCandidate from './pages/CompanyProfileForCandidate.jsx';
import Roadmap  from './pages/Roadmap.js';
import CompaniesRelated from './pages/CompaniesRelated.jsx';
import { CandidateTest } from './pages/CandidateTest.jsx';
import { EnhancedLandingPage } from './Espaces/EnhancedLandingPage.jsx';
import AdminHome from './pages/adminHome.jsx';
import CompaniesList from './pages/manage/companiesList.jsx';
import CandidateListForCompany from './pages/CandidateListForCompany.jsx';
import BanUsers from './pages/manage/banUsers.jsx'
import QcmForRoadmap from './pages/qcmForRoadmap.js';
import TestsList from './pages/TestList.jsx';
import { ListCandidateSelected } from './pages/CandidateSelected.jsx';
import Company from './pages/Company.jsx';
import CandidateProfileForCompany from './pages/CandidateProfileForCompany.jsx';
import ResultTest from './pages/Testresult.jsx';
import FilterCandidate from './pages/FilterCandidate.js';
import {BadgeList} from './pages/BadgesListes.jsx';
import NotificationCandidate from './pages/NotificationCandidate.js';
import SupportPage from './pages/Support.jsx';
import CandidateDashboard from './pages/CandidateDashboard.jsx';
import { CompanyProfile } from './pages/ProfileCompany.jsx';
import CreateProfileCompany  from './pages/createProfileCompany.jsx';
import CreateSkill from './pages/createSkillsCompany.js';
import TestCreationForm from './pages/CreateProgrammingTestForCompany.js';
import CandidatesList from './pages/manage/candidatesList.jsx';
import LeetcodeProblems from './pages/LeetcodeProblems.jsx';
import LeetcodeProblemWorkspace from './pages/LeetcodeProblemWorkspace.jsx';
import ProblemWorkspace from './pages/ProblemWorkspace.js';
import AddLeetcodeProblem from './pages/manage/addLeetcodeProblem.jsx';
import ManageLeetcodeProblems from './pages/manage/manageLeetcodeProblems.jsx';
import EditLeetcodeProblem from './pages/manage/editLeetcodeProblem.jsx';
import TestListShowCompany from './pages/TestListShowCompany.js';
import DocumentsPage from './pages/manage/documentsPage.jsx';
import ForgotPassword from './pages/ResetPassword/ForgetPassword.jsx';
import ResetPassword from './pages/ResetPassword/ResetPassword.jsx';
import ProtectedCandidateRoute from './features/session/ProtectedCandidateRoute.jsx';
import ProtectedAdminRoute from './features/session/ProtectedAdminRoute.jsx';
import ProtectedCompanyRoute from './features/session/ProtectedCompanyRoute.jsx';
import NotFoundPage from './pages/NotFound.jsx';
import Box from './pages/createProfileCandidate.jsx';
import AccountDeactivatedPage from './pages/AccountDesactive.jsx';
import AccountBannedPage from './pages/BannedPage.jsx';


export default function App() {
  return (
    <Router>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        Page d'authentification (SignIn / SignUp toggle) 
        <Route path="/" element={<EnhancedLandingPage/>} />
        {/* Espace candidat après inscription  */}
        <Route path="/password-reset/:token" element={<ResetPassword />} />
        <Route path='/foregt-password' element={<ForgotPassword/>}/>
        <Route path='/signIn' element={<SignPages isSignin={true}/>}/>
        <Route path='/signUp' element={<SignPages isSignin={false}/>}/>
        <Route path='/account-desactive/:Email' element={<AccountDeactivatedPage/>}/>
        <Route path='/bannedPage/:Email' element={<AccountBannedPage/>}/>

        <Route path='/candidate/company/:id/profile' element={<ProtectedCandidateRoute><CompanyProfileForCandidate/></ProtectedCandidateRoute>}/>
        <Route path="/candidate/Session/:id" element={<ProtectedCandidateRoute><Candidates/></ProtectedCandidateRoute>} />
        <Route path='/Createprofile' element={<ProtectedCandidateRoute><Box/></ProtectedCandidateRoute>}/>
        <Route path='/companies/list'  element={<ProtectedCandidateRoute><CompaniesMatching/></ProtectedCandidateRoute>}></Route> 
        <Route path= "/notification"element= {<ProtectedCandidateRoute><NotificationCandidate /></ProtectedCandidateRoute>} />
        <Route path='/support' element={<SupportPage />}/>
        <Route path='/profile' element={<ProtectedCandidateRoute><ProfileCandidat/></ProtectedCandidateRoute>} />
        <Route path='/badges' element = {<ProtectedCandidateRoute><BadgeList /></ProtectedCandidateRoute>}/>
        {/* <Route path='/companyProfile' element={<ProtectedRoute><CompanyProfile/></ProtectedRoute>}/>  */}
        <Route path="/qcmForRoadmap/:id" element={<ProtectedCandidateRoute><QcmForRoadmap /></ProtectedCandidateRoute>} />
        
        {/* Challenge Routes */}
        <Route path="/challenges" element={<ProtectedCandidateRoute><ChallengeList /></ProtectedCandidateRoute>} />
        <Route path="/challenges/:challengeId" element={<ProtectedCandidateRoute><ChallengeDetail /></ProtectedCandidateRoute>} />
        <Route path="/certificates/:certificateId" element={<ProtectedCandidateRoute><Certificate /></ProtectedCandidateRoute>} />
        <Route path="/admin/challenges" element={<ProtectedAdminRoute><AdminChallenges /></ProtectedAdminRoute>} />
        
        {/* Legacy challenge routes - kept for backward compatibility */}
        <Route path="/serie-challenges/:challengeId" element={<ProtectedCandidateRoute><SeriesChallenge /></ProtectedCandidateRoute>} />
        
        <Route path="/problems" element={<ProtectedCandidateRoute ><LeetcodeProblems /></ProtectedCandidateRoute>} />
        <Route path="/problems/:id" element={<ProtectedCandidateRoute><ProblemWorkspace /></ProtectedCandidateRoute>} />
        <Route path="/leetcode/problem/:id" element={<ProtectedCandidateRoute><LeetcodeProblemWorkspace /></ProtectedCandidateRoute>} />
        <Route path="/profile-settings" element={<ProtectedCandidateRoute><ProfileSettings /></ProtectedCandidateRoute>} />
        <Route path="/performance" element= {<ProtectedCandidateRoute><CandidateDashboard/></ProtectedCandidateRoute>}/>
        <Route path="/candidate/roadmap/:id" element={<ProtectedCandidateRoute><Roadmap /></ProtectedCandidateRoute>} />
        <Route path = '/companies/related' element={<ProtectedCandidateRoute><CompaniesRelated/></ProtectedCandidateRoute>}/>
        <Route path = '/roadmap' element={<ProtectedCandidateRoute><Roadmap/></ProtectedCandidateRoute>}/>
        <Route path = '/study-with-ai' element={<ProtectedCandidateRoute><StudyWithAI/></ProtectedCandidateRoute>}/>

        {/*test*/}
        <Route path = '/candidates/list' element={<ProtectedCompanyRoute><CandidateListForCompany/></ProtectedCompanyRoute>}/>
        <Route path = '/testsList' element={<ProtectedCompanyRoute><TestListShowCompany/></ProtectedCompanyRoute>}/>
        <Route path = '/candidates/related' element={<ProtectedCompanyRoute><FilterCandidate/></ProtectedCompanyRoute>}/>
        <Route path='/candidate/company/test/:companyId' element={<ProtectedCompanyRoute><CandidateTest/></ProtectedCompanyRoute>}/>

       <Route path='/candidate/Test/:TestId' element={<ProtectedCompanyRoute><CandidateTest/></ProtectedCompanyRoute>}/>
        <Route path='/candidate/assessment/:companyId/tests' element={<ProtectedCandidateRoute><TestsList/></ProtectedCandidateRoute>}/>
        <Route path='/candidate/test/:TestId/result' element={<ProtectedCompanyRoute><ResultTest/></ProtectedCompanyRoute>}/>
        

        {/*company Routes */}
        <Route path='/company/Candidate-Selected' element={<ProtectedCompanyRoute><ListCandidateSelected/></ProtectedCompanyRoute>}/>
        <Route path='/company/Session/:CompanyId' element={<ProtectedCompanyRoute><Company/></ProtectedCompanyRoute>}/>
        <Route path='/company/candidate/profile/:candidate_id' element={<ProtectedCompanyRoute><CandidateProfileForCompany/></ProtectedCompanyRoute>}/>
        <Route path='/company/profile' element={<ProtectedCompanyRoute><CompanyProfile/></ProtectedCompanyRoute>}/>
        <Route path='/company/create/profile' element={<ProtectedCompanyRoute><CreateProfileCompany/></ProtectedCompanyRoute>}/>
        <Route path='/company/create/skill' element={<ProtectedCompanyRoute><CreateSkill/></ProtectedCompanyRoute>}/>
        <Route path='/training/start' element={<ProtectedCompanyRoute><TestCreationForm/></ProtectedCompanyRoute>}/>
        

        {/* admin */}
        <Route path="/admin/Session/:id" element={<ProtectedAdminRoute><AdminHome/></ProtectedAdminRoute>} />
        <Route path="/admin" element={<ProtectedAdminRoute><AdminHome/></ProtectedAdminRoute>} />
        <Route path="/admin/companiesList" element={<ProtectedAdminRoute><CompaniesList/></ProtectedAdminRoute>} />

        <Route path="/admin/candidatesList" element={<ProtectedAdminRoute><CandidatesList/></ProtectedAdminRoute>} />
        <Route path="/admin/banUsers" element={<ProtectedAdminRoute><BanUsers /></ProtectedAdminRoute>} />
        <Route path="/admin/addLeetcodeProblem" element={<ProtectedAdminRoute><AddLeetcodeProblem /></ProtectedAdminRoute>} />
        <Route path="/manage/addLeetcodeProblem" element={<ProtectedAdminRoute><AddLeetcodeProblem /></ProtectedAdminRoute>} />
        <Route path="/documents/companies" element={<ProtectedAdminRoute><DocumentsPage /></ProtectedAdminRoute>} />
        <Route path="/training/problems" element={<ProtectedAdminRoute><ManageLeetcodeProblems /></ProtectedAdminRoute>} />
        <Route path="/admin/manageLeetcodeProblems" element={<ProtectedAdminRoute><ManageLeetcodeProblems /></ProtectedAdminRoute>} />
        <Route path="/manage/editLeetcodeProblem/:id" element={<ProtectedAdminRoute><EditLeetcodeProblem /></ProtectedAdminRoute>} />
        <Route path='*' element={<NotFoundPage/>}></Route>
      </Routes>
    </Router>
  );
}

