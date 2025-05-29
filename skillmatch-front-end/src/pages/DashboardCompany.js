import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3'; // Import d3.js
import { api } from '../api/api';
import { BarChart3, Users, CheckCircle, FileText, TrendingUp, Eye, EyeOff, Mail, Phone, MapPin, Briefcase, Award, Code } from 'lucide-react';

const CompanyDashboard = () => {
  const testsChartRef = useRef();
  const [stats, setStats] = useState(null);
  const [selectedCandidates, setSelectedCandidates] = useState([]);
  const [acceptedCandidates, setAcceptedCandidates] = useState([]);
  const [tests, setTests] = useState([]);
  const [resolvedTests, setResolvedTests] = useState([]);
  const [expandedCandidate, setExpandedCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('Daily'); // Options: Daily, Weekly, Monthly
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
          { label: 'Total Tests', value: testCount, icon: FileText, color: 'from-blue-500 to-blue-600', bgColor: 'bg-blue-50' },
          { label: 'Resolved Tests', value: resolvedCount, icon: CheckCircle, color: 'from-green-500 to-green-600', bgColor: 'bg-green-50' },
          { label: 'Selected Candidates', value: selectedCount, icon: Users, color: 'from-purple-500 to-purple-600', bgColor: 'bg-purple-50' },
          { label: 'Accepted Candidates', value: acceptedCount, icon: Award, color: 'from-orange-500 to-orange-600', bgColor: 'bg-orange-50' },
          { label: 'Skills Required', value: skillsCount, icon: Code, color: 'from-teal-500 to-teal-600', bgColor: 'bg-teal-50' }
        ]);

        setSelectedCandidates(selectedList);
        setAcceptedCandidates(acceptedList);
        const testsData = Array.isArray(testsRes.data) ? testsRes.data : [];
        setTests(testsData);
        console.log('Tests Data:', testsData); // Debug log
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

  // Chart: Tests Created Over Time (Daily, Weekly, Monthly) with d3.js
  useEffect(() => {
    if (!tests.length || !testsChartRef.current) {
      console.log('No tests to display or chart ref not available:', tests); // Debug log
      return;
    }

    const today = new Date('2025-05-29T13:49:00+01:00'); // Updated to current time
    // Adjust date parsing to handle 'Z' as UTC
    const parseDate = d3.timeParse('%Y-%m-%dT%H:%M:%S.%LZ');

    let groupFormat, startDate, ticks, labelFormat;
    switch (timeRange) {
      case 'Daily':
        groupFormat = (date) => d3.timeFormat('%Y-%m-%d')(date);
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 30); // Last 30 days
        ticks = d3.timeDay.every(5);
        labelFormat = (date) => d3.timeFormat('%d/%m')(date);
        break;
      case 'Weekly':
        groupFormat = (date) => {
          const week = d3.timeWeek.floor(date);
          return d3.timeFormat('%Y-W%U')(week);
        };
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 180);
        ticks = d3.timeMonth.every(1);
        labelFormat = (date) => `Week ${d3.timeFormat('%U')(date)} (${d3.timeFormat('%b %d')(date)})`;
        break;
      case 'Monthly':
        groupFormat = (date) => d3.timeFormat('%Y-%m')(date);
        startDate = new Date(today);
        startDate.setFullYear(today.getFullYear() - 1);
        ticks = d3.timeMonth.every(2);
        labelFormat = (date) => d3.timeFormat('%b %Y')(date);
        break;
      default:
        return;
    }

    const testCountsByPeriod = {};
    tests.forEach(test => {
      const date = parseDate(test.created_at);
      console.log('Parsed Date for test:', test.created_at, date); // Debug log
      if (date && date >= startDate && date <= today) {
        const period = groupFormat(date);
        testCountsByPeriod[period] = (testCountsByPeriod[period] || 0) + 1;
      }
    });

    const data = Object.entries(testCountsByPeriod)
      .map(([period, count]) => ({
        date: parseDate(`${period}T00:00:00.000Z`),
        value: count
      }))
      .filter(d => d.date >= startDate && d.date <= today)
      .sort((a, b) => a.date - b.date);

    console.log('Chart Data:', data); // Debug log

    d3.select(testsChartRef.current).selectAll('*').remove();

    const svg = d3.select(testsChartRef.current);
    const width = 800;
    const height = 300;
    const margin = { top: 20, right: 20, bottom: 40, left: 40 };

    svg.attr('width', width).attr('height', height);

    const x = d3.scaleBand()
      .domain(data.map(d => d.date))
      .range([margin.left, width - margin.right])
      .padding(0.1);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.value) || 1])
      .nice()
      .range([height - margin.bottom, margin.top]);

    svg.selectAll('.bar')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', d => x(d.date))
      .attr('y', d => y(d.value))
      .attr('width', x.bandwidth())
      .attr('height', d => height - margin.bottom - y(d.value))
      .attr('fill', '#3b82f6');

    svg.append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).tickValues(data.map(d => d.date)).tickFormat(labelFormat).tickSizeOuter(0))
      .selectAll('text')
      .attr('font-size', '12px')
      .attr('fill', '#6b7280')
      .style('text-anchor', 'end')
      .attr('dx', '-0.5em')
      .attr('dy', '0.15em')
      .attr('transform', 'rotate(-45)');

    svg.append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).ticks(5))
      .selectAll('text')
      .attr('font-size', '12px')
      .attr('fill', '#6b7280');

    svg.append('text')
      .attr('x', width / 2)
      .attr('y', margin.top / 2)
      .attr('text-anchor', 'middle')
      .attr('font-size', '14px')
      .attr('fill', '#1e293b')
      .text('Tests Created Over Time');

    svg.append('text')
      .attr('x', width / 2)
      .attr('y', height - margin.bottom / 2)
      .attr('text-anchor', 'middle')
      .attr('font-size', '12px')
      .attr('fill', '#1e293b')
      .text(timeRange === 'Daily' ? 'Date' : timeRange === 'Weekly' ? 'Week' : 'Month');

    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -height / 2)
      .attr('y', margin.left / 4)
      .attr('text-anchor', 'middle')
      .attr('font-size', '12px')
      .attr('fill', '#1e293b')
      .text('Number of Tests');
  }, [tests, timeRange]);

  const toggleCandidateDetails = (id) => {
    setExpandedCandidate(expandedCandidate === id ? null : id);
  };

  const StatCard = ({ stat, index }) => {
    const Icon = stat.icon;
    return (
      <div className={`${stat.bgColor} rounded-2xl p-6 border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}>
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color} shadow-lg`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          <TrendingUp className="w-5 h-5 text-gray-400" />
        </div>
        <div className="space-y-2">
          <p className="text-3xl font-bold text-gray-800">{loading ? '...' : stat.value}</p>
          <p className="text-sm font-medium text-gray-600">{stat.label}</p>
        </div>
      </div>
    );
  };

  const CandidateCard = ({ candidate, type = 'selected' }) => {
    const candidateData = candidate.candidate || candidate;
    const candidateId = candidate.candidate_id || candidateData.id;
    const candidateName = candidateData.name || 'Unknown';
    const profile = candidateData.profile || candidateData;
    const isExpanded = expandedCandidate === candidateId;

    return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">
                  {candidateName.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">{candidateName}</h4>
                <p className="text-sm text-gray-500">{profile.field || 'N/A'}</p>
              </div>
            </div>
            <button
              onClick={() => toggleCandidateDetails(candidateId)}
              className="flex items-center space-x-1 px-3 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
            >
              {isExpanded ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              <span className="text-sm font-medium">
                {isExpanded ? 'Hide' : 'Show'}
              </span>
            </button>
          </div>

          {isExpanded && (
            <div className="mt-4 pt-4 border-t border-gray-100 space-y-3 animate-in slide-in-from-top duration-300">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Users className="w-4 h-4" />
                <span>Last Name: {profile.last_name || 'N/A'}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Mail className="w-4 h-4" />
                <span>Email: {candidateData.email || 'N/A'}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Phone className="w-4 h-4" />
                <span>Phone: {profile.phoneNumber || 'N/A'}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4" />
                <span>Location: {profile.localisation || 'N/A'}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Briefcase className="w-4 h-4" />
                <span>Experience: {JSON.stringify(profile.experience) || 'N/A'}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Award className="w-4 h-4" />
                <span>Formation: {JSON.stringify(profile.formation) || 'N/A'}</span>
              </div>
              <div className="flex items-start space-x-2 text-sm text-gray-600">
                <Code className="w-4 h-4 mt-0.5" />
                <span>Skills: {JSON.stringify(profile.competenceList) || 'N/A'}</span>
              </div>
              <div className="flex items-start space-x-2 text-sm text-gray-600">
                <FileText className="w-4 h-4 mt-0.5" />
                <span>Description: {profile.description || 'N/A'}</span>
              </div>
              <div className="flex items-start space-x-2 text-sm text-gray-600">
                <Briefcase className="w-4 h-4 mt-0.5" />
                <span>Projects: {profile.projects || 'N/A'}</span>
              </div>
              {profile.file && (
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <FileText className="w-4 h-4" />
                  <span>File: <a href={profile.file} className="text-blue-600 hover:underline">Download</a></span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded-lg w-64 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl p-6 h-32">
                  <div className="h-4 bg-gray-300 rounded w-3/4 mb-4"></div>
                  <div className="h-8 bg-gray-300 rounded w-1/2"></div>
                </div>
              ))}
            </div>
            <div className="bg-white rounded-2xl p-6 h-96 mb-8">
              <div className="h-full bg-gray-300 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              Company Dashboard
            </h1>
            <p className="text-gray-600 mt-2">Monitor your recruitment performance and candidate pipeline</p>
          </div>
          <div className="flex items-center space-x-2 px-4 py-2 bg-white rounded-xl shadow-sm">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            <span className="font-medium text-gray-700">Analytics Overview</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {stats?.map((stat, index) => (
            <StatCard key={stat.label} stat={stat} index={index} />
          ))}
        </div>

        <div className="space-y-8">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <span className="text-lg font-semibold text-gray-800">Tests Created Over Time</span>
                <button
                  onClick={() => setTimeRange('Daily')}
                  className={`px-3 py-1 rounded-md ${timeRange === 'Daily' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'} hover:bg-gray-200`}
                >
                  Daily
                </button>
                <button
                  onClick={() => setTimeRange('Weekly')}
                  className={`px-3 py-1 rounded-md ${timeRange === 'Weekly' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'} hover:bg-gray-200`}
                >
                  Weekly
                </button>
                <button
                  onClick={() => setTimeRange('Monthly')}
                  className={`px-3 py-1 rounded-md ${timeRange === 'Monthly' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'} hover:bg-gray-200`}
                >
                  Monthly
                </button>
              </div>
              <button className="px-3 py-1 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200">
                Export PDF
              </button>
            </div>
            <div className="overflow-x-auto">
              <svg ref={testsChartRef} className="w-full"></svg>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800 flex items-center">
                <Users className="w-6 h-6 text-purple-600 mr-2" />
                Selected Candidates
              </h3>
              <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                {selectedCandidates.length} total
              </span>
            </div>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {selectedCandidates.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No selected candidates yet</p>
                </div>
              ) : (
                selectedCandidates.map((candidate, index) => (
                  <CandidateCard key={index} candidate={candidate} type="selected" />
                ))
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800 flex items-center">
                <Award className="w-6 h-6 text-orange-600 mr-2" />
                Accepted Candidates
              </h3>
              <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
                {acceptedCandidates.length} total
              </span>
            </div>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {acceptedCandidates.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Award className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No accepted candidates yet</p>
                </div>
              ) : (
                acceptedCandidates.map((candidate) => (
                  <CandidateCard key={candidate.candidate_id} candidate={candidate} type="accepted" />
                ))
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-800 flex items-center">
              <FileText className="w-6 h-6 text-blue-600 mr-2" />
              Created Tests
            </h3>
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
              {tests.length} tests
            </span>
          </div>
          {tests.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">No tests created yet</p>
              <p className="text-sm">Start by creating your first assessment test</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {tests.map((test, index) => (
                <div key={test.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow duration-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800 mb-2">
                        {test.objective || `Test #${test.id}`}
                      </h4>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p><strong>Prerequisites:</strong> {test.prerequisites || 'N/A'}</p>
                        <p><strong>Tools Required:</strong> {test.tools_required || 'N/A'}</p>
                        <p><strong>Before Answer:</strong> {test.before_answer || 'N/A'}</p>
                        <p><strong>Created At:</strong> {new Date(test.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="ml-4 flex-shrink-0">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Test #{index + 1}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyDashboard;