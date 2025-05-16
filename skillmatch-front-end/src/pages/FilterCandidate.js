import React, { useState, useEffect } from 'react';
import { api } from '../api/api';

const CandidateFilter = () => {
  const [filters, setFilters] = useState({ city: '', skill: '', field: '' });
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({});

  const fetchCandidates = async () => {
    const res = await api.get('/api/candidates/filter', {
      params: { ...filters, page }
    });
    setCandidates(res.data.data);
    setMeta({ lastPage: res.data.last_page, total: res.data.total });
  };

  useEffect(() => {
    fetchCandidates();
  }, [page]);

  const handleFilter = () => {
    setPage(1);
    fetchCandidates();
  };

  const resetFilters = () => {
    setFilters({ city: '', skill: '', field: '' });
    setSelectedCandidate(null);
    setPage(1);
    fetchCandidates();
  };

  return (
    <div className="p-6">
      {/* FILTERS */}
      <div className="flex gap-4">
        <input placeholder="City" value={filters.city}
          onChange={e => setFilters({ ...filters, city: e.target.value })} />

        <input placeholder="Skill" value={filters.skill}
          onChange={e => setFilters({ ...filters, skill: e.target.value })} />

        <input placeholder="Field" value={filters.field}
          onChange={e => setFilters({ ...filters, field: e.target.value })} />

        <button onClick={resetFilters}>Reset Filters</button>
        <button onClick={handleFilter}>Apply Filters</button>
      </div>

      {/* SEARCH RESULTS */}
      <h2>{meta.total} candidates found</h2>
      <div className="grid grid-cols-2 gap-6">
        {candidates.map(candidate => (
          <div key={candidate.id} className="border p-4 rounded">
            <h3>{candidate.name}</h3>
            <p>{candidate.profile?.field} | {candidate.profile?.localisation}</p>
            <div className="flex gap-2 flex-wrap">
              {candidate.skills.map(skill => (
                <span key={skill.id} className="bg-blue-100 px-2 rounded">{skill.name}</span>
              ))}
            </div>
            <button onClick={() => setSelectedCandidate(candidate)}>View</button>
          </div>
        ))}
      </div>

      {/* PAGINATION */}
      <div className="mt-4 flex gap-2">
        {[...Array(meta.lastPage || 1)].map((_, idx) => (
          <button key={idx} onClick={() => setPage(idx + 1)}
            className={page === idx + 1 ? 'font-bold' : ''}>
            {idx + 1}
          </button>
        ))}
      </div>

      {/* CANDIDATE DETAILS */}
      {selectedCandidate && (
        <div className="mt-6 border p-6 rounded shadow">
          <h2>{selectedCandidate.name}</h2>
          <p>{selectedCandidate.profile?.field} | {selectedCandidate.profile?.localisation}</p>
          <p><strong>Summary:</strong> {selectedCandidate.profile?.description}</p>

          {/* Certified */}
          {selectedCandidate.attestations.length > 0 && (
            <span className="bg-green-100 px-2 py-1 rounded">Certified</span>
          )}

          {/* Badges */}
          <div className="mt-2 flex gap-2 flex-wrap">
            {selectedCandidate.badges.map(badge => (
              <span key={badge.id} className="bg-purple-100 px-2 rounded">{badge.name}</span>
            ))}
          </div>

          {/* Action buttons */}
          <div className="mt-4 flex gap-4">
            <button className="bg-blue-500 text-white px-3 py-1 rounded">Resume</button>
            <button className="bg-indigo-500 text-white px-3 py-1 rounded">Notification</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CandidateFilter;
