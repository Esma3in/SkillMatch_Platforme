import { BrowserRouter as Router,Routes,Route } from 'react-router';
import SignPages from './pages/SignPages';
import Candidates from './Espaces/Candidate.jsx';
import Listcompanies from './pages/ListComapnies.jsx';
import ProfileCandidat from './pages/ProfileCandidate.jsx';
import CompaniesMatching from './pages/CompaniesMatching.jsx';
// import CompanyProfile from './components/modals/CompanyProfileForCandidate.jsx';
import ProtectedRoute from './features/session/ProtectedRoute.jsx';
import ProblemsList from './pages/problemsList.js';
import Challenge from './pages/Challenge';
import SeriesChallenge from './pages/SerieChallenges'
import QcmForRoadmap from './pages/qcmForRoadmap';
import { Box } from './pages/createProfileCandidate.jsx';
import { Roadmap } from './pages/Roadmap.js';
import CompaniesRelated from './pages/compniesSelectedList.jsx';
export default function App() {
  return (
    <Router>
      <Routes>
        Page d'authentification (SignIn / SignUp toggle) 
        <Route path="/" element={<SignPages />} />
        {/* Espace candidat après inscription  */}
        <Route path="/candidate/Session/:id" element={<ProtectedRoute><Candidates /></ProtectedRoute>} />
        <Route path='/Createprofile' element={<ProtectedRoute><Box/></ProtectedRoute>}/>
        <Route path='/companies/list'  element={<ProtectedRoute><CompaniesMatching/></ProtectedRoute>}></Route> 
        <Route path='/profile' element={<ProtectedRoute><ProfileCandidat/></ProtectedRoute>} />
        {/* <Route path='/companyProfile' element={<ProtectedRoute><CompanyProfile/></ProtectedRoute>}/> */}
         <Route path="/" element={<ProtectedRoute ><QcmForRoadmap /></ProtectedRoute>} />
         <Route path="/challenges" element={<ProtectedRoute ><Challenge /></ProtectedRoute>} />
        <Route path="/problems" element={<ProtectedRoute ><ProblemsList /></ProtectedRoute>} />
        <Route path="/serie-challenges/:challengeId" element={<ProtectedRoute><SeriesChallenge /></ProtectedRoute>} />
        <Route path = '/companies/related' element={<ProtectedRoute><CompaniesRelated/></ProtectedRoute>}/>
        <Route path = '/roadmap' element={<ProtectedRoute><Roadmap /></ProtectedRoute>}/>
        <Route path='*' element={<h1>Page Not Found For Now</h1>}></Route>
      </Routes>
    </Router>
  );
}