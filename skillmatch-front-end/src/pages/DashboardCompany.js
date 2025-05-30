import React, { useEffect, useState } from 'react';
import { 
  BarChart3, Users, CheckCircle, FileText, Eye, EyeOff, 
  Mail, Award, Code, Filter, Search, Download, Star, Building2,
  Target, Activity, ArrowUpRight, MoreHorizontal, Calendar
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { api } from '../api/api';

const CompanyDashboard = () => {
  const [stats, setStats] = useState(null);
  const [selectedCandidates, setSelectedCandidates] = useState([]);
  const [acceptedCandidates, setAcceptedCandidates] = useState([]);
  const [tests, setTests] = useState([]);
  const [resolvedTests, setResolvedTests] = useState([]);
  const [expandedCandidate, setExpandedCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [activeTab, setActiveTab] = useState('overview');
  
  const companyId = localStorage.getItem('company_id');

  useEffect(() => {
    if (!companyId) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const [
          testCountRes,
          selectedCandidatesRes,
          resolvedTestsRes,
          acceptedCandidatesRes,
          testsRes,
          skillsCountRes
        ] = await Promise.all([
          api.get(`/api/companies/tests-count?company_id=${companyId}`),
          api.get(`/api/companies/selected-candidates?company_id=${companyId}`),
          api.get(`/api/companies/resolved-test-stats?company_id=${companyId}`),
          api.get(`/api/companies/accepted-candidates?company_id=${companyId}`),
          api.get(`/api/companies/tests?company_id=${companyId}`),
          api.get(`/api/companies/skills-count/${companyId}`)
        ]);

        const testCount = testCountRes.data?.tests_count || 0;
        const selectedList = Array.isArray(selectedCandidatesRes.data?.selected_candidates)
          ? selectedCandidatesRes.data.selected_candidates
          : [];
        const selectedCount = selectedList.length;
        const resolvedList = Array.isArray(resolvedTestsRes.data) ? resolvedTestsRes.data : [];
        const resolvedCount = resolvedList.length;
        const acceptedList = Array.isArray(acceptedCandidatesRes.data) ? acceptedCandidatesRes.data : [];
        const acceptedCount = acceptedList?.[0]?.accepted_candidates_count || acceptedList.length;
        const skillsCount = skillsCountRes.data?.skills_count || 0;

        setStats([
          { 
            label: 'Total Tests', 
            value: testCount, 
            icon: FileText, 
            gradient: 'from-blue-600 via-blue-700 to-indigo-800',
            bgGradient: 'from-blue-50 to-indigo-50',
            change: '+12%',
            changeType: 'positive'
          },
          { 
            label: 'Resolved Tests', 
            value: resolvedCount, 
            icon: CheckCircle, 
            gradient: 'from-emerald-600 via-green-700 to-teal-800',
            bgGradient: 'from-emerald-50 to-teal-50',
            change: '+8%',
            changeType: 'positive'
          },
          { 
            label: 'Selected Candidates', 
            value: selectedCount, 
            icon: Users, 
            gradient: 'from-purple-600 via-violet-700 to-indigo-800',
            bgGradient: 'from-purple-50 to-indigo-50',
            change: '+24%',
            changeType: 'positive'
          },
          { 
            label: 'Accepted Candidates', 
            value: acceptedCount, 
            icon: Award, 
            gradient: 'from-orange-600 via-amber-700 to-yellow-800',
            bgGradient: 'from-orange-50 to-yellow-50',
            change: '+18%',
            changeType: 'positive'
          },
          { 
            label: 'Skills Required', 
            value: skillsCount, 
            icon: Code, 
            gradient: 'from-teal-600 via-cyan-700 to-blue-800',
            bgGradient: 'from-teal-50 to-cyan-50',
            change: '+5%',
            changeType: 'positive'
          }
        ]);

        setSelectedCandidates(selectedList);
        setAcceptedCandidates(acceptedList);
        const testsData = Array.isArray(testsRes.data) ? testsRes.data : [];
        setTests(testsData);
        setResolvedTests(resolvedList);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setSelectedCandidates([]);
        setAcceptedCandidates([]);
        setTests([]);
        setResolvedTests([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [companyId]);

  const toggleCandidateDetails = (id, type) => {
    setExpandedCandidate(expandedCandidate === `${id}-${type}` ? null : `${id}-${type}`);
  };

  const exportToExcel = () => {
    const selectedData = selectedCandidates.map(c => ({
      Status: 'Selected',
      Name: c.candidate?.name || 'Unknown',
      Email: c.candidate?.email || 'N/A'
    }));
    const acceptedData = acceptedCandidates.map(c => ({
      Status: 'Accepted',
      Name: c.candidate_name || 'Unknown',
      Email: c.email || 'N/A'
    }));
    const combinedData = [...selectedData, ...acceptedData];

    const ws = XLSX.utils.json_to_sheet(combinedData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Candidates');
    XLSX.writeFile(wb, 'Candidates_Report.xlsx');
  };

  const StatCard = ({ stat, index }) => {
    const Icon = stat.icon;
    return (
      <div className="group relative">
        <div className={`bg-gradient-to-br ${stat.bgGradient} backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-105`}>
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div className={`p-4 rounded-2xl bg-gradient-to-r ${stat.gradient} shadow-xl group-hover:shadow-2xl transition-all duration-300`}>
                <Icon className="w-8 h-8 text-white" />
              </div>
              <div className="flex items-center space-x-1">
                <ArrowUpRight className={`w-4 h-4 ${stat.changeType === 'positive' ? 'text-emerald-600' : 'text-red-500'}`} />
                <span className={`text-sm font-bold ${stat.changeType === 'positive' ? 'text-emerald-600' : 'text-red-500'}`}>
                  {stat.change}
                </span>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-baseline space-x-2">
                <p className="text-4xl font-black text-gray-900 group-hover:text-gray-800 transition-colors duration-300">
                  {loading ? (
                    <div className="animate-pulse bg-gray-300 h-12 w-16 rounded-lg"></div>
                  ) : (
                    stat.value
                  )}
                </p>
                <div className="flex items-center space-x-1">
                  <div className="animate-pulse">
                    <Activity className="w-4 h-4 text-gray-500" />
                  </div>
                </div>
              </div>
              <p className="text-sm font-semibold text-gray-700 tracking-wide uppercase">
                {stat.label}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const CandidateCard = ({ candidate, type }) => {
    const candidateData = candidate.candidate || candidate;
    const candidateId = candidate.candidate_id || candidateData.id;
    const candidateName = candidateData.name || candidateData.candidate_name || 'Unknown';
    const candidateEmail = candidateData.email || 'N/A';
    const isExpanded = expandedCandidate === `${candidateId}-${type}`;

    return (
      <div className="group bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden hover:-translate-y-1">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 rounded-2xl flex items-center justify-center shadow-xl">
                  <span className="text-white font-bold text-lg">
                    {candidateName.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                </div>
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-lg">{candidateName}</h4>
                <p className="text-sm text-gray-600 font-medium">{candidateEmail}</p>
              </div>
            </div>
            <button
              onClick={() => toggleCandidateDetails(candidateId, type)}
              className="group/btn flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-gray-100 to-gray-200 hover:from-blue-100 hover:to-indigo-200 transition-all duration-300 border border-gray-300/50 hover:border-blue-300/50 shadow-sm hover:shadow-md"
            >
              {isExpanded ? (
                <EyeOff className="w-4 h-4 text-gray-600 group-hover/btn:text-blue-600 transition-colors duration-300" />
              ) : (
                <Eye className="w-4 h-4 text-gray-600 group-hover/btn:text-blue-600 transition-colors duration-300" />
              )}
              <span className="text-sm font-semibold text-gray-700 group-hover/btn:text-blue-700 transition-colors duration-300">
                {isExpanded ? 'Hide' : 'View'}
              </span>
            </button>
          </div>

          {isExpanded && (
            <div className="mt-6 pt-6 border-t border-gray-200/80 space-y-4 animate-in slide-in-from-top duration-500">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoItem icon={Users} label="Name" value={candidateName} />
                <InfoItem icon={Mail} label="Email" value={candidateEmail} />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const InfoItem = ({ icon: Icon, label, value, fullWidth = false }) => (
    <div className={`flex items-start space-x-3 p-3 rounded-xl bg-gray-50/80 border border-gray-200/50 ${fullWidth ? 'col-span-full' : ''}`}>
      <Icon className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">{label}</p>
        <p className="text-sm text-gray-900 break-words">{value}</p>
      </div>
    </div>
  );

  const TabButton = ({ id, label, icon: Icon, isActive, onClick }) => (
    <button
      onClick={() => onClick(id)}
      className={`flex items-center space-x-3 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
        isActive
          ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
      }`}
    >
      <Icon className="w-5 h-5" />
      <span>{label}</span>
    </button>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="animate-pulse space-y-8">
            <div className="h-12 bg-gray-300/50 rounded-2xl w-96"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="bg-white/50 rounded-3xl p-8 h-48">
                  <div className="space-y-4">
                    <div className="h-6 bg-gray-300/50 rounded-xl w-3/4"></div>
                    <div className="h-12 bg-gray-300/50 rounded-xl w-1/2"></div>
                    <div className="h-4 bg-gray-300/50 rounded-lg w-2/3"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const filteredCandidates = [...selectedCandidates, ...acceptedCandidates].filter(candidate => {
    const candidateData = candidate.candidate || candidate;
    const name = candidateData.name || candidateData.candidate_name || '';
    const email = candidateData.email || '';
    const isSelected = selectedCandidates.some(c => c.candidate_id === candidateData.id || c.candidate?.id === candidateData.id);
    const isAccepted = acceptedCandidates.some(c => c.candidate_id === candidateData.id || c.id === candidateData.id);

    const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || 
                         (filterStatus === 'selected' && isSelected) || 
                         (filterStatus === 'accepted' && isAccepted);

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-6 lg:space-y-0">
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl shadow-xl">
                <Building2 className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-5xl font-black bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">
                  Company Dashboard
                </h1>
                <p className="text-gray-600 font-medium text-lg">Advanced recruitment analytics and insights</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button 
              onClick={exportToExcel}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 font-semibold"
            >
              <Download className="w-5 h-5" />
              <span>Export Report</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {stats?.map((stat, index) => (
            <StatCard key={stat.label} stat={stat} index={index} />
          ))}
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center space-x-2 p-2 bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 shadow-lg">
          <TabButton
            id="overview"
            label="Overview"
            icon={BarChart3}
            isActive={activeTab === 'overview'}
            onClick={setActiveTab}
          />
          <TabButton
            id="candidates"
            label="Candidates"
            icon={Users}
            isActive={activeTab === 'candidates'}
            onClick={setActiveTab}
          />
          <TabButton
            id="tests"
            label="Tests"
            icon={FileText}
            isActive={activeTab === 'tests'}
            onClick={setActiveTab}
          />
        </div>

        {/* Content based on active tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            <CandidatesSection 
              title="Selected Candidates" 
              candidates={selectedCandidates}
              icon={Users}
              gradient="from-purple-600 to-indigo-700"
              bgGradient="from-purple-50 to-indigo-50"
              type="selected"
            />
            <CandidatesSection 
              title="Accepted Candidates" 
              candidates={acceptedCandidates}
              icon={Award}
              gradient="from-orange-600 to-amber-700"
              bgGradient="from-orange-50 to-amber-50"
              type="accepted"
            />
          </div>
        )}

        {activeTab === 'candidates' && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search candidates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 pr-4 py-3 bg-white/80 backdrop-blur-xl border border-gray-200/50 rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 w-full sm:w-80 font-medium"
                />
              </div>
              <div className="flex items-center space-x-3">
                <Filter className="w-5 h-5 text-gray-500" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-3 bg-white/80 backdrop-blur-xl border border-gray-200/50 rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 font-medium"
                >
                  <option value="all">All Status</option>
                  <option value="selected">Selected</option>
                  <option value="accepted">Accepted</option>
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredCandidates.map((candidate, index) => {
                const isSelected = selectedCandidates.some(c => c.candidate_id === candidate.id || c.candidate?.id === candidate.id);
                const type = isSelected ? 'selected' : 'accepted';
                return <CandidateCard key={`${candidate.id || candidate.candidate_id}-${type}`} candidate={candidate} type={type} />;
              })}
            </div>
          </div>
        )}

        {activeTab === 'tests' && (
          <TestsSection tests={tests} />
        )}
      </div>
    </div>
  );

  function CandidatesSection({ title, candidates, icon: Icon, gradient, bgGradient, type }) {
    return (
      <div className={`bg-gradient-to-br ${bgGradient} backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl p-8`}>
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className={`p-4 rounded-2xl bg-gradient-to-r ${gradient} shadow-xl`}>
              <Icon className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
          </div>
          <div className="flex items-center space-x-3">
            <span className={`px-4 py-2 bg-gradient-to-r ${gradient} text-white rounded-xl text-sm font-bold shadow-lg`}>
              {candidates.length} total
            </span>
            <button className="p-2 hover:bg-white/50 rounded-xl transition-colors duration-200">
              <MoreHorizontal className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
        
        <div className="space-y-6 max-h-96 overflow-y-auto custom-scrollbar">
          {candidates.length === 0 ? (
            <div className="text-center py-12">
              <div className="p-6 bg-white/50 rounded-2xl inline-block mb-4">
                <Icon className="w-16 h-16 text-gray-400 mx-auto" />
              </div>
              <p className="text-xl font-semibold text-gray-600 mb-2">No {title.toLowerCase()} yet</p>
              <p className="text-gray-500">Candidates will appear here once available</p>
            </div>
          ) : (
            candidates.map((candidate, index) => (
              <CandidateCard key={`${candidate.candidate_id || candidate.id}-${type}`} candidate={candidate} type={type} />
            ))
          )}
        </div>
      </div>
    );
  }

  function TestsSection({ tests }) {
    return (
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-gray-200/50 shadow-2xl p-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 shadow-xl">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">Created Tests</h3>
          </div>
          <span className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl text-sm font-bold shadow-lg">
            {tests.length} tests
          </span>
        </div>
        
        {tests.length === 0 ? (
          <div className="text-center py-16">
            <div className="p-8 bg-gray-50 rounded-3xl inline-block mb-6">
              <FileText className="w-20 h-20 text-gray-400 mx-auto" />
            </div>
            <p className="text-2xl font-bold text-gray-700 mb-3">No tests created yet</p>
            <p className="text-gray-500 text-lg mb-6">Start by creating your first assessment test</p>
            <button className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              Create Test
            </button>
          </div>
        ) : (
          <div className="grid gap-6">
            {tests.map((test, index) => (
              <div key={test.id} className="group bg-gradient-to-r from-white to-gray-50/80 border border-gray-200/50 rounded-2xl p-6 hover:shadow-xl transition-all duration-500 hover:-translate-y-1">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                        <FileText className="w-6 h-6 text-white" />
                      </div>
                      <h4 className="font-bold text-gray-900 text-xl group-hover:text-blue-700 transition-colors duration-300">
                        {test.objective || `Test #${test.id}`}
                      </h4>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <InfoItem icon={Target} label="Prerequisites" value={test.prerequisites || 'N/A'} />
                      <InfoItem icon={Code} label="Tools Required" value={test.tools_required || 'N/A'} />
                      <InfoItem icon={FileText} label="Before Answer" value={test.before_answer || 'N/A'} />
                      <InfoItem icon={Calendar} label="Created" value={new Date(test.created_at).toLocaleDateString()} />
                    </div>
                  </div>
                  
                  <div className="ml-6 flex-shrink-0 space-y-3">
                    <span className="inline-flex items-center px-4 py-2 rounded-xl text-sm font-bold bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border border-blue-200/50">
                      Test #{index + 1}
                    </span>
                    <div className="flex space-x-2">
                      <button className="p-2 hover:bg-blue-100 rounded-lg transition-colors duration-200">
                        <Eye className="w-4 h-4 text-blue-600" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                        <MoreHorizontal className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
};

export default CompanyDashboard;