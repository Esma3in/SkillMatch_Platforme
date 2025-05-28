import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { api } from '../api/api';

const CompanyDashboard = () => {
  const chartRef = useRef();
  const [stats, setStats] = useState(null);
  const [selectedCandidates, setSelectedCandidates] = useState([]);
  const [acceptedCandidates, setAcceptedCandidates] = useState([]);
  const [tests, setTests] = useState([]);
  const [expandedCandidate, setExpandedCandidate] = useState(null);
  const companyId = localStorage.getItem('company_id');

  useEffect(() => {
    if (!companyId) return;

    const fetchData = async () => {
      try {
        const [
          testCountRes,
          selectedCandidatesRes,
          resolvedTestsRes,
          acceptedCandidatesRes,
          testsRes
        ] = await Promise.all([
          api.get(`/api/companies/tests-count?company_id=${companyId}`),
          api.get(`/api/companies/selected-candidates?company_id=${companyId}`),
          api.get(`/api/companies/resolved-test-stats?company_id=${companyId}`),
          api.get(`/api/companies/accepted-candidates?company_id=${companyId}`),
          api.get(`/api/companies/tests?company_id=${companyId}`)
        ]);

        const testCount = testCountRes.data?.tests_count || 0;
        const selectedList = selectedCandidatesRes.data?.selected_candidates || [];
        const selectedCount = selectedList.length;
        const resolvedCount = resolvedTestsRes.data?.length || 0;
        const acceptedList = acceptedCandidatesRes.data || [];
        const acceptedCount = acceptedList?.[0]?.accepted_candidates_count || acceptedList.length;

        setStats([
          { label: 'Resolved Tests', value: resolvedCount },
          { label: 'Selected Candidates', value: selectedCount },
          { label: 'Total Tests', value: testCount },
          { label: 'Accepted Candidates', value: acceptedCount }
        ]);

        setSelectedCandidates(selectedList);
        setAcceptedCandidates(acceptedList);
        setTests(testsRes.data || []);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchData();
  }, [companyId]);

  useEffect(() => {
    if (!stats || !chartRef.current) return;

    d3.select(chartRef.current).selectAll('*').remove();

    const svg = d3.select(chartRef.current);
    const width = 600;
    const height = 300;
    const margin = { top: 20, right: 30, bottom: 40, left: 60 };

    svg.attr('width', width).attr('height', height);

    const x = d3.scaleBand()
      .domain(stats.map(d => d.label))
      .range([margin.left, width - margin.right])
      .padding(0.3);

    const y = d3.scaleLinear()
      .domain([0, d3.max(stats, d => d.value) + 2])
      .nice()
      .range([height - margin.bottom, margin.top]);

    svg.append('g')
      .attr('fill', '#4f46e5')
      .selectAll('rect')
      .data(stats)
      .join('rect')
      .attr('x', d => x(d.label))
      .attr('y', d => y(d.value))
      .attr('height', d => y(0) - y(d.value))
      .attr('width', x.bandwidth());

    svg.append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x));

    svg.append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(y));

    svg.selectAll('text.label')
      .data(stats)
      .join('text')
      .attr('class', 'label')
      .attr('x', d => x(d.label) + x.bandwidth() / 2)
      .attr('y', d => y(d.value) - 5)
      .attr('text-anchor', 'middle')
      .text(d => d.value);
  }, [stats]);

  const toggleCandidateDetails = (id) => {
    setExpandedCandidate(expandedCandidate === id ? null : id);
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Company Dashboard</h2>

      <div className="mb-8">
        <svg ref={chartRef}></svg>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Selected Candidates */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Selected Candidates</h3>
          {selectedCandidates.map((cand) => (
            <div key={cand.id} className="border p-2 mb-2 rounded shadow-sm">
              <div className="flex justify-between items-center">
                <span>{cand.candidate?.name || 'Unknown'}</span>
                <button
                  onClick={() => toggleCandidateDetails(cand.id)}
                  className="text-blue-600 hover:underline"
                >
                  {expandedCandidate === cand.id ? 'Hide Details' : 'Show Details'}
                </button>
              </div>
              {expandedCandidate === cand.id && cand.candidate?.profile && (
                <div className="mt-2 text-sm text-gray-700">
                  <p>Field: {cand.candidate.profile.field}</p>
                  <p>Location: {cand.candidate.profile.localisation}</p>
                  <p>Experience: {cand.candidate.profile.experience || 'N/A'}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Accepted Candidates */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Accepted Candidates</h3>
          {acceptedCandidates.map((cand) => (
            <div key={cand.candidate_id} className="border p-2 mb-2 rounded shadow-sm">
              <div className="flex justify-between items-center">
                <span>{cand.candidate_name}</span>
                <button
                  onClick={() => toggleCandidateDetails(cand.candidate_id)}
                  className="text-blue-600 hover:underline"
                >
                  {expandedCandidate === cand.candidate_id ? 'Hide Details' : 'Show Details'}
                </button>
              </div>
              {expandedCandidate === cand.candidate_id && (
                <div className="mt-2 text-sm text-gray-700">
                  <p>Email: {cand.email}</p>
                  <p>Field: {cand.field}</p>
                  <p>Phone: {cand.phoneNumber}</p>
                  <p>Experience: {cand.experience}</p>
                  <p>Skills: {cand.competenceList}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* List of Tests */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-2">Created Tests</h3>
        {tests.length === 0 ? (
          <p className="text-gray-600">No tests found.</p>
        ) : (
          <ul className="list-disc pl-5">
            {tests.map(test => (
              <li key={test.id} className="mb-1">
                <strong>{test.objective || `Test #${test.id}`}</strong> — {test.prerequisites || 'No description'}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default CompanyDashboard;
