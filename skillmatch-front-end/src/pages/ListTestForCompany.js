import React, { useState, useEffect } from 'react';
import { api } from '../api/api';
import { useNavigate } from 'react-router-dom';

// Icons pour le composant
import { List, Plus, Trash2, Eye, MoreVertical } from 'lucide-react';

export default function TestsListForCompany() {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [selectedTest, setSelectedTest] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [candidatesLoading, setCandidatesLoading] = useState(false);
  
  const navigate = useNavigate();
  
  // Récupérer la liste des tests
  const fetchTests = async (page = 1) => {
    try {
      setLoading(true);
      const response = await api.get(`api/tests?page=${page}`);
      setTests(response.data.tests.data);
      setCurrentPage(response.data.tests.current_page);
      setTotalPages(response.data.tests.last_page);
    } catch (error) {
      console.error('Error fetching tests:', error);
    } finally {
      setLoading(false);
    }
  };

  // Récupérer les candidats qui ont résolu le test
  const fetchCandidates = async (testId) => {
    try {
      setCandidatesLoading(true);
      const response = await api.get(`/tests/${testId}/candidates`);
      setCandidates(response.data.candidates);
    } catch (error) {
      console.error('Error fetching candidates:', error);
    } finally {
      setCandidatesLoading(false);
    }
  };

  // Supprimer tous les tests
  const handleDeleteAll = async () => {
    if (window.confirm('Are you sure you want to delete all tests?')) {
      try {
        await api.delete('/tests');
        fetchTests();
      } catch (error) {
        console.error('Error deleting tests:', error);
      }
    }
  };

  // Afficher le modal des candidats
  const handleViewCandidates = (test) => {
    setSelectedTest(test);
    fetchCandidates(test.id);
    setShowModal(true);
  };

  // Rediriger vers la création d'un nouveau test
  const handleNewTest = () => {
    navigate('/create-test');
  };

  // Changer de page
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      fetchTests(page);
    }
  };

  useEffect(() => {
    fetchTests();
  }, []);

  // Modal des candidats
  const CandidatesModal = () => {
    if (!selectedTest) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">
              Candidates who solved: {selectedTest.skill?.name || selectedTest.objective}
            </h2>
            <button 
              onClick={() => setShowModal(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              &times;
            </button>
          </div>
          
          {candidatesLoading ? (
            <div className="text-center py-4">Loading candidates...</div>
          ) : candidates.length === 0 ? (
            <div className="text-center py-4">No candidates found for this test.</div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {candidates.map((candidate) => (
                  <tr key={candidate.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{candidate.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{candidate.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{candidate.pivot?.score || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          
          <div className="mt-4 flex justify-end">
            <button
              onClick={() => setShowModal(false)}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Affichage des icônes de test en fonction du type
  const TestIcon = ({ title }) => {
    if (title.toLowerCase().includes('api') || title.toLowerCase().includes('rest')) {
      return <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center text-purple-500"><List size={20} /></div>;
    } else if (title.toLowerCase().includes('system') || title.toLowerCase().includes('purchase')) {
      return <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-500"><List size={20} /></div>;
    } else if (title.toLowerCase().includes('card') || title.toLowerCase().includes('component')) {
      return <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center text-pink-500"><List size={20} /></div>;
    } else if (title.toLowerCase().includes('figma') || title.toLowerCase().includes('table')) {
      return <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center text-yellow-500"><List size={20} /></div>;
    } else if (title.toLowerCase().includes('function')) {
      return <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center text-green-500"><List size={20} /></div>;
    } else {
      return <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500"><List size={20} /></div>;
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Tests List</h1>
        <div className="flex space-x-2">
          <button 
            onClick={handleDeleteAll}
            className="px-4 py-2 bg-red-100 text-red-600 rounded hover:bg-red-200 flex items-center"
          >
            <Trash2 size={16} className="mr-1" /> Delete all
          </button>
          <button 
            onClick={handleNewTest}
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 flex items-center"
          >
            <Plus size={16} className="mr-1" /> New Test
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10">Loading tests...</div>
      ) : tests.length === 0 ? (
        <div className="text-center py-10">No tests found.</div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="w-10 px-6 py-3 text-left">
                    <input type="checkbox" className="rounded" />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Test title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Level</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date creation</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last updated</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Solved By</th>
                  <th className="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {tests.map((test) => (
                  <tr key={test.id}>
                    <td className="px-6 py-4">
                      <input type="checkbox" className="rounded" />
                    </td>
                    <td className="px-6 py-4 flex items-center space-x-3">
                      <TestIcon title={test.skill?.name || test.objective} />
                      <span>{test.skill?.name || test.objective}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-orange-100 text-orange-800">
                        {test.skill?.level || 'Medium'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(test.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(test.updated_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleViewCandidates(test)}
                        className="px-4 py-2 bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
                      >
                        View
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-gray-400 hover:text-gray-600">
                        <MoreVertical size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="mt-6 flex justify-center">
            <nav className="flex items-center">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-3 py-1 mx-1 rounded ${
                  currentPage === 1 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Previous
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-1 mx-1 rounded ${
                    currentPage === page
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {page}
                </button>
              ))}
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 mx-1 rounded ${
                  currentPage === totalPages 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Next
              </button>
            </nav>
          </div>
        </>
      )}

      {/* Modal pour afficher les candidats */}
      {showModal && <CandidatesModal />}
    </div>
  );
}