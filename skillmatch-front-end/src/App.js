import { BrowserRouter as Router,Routes,Route } from 'react-router';
//import SignPages from './pages/SignPages';
//import Candidates from './Espaces/Candidate.jsx';
//import Listcompanies from './pages/ListComapnies.jsx';
//import ProfileCandidat from './pages/ProfileCandidate.jsx';
//import CompaniesMatching from './pages/CompaniesMatching.jsx';
//import CompanyProfile from './components/modals/CompanyProfileForCandidate.jsx';
//import ProblemsList from './pages/problemsList.js';
import Challenge from './pages/Challenge';
import SeriesChallenge from './pages/SerieChallenges'
import ProblemsList from './pages/problemsList';
import QcmForRoadmap from './pages/qcmForRoadmap';
//import { Box } from './pages/createProfileCandidate.jsx';
export default function App() {
  return (
    <Router>
      <Routes>
        {/* Page d'authentification (SignIn / SignUp toggle) 
        <Route path="/" element={<SignPages />} />

      

        {/* Espace candidat après inscription 
        <Route path="/candidate/Session/:id" element={<Candidates />} />
        <Route path='/Createprofile' element={<Box/>}/>

         <Route path='/companies/list'  element={<CompaniesMatching/>}></Route> 
         <Route path='/profile' element={<ProfileCandidat/>} />
         <Route path='/companyProfile' element={<CompanyProfile/>}/>*/}
         <Route path="/" element={<QcmForRoadmap />} />
         <Route path="/challenges" element={<Challenge />} />
        <Route path="/problems" element={<ProblemsList />} />
        <Route path="/serie-challenges/:challengeId" element={<SeriesChallenge />} />
         <Route path='*' element={<h1>Page Not Found For Now</h1>}></Route>
      </Routes>
    </Router>
  );
}

