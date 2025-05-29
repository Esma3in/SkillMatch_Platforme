import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { api } from '../api/api';
import { BarChart3, Users, CheckCircle, FileText, TrendingUp, Eye, EyeOff, Mail, Phone, MapPin, Briefcase, Award } from 'lucide-react';

const CompanyDashboard = () => {
  const chartRef = useRef();
  const [stats, setStats] = useState(null);
  const [selectedCandidates, setSelectedCandidates] = useState([]);
  const [acceptedCandidates, setAcceptedCandidates] = useState([]);
  const [tests, setTests] = useState([]);
  const [expandedCandidate, setExpandedCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30 Days');
  const [chartData, setChartData] = useState([]);
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
          dailyStatsRes
        ] = await Promise.all([
          api.get(`/api/companies/tests-count?company_id=${companyId}`),
          api.get(`/api/companies/selected-candidates?company_id=${companyId}`),
          api.get(`/api/companies/resolved-test-stats?company_id=${companyId}`),
          api.get(`/api/companies/accepted-candidates?company_id=${companyId}`),
          api.get(`/api/companies/tests?company_id=${companyId}`),
          api.get(`/api/companies/daily-stats?company_id=${companyId}&range=${timeRange === '12 Months' ? 365 : timeRange === '6 Months' ? 180 : timeRange === '30 Days' ? 30 : 7}`)
        ]);

        const testCount = testCountRes.data?.tests_count || 0;
        const selectedList = selectedCandidatesRes.data?.selected_candidates || [];
        const selectedCount = selectedList.length;
        const resolvedCount = resolvedTestsRes.data?.length || 0;
        const acceptedList = acceptedCandidatesRes.data || [];
        const acceptedCount = acceptedList?.[0]?.accepted_candidates_count || acceptedList.length;

        setStats([
          { label: 'Total Tests', value: testCount, icon: FileText, color: 'from-blue-500 to-blue-600', bgColor: 'bg-blue-50' },
          { label: 'Resolved Tests', value: resolvedCount, icon: CheckCircle, color: 'from-green-500 to-green-600', bgColor: 'bg-green-50' },
          { label: 'Selected Candidates', value: selectedCount, icon: Users, color: 'from-purple-500 to-purple-600', bgColor: 'bg-purple-50' },
          { label: 'Accepted Candidates', value: acceptedCount, icon: Award, color: 'from-orange-500 to-orange-600', bgColor: 'bg-orange-50' }
        ]);

        setSelectedCandidates(selectedList);
        setAcceptedCandidates(acceptedList);
        setTests(testsRes.data || []);
        setChartData(dailyStatsRes.data || []);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [companyId, timeRange]);

  useEffect(() => {
    if (!chartData.length || !chartRef.current) return;

    d3.select(chartRef.current).selectAll('*').remove();

    const svg = d3.select(chartRef.current);
    const width = 800;
    const height = 300;
    const margin = { top: 20, right: 20, bottom: 40, left: 40 };

    svg.attr('width', width).attr('height', height);

    const parseDate = d3.timeParse('%Y-%m-%d');
    const data = chartData.map(d => ({
      date: parseDate(d.date),
      value: d.total // Use the pre-calculated total from backend
    }));

    const x = d3.scaleTime()
      .domain(d3.extent(data, d => d.date))
      .range([margin.left, width - margin.right]);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.value) + 5])
      .nice()
      .range([height - margin.bottom, margin.top]);

    // Line generator
    const line = d3.line()
      .x(d => x(d.date))
      .y(d => y(d.value))
      .curve(d3.curveCatmullRom);

    // Area generator
    const area = d3.area()
      .x(d => x(d.date))
      .y0(height - margin.bottom)
      .y1(d => y(d.value))
      .curve(d3.curveCatmullRom);

    // Draw area
    svg.append('path')
      .datum(data)
      .attr('fill', '#e6f0fa')
      .attr('d', area);

    // Draw line
    svg.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', '#3b82f6')
      .attr('stroke-width', 2)
      .attr('d', line);

    // Highlighted point (e.g., May 15, 2025)
    const highlightDate = parseDate('2025-05-15');
    const highlightData = data.find(d => d.date.toDateString() === highlightDate.toDateString());
    if (highlightData) {
      svg.append('circle')
        .attr('cx', x(highlightData.date))
        .attr('cy', y(highlightData.value))
        .attr('r', 4)
        .attr('fill', '#3b82f6');

      // Tooltip background
      svg.append('rect')
        .attr('x', x(highlightData.date) - 40)
        .attr('y', y(highlightData.value) - 30)
        .attr('width', 80)
        .attr('height', 40)
        .attr('fill', 'white')
        .attr('opacity', 0.8)
        .attr('rx', 8);

      // Tooltip value
      svg.append('text')
        .attr('x', x(highlightData.date))
        .attr('y', y(highlightData.value) - 10)
        .attr('text-anchor', 'middle')
        .attr('fill', '#1e293b')
        .attr('font-size', '12px')
        .text(highlightData.value);

      // Tooltip date
      svg.append('text')
        .attr('x', x(highlightData.date))
        .attr('y', y(highlightData.value) - 25)
        .attr('text-anchor', 'middle')
        .attr('fill', '#1e293b')
        .attr('font-size', '12px')
        .text(d3.timeFormat('%b %Y')(highlightData.date));
    }

    // X-axis
    svg.append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).ticks(d3.timeDay.every(5)).tickFormat(d3.timeFormat('%b %d')))
      .selectAll('text')
      .attr('font-size', '12px')
      .attr('fill', '#6b7280');

    // Y-axis
    svg.append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).ticks(5))
      .selectAll('text')
      .attr('font-size', '12px')
      .attr('fill', '#6b7280');
  }, [chartData]);

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
    const candidateId = type === 'selected' ? candidate.id : candidate.candidate_id;
    const candidateName = type === 'selected' ? candidate.candidate?.name : candidate.candidate_name;
    const isExpanded = expandedCandidate === candidateId;

    return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">
                  {candidateName?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">{candidateName || 'Unknown'}</h4>
                <p className="text-sm text-gray-500">
                  {type === 'selected' ? candidate.candidate?.profile?.field : candidate.field}
                </p>
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
              {type === 'selected' && candidate.candidate?.profile ? (
                <>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Briefcase className="w-4 h-4" />
                    <span>Experience: {candidate.candidate.profile.experience || 'N/A'}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{candidate.candidate.profile.localisation}</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Mail className="w-4 h-4" />
                    <span>{candidate.email}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span>{candidate.phoneNumber}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Briefcase className="w-4 h-4" />
                    <span>Experience: {candidate.experience}</span>
                  </div>
                  <div className="flex items-start space-x-2 text-sm text-gray-600">
                    <Award className="w-4 h-4 mt-0.5" />
                    <span>Skills: {candidate.competenceList}</span>
                  </div>
                </>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
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
        {/* Header */}
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

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats?.map((stat, index) => (
            <StatCard key={stat.label} stat={stat} index={index} />
          ))}
        </div>

        {/* Chart */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <span className="text-lg font-semibold text-gray-800">Performance Overview</span>
              <button
                onClick={() => setTimeRange('12 Months')}
                className={`px-3 py-1 rounded-md ${timeRange === '12 Months' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'} hover:bg-gray-200`}
              >
                12 Months
              </button>
              <button
                onClick={() => setTimeRange('6 Months')}
                className={`px-3 py-1 rounded-md ${timeRange === '6 Months' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'} hover:bg-gray-200`}
              >
                6 Months
              </button>
              <button
                onClick={() => setTimeRange('30 Days')}
                className={`px-3 py-1 rounded-md ${timeRange === '30 Days' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'} hover:bg-gray-200`}
              >
                30 Days
              </button>
              <button
                onClick={() => setTimeRange('7 Days')}
                className={`px-3 py-1 rounded-md ${timeRange === '7 Days' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'} hover:bg-gray-200`}
              >
                7 Days
              </button>
            </div>
            <button className="px-3 py-1 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200">
              Export PDF
            </button>
          </div>
          <div className="overflow-x-auto">
            <svg ref={chartRef} className="w-full"></svg>
          </div>
        </div>

        {/* Candidates Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Selected Candidates */}
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
                selectedCandidates.map((candidate) => (
                  <CandidateCard key={candidate.id} candidate={candidate} type="selected" />
                ))
              )}
            </div>
          </div>

          {/* Accepted Candidates */}
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

        {/* Tests Section */}
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
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {test.prerequisites || 'No description available'}
                      </p>
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