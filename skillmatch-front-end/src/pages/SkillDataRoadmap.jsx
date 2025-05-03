import React, { useEffect, useState } from 'react';
import { api } from '../api/api';
import { useParams } from 'react-router';

const SkillsDataPage = () => {
  const [data, setData] = useState({
    skills: [],
    prerequisites: [],
    tools: [],
    candidateCourses: [],
    roadmapSkills: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const {id} = useParams();
 
  useEffect(() => {
    api.get(`/api/roadmap/${id}`)
      .then((response) => {
        setData({
          skills: response.data.skills,
          prerequisites: response.data.prerequisites,
          tools: response.data.tools,
          candidateCourses: response.data.candidateCourses,
          roadmapSkills: response.data.roadmapSkills,
        });
        setLoading(false);
      })
      .catch((err) => {
        setError(err.response?.data?.message || 'Error fetching data');
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div className="p-4">
      <h2>Company Skills Data</h2>

      <Section title="Skills" items={data.skills} />
      <Section title="Prerequisites" items={data.prerequisites} />
      <Section title="Tools" items={data.tools} />
      <Section title="Candidate Courses" items={data.candidateCourses} />
      <Section title="Roadmap Skills" items={data.roadmapSkills} />
    </div>
  );
};

const Section = ({ title, items }) => (
  <div className="mb-5">
    <h3>{title}</h3>
    {items.length === 0 ? (
      <p>No {title.toLowerCase()} found.</p>
    ) : (
      <ul className="list-disc pl-6">
        {items.map((item, index) => (
          <li key={index}>
            <pre className="bg-gray-100 p-2 rounded text-sm overflow-x-auto">
              {JSON.stringify(item, null, 2)}
            </pre>
          </li>
        ))}
      </ul>
    )}
  </div>
);

export default SkillsDataPage;
