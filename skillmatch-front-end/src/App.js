import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignPages from './pages/SignPages';
import SignUp from './pages/SignUp';
import Candidates from './Espaces/Candidate.js';

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Page d'authentification (SignIn / SignUp toggle) */}
        <Route path="/" element={<SignPages />} />

        {/* Route directe vers le formulaire SignUp (si besoin séparément) */}
        <Route path="/signup" element={<SignUp />} />

        {/* Espace candidat après inscription */}
        <Route path="/candidate/Session" element={<Candidates />} />
      </Routes>
    </Router>
  );
}

