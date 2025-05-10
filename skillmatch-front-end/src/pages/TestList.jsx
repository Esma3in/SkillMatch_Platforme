import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import NavbarCandidate from '../components/common/navbarCandidate';
import { FaExclamationCircle, FaList, FaPen, FaTrophy } from 'react-icons/fa';
import { Footer } from '../components/common/footer';

const TestsList = () => {
  const { companyId } = useParams();
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [totalTests, setTotalTests] = useState(0);

  useEffect(() => {
    const fetchTests = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:8000/api/candidate/company/${companyId}/tests?page=${currentPage}`,
          {
            headers: { Accept: 'application/json' },
          }
        );
        setTests(response.data.data);
        setLastPage(response.data.last_page);
        setTotalTests(response.data.total);
        setLoading(false);
      } catch (err) {
        setError(err.response.data);
        setLoading(false);
        console.error('Error fetching tests:', err);
      }
    };
    fetchTests();
  }, [companyId, currentPage]);

  const getLevelStyles = (level) => {
    const levels = {
      easy: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      hard: 'bg-red-100 text-red-800',
      expert: 'bg-purple-100 text-purple-800',
    };
    return levels[level?.toLowerCase()] || 'bg-gray-100 text-gray-800';
  };

  const goToPage = (page) => {
    if (page >= 1 && page <= lastPage) {
      setCurrentPage(page);
    }
  };

  const renderPagination = () => {
    const pages = Array.from({ length: lastPage }, (_, i) => i + 1);
    return (
      <div className="flex flex-wrap justify-center items-center mt-8 gap-3">
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 rounded-full bg-white border border-indigo-200 text-indigo-600 hover:bg-indigo-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
          aria-label="Previous page"
        >
          Previous
        </button>
        {pages.map((page) => (
          <button
            key={page}
            onClick={() => goToPage(page)}
            className={`px-4 py-2 rounded-full ${
              currentPage === page
                ? 'bg-indigo-600 text-white'
                : 'bg-white border border-indigo-200 text-indigo-600 hover:bg-indigo-50'
            } transition-all duration-300`}
            aria-label={`Page ${page}`}
          >
            {page}
          </button>
        ))}
        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === lastPage}
          className="px-4 py-2 rounded-full bg-white border border-indigo-200 text-indigo-600 hover:bg-indigo-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
          aria-label="Next page"
        >
          Next
        </button>
      </div>
    );
  };

  if (loading)
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-16 text-indigo-600 text-lg"
      >
        Loading Tests...
      </motion.div>
    );
  if (error)
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-4 px-6 mx-auto mt-8 max-w-md rounded-xl bg-red-50 text-red-700 shadow-lg border border-red-200"
      >
        {error}
      </motion.div>
    );

  return (
    <>
      <NavbarCandidate />
      <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8 font-sans">
        <div className="max-w-7xl mx-auto">
          {/* Enhanced Introductory Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-white rounded-2xl shadow-xl p-8 mb-10 border border-indigo-100 relative overflow-hidden"
          >
            {/* Subtle Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-50 to-white opacity-50"></div>
            <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
              <div className="flex items-center mb-6 sm:mb-0">
                <div className="w-16 h-16 overflow-hidden rounded-full border-4 border-indigo-200/50 bg-indigo-50 p-1 mr-4">
                  <img
                    src={`${tests[0]?.company?.logo || 'https://via.placeholder.com/150'}`}
                    alt={`${tests[0]?.company?.name || 'Company'} Logo`}
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <div>
                  <h1 className="text-3xl font-extrabold text-indigo-900 tracking-tight">
                    {tests[0]?.company?.name || 'InnovateCorp'} Assessments
                  </h1>
                  <p className="text-indigo-600 text-sm font-medium mt-1">
                    {tests[0]?.company?.sector || 'Technology & Innovation'} Excellence
                  </p>
                </div>
              </div>
              <span className="text-sm text-white font-medium bg-indigo-600 px-4 py-2 rounded-full shadow-md">
                {totalTests} Challenges Ready
              </span>
            </div>
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-gray-700 text-base leading-relaxed max-w-2xl"
            >
              Step into the future with {tests[0]?.company?.name || 'InnovateCorp'}’s cutting-edge skill challenges. Designed to spotlight your talent, these assessments are your chance to prove your expertise and join a league of innovators.
            </motion.p>
            {/* Creative Journey Timeline */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-8 flex justify-center"
              role="navigation"
              aria-label="Assessment journey steps"
            >
              <div className="flex items-center space-x-4 bg-indigo-50 p-4 rounded-xl max-w-3xl w-full">
                {[
                  { icon: FaList, label: 'Choose Challenge', active: true },
                  { icon: FaPen, label: 'Take Assessment', active: false },
                  { icon: FaTrophy, label: 'View Results', active: false },
                ].map((step, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.1 }}
                    className="flex-1 text-center"
                  >
                    <div
                      className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                        step.active ? 'bg-indigo-600 text-white' : 'bg-white text-indigo-400 border border-indigo-200'
                      } transition-all duration-300`}
                    >
                      <step.icon className="w-6 h-6" />
                    </div>
                    <span
                      className={`text-sm font-medium ${
                        step.active ? 'text-indigo-900' : 'text-gray-500'
                      }`}
                    >
                      {step.label}
                    </span>
                    {index < 2 && (
                      <div className="hidden sm:block h-1 bg-indigo-200 mt-4 mx-2"></div>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Descriptive Section 1: Why Take These Assessments? */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-2xl shadow-xl p-8 mb-10 border border-indigo-100"
          >
            <h2 className="text-2xl font-semibold text-indigo-900 mb-4 border-l-4 border-indigo-600 pl-4">
              Why Take These Assessments?
            </h2>
            <p className="text-gray-600 leading-relaxed">
              These assessments are crafted to test your skills through practical, real-world scenarios. By excelling,
              you demonstrate your readiness to {tests[0]?.company?.name || 'the company'} and stand out as a top
              candidate.
            </p>
          </motion.section>

          {/* Descriptive Section 2: Your Benefits */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white rounded-2xl shadow-xl p-8 mb-10 border border-indigo-100"
          >
            <h2 className="text-2xl font-semibold text-indigo-900 mb-4 border-l-4 border-indigo-600 pl-4">
              Your Benefits
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Success here boosts your visibility to hiring managers, showcasing your skills and dedication. It’s a
              powerful step toward landing your dream role with {tests[0]?.company?.name || 'the company'}.
            </p>
          </motion.section>

          {/* Descriptive Section 3: How to Get Started */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="bg-white rounded-2xl shadow-xl p-8 mb-10 border border-indigo-100"
          >
            <h2 className="text-2xl font-semibold text-indigo-900 mb-4 border-l-4 border-indigo-600 pl-4">
              How to Get Started
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Explore the assessments below, select one that matches your expertise, and click “Start Assessment” to
              begin. Review your results afterward to track your progress and prepare for the next steps.
            </p>
          </motion.section>

          {/* Enhanced Tests List with Cards */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence>
              {tests.length > 0 ? (
                tests.map((test) => {
                  const isStarted = Math.random() > 0.5; // Mock status
                  return (
                    <motion.div
                      key={test.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.4 }}
                      whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
                      className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-all duration-300 border border-indigo-100"
                    >
                      <h3 className="text-lg font-semibold text-indigo-900 mb-2">
                        {test?.skill?.name?.length > 30
                          ? `${test.skill?.name.substring(0, 30)}...`
                          : `Test in ${test?.skill?.name || 'Unnamed Skill'}`}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {test.objective?.length > 50
                          ? `${test.objective.substring(0, 50)}...`
                          : test.objective || 'No objective provided'}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className="bg-indigo-50 text-indigo-700 text-xs font-medium px-2.5 py-1 rounded-full">
                          {test.skill?.name || 'N/A'}
                        </span>
                        <span
                          className={`text-xs font-medium px-2.5 py-1 rounded-full ${getLevelStyles(
                            test.skill?.level
                          )}`}
                        >
                          {test.skill?.level
                            ? test.skill.level.charAt(0).toUpperCase() + test.skill.level.slice(1)
                            : 'N/A'}
                        </span>
                        {isStarted && (
                          <span className="bg-indigo-50 text-indigo-700 text-xs font-medium px-2.5 py-1 rounded-full">
                            In Progress
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-600 mb-4">
                        <span className="font-medium text-indigo-700">Duration:</span> {test.duration || '30 minutes'}
                      </div>
                      <div className="flex gap-3">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => (window.location.href = `/candidate/Test/${test.id}`)}
                          className="bg-indigo-600 text-white px-4 py-2 rounded-full hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                          aria-label={`Start test: ${test.skill?.name || 'Unnamed Test'}`}
                          disabled={isStarted}
                        >
                          Start Assessment
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => (window.location.href = `/candidate/test/${test.id}/result`)}
          
                          className="bg-white border border-indigo-200 text-indigo-600 px-4 py-2 rounded-full hover:bg-indigo-50 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                          aria-label={`View results for test: ${test.skill?.name || 'Unnamed Test'}`}
                          disabled={!isStarted}
                        >
                          View Results
                        </motion.button>
                      </div>
                    </motion.div>
                  );
                })
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-16 bg-white rounded-xl shadow-md border border-indigo-100 col-span-full"
                >
                  <FaExclamationCircle className="text-indigo-300 text-5xl mb-4 mx-auto" />
                  <h2 className="text-2xl font-bold text-indigo-900 mb-2">No Assessments Available</h2>
                  <p className="text-gray-600 max-w-md mx-auto">
                    No assessments are currently available from this company. Check back soon for new opportunities.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {lastPage > 1 && renderPagination()}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default TestsList;