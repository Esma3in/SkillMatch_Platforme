import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { api } from "../api/api.js";
import NavbarCandidate from "../components/common/navbarCandidate";

export const Dashboard = () => {
  const chartRef = useRef(null);
  const [timeRange, setTimeRange] = useState('7d');
  const [statsCards, setStatsCards] = useState([]);
  const [roadmapProgress, setRoadmapProgress] = useState([]);
  const [testsProgress, setTestsProgress] = useState([]);
  const [challengeProgress, setChallengeProgress] = useState([]);
  const [companiesData, setCompaniesData] = useState([]);
  const [roadmapDetails, setRoadmapDetails] = useState([]);
  const [error, setError] = useState(null);

  // Get the candidate_id from localStorage
  const candidate_id = JSON.parse(localStorage.getItem('candidate_id'));

  // Fetch dashboard data

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!candidate_id) {
        setError('Candidate ID not found in localStorage');
        return;
      }

      try {
        setError(null);

        // Fetch matched companies
        let matchedResponse;
        try {
       
          matchedResponse = await api.get(`/api/dashboard/companies/matched/${candidate_id}`);
          console.log('Matched Response:', matchedResponse.data);
        } catch (err) {
          console.log('Error fetching matched companies:', err.response?.status, err.message);
          matchedResponse = { data: { count: 0, change: 0 } };
        }

        // Fetch selected companies
        let selectedResponse;
        try {
     
          selectedResponse = await api.get(`/api/dashboard/companies/selected/${candidate_id}`);
          console.log('Selected Response:', selectedResponse.data.selected_companies_count);
        } catch (err) {
          console.log('Error fetching selected companies:', err.response?.status, err.message);
          selectedResponse = { data: { count: 0, change: 0 } };
        }

        // Fetch completed roadmaps
        let completedResponse;
        try {

          completedResponse = await api.get(`/api/dashboard/roadmap/completed/${candidate_id}`);
          console.log('Completed Response:', completedResponse.data);
        } catch (err) {
          console.log('Error fetching completed roadmaps:', err.response?.status, err.message);
          completedResponse = { data: { count: 0, change: 0 } };
        }

        // Fetch badges
        let badgesResponse;
        try {
    
          badgesResponse = await api.get(`/api/dashboard/badges/${candidate_id}`);
          console.log('Badges Response:', badgesResponse.data);
        } catch (err) {
          console.log('Error fetching badges:', err.response?.status, err.message);
          badgesResponse = { data: { count: 0, change: 0 } };
        }

        // Fetch active roadmaps
        let activeResponse;
        try {
        
          activeResponse = await api.get(`/api/dashboard/all/roadmaps/${candidate_id}`);
          console.log('Active Response:', activeResponse.data);
        } catch (err) {
          console.log('Error fetching active roadmaps:', err.response?.status, err.message);
          activeResponse = { data: { count: 0, change: 0 } };
        }

        // Fetch roadmap progress
        let roadmapProgressResponse;
        try {
          roadmapProgressResponse = await api.get(`/api/candidate/${candidate_id}/roadmaps-progress`);
          console.log('Roadmap Progress Response:', roadmapProgressResponse.data);
        } catch (err) {
          console.log('Error fetching roadmap progress:', err.response?.status, err.message);
          roadmapProgressResponse = { data: [] };
        }

        // Fetch tests progress
        let testsProgressResponse;
        try {
          testsProgressResponse = await api.get(`/api/candidate/${candidate_id}/test-progress`);
          console.log('Tests Progress Response:', testsProgressResponse.data);
        } catch (err) {
          console.log('Error fetching tests progress:', err.response?.status, err.message);
          testsProgressResponse = { data: [] };
        }

        // Fetch challenges progress
        let challengesProgressResponse;
        try {
      
          challengesProgressResponse = await api.get(`/api/candidate/${candidate_id}/challenges-progress`);
          console.log('Challenges Progress Response:', challengesProgressResponse.data);
        } catch (err) {
          console.log('Error fetching challenges progress:', err.response?.status, err.message);
          challengesProgressResponse = { data: [] };
        }

        // Fetch company data
        let companiesResponse;
        try {
      
          companiesResponse = await api.get(`/api/candidate/${candidate_id}/company-data`);
          console.log('Companies Response:', companiesResponse.data);
        } catch (err) {
          console.log('Error fetching company data:', err.response?.status, err.message);
          companiesResponse = { data: [] };
        }

        // Fetch selected companies
        let selectedCompaniesResponse;
        try {
        
          selectedCompaniesResponse = await api.get(`/api/candidate/${candidate_id}/selected-companies`);
          console.log('Selected Companies Response:', selectedCompaniesResponse.data);
        } catch (err) {
          console.log('Error fetching selected companies:', err.response?.status, err.message);
          selectedCompaniesResponse = { data: [] };
        }

        // Set stats cards
        setStatsCards([
          {
            title: 'ENTREPRISE MATCHED',
            value: matchedResponse.data?.matched_companies_count?.toString() || '0',
            change: matchedResponse.data?.change?.toString() || '+0',
            increase: (matchedResponse.data?.change || 0) >= 0,
          },
          {
            title: 'ENTREPRISE SELECTED',
            value: selectedResponse.data?.selected_companies_count?.toString() || '0',
            change: selectedResponse.data?.change?.toString() || '+0',
            increase: (selectedResponse.data?.change || 0) >= 0,
          },
          {
            title: 'ROADMAPS COMPLETED',
            value: completedResponse.data?.count?.toString() || '0',
            change: completedResponse.data?.change?.toString() || '+0',
            increase: (completedResponse.data?.change || 0) >= 0,
          },
          {
            title: 'BADGES EARNED',
            value: badgesResponse.data?.count?.toString() || '0',
            change: badgesResponse.data?.change?.toString() || '+0',
            increase: (badgesResponse.data?.change || 0) >= 0,
          },
          {
            title: 'ACTIVE ROADMAPS',
            value: activeResponse.data?.roadmap_count?.toString() || '0',
            change: activeResponse.data?.change?.toString() || '+0',
            increase: (activeResponse.data?.change || 0) >= 0,
          },
        ]);

        // Set roadmap progress
        setRoadmapProgress(
          Array.isArray(roadmapProgressResponse.data)
            ? roadmapProgressResponse.data.map((item) => ({
                name: item.name || item.roadmap_name || 'Unknown',
                percentage: item.progress || 0,
              }))
            : []
        );

        // Set tests progress
        setTestsProgress(
          Array.isArray(testsProgressResponse.data)
            ? testsProgressResponse.data.map((item) => ({
                name: item.name  || 'Unknown',
                percentage: item.progress || 0,
              }))
            : []
        );

        // Set challenge progress
        setChallengeProgress(
          Array.isArray(challengesProgressResponse.data)
            ? challengesProgressResponse.data.map((item) => ({
                name: item.name || 'Unknown',
                percentage: item.progress || 0,
              }))
            : []
        );

        // Set companies data
        setCompaniesData(
          Array.isArray(companiesResponse.data)
            ? companiesResponse.data.map((company) => ({
                name: company.name || 'Unknown',
                email: company.email || 'N/A',
              }))
            : []
        );

        // Set roadmap details
        setRoadmapDetails(
          Array.isArray(selectedCompaniesResponse.data)
            ? selectedCompaniesResponse.data.map((roadmap) => ({
                status: roadmap.completed ? 'completed' : roadmap.status || 'pending',
                name: roadmap.name || 'Unknown',
                badges: roadmap.badges  || 0,
           
              }))
            : []
        );

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError(`Failed to fetch data: ${error.response?.status || error.message}`);
      }
    };

    fetchDashboardData();
  }, [candidate_id]);

  // Chart rendering (unchanged)
  useEffect(() => {
    if (!chartRef.current) return;

    // Clear previous chart
    d3.select(chartRef.current).selectAll('*').remove();

    // Chart dimensions
    const width = 600;
    const height = 300;
    const margin = { top: 40, right: 30, bottom: 40, left: 40 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Create SVG
    const svg = d3
      .select(chartRef.current)
      .attr('width', width)
      .attr('height', height)
      .style('max-width', '100%')
      .style('background', '#f1f5f9')
      .style('border-radius', '8px');

    // Create chart group
    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    // Generate data based on timeRange
    let labels, data1, data2;
    if (timeRange === '7d') {
      labels = ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'];
      data1 = labels.map((_, i) => 10 + i * 2 + Math.random() * 5);
      data2 = labels.map((_, i) => 15 + i * 1.5 + Math.random() * 4);
    } else if (timeRange === '30d') {
      labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
      data1 = labels.map((_, i) => 20 + i * 5 + Math.random() * 10);
      data2 = labels.map((_, i) => 25 + i * 4 + Math.random() * 8);
    } else if (timeRange === '6m') {
      labels = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      data1 = labels.map((_, i) => 25 + i * 5 + Math.random() * 15);
      data2 = labels.map((_, i) => 30 + i * 4 + Math.random() * 12);
    } else {
      labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      data1 = labels.map((_, i) => 30 + i * 4 + Math.random() * 20);
      data2 = labels.map((_, i) => 35 + i * 3 + Math.random() * 15);
    }

    const data = labels.map((label, i) => ({
      label,
      value1: data1[i],
      value2: data2[i],
    }));

    // Scales
    const x = d3.scaleBand().domain(labels).range([0, innerWidth]).padding(0.2);

    const y = d3
      .scaleLinear()
      .domain([0, Math.max(...data1, ...data2) + 5])
      .range([innerHeight, 0])
      .nice();

    // Line and area generators
    const line1 = d3
      .line()
      .x((d) => (x(d.label) || 0) + x.bandwidth() / 2)
      .y((d) => y(d.value1))
      .curve(d3.curveMonotoneX);

    const line2 = d3
      .line()
      .x((d) => (x(d.label) || 0) + x.bandwidth() / 2)
      .y((d) => y(d.value2))
      .curve(d3.curveMonotoneX);

    const area1 = d3
      .area()
      .x((d) => (x(d.label) || 0) + x.bandwidth() / 2)
      .y0(innerHeight)
      .y1((d) => y(d.value1))
      .curve(d3.curveMonotoneX);

    const area2 = d3
      .area()
      .x((d) => (x(d.label) || 0) + x.bandwidth() / 2)
      .y0(innerHeight)
      .y1((d) => y(d.value2))
      .curve(d3.curveMonotoneX);

    // Add grid lines
    g.append('g')
      .attr('class', 'grid')
      .call(d3.axisLeft(y).tickSize(-innerWidth).tickFormat(() => ''))
      .style('stroke', '#e5e7eb')
      .style('stroke-dasharray', '3,3')
      .style('stroke-opacity', 0.5);

    // Draw areas
    g.append('path')
      .datum(data)
      .attr('fill', '#dbeafe')
      .attr('fill-opacity', 0.3)
      .attr('d', area1);

    g.append('path')
      .datum(data)
      .attr('fill', '#e0e7ff')
      .attr('fill-opacity', 0.3)
      .attr('d', area2);

    // Draw lines
    g.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', '#3b82f6')
      .attr('stroke-width', 2)
      .attr('d', line1);

    g.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', '#93c5fd')
      .attr('stroke-width', 2)
      .attr('d', line2);

    // Add dots with tooltips for line1
    const tooltip = d3
      .select('body')
      .append('div')
      .attr('class', 'tooltip')
      .style('position', 'absolute')
      .style('background', '#1f2937')
      .style('color', '#ffffff')
      .style('padding', '8px')
      .style('border-radius', '4px')
      .style('pointer-events', 'none')
      .style('opacity', 0);

    g.selectAll('.dot1')
      .data(data)
      .enter()
      .append('circle')
      .attr('class', 'dot1')
      .attr('cx', (d) => (x(d.label) || 0) + x.bandwidth() / 2)
      .attr('cy', (d) => y(d.value1))
      .attr('r', 4)
      .attr('fill', '#3b82f6')
      .on('mouseover', (event, d) => {
        tooltip.transition().duration(200).style('opacity', 0.9);
        tooltip
          .html(`${d.label} 2021: ${Math.round(d.value1)}`)
          .style('left', `${event.pageX + 10}px`)
          .style('top', `${event.pageY - 28}px`);
      })
      .on('mouseout', () => {
        tooltip.transition().duration(500).style('opacity', 0);
      });

    // Add dots for line2
    g.selectAll('.dot2')
      .data(data)
      .enter()
      .append('circle')
      .attr('class', 'dot2')
      .attr('cx', (d) => (x(d.label) || 0) + x.bandwidth() / 2)
      .attr('cy', (d) => y(d.value2))
      .attr('r', 4)
      .attr('fill', '#93c5fd');

    // Add axes
    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x))
      .style('font-size', '12px')
      .style('color', '#374151');

    g.append('g')
      .call(d3.axisLeft(y).ticks(5))
      .style('font-size', '12px')
      .style('color', '#374151');

    // Cleanup tooltip on unmount
    return () => {
      tooltip.remove();
    };
  }, [timeRange]);

  return (
    <div className="w-full min-h-screen bg-gray-100">
      <NavbarCandidate />
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-8">
            {error}
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
          {statsCards.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <div className="text-gray-500 text-sm font-medium uppercase tracking-wide mb-3">
                {stat.title}
              </div>
              <div className="flex justify-between items-end">
                <span className="text-3xl font-bold text-gray-900">{stat.value}</span>
                <div
                  className={`flex items-center text-sm font-medium ${
                    stat.increase ? 'text-green-500' : 'text-red-500'
                  }`}
                >
                  {stat.change}
                  <span className="ml-1">{stat.increase ? '↑' : '↓'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="space-y-8">
            {/* Roadmap Progress */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Roadmap Progress</h2>
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="text-sm text-gray-600 border-none focus:ring-0"
                >
                  <option value="7d">Last 7 Days</option>
                  <option value="30d">Last 30 Days</option>
                  <option value="6m">Last 6 Months</option>
                  <option value="12m">Last 12 Months</option>
                </select>
              </div>
              <div className="space-y-6">
                {roadmapProgress.map((item, index) => (
                  <div key={index}>
                    <div className="flex justify-between mb-2">
                      <span className="font-medium text-gray-700">{item.name}</span>
                      <span className="font-semibold text-gray-900">{item.percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Companies */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Companies</h2>
                <a href="#" className="text-sm text-blue-600 hover:underline">
                  See All Enterprises
                </a>
              </div>
              <div className="space-y-4">
                {companiesData.map((company, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                  >
                    <div className="flex items-center">
                      <img
                        src={company.image}
                        alt={`${company.name} logo`}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="ml-3">
                        <div className="font-semibold text-gray-900">{company.name}</div>
                        <div className="text-sm text-gray-500">{company.email}</div>
                      </div>
                    </div>
                    <button
                      className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium hover:bg-blue-700 transition-colors duration-200"
                      aria-label={`View profile of ${company.name}`}
                    >
                      View
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Center Column */}
          <div className="space-y-10">
            {/* Activity Chart */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Activity</h2>
                <div className="flex items-center space-x-2">
                  <select
                    value={timeRange}
                    onChange={(e) => setTimeRange(e.target.value)}
                    className="text-sm text-gray-600 border-none focus:ring-0"
                  >
                    <option value="12m">12 Months</option>
                    <option value="6m">6 Months</option>
                    <option value="30d">30 Days</option>
                    <option value="7d">7 Days</option>
                  </select>
                  <button
                    className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium hover:bg-blue-700 transition-colors duration-200 flex items-center"
                    aria-label="Export chart as PDF"
                  >
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                      ></path>
                    </svg>
                    Export PDF
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <svg ref={chartRef} className="w-full min-w-[500px]"></svg>
              </div>
            </div>

            {/* Roadmap Details */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Roadmap Details</h2>
                <a href="#" className="text-sm text-blue-600 hover:underline">
                  See All Roadmaps
                </a>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-gray-700">
                  <thead>
                    <tr className="border-b">
                      <th className="py-3 text-left font-medium"></th>
                      <th className="py-3 text-left font-medium">Roadmap Name</th>
                      <th className="py-3 text-left font-medium">Badges Earned</th>
                      <th className="py-3 text-left font-medium">Company</th>
                    </tr>
                  </thead>
                  <tbody>
                    {roadmapDetails.map((roadmap, index) => (
                      <tr key={index} className="border-b last:border-0">
                        <td className="py-3">
                          <span
                            className={`w-4 h-4 rounded-full inline-block ${
                              roadmap.status === 'completed'
                                ? 'bg-green-500'
                                : roadmap.status === 'pending'
                                ? 'bg-yellow-500'
                                : 'bg-red-500'
                            }`}
                          ></span>
                        </td>
                        <td className="py-3">{roadmap.name}</td>
                        <td className="py-3">{roadmap.badges}</td>
                        <td className="py-3">{roadmap.company || 'N/A'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Tests Progress */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Tests Progress</h2>
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="text-sm text-gray-600 border-none focus:ring-0"
                >
                  <option value="7d">Last 7 Days</option>
                  <option value="30d">Last 30 Days</option>
                  <option value="6m">Last 6 Months</option>
                  <option value="12m">Last 12 Months</option>
                </select>
              </div>
              <div className="space-y-6">
                {testsProgress.map((item, index) => (
                  <div key={index}>
                    <div className="flex justify-between mb-2">
                      <span className="font-medium text-gray-700">{item.name}</span>
                      <span className="font-semibold text-gray-900">{item.percentage || 0}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                        style={{ width: `${item.percentage || 0}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Challenge Progress */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Challenge Progress</h2>
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="text-sm text-gray-600 border-none focus:ring-0"
                >
                  <option value="7d">Last 7 Days</option>
                  <option value="30d">Last 30 Days</option>
                  <option value="6m">Last 6 Months</option>
                  <option value="12m">Last 12 Months</option>
                </select>
              </div>
              <div className="space-y-6">
                {challengeProgress.map((item, index) => (
                  <div key={index}>
                    <div className="flex justify-between mb-2">
                      <span className="font-medium text-gray-700">{item.name}</span>
                      <span className="font-semibold text-gray-900">{item.percentage || 0}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                        style={{ width: `${item.percentage || 0}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};