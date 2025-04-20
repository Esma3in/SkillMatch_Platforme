import { BrowserRouter as Router,Routes,Route } from 'react-router';
import SignPages from './pages/SignPages';
import Candidates from './Espaces/Candidate.jsx';
import Listcompanies from './pages/ListComapnies.jsx';
import CompaniesMatching from './pages/CompaniesMatching.jsx';
export default function App() {
  return (
    <Router>
      <Routes>
        {/* Page d'authentification (SignIn / SignUp toggle) */}
        <Route path="/" element={<SignPages />} />

      

        {/* Espace candidat après inscription */}
        <Route path="/candidate/Session/:id" element={<Candidates />} />

         <Route path='/companies/list'  element={<CompaniesMatching/>}></Route> 
      </Routes>
    </Router>
  );
}

