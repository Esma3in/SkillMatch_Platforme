import {
  // ArrowLeftIcon,
  // ArrowRightIcon,
  CheckIcon,
  CornerUpLeftIcon,
  SearchIcon,
  XIcon,
} from "lucide-react";
import { api } from "../../../../api/api";

import React, { useState , useEffect} from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../avatar";
import { Badge } from "../badge";
import { Button } from "../button";
import { Card, CardContent } from "../card";
import { Input } from "../input";
// import {
//   Pagination,
//   PaginationContent,
//   PaginationEllipsis,
//   PaginationItem,
//   PaginationLink,
//   PaginationNext,
//   PaginationPrevious,
// } from "./pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../table";
import UserDetailModal from "./UserDetailModal";

const AllCandidate = () => {
  // Data for candidates
  // const candidates = [
  //   {
  //     id: "#306685",
  //     name: "jack",
  //     email: "olivia@untitledui.com",
  //     avatar: "/avatar-1.svg",
  //     avatarFallback: null,
  //     state: "active",
  //     date: "Jan 6, 2022",
  //     isActive: false,
  //   },
  //   {
  //     id: "#306585",
  //     name: "Phoenix Baker",
  //     email: "phoenix@untitledui.com",
  //     avatar: "/avatar-2.svg",
  //     avatarFallback: null,
  //     state: "active",
  //     date: "Jan 6, 2022",
  //     isActive: false,
  //   },
  //   {
  //     id: "#306485",
  //     name: "Lana Steiner",
  //     email: "lana@untitledui.com",
  //     avatar: null,
  //     avatarFallback: "LS",
  //     state: "active",
  //     date: "Jan 6, 2022",
  //     isActive: false,
  //   },
  //   {
  //     id: "#306385",
  //     name: "Demi Wilkinson",
  //     email: "demi@untitledui.com",
  //     avatar: null,
  //     avatarFallback: "DW",
  //     state: "active",
  //     date: "Jan 5, 2022",
  //     isActive: false,
  //   },
  //   {
  //     id: "#30628",
  //     name: "Candice Wu",
  //     email: "candice@untitledui.com",
  //     avatar: "/avatar-5.svg",
  //     avatarFallback: null,
  //     state: "waiting",
  //     date: "Jan 5, 2022",
  //     isActive: true,
  //   },
  //   {
  //     id: "#306185",
  //     name: "Natali Craig",
  //     email: "natali@untitledui.com",
  //     avatar: null,
  //     avatarFallback: "NC",
  //     state: "active",
  //     date: "Jan 5, 2022",
  //     isActive: false,
  //   },
  //   {
  //     id: "#306085",
  //     name: "Drew Cano",
  //     email: "drew@untitledui.com",
  //     avatar: "/avatar.svg",
  //     avatarFallback: null,
  //     state: "inactive",
  //     date: "Jan 4, 2022",
  //     isActive: true,
  //   },
  //   {
  //     id: "#305985",
  //     name: "Orlando Diggs",
  //     email: "orlando@untitledui.com",
  //     avatar: "/avatar-4.svg",
  //     avatarFallback: null,
  //     state: "active",
  //     date: "Jan 3, 2022",
  //     isActive: false,
  //   },
  //   {
  //     id: "#305885",
  //     name: "Andi Lane",
  //     email: "andi@untitledui.com",
  //     avatar: "/avatar-6.svg",
  //     avatarFallback: null,
  //     state: "active",
  //     date: "Jan 3, 2022",
  //     isActive: false,
  //   },
  //   {
  //     id: "#308557",
  //     name: "Kate Morrison",
  //     email: "kate@untitledui.com",
  //     avatar: "/avatar-3.svg",
  //     avatarFallback: null,
  //     state: "active",
  //     date: "Jan 3, 2022",
  //     isActive: false,
  //   },
  // ];

  const [candidates, setCandidate] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [loading, setLoading] = useState(false);
  const itemsPerPage = 8;

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const response = await api.get('/admin/CanidatesList');
        if (response.status !== 200) {
          throw new Error('Failed to fetch candidates');
        }
        
        const rawData = await response.data;
  
        const formattedCandidates = rawData.map((item, index) => ({
          id: item.id,
          name: item.name || 'Unknown',
          email: item.email || 'noemail@example.com',
          avatar: item.avatar || `/avatar-${(index % 5) + 1}.svg`,
          avatarFallback: null,
          state: item.state,
          date: new Date(item.created_at).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          }),
          isActive: (item.state || '') === 'active',}));
        
        setCandidate(formattedCandidates);
        
      } catch (error) {
        console.error("Error fetching candidates:", error);
      }
    };
    
    fetchCandidates();
  }, []);
  
  async function updateState(id, newState) {
    try {
      // call your API
      await api.post('/admin/CanidatesList/setstate', { id, state: newState });

      // optimistically update the UI
      setCandidate(prev =>
        prev.map(c =>
          c.id === id
            ? { ...c, state: newState }
            : c
        )
      );
    } catch (err) {
      console.error(err.response?.data || err);
      // you could show a toast here
    }
  }

  const handleViewDetails = async (candidateId) => {
    try {
      setLoading(true);
      const response = await api.get(`/admin/candidates/${candidateId}`);
      
      if (response.status === 200) {
        // Merge the detailed data with the basic candidate data
        const basicInfo = candidates.find(c => c.id === candidateId);
        const detailedData = response.data;
        
        // Combine the data, giving preference to detailed data
        const combinedData = {
          ...basicInfo,
          ...detailedData,
          // Make sure these fields from the basic info are preserved
          avatar: basicInfo.avatar,
          date: basicInfo.date,
          state: basicInfo.state
        };
        
        setSelectedCandidate(combinedData);
        setIsModalOpen(true);
      }
    } catch (error) {
      console.error("Error fetching candidate details:", error);
      // Fallback to basic info if detailed fetch fails
      const basicInfo = candidates.find(c => c.id === candidateId);
      setSelectedCandidate(basicInfo);
      setIsModalOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCandidate(null);
  };

  // Column headers
  const columns = [
    { key: "id", label: "ID Candidate" },
    { key: "candidate", label: "Candidat" },
    { key: "state", label: "State" },
    { key: "date", label: "Date inscription" },
    { key: "details", label: "Details" },
    { key: "action", label: "Action" },
  ];

  const filteredCandidates = candidates.filter(candidate =>
    candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    candidate.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  //pagination 
  const totalPages = Math.ceil(filteredCandidates.length / itemsPerPage) || 1;

  const paginatedCandidates = filteredCandidates.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="w-full h-full">
      <div className="relative w-full h-full">
        <div className="relative h-full">
          {<div className="w-full h-full bg-white">
          <div className="flex justify-between items-center px-4 py-2">
              <h1 className="font-semibold text-2xl text-black font-['Inter',Helvetica] leading-5">
                All candidats
              </h1>
              <div className="relative w-[644px] h-8">
                <div className="relative w-full h-full flex items-center bg-white rounded-md overflow-hidden border border-solid border-[#dde1e3]">
                  <SearchIcon className="w-6 h-6 ml-1" />
                  <Input
                    className="border-0 h-full pl-2 text-mid-gray-mid-gray-4 font-UI-UI-text-14-reg"
                    placeholder="Search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>}

          <div className="">
          <Card className="border border-solid border-[#eaecf0] shadow-shadow-md rounded-lg overflow-hidden">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      {columns.map((column) => (
                        <TableHead
                          key={column.key}
                          className={`h-11 px-6 py-3 text-xs font-medium text-gray-500 ${
                            column.key === "candidate" ? "text-center" : ""
                          }`}
                        >
                          {column.label}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedCandidates
                      .filter(candidate => candidate.state !== 'banned')
                      .map(candidate => (
                        <TableRow
                          key={candidate.id}
                          className="border-b border-[#eaecf0]"
                        >
                          <TableCell className="h-[69.5px] px-3 py-3 font-text-sm-medium text-gray-900 text-center">
                            {candidate.id}
                          </TableCell>
                          <TableCell className="h-[69.5px] px-3 py-3">
                            <div className="flex items-center gap-3">
                              <Avatar className="w-8 h-8">
                                {candidate.avatar ? (
                                  <AvatarImage
                                    src={candidate.avatar}
                                    alt={candidate.name}
                                    className="rounded-[200px]"
                                  />
                                ) : null}
                                {candidate.avatarFallback ? (
                                  <AvatarFallback className="bg-primary-50 text-primary-600 text-sm font-medium">
                                    {candidate.avatarFallback}
                                  </AvatarFallback>
                                ) : null}
                              </Avatar>
                              <div className="flex flex-col">
                                <span className="font-text-sm-normal text-gray-900">
                                  {candidate.name}
                                </span>
                                <span className="font-text-sm-normal text-gray-500">
                                  {candidate.email}
                                </span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="h-[69.5px] px-3 py-3 text-center">
                            {candidate.state === "active" && (
                              <Badge className="bg-green-100 text-[#39f170] rounded-2xl flex items-center gap-1 pl-1.5 pr-2 py-0.5 font-text-xs-medium">
                                <CheckIcon className="w-3 h-3" />
                                Active
                              </Badge>
                            )}
                            {candidate.state === "unactive" && (
                              <Badge className="bg-red-100 text-[#ff0a0a] rounded-2xl flex items-center gap-1 pl-1.5 pr-2 py-0.5 font-text-xs-medium">
                                <XIcon className="w-3 h-3" />
                                unActive
                              </Badge>
                            )}
                            {candidate.state === "waiting" && (
                              <Badge className="bg-gray-100 text-gray-700 rounded-2xl flex items-center gap-1 pl-1.5 pr-2 py-0.5 font-text-xs-medium">
                                <CornerUpLeftIcon className="w-3 h-3" />
                                Waiting
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="h-[69.5px] px-3 py-3 font-text-sm-normal text-gray-500">
                            {candidate.date}
                          </TableCell>
                          <TableCell className="h-[69.5px] px-3 py-3">
                            <Button 
                              className="w-[103px] h-10 bg-[#0a84ff26] text-[#0a84ff] font-semibold text-base rounded-[10px]"
                              onClick={() => handleViewDetails(candidate.id)}
                              disabled={loading}
                            >
                              {loading && selectedCandidate?.id === candidate.id ? 'Loading...' : 'Details'}
                            </Button>
                          </TableCell>
                          <TableCell className="h-[69.5px] px-3 py-3">
                            <div className="flex gap-2">
                              <button
                                onClick={() =>
                                  updateState(
                                    candidate.id,
                                    candidate.state === 'active' ? 'unactive' : 'active'
                                  )
                                }
                                className={`
                                  w-[103px] h-10 font-semibold text-base rounded-[10px] border
                                  ${candidate.state === 'active'
                                    ? 'bg-[#ff0a0a26] text-[#ff0a0a] border-none'
                                    : 'bg-[#42cd2f26] text-[#1bea59] border-none'
                                  }
                                `}
                              >
                                {candidate.state === 'active' ? 'desactivate' : 'activate'}
                              </button>
                              <button
                                onClick={() => updateState(candidate.id, 'banned')}
                                className="w-[103px] h-10 bg-[#ff0a0a26] text-[#ff0a0a] font-semibold text-base rounded-[10px]"
                              >
                                Ban
                              </button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>

                <div className="flex justify-center items-center gap-2 py-1 ">
                  <Button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2"
                  >
                    Prev
                  </Button>

                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    // Show pages around current page
                    const pageToShow = currentPage > 3 && totalPages > 5
                      ? i + currentPage - 2
                      : i + 1;
                    
                    // Don't show pages beyond the total
                    if (pageToShow <= totalPages) {
                      return (
                        <Button
                          key={pageToShow}
                          onClick={() => setCurrentPage(pageToShow)}
                          className={`px-4 py-2 ${
                            currentPage === pageToShow ? "bg-blue-500 text-white" : "bg-white"
                          }`}
                        >
                          {pageToShow}
                        </Button>
                      );
                    }
                    return null;
                  })}

                  <Button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2"
                  >
                    Next
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* User Detail Modal */}
      <UserDetailModal 
        isOpen={isModalOpen}
        onClose={closeModal}
        userData={selectedCandidate}
        userType="candidate"
      />
    </div>
  );
};

export default AllCandidate;