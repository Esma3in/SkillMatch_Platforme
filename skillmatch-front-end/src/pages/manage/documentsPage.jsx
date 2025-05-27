import React, { useState, useEffect } from 'react';
import { FaFileAlt, FaCheck, FaDownload, FaEye, FaTimes, FaSearch, FaFilter, FaTimesCircle, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { api } from '../../api/api';
import NavbarAdmin from '../../components/common/navbarAdmin';
import { toast } from 'react-toastify';
import { debounce } from 'lodash';

export default function DocumentsPage() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showConfirmation, setShowConfirmation] = useState(false);
  
  // Pagination state
  const [pagination, setPagination] = useState({
    currentPage: 1,
    perPage: 10,
    total: 0,
    totalPages: 0
  });
  
  // Filter states
  const [filterOptions, setFilterOptions] = useState({
    documentTypes: [],
    statusOptions: ['pending', 'valid', 'invalid']
  });
  const [filters, setFilters] = useState({
    search: '',
    companyName: '',
    documentType: '',
    status: ''
  });

  // Fetch filter options
  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const response = await api.get('api/admin/documents/filter-options');
        if (response.data) {
          setFilterOptions({
            documentTypes: response.data.documentTypes || [],
            statusOptions: response.data.statusOptions || ['pending', 'valid', 'invalid']
          });
        }
      } catch (error) {
        console.error('Error fetching filter options:', error);
      }
    };

    fetchFilterOptions();
  }, []);
  
  // Fetch documents with filters and pagination
  useEffect(() => {
    // Trigger fetch when component mounts
    fetchDocuments();
  }, []);
  
  // Debounced fetch for async filtering
  const debouncedFetch = debounce(() => {
    fetchDocuments();
  }, 500);
  
  // Effect for filter changes
  useEffect(() => {
    if (!loading) {
      debouncedFetch();
    }
    // Cancel debounce on cleanup
    return () => debouncedFetch.cancel();
  }, [filters, pagination.currentPage, pagination.perPage]);
  
  const fetchDocuments = async () => {
    try {
      setLoading(true);
      
      // Build query string from filters and pagination
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.companyName) params.append('company_name', filters.companyName);
      if (filters.documentType) params.append('document_type', filters.documentType);
      if (filters.status) params.append('status', filters.status);
      params.append('page', pagination.currentPage);
      params.append('per_page', pagination.perPage);
      
      const response = await api.get(`api/admin/documents?${params.toString()}`);
      
      if (response.data) {
        setDocuments(response.data.data || []);
        setPagination(prev => ({
          ...prev,
          total: response.data.meta?.total || 0,
          totalPages: response.data.meta?.last_page || 0,
          currentPage: response.data.meta?.current_page || 1
        }));
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching documents:', error);
      toast.error('Failed to fetch documents');
      setLoading(false);
    }
  };

  const handlePreviewDocument = (document) => {
    try {
      // Open document in new tab using the preview endpoint
      const previewUrl = `${api.defaults.baseURL}/admin/documents/preview/${document.id}`;
      window.open(previewUrl, '_blank');
    } catch (error) {
      console.error('Error previewing document:', error);
      toast.error('Failed to preview document');
    }
  };

  const handleDownloadDocument = async (documentId) => {
    try {
      window.open(`${api.defaults.baseURL}/admin/documents/download/${documentId}`, '_blank');
    } catch (error) {
      console.error('Error downloading document:', error);
      toast.error('Failed to download document');
    }
  };

  const handleUpdateDocumentStatus = async (documentId, status) => {
    if (!showConfirmation) {
      setShowConfirmation({id: documentId, status});
      return;
    }

    try {
      await api.post(`api/admin/documents/status/${documentId}`, { status });
      
      // Update local state
      setDocuments(documents.map(doc =>
          doc.id === documentId ? { 
            ...doc, 
            status,
            is_validated: status === 'valid',
            validated_at: new Date().toISOString() 
          } : doc
      ));
      
      const statusMessage = status === 'valid' ? 'validated' : 'invalidated';
      toast.success(`Document ${statusMessage} successfully`);
      setShowConfirmation(false);
    } catch (error) {
      console.error('Error updating document status:', error);
      toast.error('Failed to update document status');
    }
  };
  
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: value
    }));
    // Reset to first page when changing filters
    setPagination(prev => ({
      ...prev,
      currentPage: 1
    }));
  };
  
  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;
    setPagination(prev => ({
      ...prev,
      currentPage: newPage
    }));
  };
  
  const clearFilters = () => {
    setFilters({
      search: '',
      companyName: '',
      documentType: '',
      status: ''
    });
    setPagination(prev => ({
      ...prev,
      currentPage: 1
    }));
  };
  
  // Get status badge color based on status
  const getStatusBadgeClass = (status) => {
    switch(status) {
      case 'valid':
        return 'bg-green-100 text-green-800';
      case 'invalid':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };
  
  // Get friendly status text
  const getStatusText = (status) => {
    switch(status) {
      case 'valid':
        return 'Approved';
      case 'invalid':
        return 'Rejected';
      default:
        return 'Pending Review';
    }
  };

  const cancelConfirmation = () => {
    setShowConfirmation(false);
  };

  return (
    <>
      <NavbarAdmin />
      <div className="p-8 bg-gray-50 min-h-screen">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Company Legal Documents Validation</h1>
        <p className="text-sm text-gray-500 mb-4">
          Validate company identification documents uploaded during registration.
        </p>
        
        {/* Filters - Updated Styling */}
        <div className="bg-white p-5 rounded-lg shadow-md mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-700 flex items-center">
              <FaFilter className="mr-2 text-indigo-500" /> Filter Documents
            </h2>
            <button
              onClick={clearFilters}
              className="text-sm text-gray-500 hover:text-gray-700 flex items-center"
            >
              <FaTimesCircle className="mr-1" /> Clear All
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">Search Legal Documents</label>
              <div className="relative">
                <input
                  type="text"
                  id="search"
                  name="search"
                  value={filters.search}
                  onChange={handleFilterChange}
                  placeholder="Search by document type..."
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm pl-10 py-2"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="text-gray-400" />
                </div>
              </div>
            </div>
            
            {/* Company name */}
            <div>
              <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
              <input
                type="text"
                id="companyName"
                name="companyName"
                value={filters.companyName}
                onChange={handleFilterChange}
                placeholder="Filter by company name..."
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2"
              />
            </div>
            
            {/* Document Type */}
            <div>
              <label htmlFor="documentType" className="block text-sm font-medium text-gray-700 mb-1">Legal Document Type</label>
              <select
                id="documentType"
                name="documentType"
                value={filters.documentType}
                onChange={handleFilterChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2"
              >
                <option value="">All Types</option>
                {filterOptions.documentTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            
            {/* Status */}
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                id="status"
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2"
              >
                <option value="">All Statuses</option>
                {filterOptions.statusOptions.map(status => (
                  <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Company
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Document Type
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Uploaded At
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Validated At
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {documents.length > 0 ? (
                      documents.map(document => (
                            <tr key={document.id}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="ml-4">
                                    <div className="text-sm font-medium text-gray-900">
                                  {document.company?.name || 'Unknown Company'}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                  {document.company?.profile?.address || 'No address'}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <FaFileAlt className="text-blue-500 mr-2" />
                                  <span className="text-sm text-gray-900">{document.document_type}</span>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(document.status)}`}>
                                  {getStatusText(document.status)}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {new Date(document.created_at).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {document.validated_at ? new Date(document.validated_at).toLocaleDateString() : 'Not validated'}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium relative">
                                <div className="flex space-x-2">
                                  <button
                                    onClick={() => handlePreviewDocument(document)}
                                    className="text-blue-600 hover:text-blue-900"
                                    title="Preview"
                                  >
                                    <FaEye />
                                  </button>
                                  <button
                                    onClick={() => handleDownloadDocument(document.id)}
                                    className="text-green-600 hover:text-green-900"
                                    title="Download"
                                  >
                                    <FaDownload />
                                  </button>
                                  {document.status !== 'valid' && (
                                    <button
                                      onClick={() => handleUpdateDocumentStatus(document.id, 'valid')}
                                      className="text-indigo-600 hover:text-indigo-900"
                                      title="Approve Document"
                                    >
                                      <FaCheck />
                                    </button>
                                  )}
                                  {document.status !== 'invalid' && (
                                    <button
                                      onClick={() => handleUpdateDocumentStatus(document.id, 'invalid')}
                                      className="text-red-600 hover:text-red-900"
                                      title="Reject Document"
                                    >
                                      <FaTimes />
                                    </button>
                                  )}
                                </div>

                                {/* Confirmation dialog */}
                                {showConfirmation && showConfirmation.id === document.id && (
                                  <div className="absolute right-0 bg-white shadow-lg rounded-md border p-4 z-10 mt-2 w-64">
                                    <p className="text-sm text-gray-700 mb-3">
                                      {showConfirmation.status === 'valid' 
                                        ? 'Are you sure you want to approve this legal document?' 
                                        : 'Are you sure you want to reject this legal document?'}
                                    </p>
                                    <div className="flex justify-end space-x-2">
                                      <button
                                        onClick={cancelConfirmation}
                                        className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm"
                                      >
                                        Cancel
                                      </button>
                                      <button
                                        onClick={() => handleUpdateDocumentStatus(document.id, showConfirmation.status)}
                                        className={`px-3 py-1 text-white rounded text-sm ${showConfirmation.status === 'valid' ? 'bg-indigo-600' : 'bg-red-600'}`}
                                      >
                                        Confirm
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </td>
                            </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                          No documents found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* Pagination Controls */}
            {pagination.total > 0 && (
              <div className="flex items-center justify-between bg-white px-4 py-3 sm:px-6 mt-4 rounded-lg shadow-sm">
                <div className="flex flex-1 justify-between sm:hidden">
                  <button
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={pagination.currentPage === 1}
                    className={`relative inline-flex items-center rounded-md px-4 py-2 text-sm font-medium ${
                      pagination.currentPage === 1 
                        ? 'text-gray-400 cursor-not-allowed' 
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={pagination.currentPage === pagination.totalPages}
                    className={`relative ml-3 inline-flex items-center rounded-md px-4 py-2 text-sm font-medium ${
                      pagination.currentPage === pagination.totalPages
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing <span className="font-medium">{((pagination.currentPage - 1) * pagination.perPage) + 1}</span> to{' '}
                      <span className="font-medium">
                        {Math.min(pagination.currentPage * pagination.perPage, pagination.total)}
                      </span>{' '}
                      of <span className="font-medium">{pagination.total}</span> documents
                    </p>
                  </div>
                  <div>
                    <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                      <button
                        onClick={() => handlePageChange(pagination.currentPage - 1)}
                        disabled={pagination.currentPage === 1}
                        className={`relative inline-flex items-center rounded-l-md px-2 py-2 ${
                          pagination.currentPage === 1
                            ? 'text-gray-300 cursor-not-allowed'
                            : 'text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        <FaChevronLeft className="h-3 w-3" />
                      </button>
                      
                      {/* Page Numbers */}
                      {[...Array(pagination.totalPages)].map((_, i) => {
                        const pageNumber = i + 1;
                        const isCurrentPage = pageNumber === pagination.currentPage;
                        
                        // For many pages, show limited page numbers with ellipsis
                        if (pagination.totalPages > 7) {
                          // Always show first page, last page, current page and pages around current
                        if (
                          pageNumber === 1 || 
                          pageNumber === pagination.totalPages || 
                          (pageNumber >= pagination.currentPage - 1 && pageNumber <= pagination.currentPage + 1)
                        ) {
                          return (
                            <button
                              key={pageNumber}
                              onClick={() => handlePageChange(pageNumber)}
                              className={`relative inline-flex items-center px-4 py-2 text-sm font-medium ${
                                isCurrentPage 
                                  ? 'bg-indigo-50 text-indigo-600 z-10' 
                                  : 'text-gray-500 hover:bg-gray-50'
                              }`}
                            >
                              {pageNumber}
                            </button>
                          );
                        } else if (
                          (pageNumber === 2 && pagination.currentPage > 3) ||
                          (pageNumber === pagination.totalPages - 1 && pagination.currentPage < pagination.totalPages - 2)
                        ) {
                          // Show ellipsis for skipped pages
                          return (
                            <span
                              key={`ellipsis-${pageNumber}`}
                              className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700"
                            >
                              ...
                            </span>
                          );
                        }
                        
                        return null;
                        } else {
                          // If fewer pages, show all page numbers
                          return (
                            <button
                              key={pageNumber}
                              onClick={() => handlePageChange(pageNumber)}
                              className={`relative inline-flex items-center px-4 py-2 text-sm font-medium ${
                                isCurrentPage 
                                  ? 'bg-indigo-50 text-indigo-600 z-10' 
                                  : 'text-gray-500 hover:bg-gray-50'
                              }`}
                            >
                              {pageNumber}
                            </button>
                          );
                        }
                      })}
                      
                      <button
                        onClick={() => handlePageChange(pagination.currentPage + 1)}
                        disabled={pagination.currentPage === pagination.totalPages}
                        className={`relative inline-flex items-center rounded-r-md px-2 py-2 ${
                          pagination.currentPage === pagination.totalPages
                            ? 'text-gray-300 cursor-not-allowed'
                            : 'text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        <FaChevronRight className="h-3 w-3" />
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
} 