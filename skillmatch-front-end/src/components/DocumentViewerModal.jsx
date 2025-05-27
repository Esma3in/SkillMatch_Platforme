import React, { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { FaDownload, FaCheck, FaTimes, FaArrowLeft, FaArrowRight, FaExclamationTriangle, FaFile } from 'react-icons/fa';
import api from '../api/axios';

// Set worker path for PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export default function DocumentViewerModal({ document, onClose, onDownload, onValidate, onInvalidate, status }) {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [isConfirming, setIsConfirming] = useState(false);
  const [fileUrl, setFileUrl] = useState('');
  const [textContent, setTextContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [documentType, setDocumentType] = useState(null);

  useEffect(() => {
    // Reset states when document changes
    setError(null);
    setLoading(true);
    setNumPages(null);
    setPageNumber(1);
    
    try {
      // Determine document type based on file path
      let fileExt = '';
      if (document.file_path) {
        const match = document.file_path.match(/\.([a-zA-Z0-9]+)$/);
        fileExt = match ? match[1].toLowerCase() : 'pdf'; // Default to pdf if no extension found
      } else {
        fileExt = 'pdf'; // Default to pdf
      }
      setDocumentType(fileExt);
      
      // Generate a URL for the document
      // Try multiple URL formats to account for different storage configurations
      const baseStorageUrl = `${api.defaults.baseURL.replace('/api', '')}/storage/`;
      
      // Remove any 'public/' prefix from the path
      let cleanPath = document.file_path;
      if (cleanPath.startsWith('public/')) {
        cleanPath = cleanPath.replace('public/', '');
      }
      
      const url = baseStorageUrl + cleanPath;
      console.log('Loading document from:', url);
      setFileUrl(url);
      
      // If the file is a text file, fetch its content
      if (fileExt === 'txt') {
        fetchTextContent(url);
      } else {
        setLoading(false);
      }
    } catch (err) {
      console.error('Error setting up document URL:', err);
      setError('Failed to load file. Please try downloading instead.');
      setLoading(false);
    }
  }, [document]);

  const fetchTextContent = async (url) => {
    try {
      setLoading(true);
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch text: ${response.status} ${response.statusText}`);
      }
      const text = await response.text();
      setTextContent(text);
    } catch (error) {
      console.error('Error fetching text content:', error);
      setError('Failed to load text file. Please try downloading instead.');
      setTextContent('');
    } finally {
      setLoading(false);
    }
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setLoading(false);
    setError(null);
  };

  const onDocumentLoadError = (error) => {
    console.error('Error loading PDF:', error);
    setError('Failed to load PDF file. Please try downloading instead.');
    setLoading(false);
  };

  const prevPage = () => {
    setPageNumber(pageNumber <= 1 ? 1 : pageNumber - 1);
  };

  const nextPage = () => {
    setPageNumber(pageNumber >= numPages ? numPages : pageNumber + 1);
  };

  const handleStatusUpdate = (isValid) => {
    if (!isConfirming) {
      setIsConfirming(isValid ? 'valid' : 'invalid');
      return;
    }
    
    if (isConfirming === 'valid') {
      onValidate();
    } else {
      onInvalidate();
    }
    
    setIsConfirming(false);
  };
  
  const cancelAction = () => {
    setIsConfirming(false);
  };

  const isPdf = documentType === 'pdf';
  const isTextFile = documentType === 'txt';

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      );
    }
    
    if (error) {
      return (
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <FaExclamationTriangle className="text-5xl text-amber-500 mb-4" />
          <p className="text-gray-700 mb-4">{error}</p>
          <button
            onClick={onDownload}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
          >
            <FaDownload className="mr-2" /> Download File
          </button>
        </div>
      );
    }
    
    if (isPdf) {
      return (
        <Document
          file={fileUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={onDocumentLoadError}
          loading={
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          }
        >
          <Page 
            pageNumber={pageNumber} 
            renderTextLayer={false}
            renderAnnotationLayer={false}
            width={Math.min(window.innerWidth * 0.8, 800)}
            error={
              <div className="flex flex-col items-center justify-center h-64">
                <p className="text-center text-red-600 mb-4">Error loading page {pageNumber}</p>
              </div>
            }
          />
        </Document>
      );
    }
    
    if (isTextFile && textContent) {
      return (
        <div className="border p-4 rounded bg-gray-50 font-mono text-sm whitespace-pre-wrap">
          {textContent}
        </div>
      );
    }
    
    // For other file types, provide a download prompt
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <FaFile className="text-5xl text-blue-400 mb-4" />
        <p className="text-gray-700 mb-4">
          This document type ({documentType || 'unknown'}) cannot be previewed directly.
          <br />Please download to view.
        </p>
        <button
          onClick={onDownload}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
        >
          <FaDownload className="mr-2" /> Download File
        </button>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-11/12 max-w-4xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center border-b px-6 py-3">
          <h3 className="text-lg font-medium text-gray-900">
            {document.document_type}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <FaTimes />
          </button>
        </div>
        
        <div className="flex-1 overflow-auto p-6">
          {renderContent()}
        </div>
        
        {isPdf && numPages > 1 && !error && (
          <div className="flex justify-center items-center space-x-4 py-3 border-t border-b">
            <button
              onClick={prevPage}
              disabled={pageNumber <= 1}
              className={`p-2 rounded-full ${pageNumber <= 1 ? 'text-gray-300' : 'text-blue-600 hover:bg-blue-100'}`}
            >
              <FaArrowLeft />
            </button>
            <p className="text-sm text-gray-700">
              Page {pageNumber} of {numPages}
            </p>
            <button
              onClick={nextPage}
              disabled={pageNumber >= numPages}
              className={`p-2 rounded-full ${pageNumber >= numPages ? 'text-gray-300' : 'text-blue-600 hover:bg-blue-100'}`}
            >
              <FaArrowRight />
            </button>
          </div>
        )}
        
        <div className="flex justify-between items-center px-6 py-3 border-t">
          <button
            onClick={onDownload}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
          >
            <FaDownload className="mr-2" /> Download
          </button>
          
          <div className="flex space-x-2">
            {isConfirming ? (
              <div className="flex items-center space-x-2 bg-white p-3 border rounded shadow-sm">
                <span className="text-sm text-gray-700">
                  {isConfirming === 'valid' ? 'Approve this legal document?' : 'Reject this legal document?'}
                </span>
                <button
                  onClick={cancelAction}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleStatusUpdate(isConfirming === 'valid')}
                  className={`px-3 py-1 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${isConfirming === 'valid' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
                >
                  Confirm
                </button>
              </div>
            ) : (
              <>
                {status !== 'valid' && (
                  <button
                    onClick={() => handleStatusUpdate(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
                  >
                    <FaCheck className="mr-2" /> Approve Document
                  </button>
                )}
                {status !== 'invalid' && (
                  <button
                    onClick={() => handleStatusUpdate(false)}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none"
                  >
                    <FaTimes className="mr-2" /> Reject Document
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 