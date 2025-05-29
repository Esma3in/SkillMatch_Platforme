import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaTrophy, FaDownload, FaExclamationCircle, FaArrowLeft } from 'react-icons/fa';
import { api } from '../api/api';
import NavbarCandidate from '../components/common/navbarCandidate';
import { Footer } from '../components/common/footer';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export default function Certificate() {
  const { certificateId } = useParams();
  const navigate = useNavigate();
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const certificateRef = useRef(null);
  
  useEffect(() => {
    const fetchCertificate = async () => {
      setLoading(true);
      try {
        const response = await api.get(`api/training/certificates/${certificateId}`);
        setCertificate(response.data);
        setLoading(false);
      } catch (err) {
        setError('Certificate not found or could not be loaded');
        setLoading(false);
        console.error(err);
      }
    };
    
    if (certificateId) {
      fetchCertificate();
    }
  }, [certificateId]);
  
  const handleDownloadPDF = async () => {
    if (!certificateRef.current) return;
    
    try {
      const canvas = await html2canvas(certificateRef.current, {
        scale: 2,
        logging: false,
        useCORS: true
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });
      
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Certificate-${certificateId}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };
  
  if (loading) {
    return (
      <>
        <NavbarCandidate />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-indigo-600 border-solid mb-4"></div>
            <p className="text-gray-600">Loading certificate...</p>
          </div>
        </div>
      </>
    );
  }
  
  if (error) {
    return (
      <>
        <NavbarCandidate />
        <div className="text-center py-16">
          <FaExclamationCircle className="inline-block text-4xl text-red-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Certificate Not Found</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/challenges')}
            className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition-colors"
          >
            Go to Challenges
          </button>
        </div>
      </>
    );
  }
  
  return (
    <>
      <NavbarCandidate />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="mb-6 flex justify-between items-center">
            <button
              onClick={() => navigate(-1)}
              className="text-indigo-600 hover:text-indigo-800 flex items-center"
            >
              <FaArrowLeft className="mr-2" /> Back
            </button>
            
            <button
              onClick={handleDownloadPDF}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors flex items-center"
            >
              <FaDownload className="mr-2" /> Download Certificate
            </button>
          </div>
          
          {/* Certificate */}
          <div 
            ref={certificateRef}
            className="bg-white border-8 border-double border-yellow-500 p-8 rounded-lg shadow-lg mx-auto max-w-4xl"
          >
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <FaTrophy className="text-6xl text-yellow-500" />
              </div>
              
              <h1 className="text-4xl font-bold text-gray-800 mb-4 font-serif">Certificate of Completion</h1>
              <p className="text-xl text-gray-600 mb-8 font-serif">This certifies that</p>
              
              <h2 className="text-3xl font-bold text-indigo-700 mb-8 font-serif border-b-2 border-indigo-200 pb-2 max-w-md mx-auto">
                {certificate?.candidate_name || 'Candidate Name'}
              </h2>
              
              <p className="text-xl text-gray-600 mb-4 font-serif">
                has successfully completed the challenge
              </p>
              
              <h3 className="text-2xl font-bold text-gray-800 mb-8 font-serif">
                "{certificate?.challenge_name || 'Challenge Name'}"
              </h3>
              
              <div className="flex justify-center items-center mb-8">
                <div className="border-t-2 border-gray-300 flex-grow max-w-xs"></div>
                <div className="px-4">
                  <span className="bg-yellow-100 text-yellow-800 text-sm font-semibold px-3 py-1 rounded-full">
                    {certificate?.skill || 'Skill'}
                  </span>
                  <span className="bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full ml-2">
                    {certificate?.level?.charAt(0).toUpperCase() + certificate?.level?.slice(1) || 'Level'}
                  </span>
                </div>
                <div className="border-t-2 border-gray-300 flex-grow max-w-xs"></div>
              </div>
              
              <div className="mb-8">
                <p className="text-gray-600 font-serif">Issued on</p>
                <p className="text-xl font-semibold text-gray-800 font-serif">{certificate?.completion_date || 'Date'}</p>
              </div>
              
              <div className="mb-4">
                <p className="text-gray-500 text-sm">Certificate ID: {certificate?.certificate_id || 'ID'}</p>
              </div>
              
              <div className="flex justify-center">
                <div className="text-center px-8">
                  <div className="border-t-2 border-gray-400 w-40 mb-2"></div>
                  <p className="text-gray-600 font-serif">SkillMatch Platform</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}