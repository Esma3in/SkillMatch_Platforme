{{-- candidates.blade.php --}}
{{-- Cette vue peut être incluse dans une autre vue ou utilisée directement --}}

<div class="p-6">
    <div class="flex justify-between items-center mb-4">
        <h1 class="text-2xl font-semibold">Liste des Candidats</h1>

        <button
            id="refresh-button"
            class="flex items-center bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded"
        >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-1" id="refresh-icon">
                <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path>
                <path d="M21 3v5h-5"></path>
                <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path>
                <path d="M3 21v-5h5"></path>
            </svg>
            Rafraîchir
        </button>
    </div>

    {{-- Barre de recherche --}}
    <div class="mb-4 flex">
        <div class="relative flex-1 mr-2">
            <input
                type="text"
                placeholder="Rechercher un candidat..."
                id="search-input"
                class="w-full px-4 py-2 pl-10 border rounded"
            >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="absolute left-3 top-3 text-gray-500">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.3-4.3"></path>
            </svg>
        </div>
        <button
            id="search-button"
            class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
            Rechercher
        </button>
    </div>

    {{-- Onglets --}}
    <div class="flex gap-4 mb-4">
        <button
            id="all-tab"
            class="px-4 py-2 rounded bg-blue-600 text-white"
        >
            Tous les candidats
        </button>
        <button
            id="top-ranked-tab"
            class="px-4 py-2 rounded bg-gray-200"
        >
            Top classés
        </button>
    </div>

    {{-- Options de tri --}}
    <div class="mb-4 flex items-center">
        <button
            id="sort-rank"
            class="flex items-center mr-4 text-sm text-blue-600 hover:text-blue-800"
        >
            Trier par classement
            <svg id="rank-icon-up" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ml-1">
                <path d="m18 15-6-6-6 6"></path>
            </svg>
        </button>
        <button
            id="sort-name"
            class="flex items-center text-sm text-blue-600 hover:text-blue-800"
        >
            Trier par nom
            <svg id="name-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ml-1 hidden">
                <path d="m18 15-6-6-6 6"></path>
            </svg>
        </button>
    </div>

    {{-- Conteneur pour les données --}}
    <div id="loading-indicator" class="p-4 text-center">
        <div class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
        <p class="mt-2">Chargement en cours...</p>
    </div>

    <div id="error-container" class="p-4 text-center text-red-600 hidden">
        <p id="error-message"></p>
    </div>

    <div id="candidates-container">
        {{-- Les candidats seront injectés ici par JavaScript --}}
    </div>

    {{-- Pagination --}}
    <div id="pagination" class="flex justify-between items-center mt-4 hidden">
        <button
            id="prev-page"
            class="px-3 py-1 bg-gray-300 rounded disabled:opacity-50 hover:bg-gray-400 transition-colors"
        >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="m15 18-6-6 6-6"></path>
            </svg>
        </button>
        <span id="page-info">Page 1</span>
        <button
            id="next-page"
            class="px-3 py-1 bg-gray-300 rounded disabled:opacity-50 hover:bg-gray-400 transition-colors"
        >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="m9 18 6-6-6-6"></path>
            </svg>
        </button>
    </div>
</div>

{{-- Modèle pour un candidat (sera cloné par JavaScript) --}}
<template id="candidate-template">
    <div class="candidate-item border p-4 rounded mb-2 shadow-sm bg-white hover:bg-gray-50 transition-colors">
        <div class="flex justify-between items-start">
            <div>
                <h3 class="candidate-name font-semibold text-lg"></h3>
                <p class="candidate-email text-gray-600"></p>
            </div>
            <div class="text-right">
                <span class="candidate-rank bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm"></span>
            </div>
        </div>

        <div class="mt-3 grid grid-cols-1 md:grid-cols-3 gap-2">
            <div>
                <p class="text-sm text-gray-500">Badges</p>
                <p class="candidate-badges font-medium"></p>
            </div>
            <div>
                <p class="text-sm text-gray-500">Tests terminés</p>
                <p class="candidate-tests font-medium"></p>
            </div>
            <div>
                <p class="text-sm text-gray-500">Dernier test</p>
                <p class="candidate-last-test font-medium"></p>
            </div>
        </div>

        <div class="mt-2 flex justify-between items-center">
            <div class="candidate-status">
                {{-- Statut sera inséré ici par JavaScript --}}
            </div>

            <div class="flex space-x-2">
                <button
                    class="accept-button bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
                >
                    Accepter
                </button>
                <button
                    class="reject-button bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                >
                    Rejeter
                </button>
            </div>
        </div>
    </div>
</template>

{{-- Scripts requis pour la fonctionnalité --}}
<script>
    document.addEventListener('DOMContentLoaded', function() {
        // État de l'application
        let candidates = [];
        let topRankedCandidates = [];
        let currentPage = 1;
        let activeTab = 'all';
        let sortField = 'rank';
        let sortDirection = 'asc';
        const itemsPerPage = 10;

        // Éléments DOM
        const loadingIndicator = document.getElementById('loading-indicator');
        const errorContainer = document.getElementById('error-container');
        const errorMessage = document.getElementById('error-message');
        const candidatesContainer = document.getElementById('candidates-container');
        const paginationContainer = document.getElementById('pagination');
        const pageInfo = document.getElementById('page-info');
        const prevPageBtn = document.getElementById('prev-page');
        const nextPageBtn = document.getElementById('next-page');
        const refreshBtn = document.getElementById('refresh-button');
        const refreshIcon = document.getElementById('refresh-icon');
        const searchInput = document.getElementById('search-input');
        const searchBtn = document.getElementById('search-button');
        const allTabBtn = document.getElementById('all-tab');
        const topRankedTabBtn = document.getElementById('top-ranked-tab');
        const sortRankBtn = document.getElementById('sort-rank');
        const sortNameBtn = document.getElementById('sort-name');
        const candidateTemplate = document.getElementById('candidate-template');

        // Fonction pour récupérer les candidats depuis l'API
        async function fetchCandidates() {
            try {
                showLoading();
                hideError();

                // Essayer d'abord sans le préfixe /api
                try {
                    const response = await fetch('/candidates');
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    const data = await response.json();

                    candidates = data.candidates || [];
                    topRankedCandidates = data.topRankedCandidates || [];
                } catch (firstError) {
                    // Si la première tentative échoue, essayer avec le préfixe /api
                    console.error('First attempt failed:', firstError);
                    const response = await fetch('/api/candidates');
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    const data = await response.json();

                    candidates = data.candidates || [];
                    topRankedCandidates = data.topRankedCandidates || [];
                }

                renderCandidates();
            } catch (error) {
                console.error('Error fetching candidates:', error);
                showError(`Échec du chargement des candidats: ${error.message}`);
            } finally {
                hideLoading();
            }
        }

        // Fonction pour rechercher des candidats
        async function searchCandidates() {
            const searchTerm = searchInput.value.trim();
            if (!searchTerm) {
                fetchCandidates();
                return;
            }

            try {
                showLoading();
                hideError();

                const response = await fetch(`/candidates?search=${encodeURIComponent(searchTerm)}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data = await response.json();

                candidates = data.candidates || [];
                topRankedCandidates = data.candidates || []; // Même résultat pour les deux tabs pendant la recherche

                renderCandidates();
            } catch (error) {
                console.error('Error searching candidates:', error);
                showError(`Échec de la recherche: ${error.message}`);
            } finally {
                hideLoading();
            }
        }

        // Fonction pour accepter un candidat
        async function acceptCandidate(candidateId) {
            try {
                const response = await fetch(`/candidates/${candidateId}/accept`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
                    }
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                // Rafraîchir la liste après l'action
                fetchCandidates();
                return true;
            } catch (error) {
                console.error('Error accepting candidate:', error);
                showError(`Échec de l'acceptation: ${error.message}`);
                return false;
            }
        }

        // Fonction pour rejeter un candidat
        async function rejectCandidate(candidateId) {
            try {
                const response = await fetch(`/candidates/${candidateId}/reject`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
                    }
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                // Rafraîchir la liste après l'action
                fetchCandidates();
                return true;
            } catch (error) {
                console.error('Error rejecting candidate:', error);
                showError(`Échec du rejet: ${error.message}`);
                return false;
            }
        }

        // Fonction pour trier les candidats
        function sortCandidates(field) {
            if (sortField === field) {
                sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
            } else {
                sortField = field;
                sortDirection = 'asc';
            }

            updateSortIcons();
            renderCandidates();
        }

        // Mettre à jour les icônes de tri
        function updateSortIcons() {
            const rankIcon = document.getElementById('rank-icon-up');
            const nameIcon = document.getElementById('name-icon');

            rankIcon.classList.add('hidden');
            nameIcon.classList.add('hidden');

            if (sortField === 'rank') {
                rankIcon.classList.remove('hidden');
                if (sortDirection === 'desc') {
                    rankIcon.style.transform = 'rotate(180deg)';
                } else {
                    rankIcon.style.transform = 'rotate(0deg)';
                }
            } else if (sortField === 'name') {
                nameIcon.classList.remove('hidden');
                if (sortDirection === 'desc') {
                    nameIcon.style.transform = 'rotate(180deg)';
                } else {
                    nameIcon.style.transform = 'rotate(0deg)';
                }
            }
        }

        // Formater les dates
        function formatDate(dateString) {
            if (!dateString) return 'N/A';
            const date = new Date(dateString);
            return date.toLocaleDateString('fr-FR');
        }

        // Créer un indicateur de statut
        function createStatusIndicator(status) {
            if (!status) return '';

            let html = '';
            switch(status) {
                case 'Done':
                    html = `
                        <span class="flex items-center text-green-600">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-1">
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                <polyline points="22 4 12 14.01 9 11.01"></polyline>
                            </svg>
                            Terminé
                        </span>
                    `;
                    break;
                case 'In Progress':
                    html = `
                        <span class="flex items-center text-yellow-600">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-1">
                                <circle cx="12" cy="12" r="10"></circle>
                                <polyline points="12 6 12 12 16 14"></polyline>
                            </svg>
                            En cours
                        </span>
                    `;
                    break;
                case 'No Tests':
                    html = `
                        <span class="flex items-center text-gray-500">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-1">
                                <circle cx="12" cy="12" r="10"></circle>
                                <line x1="15" y1="9" x2="9" y2="15"></line>
                                <line x1="9" y1="9" x2="15" y2="15"></line>
                            </svg>
                            Aucun test
                        </span>
                    `;
                    break;
                default:
                    html = `<span>${status}</span>`;
            }

            return html;
        }

        // Obtenir la liste paginée
        function getPaginatedData(list) {
            const startIndex = (currentPage - 1) * itemsPerPage;
            return list.slice(startIndex, startIndex + itemsPerPage);
        }

        // Trier les candidats
        function getSortedCandidates() {
            return [...candidates].sort((a, b) => {
                if (sortField === 'rank') {
                    // Enlever le '#' pour trier numériquement
                    const rankA = parseInt(a.rank.replace('#', ''), 10);
                    const rankB = parseInt(b.rank.replace('#', ''), 10);
                    return sortDirection === 'asc' ? rankA - rankB : rankB - rankA;
                } else {
                    // Pour les autres champs (comme le nom)
                    return sortDirection === 'asc'
                        ? a[sortField] > b[sortField] ? 1 : -1
                        : a[sortField] < b[sortField] ? 1 : -1;
                }
            });
        }

        // Rendre la liste des candidats
        function renderCandidates() {
            candidatesContainer.innerHTML = '';

            const sortedCandidates = getSortedCandidates();
            const displayData = activeTab === 'all' ? sortedCandidates : topRankedCandidates;

            if (displayData.length === 0) {
                candidatesContainer.innerHTML = `
                    <p class="text-center py-4">
                        ${activeTab === 'all' ? 'Aucun candidat trouvé' : 'Aucun candidat classé trouvé'}
                    </p>
                `;
                paginationContainer.classList.add('hidden');
                return;
            }

            const paginatedData = getPaginatedData(displayData);

            paginatedData.forEach(candidate => {
                const candidateItem = candidateTemplate.content.cloneNode(true);

                // Remplir les données
                candidateItem.querySelector('.candidate-name').textContent = candidate.name;
                candidateItem.querySelector('.candidate-email').textContent = candidate.email;
                candidateItem.querySelector('.candidate-rank').textContent = candidate.rank;
                candidateItem.querySelector('.candidate-badges').textContent = candidate.badges;
                candidateItem.querySelector('.candidate-tests').textContent = candidate.completedTests;
                candidateItem.querySelector('.candidate-last-test').textContent = formatDate(candidate.lastTestDate);
                candidateItem.querySelector('.candidate-status').innerHTML = createStatusIndicator(candidate.lastTestStatus);

                // Configurer les boutons d'action
                const acceptButton = candidateItem.querySelector('.accept-button');
                const rejectButton = candidateItem.querySelector('.reject-button');

                acceptButton.addEventListener('click', () => acceptCandidate(candidate.id));
                rejectButton.addEventListener('click', () => rejectCandidate(candidate.id));

                candidatesContainer.appendChild(candidateItem);
            });

            // Mettre à jour la pagination
            updatePagination(displayData.length);
        }

        // Mettre à jour la pagination
        function updatePagination(totalItems) {
            if (totalItems <= itemsPerPage) {
                paginationContainer.classList.add('hidden');
                return;
            }

            paginationContainer.classList.remove('hidden');
            pageInfo.textContent = `Page ${currentPage}`;

            const maxPage = Math.ceil(totalItems / itemsPerPage);

            prevPageBtn.disabled = currentPage === 1;
            nextPageBtn.disabled = currentPage >= maxPage;

            if (prevPageBtn.disabled) {
                prevPageBtn.classList.add('opacity-50');
            } else {
                prevPageBtn.classList.remove('opacity-50');
            }

            if (nextPageBtn.disabled) {
                nextPageBtn.classList.add('opacity-50');
            } else {
                nextPageBtn.classList.remove('opacity-50');
            }
        }

        // Afficher le chargement
        function showLoading() {
            loadingIndicator.classList.remove('hidden');
            candidatesContainer.classList.add('hidden');
        }

        // Masquer le chargement
        function hideLoading() {
            loadingIndicator.classList.add('hidden');
            candidatesContainer.classList.remove('hidden');
        }

        // Afficher une erreur
        function showError(message) {
            errorContainer.classList.remove('hidden');
            errorMessage.textContent = message;
        }

        // Masquer l'erreur
        function hideError() {
            errorContainer.classList.add('hidden');
        }

        // Événements
        allTabBtn.addEventListener('click', () => {
            activeTab = 'all';
            allTabBtn.classList.add('bg-blue-600', 'text-white');
            allTabBtn.classList.remove('bg-gray-200');
            topRankedTabBtn.classList.add('bg-gray-200');
            topRankedTabBtn.classList.remove('bg-blue-600', 'text-white');
            currentPage = 1;
            renderCandidates();
        });

        topRankedTabBtn.addEventListener('click', () => {
            activeTab = 'topRanked';
            topRankedTabBtn.classList.add('bg-blue-600', 'text-white');
            topRankedTabBtn.classList.remove('bg-gray-200');
            allTabBtn.classList.add('bg-gray-200');
            allTabBtn.classList.remove('bg-blue-600', 'text-white');
            currentPage = 1;
            renderCandidates();
        });

        sortRankBtn.addEventListener('click', () => sortCandidates('rank'));
        sortNameBtn.addEventListener('click', () => sortCandidates('name'));

        prevPageBtn.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                renderCandidates();
            }
        });

        nextPageBtn.addEventListener('click', () => {
            const displayData = activeTab === 'all' ? candidates : topRankedCandidates;
            const maxPage = Math.ceil(displayData.length / itemsPerPage);

            if (currentPage < maxPage) {
                currentPage++;
                renderCandidates();
            }
        });

        refreshBtn.addEventListener('click', () => {
            refreshIcon.classList.add('animate-spin');
            fetchCandidates().finally(() => {
                setTimeout(() => refreshIcon.classList.remove('animate-spin'), 500);
            });
        });

        searchBtn.addEventListener('click', searchCandidates);
        searchInput.addEventListener('keypress', event => {
            if (event.key === 'Enter') {
                searchCandidates();
            }
        });

        // Charger les candidats au chargement de la page
        fetchCandidates();
    });
</script>
