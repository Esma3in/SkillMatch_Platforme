import React, { useEffect, useState } from 'react';
import { api } from "../api/api";
import NavbarCandidate from "../components/common/navbarCandidate";
import { Footer } from "../components/common/footer";
import { Briefcase, UserCircle, Sparkles, ChevronRight, Info, Award, BookOpen, CheckCircle, Clock } from "lucide-react";
import * as d3 from 'd3';
import '../styles/pages/CandidateDashboard.css';
import CompanyDisplay from '../components/modals/CompanyDisplay';

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

        // get recent activites 
        let recentActivitiesResponse ; 
        try{
          recentActivitiesResponse = await api.get(`/api/candidate/${candidate_id}/recent-activities`);
          console.log(recentActivitiesResponse.data.data)
        }catch(err){

          console.log('Error fetching' , err.message)
          
        }


        // Set stats cards
        setStatsCards([
          {
            title: 'COMPANIES MATCHED',
            value: matchedResponse.data?.matched_companies_count?.toString() || '0',
            change: matchedResponse.data?.matched_companies_count?.toString() || '+0',
            increase: (matchedResponse.data?.matched_companies_count || 0) >= 0,
            icon: <Briefcase size={20} className="text-blue-500" />
          },
          {
            title: 'COMPANIES SELECTED',
            value: selectedResponse.data?.selected_companies_count?.toString() || '0',
            change: selectedResponse.data?.selected_companies_count?.toString() || '+0',
            increase: (selectedResponse.data?.selected_companies_count || 0) >= 0,
            icon: <CheckCircle size={20} className="text-green-500" />
          },
          {
            title: 'ROADMAPS COMPLETED',
            value: completedResponse.data?.completed_count?.toString() || '0',
            change: completedResponse.data?.completed_count?.toString() || '+0',
            increase: (completedResponse.data?.completed_count|| 0) >= 0,
            icon: <BookOpen size={20} className="text-purple-500" />
          },
          {
            title: 'BADGES EARNED',
            value: badgesResponse.data?.badge_count?.toString() || '0',
            change: badgesResponse.data?.badge_count?.toString() || '+0',
            increase: (badgesResponse.data?.badge_count || 0) >= 0,
            icon: <Award size={20} className="text-yellow-500" />
          },
          {
            title: 'ACTIVE ROADMAPS',
            value: activeResponse.data?.roadmap_count?.toString() || '0',
            change: activeResponse.data?.roadmap_count?.toString() || '+0',
            increase: (activeResponse.data?.roadmap_count || 0) >= 0,
            icon: <Clock size={20} className="text-indigo-500" />
          },
        ]);

        // Set roadmap progress
        setRoadmapProgress(
          Array.isArray(roadmapProgressResponse.data)
            ? roadmapProgressResponse.data.map((item) => ({
              id : item.id ,
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
        console.log("select companies data : " , selectedCompaniesData)
   

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

        setRecentActivities(
          Array.isArray(recentActivitiesResponse.data?.data)
            ? recentActivitiesResponse.data.data.map((recentActivity) => {
                switch (recentActivity.type) {
                  case 'roadmap_progress':
                    return {
                      type: 'roadmap_progress',
                      id: recentActivity.roadmap_id,
                      title: `Progress updated for roadmap: ${recentActivity.roadmap_name}`,
                      details: `Progress: ${recentActivity.progress}%`,
                      time: recentActivity.time,
                      date: recentActivity.date,
                    };
                  case 'roadmap_completed':
                    return {
                      type: 'roadmap_completed',
                      id: recentActivity.roadmap_id,
                      title: `Completed roadmap: ${recentActivity.roadmap_name}`,
                      details: 'Roadmap marked as completed',
                      time: recentActivity.time,
                      date: recentActivity.date,
                    };
                  case 'company_selected':
                    return {
                      type: 'company_selected',
                      id: recentActivity.company_id,
                      title: `Selected company: ${recentActivity.company_name}`,
                      details: 'Added to selected companies',
                      time: recentActivity.time,
                      date: recentActivity.date,
                    };
                  case 'badge_earned':
                    return {
                      type: 'badge_earned',
                      id: recentActivity.badge_id,
                      title: `Earned badge: ${recentActivity.badge_name}`,
                      details: 'New badge achieved',
                      time: recentActivity.time,
                      date: recentActivity.date,
                    };
                  default:
                    return {
                      type: recentActivity.type,
                      id: recentActivity.roadmap_id || recentActivity.company_id || recentActivity.badge_id,
                      title: 'Unknown activity',
                      details: 'No details available',
                      time: recentActivity.time,
                      date: recentActivity.date,
                    };
                }
              })
              :recentActivities.message
         
        );


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
      .style('background', 'linear-gradient(to bottom, #f8fafc, #f1f5f9)')
      .style('border-radius', '12px')
      .style('box-shadow', '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)');

    // Add a subtle pattern background
    svg.append('defs')
      .append('pattern')
      .attr('id', 'grid')
      .attr('width', 10)
      .attr('height', 10)
      .attr('patternUnits', 'userSpaceOnUse')
      .append('path')
      .attr('d', 'M 10 0 L 0 0 0 10')
      .attr('fill', 'none')
      .attr('stroke', '#e2e8f0')
      .attr('stroke-width', 0.5);

    svg.append('rect')
      .attr('width', width)
      .attr('height', height)
      .attr('fill', 'url(#grid)')
      .attr('opacity', 0.3);

    // Create chart group
    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    // Generate data based on timeRange
    let labels, data1, data2, data3;
    
    // Get the selected companies count and badges count from statsCards
    const selectedCompaniesCount = parseInt(statsCards.find(card => card.title === 'COMPANIES SELECTED')?.value || '0');
    const badgesEarnedCount = parseInt(statsCards.find(card => card.title === 'BADGES EARNED')?.value || '0');
    
    if (timeRange === '7d') {
      labels = ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'];
      // Generate activity data (skill progress)
      data1 = labels.map((_, i) => 10 + i * 2 + Math.random() * 5);
      // Generate selected companies data with a slight upward trend
      data2 = labels.map((_, i) => {
        const baseValue = selectedCompaniesCount > 0 ? selectedCompaniesCount - Math.min(i, selectedCompaniesCount) : 0;
        return baseValue + Math.random() * 0.5;
      });
      // Generate badges earned data with a slight upward trend
      data3 = labels.map((_, i) => {
        const baseValue = badgesEarnedCount > 0 ? badgesEarnedCount - Math.min(i, badgesEarnedCount) : 0;
        return baseValue + Math.random() * 0.5;
      });
    } else if (timeRange === '30d') {
      labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
      data1 = labels.map((_, i) => 20 + i * 5 + Math.random() * 10);
      data2 = labels.map((_, i) => {
        const baseValue = Math.max(0, selectedCompaniesCount - (3 - i));
        return baseValue + Math.random() * 0.5;
      });
      data3 = labels.map((_, i) => {
        const baseValue = Math.max(0, badgesEarnedCount - (3 - i));
        return baseValue + Math.random() * 0.5;
      });
    } else if (timeRange === '6m') {
      labels = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      data1 = labels.map((_, i) => 25 + i * 5 + Math.random() * 15);
      data2 = labels.map((_, i) => {
        const baseValue = Math.max(0, selectedCompaniesCount - (5 - i));
        return baseValue + Math.random() * 0.5;
      });
      data3 = labels.map((_, i) => {
        const baseValue = Math.max(0, badgesEarnedCount - (5 - i));
        return baseValue + Math.random() * 0.5;
      });
    } else {
      labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      data1 = labels.map((_, i) => 30 + i * 4 + Math.random() * 20);
      data2 = labels.map((_, i) => {
        const baseValue = Math.max(0, selectedCompaniesCount - (11 - i));
        return baseValue + Math.random() * 0.5;
      });
      data3 = labels.map((_, i) => {
        const baseValue = Math.max(0, badgesEarnedCount - (11 - i));
        return baseValue + Math.random() * 0.5;
      });
    }

    const data = labels.map((label, i) => ({
      label,
      value1: data1[i],                // Skill progress
      value2: data2[i],                // Selected companies
      value3: data3[i],                // Badges earned
    }));

    // Scales
    const x = d3.scaleBand().domain(labels).range([0, innerWidth]).padding(0.2);

    const y = d3
      .scaleLinear()
      .domain([0, Math.max(...data1, ...data2, ...data3) + 5])
      .range([innerHeight, 0])
      .nice();

    // Color scheme
    const colors = {
      skillProgress: {
        line: '#4f46e5',
        area: '#e0e7ff',
        dot: '#4338ca'
      },
      selectedCompanies: {
        line: '#0891b2',
        area: '#cffafe',
        dot: '#0e7490'
      },
      badgesEarned: {
        line: '#f59e0b',
        area: '#fef3c7',
        dot: '#d97706'
      }
    };

    // Line and area generators with smooth curves
    const line1 = d3
      .line()
      .x((d) => (x(d.label) || 0) + x.bandwidth() / 2)
      .y((d) => y(d.value1))
      .curve(d3.curveCatmullRom.alpha(0.5));

    const line2 = d3
      .line()
      .x((d) => (x(d.label) || 0) + x.bandwidth() / 2)
      .y((d) => y(d.value2))
      .curve(d3.curveCatmullRom.alpha(0.5));
      
    const line3 = d3
      .line()
      .x((d) => (x(d.label) || 0) + x.bandwidth() / 2)
      .y((d) => y(d.value3))
      .curve(d3.curveCatmullRom.alpha(0.5));

    const area1 = d3
      .area()
      .x((d) => (x(d.label) || 0) + x.bandwidth() / 2)
      .y0(innerHeight)
      .y1((d) => y(d.value1))
      .curve(d3.curveCatmullRom.alpha(0.5));

    const area2 = d3
      .area()
      .x((d) => (x(d.label) || 0) + x.bandwidth() / 2)
      .y0(innerHeight)
      .y1((d) => y(d.value2))
      .curve(d3.curveCatmullRom.alpha(0.5));
      
    const area3 = d3
      .area()
      .x((d) => (x(d.label) || 0) + x.bandwidth() / 2)
      .y0(innerHeight)
      .y1((d) => y(d.value3))
      .curve(d3.curveCatmullRom.alpha(0.5));

    // Add grid lines
    g.append('g')
      .attr('class', 'grid')
      .call(d3.axisLeft(y).tickSize(-innerWidth).tickFormat(() => ''))
      .style('stroke', '#e5e7eb')
      .style('stroke-dasharray', '3,3')
      .style('stroke-opacity', 0.5)
      .selectAll('line')
      .style('transition', 'stroke-opacity 0.3s ease');

    // Draw areas with gradients
    // Create gradient for area1
    const gradient1 = svg.append('defs')
      .append('linearGradient')
      .attr('id', 'area-gradient1')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '0%')
      .attr('y2', '100%');

    gradient1.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', colors.skillProgress.area)
      .attr('stop-opacity', 0.7);

    gradient1.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', colors.skillProgress.area)
      .attr('stop-opacity', 0.1);

    // Create gradient for area2
    const gradient2 = svg.append('defs')
      .append('linearGradient')
      .attr('id', 'area-gradient2')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '0%')
      .attr('y2', '100%');

    gradient2.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', colors.selectedCompanies.area)
      .attr('stop-opacity', 0.7);

    gradient2.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', colors.selectedCompanies.area)
      .attr('stop-opacity', 0.1);

    // Create gradient for area3
    const gradient3 = svg.append('defs')
      .append('linearGradient')
      .attr('id', 'area-gradient3')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '0%')
      .attr('y2', '100%');

    gradient3.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', colors.badgesEarned.area)
      .attr('stop-opacity', 0.7);

    gradient3.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', colors.badgesEarned.area)
      .attr('stop-opacity', 0.1);

    // Draw areas with gradients
    g.append('path')
      .datum(data)
      .attr('fill', 'url(#area-gradient1)')
      .attr('d', area1)
      .attr('opacity', 0)
      .transition()
      .duration(1000)
      .attr('opacity', 1);

    g.append('path')
      .datum(data)
      .attr('fill', 'url(#area-gradient2)')
      .attr('d', area2)
      .attr('opacity', 0)
      .transition()
      .duration(1000)
      .delay(200)
      .attr('opacity', 1);
      
    g.append('path')
      .datum(data)
      .attr('fill', 'url(#area-gradient3)')
      .attr('d', area3)
      .attr('opacity', 0)
      .transition()
      .duration(1000)
      .delay(400)
      .attr('opacity', 1);

    // Draw lines with animations
    const path1 = g.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', colors.skillProgress.line)
      .attr('stroke-width', 3)
      .attr('stroke-linecap', 'round')
      .attr('stroke-linejoin', 'round')
      .attr('d', line1);

    const path1Length = path1.node().getTotalLength();
    
    path1
      .attr('stroke-dasharray', path1Length)
      .attr('stroke-dashoffset', path1Length)
      .transition()
      .duration(1500)
      .attr('stroke-dashoffset', 0);

    const path2 = g.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', colors.selectedCompanies.line)
      .attr('stroke-width', 3)
      .attr('stroke-linecap', 'round')
      .attr('stroke-linejoin', 'round')
      .attr('d', line2);

    const path2Length = path2.node().getTotalLength();
    
    path2
      .attr('stroke-dasharray', path2Length)
      .attr('stroke-dashoffset', path2Length)
      .transition()
      .duration(1500)
      .delay(200)
      .attr('stroke-dashoffset', 0);
      
    const path3 = g.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', colors.badgesEarned.line)
      .attr('stroke-width', 3)
      .attr('stroke-linecap', 'round')
      .attr('stroke-linejoin', 'round')
      .attr('d', line3);

    const path3Length = path3.node().getTotalLength();
    
    path3
      .attr('stroke-dasharray', path3Length)
      .attr('stroke-dashoffset', path3Length)
      .transition()
      .duration(1500)
      .delay(400)
      .attr('stroke-dashoffset', 0);

    // Add dots with enhanced tooltips and animations for line1
    g.selectAll('.dot1')
      .data(data)
      .enter()
      .append('circle')
      .attr('class', 'dot1')
      .attr('cx', (d) => (x(d.label) || 0) + x.bandwidth() / 2)
      .attr('cy', (d) => y(d.value1))
      .attr('r', 0) // Start with radius 0 for animation
      .attr('fill', colors.skillProgress.dot)
      .attr('stroke', '#ffffff')
      .attr('stroke-width', 1.5)
      .style('cursor', 'pointer')
      .style('filter', 'drop-shadow(0px 2px 2px rgba(0, 0, 0, 0.1))')
      .transition()
      .delay((_, i) => i * 100 + 1000)
      .duration(300)
      .attr('r', 5) // Animate to final radius
      .on('end', function() {
        d3.select(this)
          .on('mouseover', function(event, d) {
            d3.select(this)
              .transition()
              .duration(300)
              .attr('r', 7);
            
            // Create tooltip if it doesn't exist
            const tooltip = d3.select('body')
              .selectAll('.tooltip')
              .data([null])
              .join('div')
              .attr('class', 'tooltip')
              .style('opacity', 0)
              .style('position', 'absolute')
              .style('background', 'white')
              .style('padding', '8px')
              .style('border-radius', '4px')
              .style('box-shadow', '0 2px 4px rgba(0,0,0,0.1)')
              .style('pointer-events', 'none')
              .style('font-size', '12px');

            tooltip.transition().duration(200).style('opacity', 0.95);
            tooltip
              .html(`
                <div style="color: ${colors.skillProgress.dot}">
                  <strong>${d.label}</strong><br/>
                  Skill Progress: ${d.value1.toFixed(1)}
                </div>
              `)
              .style('left', `${event.pageX + 10}px`)
              .style('top', `${event.pageY - 28}px`);
          })
          .on('mouseout', function() {
            d3.select(this)
              .transition()
              .duration(300)
              .attr('r', 5);
              
            d3.select('body').selectAll('.tooltip').transition().duration(500).style('opacity', 0);
          });
      });

    // Add dots with enhanced tooltips and animations for line2 (Selected Companies)
    g.selectAll('.dot2')
      .data(data)
      .enter()
      .append('circle')
      .attr('class', 'dot2')
      .attr('cx', (d) => (x(d.label) || 0) + x.bandwidth() / 2)
      .attr('cy', (d) => y(d.value2))
      .attr('r', 0) // Start with radius 0 for animation
      .attr('fill', colors.selectedCompanies.dot)
      .attr('stroke', '#ffffff')
      .attr('stroke-width', 1.5)
      .style('cursor', 'pointer')
      .style('filter', 'drop-shadow(0px 2px 2px rgba(0, 0, 0, 0.1))')
      .transition()
      .delay((_, i) => i * 100 + 1200)
      .duration(300)
      .attr('r', 5) // Animate to final radius
      .on('end', function() {
        d3.select(this)
          .on('mouseover', function(event, d) {
            d3.select(this)
              .transition()
              .duration(300)
              .attr('r', 7);
              
            const tooltip = d3.select('body')
              .selectAll('.tooltip')
              .data([null])
              .join('div')
              .attr('class', 'tooltip')
              .style('opacity', 0)
              .style('position', 'absolute')
              .style('background', 'white')
              .style('padding', '8px')
              .style('border-radius', '4px')
              .style('box-shadow', '0 2px 4px rgba(0,0,0,0.1)')
              .style('pointer-events', 'none')
              .style('font-size', '12px');
              
            tooltip.transition().duration(200).style('opacity', 0.95);
            tooltip
              .html(`
                <div style="color: ${colors.selectedCompanies.dot}">
                  <strong>${d.label}</strong><br/>
                  Selected Companies: ${d.value2.toFixed(1)}
                </div>
              `)
              .style('left', `${event.pageX + 10}px`)
              .style('top', `${event.pageY - 28}px`);
          })
          .on('mouseout', function() {
            d3.select(this)
              .transition()
              .duration(300)
              .attr('r', 5);
              
            d3.select('body').selectAll('.tooltip').transition().duration(500).style('opacity', 0);
          });
      });

    // Add dots with enhanced tooltips and animations for line3 (Badges Earned)
    g.selectAll('.dot3')
      .data(data)
      .enter()
      .append('circle')
      .attr('class', 'dot3')
      .attr('cx', (d) => (x(d.label) || 0) + x.bandwidth() / 2)
      .attr('cy', (d) => y(d.value3))
      .attr('r', 0) // Start with radius 0 for animation
      .attr('fill', colors.badgesEarned.dot)
      .attr('stroke', '#ffffff')
      .attr('stroke-width', 1.5)
      .style('cursor', 'pointer')
      .style('filter', 'drop-shadow(0px 2px 2px rgba(0, 0, 0, 0.1))')
      .transition()
      .delay((_, i) => i * 100 + 1400)
      .duration(300)
      .attr('r', 5) // Animate to final radius
      .on('end', function() {
        d3.select(this)
          .on('mouseover', function(event, d) {
            d3.select(this)
              .transition()
              .duration(300)
              .attr('r', 7);
            
            const tooltip = d3.select('body')
              .selectAll('.tooltip')
              .data([null])
              .join('div')
              .attr('class', 'tooltip')
              .style('opacity', 0)
              .style('position', 'absolute')
              .style('background', 'white')
              .style('padding', '8px')
              .style('border-radius', '4px')
              .style('box-shadow', '0 2px 4px rgba(0,0,0,0.1)')
              .style('pointer-events', 'none')
              .style('font-size', '12px');

            tooltip.transition().duration(200).style('opacity', 0.95);
            tooltip
              .html(`
                <div style="color: ${colors.badgesEarned.dot}">
                  <strong>${d.label}</strong><br/>
                  Badges Earned: ${d.value3.toFixed(1)}
                </div>
              `)
              .style('left', `${event.pageX + 10}px`)
              .style('top', `${event.pageY - 28}px`);
          })
          .on('mouseout', function() {
            d3.select(this)
              .transition()
              .duration(300)
              .attr('r', 5);
              
            d3.select('body').selectAll('.tooltip').transition().duration(500).style('opacity', 0);
          });
      });

    // Add axes with animations and styling
    const xAxis = g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .style('font-size', '12px')
      .style('color', '#64748b')
      .style('font-weight', '500');
      
    xAxis.call(d3.axisBottom(x))
      .selectAll('text')
      .style('opacity', 0)
      .transition()
      .duration(800)
      .delay((_, i) => i * 50)
      .style('opacity', 1);
      
    xAxis.selectAll('line')
      .style('stroke', '#94a3b8');
      
    xAxis.select('.domain')
      .style('stroke', '#94a3b8');

    const yAxis = g.append('g')
      .style('font-size', '12px')
      .style('color', '#64748b')
      .style('font-weight', '500');
      
    yAxis.call(d3.axisLeft(y).ticks(5))
      .selectAll('text')
      .style('opacity', 0)
      .transition()
      .duration(800)
      .delay((_, i) => i * 100)
      .style('opacity', 1);
      
    yAxis.selectAll('line')
      .style('stroke', '#94a3b8');
      
    yAxis.select('.domain')
      .style('stroke', '#94a3b8');

    // Add chart title
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', 20)
      .attr('text-anchor', 'middle')
      .style('font-size', '16px')
      .style('font-weight', '600')
      .style('fill', '#1e293b')
      .text('Activity Overview')
      .style('opacity', 0)
      .transition()
      .duration(1000)
      .style('opacity', 1);

    // Add legend
    const legend = svg.append('g')
      .attr('transform', `translate(${width - margin.right - 150}, ${margin.top})`)
      .style('font-size', '12px');

    // Legend entries
    const legendData = [
      { name: 'Skill Progress', color: colors.skillProgress.line },
      { name: 'Selected Companies', color: colors.selectedCompanies.line },
      { name: 'Badges Earned', color: colors.badgesEarned.line }
    ];

    // Add legend items with animation
    legendData.forEach((item, i) => {
      const legendItem = legend.append('g')
        .attr('transform', `translate(0, ${i * 20})`)
        .style('opacity', 0)
        // .duration(500)
        // .delay(i * 200 + 1000)
        .style('opacity', 1);

      legendItem.append('line')
        .attr('x1', 0)
        .attr('y1', 5)
        .attr('x2', 20)
        .attr('y2', 5)
        .style('stroke', item.color)
        .style('stroke-width', 3)
        .style('stroke-linecap', 'round');

      legendItem.append('text')
        .attr('x', 25)
        .attr('y', 9)
        .text(item.name)
        .style('fill', '#475569')
        .style('font-weight', '500');
    });

    // Add hover effect to the entire chart
    svg.append('rect')
      .attr('width', width)
      .attr('height', height)
      .attr('fill', 'transparent')
      .on('mouseover', function() {
        d3.selectAll('.grid line')
          .transition()
          .duration(300)
          .style('stroke-opacity', 0.8);
      })
      .on('mouseout', function() {
        d3.selectAll('.grid line')
          .transition()
          .duration(300)
          .style('stroke-opacity', 0.5);
      });

    // Cleanup tooltip on unmount
 
  }, [timeRange, statsCards]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-indigo-700"></div>
      </div>
    );
  }
  console.log("recent activites" , recentActivities)

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
                href="/createprofile"
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
                <div className="flex items-center mr-4">
                  <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-1"></span>
                  <span>Selected Companies</span>
                </div>
                <div className="flex items-center">
                  <span className="inline-block w-3 h-3 bg-yellow-500 rounded-full mr-1"></span>
                  <span>Badges Earned</span>
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
                <a href="/companies/related" className="text-sm text-indigo-600 hover:underline inline-flex items-center">
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
                            <a href={`/candidate/company/${company.id}/profile`} className="text-xs text-indigo-600 hover:underline">
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
                  <a href="/profile" className="mt-3 inline-block text-indigo-600 hover:underline">Update Profile</a>
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
                </div>
              </div>
              
              <div className="space-y-6">
                {console.log(roadmapProgress)}
                {roadmapProgress.length > 0 ? (
                  roadmapProgress.map((item, index) => (
                    <div key={index}>
                      <div className="flex justify-between mb-2">
                        <span className="font-medium text-gray-700">{item.name}  for  ID : {item.id}</span>
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
                <h2 className="text-lg font-semibold text-gray-900"> your chosen companies</h2>
                <a href="/companies/list" className="text-sm text-indigo-600 hover:underline inline-flex items-center">
                  See All <ChevronRight size={16} />
                </a>
              </div>
             <CompanyDisplay selectedCompaniesData={selectedCompaniesData} />
                </div>
              </div>
            </div>
          </div>
        </div>

  );
}   