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

import AdminHome from './pages/adminHome.jsx';

import ProfileForm, { Box } from './pages/createProfileCandidate.jsx';
import CompanyProfileForCandidate from './pages/CompanyProfileForCandidate.jsx';
import { Roadmap } from './pages/Roadmap.js';
import CompaniesRelated from './pages/CompaniesRelated.jsx';
import { CandidateTest } from './pages/CandidateTest.jsx';
import { LandingPage } from './Espaces/LandingPage.jsx';
import SkillsDataPage from './pages/SkillDataRoadmap.jsx';
import QcmForRoadmap from './pages/QcmForRoadmap.js';
export default function App() {
  return (
    <Router>
      <Routes>
        Page d'authentification (SignIn / SignUp toggle) 
        <Route path="/" element={<LandingPage/>} />
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
        <Route path="/serie-challenges/:challengeId" element={<ProtectedRoute><SeriesChallenge /></ProtectedRoute>} />
        <Route path="/candidate/roadmap/:id" element={<ProtectedRoute><Roadmap /></ProtectedRoute>} />

        <Route path = '/companies/related' element={<ProtectedRoute><CompaniesRelated/></ProtectedRoute>}/>
        <Route path = '/roadmap' element={<ProtectedRoute><Roadmap/></ProtectedRoute>}/>
        <Route path='/candidate/company/test/:companyId' element={<CandidateTest/>}/>
        <Route path='*' element={<h1>Page Not Found For Now</h1>}></Route>

        <Route path="/admin/Session/:id" element={<ProtectedRoute><AdminHome/></ProtectedRoute>} />

      </Routes>
    </Router>
  );
}

