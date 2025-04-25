import { BrowserRouter as Router,Routes,Route } from 'react-router';
import SignPages from './pages/SignPages';
import Candidates from './Espaces/Candidate.jsx';
//import Listcompanies from './pages/ListComapnies.jsx';
import ProfileCandidat from './pages/ProfileCandidate.jsx';
import CompaniesMatching from './pages/CompaniesMatching.jsx';
<<<<<<< HEAD
import CompanyProfile from './components/modals/CompanyProfileForCandidate.jsx';
import ProblemsList from './pages/problemsList.js';
import SerieChallenges from './pages/SerieChallenges';

import { Box } from './pages/createProfileCandidate.jsx';
=======
import CompanyProfile from './pages/CompanyProfileForCandidate.jsx';
import { Box } from './pages/createProfileCandidate.jsx';
import ProtectedRoute from './features/session/ProtectedRoute.jsx';
import CompanyProfileForCandidate from './pages/CompanyProfileForCandidate.jsx';
>>>>>>> c165dc4379cff24b6d9404c47e0e5d9c2bcae5cf
export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignPages />} />
<<<<<<< HEAD

      

        {/* Espace candidat après inscription */}
        <Route path="/candidate/Session/:id" element={<Candidates />} />
        <Route path='/Createprofile' element={<Box/>}/>

         <Route path='/companies/list'  element={<CompaniesMatching/>}></Route> 
         <Route path='/profile' element={<ProfileCandidat/>} />
         <Route path='/companyProfile' element={<CompanyProfile/>}/>
         <Route path="/" element={<ProblemsList />} />
         <Route path="/serie-challenges/:skill" element={<SerieChallenges />} />
=======
        <Route path="/candidate/Session/:id" element={<ProtectedRoute><Candidates /></ProtectedRoute>} />
        <Route path='/Createprofile' element={<ProtectedRoute><Box/></ProtectedRoute>}/>
         <Route path='/companies/list'  element={<ProtectedRoute><CompaniesMatching/></ProtectedRoute>}></Route> 
         <Route path='/profile' element={<ProtectedRoute><ProfileCandidat/></ProtectedRoute>} />
         <Route path='/companyProfile' element={<ProtectedRoute><CompanyProfile/></ProtectedRoute>}/>
         <Route path='/candidate/company/:id/profile' element={<ProtectedRoute><CompanyProfileForCandidate/></ProtectedRoute>}/>
>>>>>>> c165dc4379cff24b6d9404c47e0e5d9c2bcae5cf
         <Route path='*' element={<h1>Page Not Found For Now</h1>}></Route>
      </Routes>
    </Router>
  );
}

