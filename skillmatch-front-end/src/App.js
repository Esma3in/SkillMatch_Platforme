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
import CandidatesList from './pages/manage/candidatesList.jsx';
import BanUsers from './pages/manage/banUsers.jsx'

import { Dashboard } from './pages/Dashboard.js';

import QcmForRoadmap from './pages/qcmForRoadmap.js';
import TestsList from './pages/TestList.jsx';
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
        <Route path='/profile' element={<ProtectedRoute><ProfileCandidat/></ProtectedRoute>} />
        {/* <Route path='/companyProfile' element={<ProtectedRoute><CompanyProfile/></ProtectedRoute>}/>  */}
        <Route path="/qcm/roadmap/:id" element={<QcmForRoadmap />} />
         <Route path="/challenges" element={<ProtectedRoute ><Challenge /></ProtectedRoute>} />
        <Route path="/problems" element={<ProtectedRoute ><ProblemsList /></ProtectedRoute>} />
        <Route path="/profile-settings" element={<ProfileSettings />} />
        <Route path="/performance" element= {<ProtectedRoute><Dashboard /></ProtectedRoute>}/>
        <Route path="/serie-challenges/:challengeId" element={<ProtectedRoute><SeriesChallenge /></ProtectedRoute>} />
        <Route path="/candidate/roadmap/:id" element={<ProtectedRoute><Roadmap /></ProtectedRoute>} />
        <Route path = '/companies/related' element={<ProtectedRoute><CompaniesRelated/></ProtectedRoute>}/>
        <Route path = '/roadmap' element={<ProtectedRoute><Roadmap/></ProtectedRoute>}/>
       <Route path='/candidate/Test/:TestId' element={<ProtectedRoute><CandidateTest/></ProtectedRoute>}/>
        <Route path='/candidate/assessment/:companyId/tests' element={<ProtectedRoute><TestsList/></ProtectedRoute>}/>
        <Route path='*' element={<h1>Page Not Found For Now</h1>}></Route>

        {/* admin */}
        <Route path="/admin/Session/:id" element={<ProtectedRoute><AdminHome/></ProtectedRoute>} />
        <Route path="/admin/companiesList" element={<ProtectedRoute><CompaniesList/></ProtectedRoute>} />
        <Route path="/admin/candidatesList" element={<ProtectedRoute><CandidatesList/></ProtectedRoute>} />
        <Route path="/admin/banUsers" element={<ProtectedRoute><BanUsers /></ProtectedRoute>} />

      </Routes>
    </Router>
  );
}

