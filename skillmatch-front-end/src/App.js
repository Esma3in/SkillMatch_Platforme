import { BrowserRouter as Router,Routes,Route } from 'react-router';
import SignPages from './pages/SignPages';
import Candidates from './Espaces/Candidate.jsx';
// import Listcompanies from './pages/ListComapnies.jsx';
import ProfileCandidat from './pages/ProfileCandidate.jsx';
import CompaniesMatching from './pages/CompaniesMatching.jsx';
import CompanyProfile from './components/modals/CompanyProfileForCandidate.jsx';
import { Box } from './pages/createProfileCandidate.jsx';
import ProtectedRoute from './features/session/ProtectedRoute.jsx';
export default function App() {
  return (
    <Router>
      <Routes>
        {/* Page d'authentification (SignIn / SignUp toggle) */}
        <Route path="/" element={<SignPages />} />

      

        {/* Espace candidat après inscription */}
        <Route path="/candidate/Session/:id" element={<ProtectedRoute><Candidates /></ProtectedRoute>} />
        <Route path='/Createprofile' element={<ProtectedRoute><Box/></ProtectedRoute>}/>

         <Route path='/companies/list'  element={<ProtectedRoute><CompaniesMatching/></ProtectedRoute>}></Route> 
         <Route path='/profile' element={<ProtectedRoute><ProfileCandidat/></ProtectedRoute>} />
         <Route path='/companyProfile' element={<ProtectedRoute><CompanyProfile/></ProtectedRoute>}/>
         <Route path='*' element={<h1>Page Not Found For Now</h1>}></Route>
      </Routes>
    </Router>
  );
}

