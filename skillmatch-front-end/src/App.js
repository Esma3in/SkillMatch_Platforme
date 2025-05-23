import { BrowserRouter as Router,Routes,Route } from 'react-router';
import SignPages from './pages/SignPages';
import Candidates from './Espaces/Candidate.jsx';
import ProfileCandidat from './pages/ProfileCandidate.jsx';
import CompaniesMatching from './pages/CompaniesMatching.jsx';
import ProtectedRoute from './features/session/ProtectedRoute.jsx';
import ProblemsList from './pages/problemsList.js';
import Challenge from './pages/Challenge';


import SeriesChallenge from './pages/SerieChallenges'



import ProfileSettings from './pages/Settings.js';


import ProfileForm, { Box } from './pages/createProfileCandidate.jsx';
import CompanyProfileForCandidate from './pages/CompanyProfileForCandidate.jsx';
import { Roadmap } from './pages/Roadmap.js';
import CompaniesRelated from './pages/CompaniesRelated.jsx';
import { CandidateTest } from './pages/CandidateTest.jsx';
import { LandingPage } from './Espaces/LandingPage.jsx';
import { EnhancedLandingPage } from './Espaces/EnhancedLandingPage.jsx';
import SkillsDataPage from './pages/SkillDataRoadmap.jsx';

import AdminHome from './pages/adminHome.jsx';
import CompaniesList from './pages/manage/companiesList.jsx';

import CandidateListForCompany from './pages/CandidateListForCompany.jsx';

import BanUsers from './pages/manage/banUsers.jsx'


import { Dashboard } from './pages/Dashboard.js';

import QcmForRoadmap from './pages/qcmForRoadmap.js';
import TestsList from './pages/TestList.jsx';
import { ListCandidateSelected } from './pages/CandidateSelected.jsx';
import Company from './pages/Company.jsx';
import CandidateProfileForCompany from './pages/CandidateProfileForCompany.jsx';
import ResultTest from './pages/Testresult.jsx';
import TestsListForCompany from './pages/ListTestForCompany.js';
import FilterCandidate from './pages/FilterCandidate.js';
import {BadgeList} from './pages/BadgesListes.jsx';
import NotificationCandidate from './pages/NotificationCandidate.js';
import SupportPage from './pages/Support.jsx';
import CandidateDashboard from './pages/CandidateDashboard.jsx';
import { CompanyProfile } from './pages/ProfileCompany.jsx';
import CreateProfileCompany  from './pages/createProfileCompany.jsx';
import CreateSkill from './pages/createSkillsCompany.js';
import TestCreationForm from './pages/CreateProgrammingTestForCompany.js';
import Certificate from './pages/certificate.js';
import CandidatesList from './pages/manage/candidatesList.jsx';
export default function App() {
  return (
    <Router>
      <Routes>
        Page d'authentification (SignIn / SignUp toggle) 
        <Route path="/" element={<EnhancedLandingPage/>} />
        {/* Espace candidat après inscription  */}
        <Route path='/signIn' element={<SignPages isSignin={true}/>}/>
        <Route path='/signUp' element={<SignPages isSignin={false}/>}/>
        <Route path='/candidate/company/:id/profile' element={<ProtectedRoute><CompanyProfileForCandidate/></ProtectedRoute>}/>
        
        <Route path="/candidate/Session/:id" element={<ProtectedRoute><Candidates/></ProtectedRoute>} />
        <Route path='/Createprofile' element={<ProtectedRoute><Box/></ProtectedRoute>}/>
        <Route path='/companies/list'  element={<ProtectedRoute><CompaniesMatching/></ProtectedRoute>}></Route> 
        <Route path= "/notification"element= {<NotificationCandidate />} />
        <Route path='/support' element={<SupportPage />}/>
        <Route path='/profile' element={<ProtectedRoute><ProfileCandidat/></ProtectedRoute>} />
        <Route path='/badges' element = {<BadgeList />}/>
        {/* <Route path='/companyProfile' element={<ProtectedRoute><CompanyProfile/></ProtectedRoute>}/>  */}
        <Route path="/qcmForRoadmap/:id" element={<QcmForRoadmap />} />
         <Route path="/challenges" element={<ProtectedRoute ><Challenge /></ProtectedRoute>} />
        <Route path="/problems" element={<ProtectedRoute ><ProblemsList /></ProtectedRoute>} />
        <Route path="/profile-settings" element={<ProfileSettings />} />
        <Route path="/performance" element= {<ProtectedRoute><CandidateDashboard/></ProtectedRoute>}/>
        <Route path="/serie-challenges/:challengeId" element={<ProtectedRoute><SeriesChallenge /></ProtectedRoute>} />
        <Route path="/candidate/roadmap/:id" element={<ProtectedRoute><Roadmap /></ProtectedRoute>} />
        <Route path = '/companies/related' element={<ProtectedRoute><CompaniesRelated/></ProtectedRoute>}/>
        <Route path = '/roadmap' element={<ProtectedRoute><Roadmap/></ProtectedRoute>}/>

        {/*test*/}
        <Route path = '/candidates/list' element={<ProtectedRoute><CandidateListForCompany/></ProtectedRoute>}/>
        <Route path = '/training/challenges' element={<ProtectedRoute><TestsListForCompany/></ProtectedRoute>}/>
        <Route path = '/candidates/related' element={<ProtectedRoute><FilterCandidate/></ProtectedRoute>}/>
        <Route path='/candidate/company/test/:companyId' element={<CandidateTest/>}/>

       <Route path='/candidate/Test/:TestId' element={<ProtectedRoute><CandidateTest/></ProtectedRoute>}/>
        <Route path='/candidate/assessment/:companyId/tests' element={<ProtectedRoute><TestsList/></ProtectedRoute>}/>
        <Route path='/candidate/test/:TestId/result' element={<ProtectedRoute><ResultTest/></ProtectedRoute>}/>
        

        {/*company Routes */}
        <Route path='/company/Candidate-Selected' element={<ListCandidateSelected/>}/>
        <Route path='/company/Session/:CompanyId' element={<Company/>}/>
        <Route path='/company/candidate/profile/:candidate_id' element={<CandidateProfileForCompany/>}/>
        <Route path='/company/profile' element={<CompanyProfile/>}/>
        <Route path='/company/create/profile' element={<CreateProfileCompany/>}/>
        <Route path='/company/create/skill' element={<CreateSkill/>}/>
        <Route path='/training/start' element={<TestCreationForm/>}/>
        <Route path='*' element={<h1>Page Not Found For Now</h1>}></Route>

        {/* admin */}
        <Route path="/admin/Session/:id" element={<ProtectedRoute><AdminHome/></ProtectedRoute>} />
        <Route path="/admin/companiesList" element={<ProtectedRoute><CompaniesList/></ProtectedRoute>} />

        <Route path="/admin/candidatesList" element={<ProtectedRoute><CandidatesList/></ProtectedRoute>} />
        <Route path="/admin/banUsers" element={<ProtectedRoute><BanUsers /></ProtectedRoute>} />
        <Route path = "/certificate"  element={<Certificate />}/>
        {/* <Route path="/admin/candidatesList" element={<ProtectedRoute><CandidatesList/></ProtectedRoute>} /> */}
      </Routes>
    </Router>
  );
}

