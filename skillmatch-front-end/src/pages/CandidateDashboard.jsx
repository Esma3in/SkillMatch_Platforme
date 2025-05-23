import React, { useEffect, useState } from 'react';
import { api } from "../api/api";
import NavbarCandidate from "../components/common/navbarCandidate";
import { Footer } from "../components/common/footer";
import { Briefcase, UserCircle, Sparkles, ChevronRight, Info, Award, BookOpen, CheckCircle, Clock } from "lucide-react";
import * as d3 from 'd3';
import '../styles/pages/CandidateDashboard.css';

export default function CandidateDashboard() {
  const chartRef = React.useRef(null);
  const [timeRange, setTimeRange] = useState('7d');
  const [statsCards, setStatsCards] = useState([]);
  const [roadmapProgress, setRoadmapProgress] = useState([]);
  const [testsProgress, setTestsProgress] = useState([]);
  const [challengeProgress, setChallengeProgress] = useState([]);
  const [companiesData, setCompaniesData] = useState([]);
  const [roadmapDetails, setRoadmapDetails] = useState([]);
  const [suggestedCompanies, setSuggestedCompanies] = useState([]);
  const [profileCompleteness, setProfileCompleteness] = useState(0);
  const [recentActivities, setRecentActivities] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCompaniesData , setSelectedCompaniesData] = useState([])

  // Get the candidate_id from localStorage
  const candidate_id = JSON.parse(localStorage.getItem('candidate_id'));
  console.log(candidate_id)

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!candidate_id) {
        setError('Candidate ID not found in localStorage');
        setLoading(false);
        return;
      }

      try {
        setError(null);
        setLoading(true);

        // Fetch matched companies
        let matchedResponse;
        try {
          matchedResponse = await api.get(`/api/dashboard/companies/matched/${candidate_id}`);
        } catch (err) {
          console.log('Error fetching matched companies:', err.response?.status, err.message);
          matchedResponse = { data: { matched_companies_count: 0, change: 0 } };
        }

        // Fetch selected companies
        let selectedResponse;
        try {
          selectedResponse = await api.get(`/api/dashboard/companies/selected/${candidate_id}`);
        } catch (err) {
          console.log('Error fetching selected companies:', err.response?.status, err.message);
          selectedResponse = { data: { selected_companies_count: 0, change: 0 } };
        }

        // Fetch completed roadmaps
        let completedResponse;
        try {
          completedResponse = await api.get(`/api/dashboard/roadmap/completed/${candidate_id}`);
        } catch (err) {
          console.log('Error fetching completed roadmaps:', err.response?.status, err.message);
          completedResponse = { data: { completed_count: 0, change: 0 } };
        }

        // Fetch badges
        let badgesResponse;
        try {
          badgesResponse = await api.get(`/api/dashboard/badges/${candidate_id}`);
        } catch (err) {
          console.log('Error fetching badges:', err.response?.status, err.message);
          badgesResponse = { data: { badge_count: 0, change: 0 } };
        }

        // Fetch active roadmaps
        let activeResponse;
        try {
          activeResponse = await api.get(`/api/dashboard/all/roadmaps/${candidate_id}`);
        } catch (err) {
          console.log('Error fetching active roadmaps:', err.response?.status, err.message);
          activeResponse = { data: { roadmap_count: 0, change: 0 } };
        }

        // Fetch roadmap progress
        let roadmapProgressResponse;
        try {
          roadmapProgressResponse = await api.get(`/api/candidate/${candidate_id}/roadmaps-progress`);
        } catch (err) {
          console.log('Error fetching roadmap progress:', err.response?.status, err.message);
          roadmapProgressResponse = { data: [] };
        }

        // Fetch tests progress
        let testsProgressResponse;
        try {
          testsProgressResponse = await api.get(`/api/candidate/${candidate_id}/test-progress`);
        } catch (err) {
          console.log('Error fetching tests progress:', err.response?.status, err.message);
          testsProgressResponse = { data: [] };
        }

        // Fetch challenges progress
        let challengesProgressResponse;
        try {
          challengesProgressResponse = await api.get(`/api/candidate/${candidate_id}/challenges-progress`);
        } catch (err) {
          console.log('Error fetching challenges progress:', err.response?.status, err.message);
          challengesProgressResponse = { data: [] };
        }

        // Fetch company data
        let companiesResponse;
        try {
          companiesResponse = await api.get(`/api/candidate/${candidate_id}/company-data`);
        } catch (err) {
          console.log('Error fetching company data:', err.response?.status, err.message);
          companiesResponse = { data: [] };
        }

        // Fetch selected companies
        let selectedCompaniesResponse;
        try {
          selectedCompaniesResponse = await api.get(`/api/dashboard/companies/selected-data/${candidate_id}`);
         console.log(  setSelectedCompaniesData(selectedCompaniesResponse.data))
          console.log("companise selected data : " ,selectedCompaniesData)
        } catch (err) {
          console.log('Error fetching selected companies:', err.response?.status, err.message);
          selectedCompaniesResponse = { data: [] };
        }

        // Fetch suggested companies
        let suggestedCompaniesResponse;
        try {
          suggestedCompaniesResponse = await api.get(`/api/candidate/suggestedcompanies/${candidate_id}`);
          console.log()
        } catch (err) {
          console.log('Error fetching suggested companies:', err.response?.status, err.message);
          suggestedCompaniesResponse = { data: [] };
        }

        // Fetch candidate profile to calculate completeness
        let profileResponse;
        try {
          profileResponse = await api.get(`/api/candidate/${candidate_id}`);
          calculateProfileCompleteness(profileResponse.data);
        } catch (err) {
          console.log('Error fetching profile:', err.response?.status, err.message);
          setProfileCompleteness(0);
        }

        // Set stats cards
        setStatsCards([
          {
            title: 'COMPANIES MATCHED',
            value: matchedResponse.data?.matched_companies_count?.toString() || '0',
            change: matchedResponse.data?.change?.toString() || '+0',
            increase: (matchedResponse.data?.change || 0) >= 0,
            icon: <Briefcase size={20} className="text-blue-500" />
          },
          {
            title: 'COMPANIES SELECTED',
            value: selectedResponse.data?.selected_companies_count?.toString() || '0',
            change: selectedResponse.data?.change?.toString() || '+0',
            increase: (selectedResponse.data?.change || 0) >= 0,
            icon: <CheckCircle size={20} className="text-green-500" />
          },
          {
            title: 'ROADMAPS COMPLETED',
            value: completedResponse.data?.completed_count?.toString() || '0',
            change: completedResponse.data?.change?.toString() || '+0',
            increase: (completedResponse.data?.change || 0) >= 0,
            icon: <BookOpen size={20} className="text-purple-500" />
          },
          {
            title: 'BADGES EARNED',
            value: badgesResponse.data?.badge_count?.toString() || '0',
            change: badgesResponse.data?.change?.toString() || '+0',
            increase: (badgesResponse.data?.change || 0) >= 0,
            icon: <Award size={20} className="text-yellow-500" />
          },
          {
            title: 'ACTIVE ROADMAPS',
            value: activeResponse.data?.roadmap_count?.toString() || '0',
            change: activeResponse.data?.change?.toString() || '+0',
            increase: (activeResponse.data?.change || 0) >= 0,
            icon: <Clock size={20} className="text-indigo-500" />
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
                name: company.company_name || 'Unknown',
                email: company.name || 'N/A',
                image: company.icon || 'https://via.placeholder.com/40',
      
              }))
            : []
        );

        // Set roadmap details
        console.log(setSelectedCompaniesData(selectedCompaniesResponse.data))
   

        // Set suggested companies
        setSuggestedCompanies(
          Array.isArray(suggestedCompaniesResponse.data)
            ? suggestedCompaniesResponse.data.map((company) => ({
                id: company.id,
                name: company.name || 'Unknown',
                description: company.description || 'No description available',
                logo: company.logo || 'https://via.placeholder.com/40',
                matchPercentage: company.matchPercentage || Math.floor(Math.random() * 100),
              }))
            : []
        );

        // Generate mock recent activities
        generateRecentActivities();

        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError(`Failed to fetch data: ${error.response?.status || error.message}`);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [candidate_id]);

  // Calculate profile completeness
  const calculateProfileCompleteness = (profileData) => {
    if (!profileData) {
      setProfileCompleteness(0);
      return;
    }

    let totalFields = 0;
    let completedFields = 0;

    // Check basic profile fields
    const basicFields = ['name', 'email'];
    basicFields.forEach(field => {
      totalFields++;
      if (profileData[field]) completedFields++;
    });

    // Check profile details
    if (profileData.profile) {
      const profileFields = ['field', 'phoneNumber', 'localisation', 'photoProfil', 'description'];
      profileFields.forEach(field => {
        totalFields++;
        if (profileData.profile[field]) completedFields++;
      });
    }

    // Calculate percentage
    const percentage = Math.round((completedFields / totalFields) * 100);
    setProfileCompleteness(percentage);
  };

  // Generate mock recent activities
  const generateRecentActivities = () => {
    const activities = [
      {
        type: 'test',
        title: 'Completed JavaScript Assessment',
        time: '2 hours ago',
        icon: <CheckCircle size={16} className="text-green-500" />
      },
      {
        type: 'company',
        title: 'Applied to TechCorp',
        time: '1 day ago',
        icon: <Briefcase size={16} className="text-blue-500" />
      },
      {
        type: 'badge',
        title: 'Earned React Developer Badge',
        time: '3 days ago',
        icon: <Award size={16} className="text-yellow-500" />
      },
      {
        type: 'roadmap',
        title: 'Started Frontend Development Roadmap',
        time: '1 week ago',
        icon: <BookOpen size={16} className="text-purple-500" />
      }
    ];

    setRecentActivities(activities);
  };

  // Chart rendering
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
          .html(`${d.label}: ${Math.round(d.value1)}`)
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-indigo-700"></div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-100">
      <NavbarCandidate />
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-8">
            {error}
          </div>
        )}

        {/* Welcome Banner with Profile Completeness */}
        <section className="bg-gradient-to-r from-indigo-600 to-blue-500 p-6 rounded-xl shadow-md text-white mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-semibold mb-2">👋 Welcome to Your Dashboard!</h1>
              <p className="text-indigo-100 max-w-xl">
                Track your progress, explore matching companies, and enhance your skills.
              </p>
            </div>
            <div className="bg-white bg-opacity-20 p-4 rounded-lg w-full md:w-auto">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Profile Completeness</span>
                <span className="text-sm font-bold">{profileCompleteness}%</span>
              </div>
              <div className="w-full bg-white bg-opacity-30 rounded-full h-2.5">
                <div
                  className="bg-white h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${profileCompleteness}%` }}
                ></div>
              </div>
              <a
                href="/edit-profile"
                className="mt-3 inline-flex items-center gap-1 bg-white text-indigo-700 px-3 py-1 text-sm font-medium rounded-lg hover:bg-opacity-90 transition-colors"
              >
                <UserCircle size={16} /> Complete Your Profile
              </a>
            </div>
          </div>
        </section>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          {statsCards.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-full bg-gray-100">
                  {stat.icon}
                </div>
                <div className="text-gray-500 text-sm font-medium uppercase tracking-wide">
                  {stat.title}
                </div>
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
          <div className="space-y-8 lg:col-span-2">
            {/* Activity Chart */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Activity Overview</h2>
                <div className="flex items-center space-x-2">
                  <select
                    value={timeRange}
                    onChange={(e) => setTimeRange(e.target.value)}
                    className="text-sm text-gray-600 border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="7d">Last 7 Days</option>
                    <option value="30d">Last 30 Days</option>
                    <option value="6m">Last 6 Months</option>
                    <option value="12m">Last 12 Months</option>
                  </select>
                </div>
              </div>
              <div className="overflow-x-auto">
                <svg ref={chartRef} className="w-full min-w-[500px]"></svg>
              </div>
              <div className="flex justify-center mt-4 text-sm text-gray-500">
                <div className="flex items-center mr-4">
                  <span className="inline-block w-3 h-3 bg-blue-500 rounded-full mr-1"></span>
                  <span>Skill Progress</span>
                </div>
                <div className="flex items-center">
                  <span className="inline-block w-3 h-3 bg-blue-300 rounded-full mr-1"></span>
                  <span>Test Completion</span>
                </div>
              </div>
            </div>

            {/* Suggested Companies */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold flex items-center gap-2 text-gray-900">
                  <Sparkles size={20} className="text-yellow-500" />
                  Suggested Companies
                </h2>
                <a href="/companies" className="text-sm text-indigo-600 hover:underline inline-flex items-center">
                  View all <ChevronRight size={16} />
                </a>
              </div>
              
              {suggestedCompanies.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {suggestedCompanies.slice(0, 4).map((company, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start gap-3">
                        <img 
                          src={company.logo} 
                          alt={`${company.name} logo`} 
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div>
                          <h3 className="font-medium text-gray-900">{company.name}</h3>
                          <p className="text-sm text-gray-500 line-clamp-2">{company.description}</p>
                          <div className="mt-2 flex items-center justify-between">
                            <span className="text-xs font-medium px-2 py-1 bg-green-100 text-green-800 rounded-full">
                              {company.matchPercentage}% Match
                            </span>
                            <a href={`/company/${company.id}`} className="text-xs text-indigo-600 hover:underline">
                              View Details
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-gray-50 p-6 rounded-lg text-center">
                  <p className="text-gray-500">No suggested companies found. Complete your profile to get better matches.</p>
                  <a href="/edit-profile" className="mt-3 inline-block text-indigo-600 hover:underline">Update Profile</a>
                </div>
              )}
            </div>

            {/* Progress Tracking */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Progress Tracking</h2>
                <div className="flex space-x-2">
                  <button className="px-3 py-1 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
                    Roadmaps
                  </button>
                  <button className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors">
                    Tests
                  </button>
                  <button className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors">
                    Challenges
                  </button>
                </div>
              </div>
              
              <div className="space-y-6">
                {roadmapProgress.length > 0 ? (
                  roadmapProgress.map((item, index) => (
                    <div key={index}>
                      <div className="flex justify-between mb-2">
                        <span className="font-medium text-gray-700">{item.name}</span>
                        <span className="font-semibold text-gray-900">{item.percentage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300"
                          style={{ width: `${item.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="bg-gray-50 p-6 rounded-lg text-center">
                    <p className="text-gray-500">No roadmaps in progress. Start a roadmap to track your progress.</p>
                    <a href="/roadmaps" className="mt-3 inline-block text-indigo-600 hover:underline">Explore Roadmaps</a>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Recent Activities */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Recent Activities</h2>
              
              {recentActivities.length > 0 ? (
                <div className="space-y-4">
                  {recentActivities.map((activity, index) => (
                    <div key={index} className="flex items-start gap-3 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                      <div className="p-2 bg-gray-100 rounded-full">
                        {activity.icon}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center">No recent activities found.</p>
              )}
            </div>

            {/* Companies */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Badges for your companies</h2>
                <a href="/companies" className="text-sm text-indigo-600 hover:underline inline-flex items-center">
                  See All <ChevronRight size={16} />
                </a>
              </div>
              
              {selectedCompaniesData.length > 0 ? (
                <div className="space-y-4">
                  {companiesData.slice(0, 3).map((company, index) => (
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
                        className="bg-indigo-600 text-white px-3 py-1 rounded-full text-xs font-medium hover:bg-indigo-700 transition-colors duration-200"
                        aria-label={`View profile of ${company.name}`}
                      >
                        View
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <p className="text-gray-500">You haven't selected any companies yet.</p>
                  <a href="/companies/list" className="mt-2 inline-block text-indigo-600 hover:underline">Explore Companies</a>
                </div>
              )}
            </div>

            {/* Roadmap Details */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Roadmap Details</h2>
                <a href="/roadmaps" className="text-sm text-indigo-600 hover:underline inline-flex items-center">
                  See All <ChevronRight size={16} />
                </a>
              </div>
              
              {roadmapDetails.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-gray-700">
                    <thead>
                      <tr className="border-b">
                        <th className="py-3 text-left font-medium"></th>
                        <th className="py-3 text-left font-medium">Roadmap</th>
                        <th className="py-3 text-left font-medium">Badges</th>
                        <th className="py-3 text-left font-medium">Company</th>
                      </tr>
                    </thead>
                    <tbody>
                      {roadmapDetails.slice(0, 3).map((roadmap, index) => (
                        <tr key={index} className="border-b last:border-0">
                          <td className="py-3">
                            <span
                              className={`w-3 h-3 rounded-full inline-block ${
                                roadmap.status === 'completed'
                                  ? 'bg-green-500'
                                  : roadmap.status === 'in-progress'
                                  ? 'bg-yellow-500'
                                  : 'bg-gray-300'
                              }`}
                            ></span>
                          </td>
                          <td className="py-3 font-medium">{roadmap.name}</td>
                          <td className="py-3">{roadmap.badges}</td>
                          <td className="py-3">{roadmap.company}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <p className="text-gray-500">No roadmap details available.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}