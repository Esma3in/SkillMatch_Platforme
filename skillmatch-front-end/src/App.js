import { BrowserRouter as Router,Routes,Route } from 'react-router';
import SignPages from './pages/SignPages';
import SignUp from './pages/SignUp';
import Candidates from './Espaces/Candidate.js';
import SuggestedCompanies from './components/sections/suggestedCompanies.jsx';
export default function App() {
  return (
    <Router>
      <Routes>
        {/* Page d'authentification (SignIn / SignUp toggle) */}
        <Route path="/" element={<SignPages />} />

      

        {/* Espace candidat après inscription */}
        <Route path="/candidate/Session/:id" element={<Candidates />} />
      </Routes>
    </Router>
  );
}

