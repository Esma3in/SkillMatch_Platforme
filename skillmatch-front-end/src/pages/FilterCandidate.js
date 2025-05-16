import React, { useState } from 'react';
import { api } from '../api/api';
const CandidateFilter = () => {
  const [city, setCity] = useState('');
  const [skill, setSkill] = useState('');
  const [field, setField] = useState('');
  const [candidates, setCandidates] = useState([]);

  const handleFilter = async () => {
    try {
      const response = await api.get('/api/candidates/filter', {
        params: { city, skill, field },
      });
      setCandidates(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des candidats :', error);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Filtrer les candidats</h2>
      
      <div className="mb-4">
        <input
          type="text"
          placeholder="Ville"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="border p-2 w-full mb-2"
        />
        <input
          type="text"
          placeholder="Compétence"
          value={skill}
          onChange={(e) => setSkill(e.target.value)}
          className="border p-2 w-full mb-2"
        />
        <input
          type="text"
          placeholder="Domaine"
          value={field}
          onChange={(e) => setField(e.target.value)}
          className="border p-2 w-full mb-2"
        />
        <button onClick={handleFilter} className="bg-blue-500 text-white px-4 py-2 rounded">
          Filtrer
        </button>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Résultats :</h3>
        {candidates.length > 0 ? (
          <ul className="space-y-2">
            {candidates.map((candidate) => (
              <li key={candidate.id} className="border p-4 rounded">
                <p><strong>Nom :</strong> {candidate.name}</p>
                <p><strong>Email :</strong> {candidate.email}</p>
                <p><strong>Domaine :</strong> {candidate.profile?.field}</p>
                <p><strong>Ville :</strong> {candidate.profile?.localisation}</p>
                <p><strong>Compétences :</strong> {candidate.skills.map(s => s.name).join(', ')}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>Aucun candidat trouvé.</p>
        )}
      </div>
    </div>
  );
};

export default CandidateFilter;
