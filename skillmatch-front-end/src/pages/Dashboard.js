import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

export const Dashboard = () => {
  const chartRef = useRef(null);
  const [timeRange, setTimeRange] = useState('7d');

  // Stats data with corrected title to avoid linter warning
  const statsCards = [
    { title: 'ENTREPRISE MATCHED', value: '25', change: '+ 4', increase: true },
    { title: 'ENTREPRISE SELECTED', value: '20', change: '+ 5', increase: true },
    { title: 'ROADMAPS COMPLETED', value: '7', change: '-3', increase: false },
    { title: 'BADGES EARNED', value: '30', change: '+ 5', increase: true },
    { title: 'ACTIVE ROADMAPS', value: '20', change: '+ 5', increase: true }, // Renamed to avoid repetition
  ];

  // Progress data (Roadmap Progress)
  const roadmapProgress = [
    { name: 'Laravel', percentage: 90 },
    { name: 'React', percentage: 75 },
    { name: 'Java', percentage: 27 },
    { name: 'C++', percentage: 11 },
  ];

  // Tests progress data
  const testsProgress = [
    { name: 'test1', percentage: 90 },
    { name: 'test2', percentage: 75 },
    { name: 'test3', percentage: 27 },
    { name: 'test4', percentage: 11 },
  ];

  // Challenge progress data
  const challengeProgress = [
    { name: 'challenge 1', percentage: 90 },
    { name: 'challenge 2', percentage: 75 },
    { name: 'challenge 3', percentage: 27 },
    { name: 'challenge 4', percentage: 11 },
  ];

  // Companies data
  const companiesData = [
    { name: 'NTT DATA', email: 'nttdatatetouan@gmail.com', image: '/image-ntt.png' },
    { name: 'Tech Corp', email: 'contact@techcorp.com', image: '/image-techcorp.png' },
    { name: 'Innovate Solutions', email: 'info@innovatesol.com', image: '/image-innovate.png' },
    { name: 'Global Systems', email: 'support@globalsys.com', image: '/image-global.png' },
  ];

  // Roadmap details data
  const roadmapDetails = [
    { status: 'completed', name: 'Frontend Development', badges: 5, company: 'TechCorp' },
    { status: 'completed', name: 'Backend Development', badges: 6, company: 'Innovate Solutions' },
    { status: 'pending', name: 'Backend Development', badges: 3, company: 'NTT DATA' },
    { status: 'canceled', name: 'Backend Development', badges: 1, company: 'Microsoft' },
  ];

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

    // Add dots for line2 (without tooltips for simplicity)
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
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8 max-w-7xl">
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
          <div className="space-y-8">
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
                        <td className="py-3">{roadmap.company}</td>
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
          </div>
        </div>
      </div>
    </div>
  );
};