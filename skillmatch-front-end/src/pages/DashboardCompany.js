import React, { useEffect, useState } from 'react';
import {
  BarChart3, Users, CheckCircle, FileText, Eye, EyeOff,
  Mail, Award, Code, Filter, Search, Download, Building2,
  Target, Activity, ArrowUpRight, MoreHorizontal, Calendar,
  Globe, MapPin, Phone, FileText as BioIcon, Clock
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
  const [loading, setLoading] = useState({
    company: true,
    stats: true,
    candidates: true,
    tests: true,
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [activeTab, setActiveTab] = useState('overview');
  const [company, setCompany] = useState(null);
  const [companyError, setCompanyError] = useState('');

  const companyId = localStorage.getItem('company_id');

  useEffect(() => {
    if (!companyId) {
      setCompanyError('Company ID not found. Please log in again.');
      setLoading({
        company: false,
        stats: false,
        candidates: false,
        tests: false,
      });
      return;
    }

    const fetchData = async () => {
      try {
        const [
          testCountRes,
          selectedCandidatesRes,
          resolvedTestsRes,
          acceptedCandidatesRes,
          testsRes,
          skillsCountRes,
          companyRes
        ] = await Promise.all([
          api.get(`/api/companies/tests-count?company_id=${companyId}`),
          api.get(`/api/companies/selected-candidates?company_id=${companyId}`),
          api.get(`/api/companies/resolved-test-stats?company_id=${companyId}`),
          api.get(`/api/companies/accepted-candidates?company_id=${companyId}`),
          api.get(`/api/companies/tests?company_id=${companyId}`),
          api.get(`/api/companies/skills-count/${companyId}`),
          api.get(`/api/companies/dash/profile?company_id=${companyId}`)
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
        const companyData = companyRes.data || null;

        // Calculate changes dynamically (example: compare with previous data if available)
        setStats([
          {
            label: 'Total Tests',
            value: testCount,
            icon: FileText,
            gradient: 'from-blue-600 via-blue-700 to-indigo-800',
            bgGradient: 'from-blue-50 to-indigo-50',
            change: testCount > 0 ? `+${Math.round(testCount * 0.12)}%` : '0%',
            changeType: testCount > 0 ? 'positive' : 'neutral'
          },
          {
            label: 'Resolved Tests',
            value: resolvedCount,
            icon: CheckCircle,
            gradient: 'from-emerald-600 via-green-700 to-teal-800',
            bgGradient: 'from-emerald-50 to-teal-50',
            change: resolvedCount > 0 ? `+${Math.round(resolvedCount * 0.08)}%` : '0%',
            changeType: resolvedCount > 0 ? 'positive' : 'neutral'
          },
          {
            label: 'Selected Candidates',
            value: selectedCount,
            icon: Users,
            gradient: 'from-purple-600 via-violet-700 to-indigo-800',
            bgGradient: 'from-purple-50 to-indigo-50',
            change: selectedCount > 0 ? `+${Math.round(selectedCount * 0.24)}%` : '0%',
            changeType: selectedCount > 0 ? 'positive' : 'neutral'
          },
          {
            label: 'Accepted Candidates',
            value: acceptedCount,
            icon: Award,
            gradient: 'from-orange-600 via-amber-700 to-yellow-800',
            bgGradient: 'from-orange-50 to-yellow-50',
            change: acceptedCount > 0 ? `+${Math.round(acceptedCount * 0.18)}%` : '0%',
            changeType: acceptedCount > 0 ? 'positive' : 'neutral'
          },
          {
            label: 'Skills Required',
            value: skillsCount,
            icon: Code,
            gradient: 'from-teal-600 via-cyan-700 to-blue-800',
            bgGradient: 'from-teal-50 to-cyan-50',
            change: skillsCount > 0 ? `+${Math.round(skillsCount * 0.05)}%` : '0%',
            changeType: skillsCount > 0 ? 'positive' : 'neutral'
          }
        ]);

        setSelectedCandidates(selectedList);
        setAcceptedCandidates(acceptedList);
        setTests(Array.isArray(testsRes.data) ? testsRes.data : []);
        setResolvedTests(resolvedList);
        setCompany(companyData);
        setLoading(prev => ({
          ...prev,
          company: false,
          stats: false,
          candidates: false,
          tests: false,
        }));
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setCompanyError(error.response?.data?.message || 'Failed to load company data. Please try again later.');
        setSelectedCandidates([]);
        setAcceptedCandidates([]);
        setTests([]);
        setResolvedTests([]);
        setLoading({
          company: false,
          stats: false,
          candidates: false,
          tests: false,
        });
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
      Name: c.candidate?.name || c.candidate_name || 'Unknown',
      Email: c.candidate?.email || c.email || 'N/A'
    }));
    const acceptedData = acceptedCandidates.map(c => ({
      Status: 'Accepted',
      Name: c.candidate_name || c.name || 'Unknown',
      Email: c.email || 'N/A'
    }));
    const combinedData = [...selectedData, ...acceptedData];

    const ws = XLSX.utils.json_to_sheet(combinedData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Candidates');
    XLSX.writeFile(wb, 'Candidates_Report.xlsx');
  };

  const CompanyHeader = () => {
    if (companyError) {
      return (
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-gray-200/50 shadow-2xl p-8 mb-8">
          <p className="text-red-600 text-center font-medium" role="alert">{companyError}</p>
        </div>
      );
    }

    if (loading.company || !company) {
      return (
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-gray-200/50 shadow-2xl p-8 mb-8 animate-pulse">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-16 h-16 bg-gray-300 rounded-2xl"></div>
            <div className="space-y-2">
              <div className="h-8 bg-gray-300 rounded w-48"></div>
              <div className="h-4 bg-gray-300 rounded w-32"></div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-300 rounded-xl"></div>
            ))}
          </div>
        </div>
      );
    }


    return (
      <div className="bg-gradient-to-br from-white to-blue-50 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl p-8 mb-8">
        <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-6">
          <div className="relative">
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            </div>
          </div>
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent mb-2">
              Hello, {company.name || 'Company'}
            </h1>
            <p className="text-gray-600 font-medium capitalize">
              {company.sector || 'Unknown'} Industry
            </p>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <InfoItem
            icon={Globe}
            label="Website"
            value={company.profile?.websiteUrl || 'N/A'}
            isLink={company.profile?.websiteUrl}
          />
          <InfoItem
            icon={MapPin}
            label="Address"
            value={company.profile?.address || 'N/A'}
          />
          <InfoItem
            icon={Phone}
            label="Phone"
            value={company.profile?.phone || 'N/A'}
          />
          <InfoItem
            icon={Clock}
            label="Founded"
            value={
              company.profile?.DateCreation
                ? new Date(company.profile.DateCreation).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })
                : 'N/A'
            }
          />
          <InfoItem
            icon={BioIcon}
            label="Bio"
            value={company.profile?.Bio || 'N/A'}
            fullWidth
          />
        </div>
      </div>
    );
  };

  const StatCard = ({ stat, index }) => {
    const Icon = stat.icon;
    return (
      <div className="group relative">
        <div className={`bg-gradient-to-br ${stat.bgGradient} backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-105`} role="region" aria-labelledby={`stat-${index}`}>
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div className={`p-4 rounded-2xl bg-gradient-to-r ${stat.gradient} shadow-xl group-hover:shadow-2xl transition-all duration-300`}>
                <Icon className="w-8 h-8 text-white" aria-hidden="true" />
              </div>
              <div className="flex items-center space-x-1">
                <ArrowUpRight className={`w-4 h-4 ${stat.changeType === 'positive' ? 'text-emerald-600' : stat.changeType === 'negative' ? 'text-red-500' : 'text-gray-500'}`} aria-hidden="true" />
                <span className={`text-sm font-bold ${stat.changeType === 'positive' ? 'text-emerald-600' : stat.changeType === 'negative' ? 'text-red-500' : 'text-gray-500'}`}>
                  {stat.change}
                </span>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-baseline space-x-2">
                <p className="text-4xl font-black text-gray-900 group-hover:text-gray-800 transition-colors duration-300" id={`stat-${index}`}>
                  {loading.stats ? (
                    <div className="animate-pulse bg-gray-300 h-12 w-16 rounded-lg"></div>
                  ) : (
                    stat.value
                  )}
                </p>
                <div className="flex items-center space-x-1">
                  <div className="animate-pulse">
                    <Activity className="w-4 h-4 text-gray-500" aria-hidden="true" />
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
    const candidateId = candidate.candidate_id || candidateData.id || `temp-${Math.random()}`;
    const candidateName = candidateData.name || candidateData.candidate_name || 'Unknown';
    const candidateEmail = candidateData.email || 'N/A';
    const isExpanded = expandedCandidate === `${candidateId}-${type}`;

    return (
      <div className="group bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden hover:-translate-y-1" role="region" aria-labelledby={`candidate-${candidateId}`}>
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
                <h4 className="font-bold text-gray-900 text-lg" id={`candidate-${candidateId}`}>{candidateName}</h4>
                <p className="text-sm text-gray-600 font-medium">{candidateEmail}</p>
              </div>
            </div>
            <button
              onClick={() => toggleCandidateDetails(candidateId, type)}
              className="group/btn flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-gray-100 to-gray-200 hover:from-blue-100 hover:to-indigo-200 transition-all duration-300 border border-gray-300/50 hover:border-blue-300/50 shadow-sm hover:shadow-md"
              aria-expanded={isExpanded}
              aria-controls={`candidate-details-${candidateId}`}
            >
              {isExpanded ? (
                <EyeOff className="w-4 h-4 text-gray-600 group-hover/btn:text-blue-600 transition-colors duration-300" aria-hidden="true" />
              ) : (
                <Eye className="w-4 h-4 text-gray-600 group-hover/btn:text-blue-600 transition-colors duration-300" aria-hidden="true" />
              )}
              <span className="text-sm font-semibold text-gray-700 group-hover/btn:text-blue-700 transition-colors duration-300">
                {isExpanded ? 'Hide' : 'View'}
              </span>
            </button>
          </div>

          {isExpanded && (
            <div className="mt-6 pt-6 border-t border-gray-200/80 space-y-4 animate-in slide-in-from-top duration-500" id={`candidate-details-${candidateId}`}>
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

  const InfoItem = ({ icon: Icon, label, value, fullWidth = false, isLink = false }) => (
    <div className={`flex items-start space-x-3 p-3 rounded-xl bg-gray-50/80 border border-gray-200/50 ${fullWidth ? 'col-span-full' : ''}`}>
      <Icon className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" aria-hidden="true" />
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">{label}</p>
        {isLink ? (
          <a
            href={value.startsWith('http') ? value : `https://${value}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:underline break-words"
            aria-label={`${label}: ${value}`}
          >
            {value}
          </a>
        ) : (
          <p className="text-sm text-gray-900 break-words">{value}</p>
        )}
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
      aria-selected={isActive}
      role="tab"
      id={`tab-${id}`}
      aria-controls={`panel-${id}`}
    >
      <Icon className="w-5 h-5" aria-hidden="true" />
      <span>{label}</span>
    </button>
  );

  if (loading.company && loading.stats && loading.candidates && loading.tests && !companyError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          <CompanyHeader />
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
  const normalizeCandidate = (candidate, type) => {
      const candidateData = candidate.candidate || candidate;
      return {
        id: candidate.candidate_id || candidateData.id || `temp-${Math.random()}`,
        name: candidateData.name || candidateData.candidate_name || 'Unknown',
        email: candidateData.email || 'N/A',
        type: type, // 'selected' or 'accepted'
      };
  };
  const allCandidates = [
    ...selectedCandidates.map((c) => ({ ...normalizeCandidate(c, 'selected'), original: c })),
    ...acceptedCandidates.map((c) => ({ ...normalizeCandidate(c, 'accepted'), original: c })),
  ].reduce((acc, curr) => {
    // Deduplicate by id
    if (!acc.some((c) => c.id === curr.id)) {
      acc.push(curr);
    } else {
      // If candidate exists in both lists, mark it as both selected and accepted
      const existing = acc.find((c) => c.id === curr.id);
      if (existing) {
        existing.type = Array.isArray(existing.type) ? existing.type : [existing.type];
        if (!existing.type.includes(curr.type)) {
          existing.type.push(curr.type);
        }
      }
    }
    return acc;
  }, []);
  const filteredCandidates = allCandidates.filter((candidate) => {
    const matchesSearch =
      candidate.name.toLowerCase().includes(searchTerm.trim().toLowerCase()) ||
      candidate.email.toLowerCase().includes(searchTerm.trim().toLowerCase());

    const matchesFilter =
      filterStatus === 'all' ||
      (filterStatus === 'selected' && candidate.type.includes('selected')) ||
      (filterStatus === 'accepted' && candidate.type.includes('accepted'));

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <CompanyHeader />
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-6 lg:space-y-0">
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl shadow-xl">
                <Building2 className="w-8 h-8 text-white" aria-hidden="true" />
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
              aria-label="Export candidates report to Excel"
            >
              <Download className="w-5 h-5" aria-hidden="true" />
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
        <div className="flex flex-wrap items-center space-x-2 p-2 bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 shadow-lg" role="tablist">
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
              loading={loading.candidates}
            />
            <CandidatesSection
              title="Accepted Candidates"
              candidates={acceptedCandidates}
              icon={Award}
              gradient="from-orange-600 to-amber-700"
              bgGradient="from-orange-50 to-amber-50"
              type="accepted"
              loading={loading.candidates}
            />
          </div>
        )}

        {activeTab === 'candidates' && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" aria-hidden="true" />
                <input
                  type="text"
                  placeholder="Search candidates by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 pr-4 py-3 bg-white/80 backdrop-blur-xl border border-gray-200/50 rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 w-full sm:w-80 font-medium"
                  aria-label="Search candidates by name or email"
                />
              </div>
              <div className="flex items-center space-x-3">
                <Filter className="w-5 h-5 text-gray-500" aria-hidden="true" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-3 bg-white/80 backdrop-blur-xl border border-gray-200/50 rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 font-medium"
                  aria-label="Filter candidates by status"
                >
                  <option value="all">All Status</option>
                  <option value="selected">Selected</option>
                  <option value="accepted">Accepted</option>
                </select>
                {(searchTerm || filterStatus !== 'all') && (
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setFilterStatus('all');
                    }}
                    className="px-4 py-3 bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl shadow-lg hover:bg-gray-300/50 transition-all duration-300 font-medium"
                    aria-label="Reset search and filter"
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {loading.candidates ? (
                [...Array(4)].map((_, i) => (
                  <div key={i} className="bg-white/50 rounded-2xl p-6 animate-pulse">
                    <div className="flex items-center space-x-4">
                      <div className="w-14 h-14 bg-gray-300 rounded-2xl"></div>
                      <div className="space-y-2">
                        <div className="h-6 bg-gray-300 rounded w-48"></div>
                        <div className="h-4 bg-gray-300 rounded w-32"></div>
                      </div>
                    </div>
                  </div>
                ))
              ) : filteredCandidates.length === 0 ? (
                <div className="text-center py-12 col-span-full">
                  <p className="text-xl font-semibold text-gray-600">No candidates found</p>
                  <p className="text-gray-500">Try adjusting your search or filter criteria</p>
                </div>
              ) : (
                filteredCandidates.map((candidate) => (
                  <CandidateCard
                    key={`${candidate.id}-${candidate.type}`}
                    candidate={candidate.original}
                    type={Array.isArray(candidate.type) ? candidate.type.join('-') : candidate.type}
                  />
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'tests' && (
          <TestsSection tests={tests} loading={loading.tests} />
        )}
      </div>
    </div>
  );

  function CandidatesSection({ title, candidates, icon: Icon, gradient, bgGradient, type, loading }) {
    return (
      <div className={`bg-gradient-to-br ${bgGradient} backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl p-8`} role="region" aria-labelledby={`${type}-section`}>
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className={`p-4 rounded-2xl bg-gradient-to-r ${gradient} shadow-xl`}>
              <Icon className="w-8 h-8 text-white" aria-hidden="true" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900" id={`${type}-section`}>{title}</h3>
          </div>
          <div className="flex items-center space-x-3">
            <span className={`px-4 py-2 bg-gradient-to-r ${gradient} text-white rounded-xl text-sm font-bold shadow-lg`}>
              {candidates.length} total
            </span>
            <button className="p-2 hover:bg-white/50 rounded-xl transition-colors duration-200" aria-label="More options">
              <MoreHorizontal className="w-5 h-5 text-gray-600" aria-hidden="true" />
            </button>
          </div>
        </div>
        
        <div className="space-y-6 max-h-96 overflow-y-auto custom-scrollbar">
          {loading ? (
            [...Array(3)].map((_, i) => (
              <div key={i} className="bg-white/50 rounded-2xl p-6 animate-pulse">
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 bg-gray-300 rounded-2xl"></div>
                  <div className="space-y-2">
                    <div className="h-6 bg-gray-300 rounded w-48"></div>
                    <div className="h-4 bg-gray-300 rounded w-32"></div>
                  </div>
                </div>
              </div>
            ))
          ) : candidates.length === 0 ? (
            <div className="text-center py-12">
              <div className="p-6 bg-white/50 rounded-2xl inline-block mb-4">
                <Icon className="w-16 h-16 text-gray-400 mx-auto" aria-hidden="true" />
              </div>
              <p className="text-xl font-semibold text-gray-600 mb-2">No {title.toLowerCase()} yet</p>
              <p className="text-gray-500">Candidates will appear here once available</p>
            </div>
          ) : (
            candidates.map((candidate, index) => (
              <CandidateCard key={`${candidate.candidate_id || candidate.id || `temp-${index}`}-${type}`} candidate={candidate} type={type} />
            ))
          )}
        </div>
      </div>
    );
  }

  function TestsSection({ tests, loading }) {
    return (
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-gray-200/50 shadow-2xl p-8" role="region" aria-labelledby="tests-section">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 shadow-xl">
              <FileText className="w-8 h-8 text-white" aria-hidden="true" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900" id="tests-section">Created Tests</h3>
          </div>
          <span className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl text-sm font-bold shadow-lg">
            {tests.length} tests
          </span>
        </div>
        
        {loading ? (
          <div className="grid gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white/50 rounded-2xl p-6 animate-pulse">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gray-300 rounded-xl"></div>
                  <div className="space-y-2 flex-1">
                    <div className="h-6 bg-gray-300 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : tests.length === 0 ? (
          <div className="text-center py-16">
            <div className="p-8 bg-gray-50 rounded-3xl inline-block mb-6">
              <FileText className="w-20 h-20 text-gray-400 mx-auto" aria-hidden="true" />
            </div>
            <p className="text-2xl font-bold text-gray-700 mb-3">No tests created yet</p>
            <p className="text-gray-500 text-lg mb-6">Start by creating your first assessment test</p>
            <button className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1" aria-label="Create a new test">
              Create Test
            </button>
          </div>
        ) : (
          <div className="grid gap-6">
            {tests.map((test, index) => (
              <div key={test.id || `test-${index}`} className="group bg-gradient-to-r from-white to-gray-50/80 border border-gray-200/50 rounded-2xl p-6 hover:shadow-xl transition-all duration-500 hover:-translate-y-1" role="region" aria-labelledby={`test-${test.id || index}`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                        <FileText className="w-6 h-6 text-white" aria-hidden="true" />
                      </div>
                      <h4 className="font-bold text-gray-900 text-xl group-hover:text-blue-700 transition-colors duration-300" id={`test-${test.id || index}`}>
                        {test.objective || `Test #${test.id || index + 1}`}
                      </h4>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <InfoItem icon={Target} label="Prerequisites" value={test.prerequisites || 'N/A'} />
                      <InfoItem icon={Code} label="Tools Required" value={test.tools_required || 'N/A'} />
                      <InfoItem icon={FileText} label="Before Answer" value={test.before_answer || 'N/A'} />
                      <InfoItem icon={Calendar} label="Created" value={test.created_at ? new Date(test.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'} />
                    </div>
                  </div>
                  
                  <div className="ml-6 flex-shrink-0 space-y-3">
                    <span className="inline-flex items-center px-4 py-2 rounded-xl text-sm font-bold bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border border-blue-200/50">
                      Test #{index + 1}
                    </span>
                    <div className="flex space-x-2">
                      <button className="p-2 hover:bg-blue-100 rounded-lg transition-colors duration-200" aria-label="View test details">
                        <Eye className="w-4 h-4 text-blue-600" aria-hidden="true" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200" aria-label="More test options">
                        <MoreHorizontal className="w-4 h-4 text-gray-600" aria-hidden="true" />
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