import { useState, useEffect } from 'react';
import {
  ChevronDown, ChevronUp, ArrowLeft, ArrowRight,
  CheckCircle, Clock, XCircle, Search, RefreshCw, X
} from 'lucide-react';
import { api } from '../api/api'; // Standardized to one import path
import Sidebar from '../components/common/sideBars/sidebarPlatforme';
import AllCandidate from '../components/common/admin/comp/AllCandidate';

export default function CandidateList() {
  const [candidates, setCandidates] = useState([]);
  const [topRankedCandidates, setTopRankedCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState('all'); // 'all' ou 'topRanked'
  const [sortField, setSortField] = useState('rank');
  const [sortDirection, setSortDirection] = useState('asc');
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [notification, setNotification] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [candidateDetails, setCandidateDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const itemsPerPage = 10;

  // DEBUGGING: Afficher toutes les étapes
  const logDebug = (message, data) => {
    console.log(`DEBUG: ${message}`, data);
  };

  // Fonction pour récupérer les candidats depuis l'API
  const fetchCandidates = async () => {
    try {
      setLoading(true);
      setError(null);

      logDebug('Tentative de récupération des candidats', 'start');

      try {
        // Première tentative avec préfixe /api
        const response = await api.get('/api/candidates');
        logDebug('Réponse API (avec /api):', response);

        if (response.data && (response.data.candidates || Array.isArray(response.data))) {
          // Vérifier le format de la réponse
          const candidatesData = response.data.candidates || response.data;
          const topRanked = response.data.topRankedCandidates || candidatesData;

          logDebug('Données de candidats reçues', {
            count: candidatesData.length,
            sample: candidatesData.length > 0 ? candidatesData[0] : 'aucun candidat',
          });

          setCandidates(candidatesData);
          setTopRankedCandidates(topRanked);
        } else {
          logDebug('Format de réponse inattendu', response.data);
          setError('Format de réponse inattendu de l\'API');
        }
        return;
      } catch (firstError) {
        logDebug('Première tentative échouée', firstError);

        // Si la première tentative échoue, essayer sans préfixe /api
        try {
          const response = await api.get('/candidates');
          logDebug('Réponse API (sans /api):', response);

          if (response.data && (response.data.candidates || Array.isArray(response.data))) {
            // Vérifier le format de la réponse
            const candidatesData = response.data.candidates || response.data;
            const topRanked = response.data.topRankedCandidates || candidatesData;

            logDebug('Données de candidats reçues (sans /api)', {
              count: candidatesData.length,
              sample: candidatesData.length > 0 ? candidatesData[0] : 'aucun candidat',
            });

            setCandidates(candidatesData);
            setTopRankedCandidates(topRanked);
          } else {
            logDebug('Format de réponse inattendu (sans /api)', response.data);
            setError('Format de réponse inattendu de l\'API');
          }
          return;
        } catch (secondError) {
          logDebug('Seconde tentative échouée', secondError);
          throw secondError;
        }
      }
    } catch (error) {
      console.error('Error fetching candidates:', error);
      setError(`Échec du chargement des candidats: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour récupérer les détails d'un candidat
  const fetchCandidateDetails = async (candidateId) => {
    try {
      setLoadingDetails(true);

      try {
        // Première tentative avec préfixe /api
        const response = await api.get(`/api/candidates/${candidateId}`);
        setCandidateDetails(response.data);
        return;
      } catch (firstError) {
        // Si la première tentative échoue, essayer sans préfixe /api
        const response = await api.get(`/candidates/${candidateId}`);
        setCandidateDetails(response.data);
      }
    } catch (error) {
      console.error('Error fetching candidate details:', error);
      setError(`Échec du chargement des détails: ${error.message}`);
    } finally {
      setLoadingDetails(false);
    }
  };

  // Ouvrir le modal avec les détails du candidat
  const openDetailsModal = (candidate) => {
    setSelectedCandidate(candidate);
    setShowModal(true);
    fetchCandidateDetails(candidate.id);
  };

  // Fermer le modal
  const closeModal = () => {
    setShowModal(false);
    setSelectedCandidate(null);
    setCandidateDetails(null);
  };

  // Fonction pour afficher une notification
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    // Masquer la notification après 3 secondes
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  // Fonction pour rafraîchir la liste des candidats
  const refreshCandidates = async () => {
    setRefreshing(true);
    await fetchCandidates();
    setRefreshing(false);
  };

  // Fonction pour rechercher des candidats
  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      fetchCandidates();
      return;
    }

    try {
      setLoading(true);
      setError(null);

      try {
        const response = await api.get('/api/candidates', {
          params: { search: searchTerm.trim() },
        });

        logDebug('Résultats de recherche (avec /api)', response.data);

        const candidatesData = response.data.candidates || response.data;
        setCandidates(candidatesData);
        setTopRankedCandidates(candidatesData);
      } catch (firstError) {
        const response = await api.get('/candidates', {
          params: { search: searchTerm.trim() },
        });

        logDebug('Résultats de recherche (sans /api)', response.data);

        const candidatesData = response.data.candidates || response.data;
        setCandidates(candidatesData);
        setTopRankedCandidates(candidatesData);
      }
    } catch (error) {
      console.error('Error searching candidates:', error);
      setError(`Échec de la recherche: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Charger les candidats au chargement du composant
  useEffect(() => {
    fetchCandidates();
  }, []);

  // DEBUGGING: Afficher l'état actuel des candidats
  useEffect(() => {
    logDebug('État actuel des candidats', {
      count: candidates.length,
      topRankedCount: topRankedCandidates.length,
    });
  }, [candidates, topRankedCandidates]);

  // Pagination
  const getPaginatedData = (list) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return list.slice(startIndex, startIndex + itemsPerPage);
  };

  // Tri des candidats
  const sortedCandidates = [...candidates].sort((a, b) => {
    if (sortField === 'rank') {
      // Enlever le '#' pour trier numériquement
      const rankA = parseInt(a.rank?.replace('#', '') || '0', 10);
      const rankB = parseInt(b.rank?.replace('#', '') || '0', 10);
      return sortDirection === 'asc' ? rankA - rankB : rankB - rankA;
    } else {
      // Pour les autres champs (comme le nom)
      const fieldA = a[sortField] || '';
      const fieldB = b[sortField] || '';

      return sortDirection === 'asc'
        ? fieldA > fieldB
          ? 1
          : -1
        : fieldA < fieldB
        ? 1
        : -1;
    }
  });

  // Gérer le tri
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Formater les dates
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch (e) {
      console.error('Error formatting date:', e);
      return 'Invalid date';
    }
  };

  // Composant pour afficher le statut
  const StatusIndicator = ({ status }) => {
    if (!status) return <span className="text-gray-500">No Status</span>;

    switch (status) {
      case 'Done':
        return (
          <span className="flex items-center text-green-600">
            <CheckCircle size={16} className="mr-1" /> Done
          </span>
        );
      case 'In Progress':
      case 'Pending':
        return (
          <span className="flex items-center text-yellow-600">
            <Clock size={16} className="mr-1" /> Pending
          </span>
        );
      case 'Failed':
        return (
          <span className="flex items-center text-red-600">
            <XCircle size={16} className="mr-1" /> Failed
          </span>
        );
      case 'No Tests':
        return <span className="flex items-center text-gray-500">No Tests</span>;
      default:
        return <span>{status}</span>;
    }
  };

  // Accepter un candidat
  const acceptCandidate = async (candidateId) => {
    try {
      await api.put(`/candidates/${candidateId}/accept`);
      showNotification('Candidate accepted successfully');
      fetchCandidates();
      return true;
    } catch (error) {
      console.error('Error accepting candidate:', error);
      showNotification(`Failed to accept candidate: ${error.message}`, 'error');
      return false;
    }
  };

  // Rejeter un candidat
  const rejectCandidate = async (candidateId) => {
    try {
      await api.put(`/candidates/${candidateId}/reject`);
      showNotification('Candidate rejected successfully');
      fetchCandidates();
      return true;
    } catch (error) {
      console.error('Error rejecting candidate:', error);
      showNotification(`Failed to reject candidate: ${error.message}`, 'error');
      return false;
    }
  };

  // Rendu des deux tabs
  const renderAllCandidates = () => (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead>
          <tr className="text-left text-gray-500 border-b">
            <th className="py-3 px-4">
              <div className="flex items-center cursor-pointer" onClick={() => handleSort('rank')}>
                Rank {sortField === 'rank' && (sortDirection === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />)}
              </div>
            </th>
            <th className="py-3 px-4">Date</th>
            <th className="py-3 px-4">Test</th>
            <th className="py-3 px-4">
              <div className="flex items-center cursor-pointer" onClick={() => handleSort('name')}>
                Candidate {sortField === 'name' && (sortDirection === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />)}
              </div>
            </th>
            <th className="py-3 px-4">Details</th>
            <th className="py-3 px-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {getPaginatedData(sortedCandidates).map((candidate) => (
            <tr key={candidate.id} className="border-b hover:bg-gray-50">
              <td className="py-3 px-4">{candidate.rank || '#N/A'}</td>
              <td className="py-3 px-4">{formatDate(candidate.lastTestDate)}</td>
              <td className="py-3 px-4">
                <StatusIndicator status={candidate.lastTestStatus} />
              </td>
              <td className="py-3 px-4">
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium mr-3">
                    {candidate.initials || '??'}
                  </div>
                  <div>
                    <div className="font-medium">{candidate.name || 'Unknown'}</div>
                    <div className="text-sm text-gray-500">{candidate.email || 'No email'}</div>
                  </div>
                </div>
              </td>
              <td className="py-3 px-4">
                <button
                  className="bg-blue-100 hover:bg-blue-200 text-blue-700 py-1 px-3 rounded"
                  onClick={() => openDetailsModal(candidate)}
                >
                  Details
                </button>
              </td>
              <td className="py-3 px-4">
                <div className="flex space-x-2">
                  <button
                    onClick={() => rejectCandidate(candidate.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => acceptCandidate(candidate.id)}
                    className="text-green-600 hover:text-green-800"
                  >
                    Accept
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderTopRanked = () => (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead>
          <tr className="text-left text-gray-500 border-b">
            <th className="py-3 px-4">
              <div className="flex items-center cursor-pointer" onClick={() => handleSort('rank')}>
                Rank {sortField === 'rank' && (sortDirection === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />)}
              </div>
            </th>
            <th className="py-3 px-4">Badges</th>
            <th className="py-3 px-4">Tests</th>
            <th className="py-3 px-4">
              <div className="flex items-center cursor-pointer" onClick={() => handleSort('name')}>
                Candidate {sortField === 'name' && (sortDirection === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />)}
              </div>
            </th>
            <th className="py-3 px-4">Details</th>
          </tr>
        </thead>
        <tbody>
          {getPaginatedData(topRankedCandidates).map((candidate) => (
            <tr key={candidate.id} className="border-b hover:bg-gray-50">
              <td className="py-3 px-4">{candidate.rank || '#N/A'}</td>
              <td className="py-3 px-4">
                <div className="text-gray-600">{candidate.badges || 0}</div>
              </td>
              <td className="py-3 px-4">
                <div className="flex items-center">
                  <div className="text-green-600 flex items-center">
                    <span className="mr-1">⬆</span>{' '}
                    {candidate.tests && candidate.tests[0] ? candidate.tests[0].status : '0'}
                  </div>
                </div>
              </td>
              <td className="py-3 px-4">
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium mr-3">
                    {candidate.initials || '??'}
                  </div>
                  <div>
                    <div className="font-medium">{candidate.name || 'Unknown'}</div>
                    <div className="text-sm text-gray-500">{candidate.email || 'No email'}</div>
                  </div>
                </div>
              </td>
              <td className="py-3 px-4">
                <button
                  className="bg-blue-100 hover:bg-blue-200 text-blue-700 py-1 px-3 rounded"
                  onClick={() => openDetailsModal(candidate)}
                >
                  Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  // Modal pour afficher les détails du candidat
  const renderCandidateDetailsModal = () => {
    if (!showModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header du modal */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Candidate Details</h2>
            <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
              <X size={24} />
            </button>
          </div>

          {/* Contenu du modal */}
          {loadingDetails ? (
            <div className="text-center py-8">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
              <p className="mt-2">Loading details...</p>
            </div>
          ) : candidateDetails ? (
            <div>
              {/* Informations principales */}
              <div className="mb-6">
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center text-lg font-medium mr-4">
                    {selectedCandidate?.initials || '??'}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">
                      {candidateDetails.candidate?.name || selectedCandidate?.name || 'Unknown'}
                    </h3>
                    <p className="text-gray-500">
                      {candidateDetails.candidate?.email || selectedCandidate?.email || 'No email'}
                    </p>
                  </div>
                </div>

                {candidateDetails.candidate?.profile && (
                  <div className="mb-4">
                    <div className="text-sm text-gray-500 mb-1">Profile</div>
                    <p>{candidateDetails.candidate.profile.bio || 'No bio available'}</p>
                  </div>
                )}
              </div>

              {/* Badges */}
              <div className="mb-6">
                <h4 className="font-medium mb-2">Badges ({candidateDetails.badges?.length || 0})</h4>
                {candidateDetails.badges?.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {candidateDetails.badges.map((badge) => (
                      <div key={badge.id} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                        {badge.name}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No badges earned yet</p>
                )}
              </div>

              {/* Tests */}
              <div className="mb-6">
                <h4 className="font-medium mb-2">Test Results</h4>
                {candidateDetails.testResults?.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2 px-4">Test Name</th>
                          <th className="text-left py-2 px-4">Score</th>
                          <th className="text-left py-2 px-4">Date</th>
                          <th className="text-left py-2 px-4">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {candidateDetails.testResults.map((test) => (
                          <tr key={test.id} className="border-b">
                            <td className="py-2 px-4">{test.name || 'Unnamed Test'}</td>
                            <td className="py-2 px-4">{test.status || '0'}</td>
                            <td className="py-2 px-4">{formatDate(test.test_date)}</td>
                            <td className="py-2 px-4">
                              <StatusIndicator
                                status={
                                  test.status > 50
                                    ? 'Done'
                                    : test.status > 0
                                    ? 'In Progress'
                                    : 'Failed'
                                }
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-500">No test results available</p>
                )}
              </div>

              {/* Skills */}
              {candidateDetails.candidate?.skills && candidateDetails.candidate.skills.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-medium mb-2">Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {candidateDetails.candidate.skills.map((skill) => (
                      <div key={skill.id} className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                        {skill.name}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => {
                    rejectCandidate(selectedCandidate.id);
                    closeModal();
                  }}
                  className="px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200"
                >
                  Reject
                </button>
                <button
                  onClick={() => {
                    acceptCandidate(selectedCandidate.id);
                    closeModal();
                  }}
                  className="px-4 py-2 bg-green-100 text-green-700 rounded hover:bg-green-200"
                >
                  Accept
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">No details available for this candidate</div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="p-4">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-semibold">Candidates</h1>
          
        </div>
      </div>

      {/* Notification */}
      {notification && (
        <div
          className={`p-4 mb-4 rounded ${
            notification.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
          }`}
        >
          {notification.message}
        </div>
      )}

      {/* Onglets */}
      <div className="flex mb-4 border-b">
        <button
          className={`px-4 py-2 ${
            activeTab === 'all' ? 'border-b-2 border-blue-600 text-blue-600 font-medium' : 'text-gray-500'
          }`}
          onClick={() => setActiveTab('all')}
        >
          All candidates
        </button>
        <button
          className={`px-4 py-2 ${
            activeTab === 'topRanked' ? 'border-b-2 border-blue-600 text-blue-600 font-medium' : 'text-gray-500'
          }`}
          onClick={() => setActiveTab('topRanked')}
        >
          Top ranked
        </button>
      </div>

      {/* Debugging info */}
      {error && (
        <div className="p-4 mb-4 bg-red-100 border border-red-400 text-red-700 rounded">
          <h3 className="font-bold">Error:</h3>
          <p>{error}</p>
        </div>
      )}

      {/* Affichage des données */}
      {loading ? (
        <div className="p-4 text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-2">Loading...</p>
        </div>
      ) : (
        <>
          {activeTab === 'all' &&
            (sortedCandidates.length ? (
              renderAllCandidates()
            ) : (
              <p className="text-center py-4">No candidates found</p>
            ))}
          {activeTab === 'topRanked' &&
            (topRankedCandidates.length ? (
              renderTopRanked()
            ) : (
              <p className="text-center py-4">No ranked candidates found</p>
            ))}

          {/* Pagination */}
          {(activeTab === 'all' && sortedCandidates.length > itemsPerPage) ||
          (activeTab === 'topRanked' && topRankedCandidates.length > itemsPerPage) ? (
            <div className="flex justify-between items-center mt-4">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50 hover:bg-gray-400 transition-colors"
              >
                <ArrowLeft size={16} />
              </button>
              <span>
                Page {currentPage} of{' '}
                {Math.ceil(
                  (activeTab === 'all' ? sortedCandidates.length : topRankedCandidates.length) / itemsPerPage
                )}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((prev) => {
                    const maxPage = Math.ceil(
                      (activeTab === 'all' ? sortedCandidates.length : topRankedCandidates.length) / itemsPerPage
                    );
                    return prev < maxPage ? prev + 1 : prev;
                  })
                }
                disabled={
                  currentPage >=
                  Math.ceil(
                    (activeTab === 'all' ? sortedCandidates.length : topRankedCandidates.length) / itemsPerPage
                  )
                }
                className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50 hover:bg-gray-400 transition-colors"
              >
                <ArrowRight size={16} />
              </button>
            </div>
          ) : null}
        </>
      )}

      {/* Modal pour les détails du candidat */}
      {renderCandidateDetailsModal()}
    </div>
  );
}