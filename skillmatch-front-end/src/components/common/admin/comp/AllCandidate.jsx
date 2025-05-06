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

  const [candidates,setCandidate] = useState([]);

  
  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const response = await api.get('api/admin/CanidatesList');
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
          state: item.state || 'waiting',
          date: new Date(item.created_at).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          }),
          isActive: false,
        }));
        
        setCandidate(formattedCandidates);
        
      } catch (error) {
        console.error("Error fetching candidates:", error);
      }
    };
    
    fetchCandidates();
  }, []);
  
  async function updateState(id,state){
    console.log(id)
    try{
      await api.post(`api/admin/CanidatesList/setstate/`,{id:id,state:state});
      window.location.reload()
    }catch(err){
        console.log(err)
      }

  }
  
  // Column headers
  const columns = [
    { key: "id", label: "ID Candidate" },
    { key: "candidate", label: "Candidat" },
    { key: "state", label: "State" },
    { key: "date", label: "Date inscription" },
    { key: "details", label: "Details" },
    { key: "action", label: "Action" },
  ];

  return (
    <div className="w-full h-full">
      <div className="relative w-full h-full">
        <div className="relative h-full">
          {/* <div className="w-full h-full bg-white">
          <div className="flex justify-between items-center px-10 py-8">
              <h1 className="font-semibold text-2xl text-black font-['Inter',Helvetica] leading-5">
                All candidats
              </h1>
              <div className="relative w-[644px] h-8">
                <div className="relative w-full h-full flex items-center bg-white rounded-md overflow-hidden border border-solid border-[#dde1e3]">
                  <SearchIcon className="w-6 h-6 ml-1" />
                  <Input
                    className="border-0 h-full pl-2 text-mid-gray-mid-gray-4 font-UI-UI-text-14-reg"
                    placeholder="Search"
                  />
                </div>
              </div>
            </div>
          </div> */}

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
                    {candidates.map((candidate, index) => (
                      <TableRow
                        key={index}
                        className="border-b border-[#eaecf0]"
                      >
                        <TableCell className="h-[72px] px-6 py-4 font-text-sm-medium text-gray-900">
                          {candidate.id}
                        </TableCell>
                        <TableCell className="h-[72px] px-6 py-4">
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
                        <TableCell className="h-[72px] px-6 py-4">
                          {candidate.state === "active" && (
                            <Badge className="bg-success-50 text-[#1bea59] rounded-2xl flex items-center gap-1 pl-1.5 pr-2 py-0.5 font-text-xs-medium">
                              <CheckIcon className="w-3 h-3" />
                              Active
                            </Badge>
                          )}
                          {candidate.state === "waiting" && (
                            <Badge className="bg-gray-100 text-gray-700 rounded-2xl flex items-center gap-1 pl-1.5 pr-2 py-0.5 font-text-xs-medium">
                              <CornerUpLeftIcon className="w-3 h-3" />
                              Waiting
                            </Badge>
                          )}
                          {candidate.state === "inactive" && (
                            <Badge className="bg-error-50 text-[#ff0a0a] rounded-2xl flex items-center gap-1 pl-1.5 pr-2 py-0.5 font-text-xs-medium">
                              <XIcon className="w-3 h-3" />
                              unActive
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="h-[72px] px-6 py-4 font-text-sm-normal text-gray-500">
                          {candidate.date}
                        </TableCell>
                        <TableCell className="h-[72px] px-6 py-4">
                          <Button className="w-[103px] h-10 bg-[#0a84ff26] text-[#0a84ff] font-semibold text-base rounded-[10px]">
                            Details
                          </Button>
                        </TableCell>
                        <TableCell className="h-[72px] px-6 py-4">
                          <div className="flex justify-between">
                          <button onClick={() => updateState(candidate.id, candidate.isActive ? "ACTIVE" : "UNACTIVE")}
                                variant="outline" className={`w-[103px] h-10 ${candidate.isActive ? "bg-[#42cd2f26] text-[#1bea59] border-none" : "bg-white text-[#ff0a0a] border-[#ff0a0a]"} font-semibold text-base rounded-[10px]`}>
                                {candidate.isActive ? "ACTIVE" : "UNACTIVE"}
                          </button>
                          <button onClick={() => updateState(candidate.id,'BANNED')} className="w-[103px] h-10 bg-[#ff0a0a26] text-[#ff0a0a] font-semibold text-base rounded-[10px]">
                            BAN
                          </button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {/* <div className="flex items-center justify-between pt-3 pb-4 px-6 border-t border-[#eaecf0]">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          href="#"
                          className="inline-flex items-center justify-center gap-2 px-3.5 py-2 bg-white rounded-lg border border-solid border-[#cfd4dc] shadow-shadow-xs text-gray-700 font-medium text-sm"
                        >
                          <ArrowLeftIcon className="w-5 h-5" />
                          Previous
                        </PaginationPrevious>
                      </PaginationItem>

                      <PaginationItem>
                        <PaginationLink
                          href="#"
                          className="w-10 h-10 flex items-center justify-center bg-primary-50 rounded-lg text-primary-600 font-medium text-sm"
                          isActive
                        >
                          1
                        </PaginationLink>
                      </PaginationItem>

                      <PaginationItem>
                        <PaginationLink
                          href="#"
                          className="w-10 h-10 flex items-center justify-center rounded-lg text-gray-500 font-medium text-sm"
                        >
                          2
                        </PaginationLink>
                      </PaginationItem>

                      <PaginationItem>
                        <PaginationLink
                          href="#"
                          className="w-10 h-10 flex items-center justify-center rounded-lg text-gray-500 font-medium text-sm"
                        >
                          3
                        </PaginationLink>
                      </PaginationItem>

                      <PaginationItem>
                        <PaginationEllipsis className="w-10 h-10 flex items-center justify-center rounded-lg text-gray-500 font-medium text-sm" />
                      </PaginationItem>

                      <PaginationItem>
                        <PaginationLink
                          href="#"
                          className="w-10 h-10 flex items-center justify-center rounded-lg text-gray-500 font-medium text-sm"
                        >
                          8
                        </PaginationLink>
                      </PaginationItem>

                      <PaginationItem>
                        <PaginationLink
                          href="#"
                          className="w-10 h-10 flex items-center justify-center rounded-lg text-gray-500 font-medium text-sm"
                        >
                          9
                        </PaginationLink>
                      </PaginationItem>

                      <PaginationItem>
                        <PaginationLink
                          href="#"
                          className="w-10 h-10 flex items-center justify-center rounded-lg text-gray-500 font-medium text-sm"
                        >
                          10
                        </PaginationLink>
                      </PaginationItem>

                      <PaginationItem>
                        <PaginationNext
                          href="#"
                          className="inline-flex items-center justify-center gap-2 px-3.5 py-2 bg-white rounded-lg border border-solid border-[#cfd4dc] shadow-shadow-xs text-gray-700 font-medium text-sm"
                        >
                          Next
                          <ArrowRightIcon className="w-5 h-5" />
                        </PaginationNext>
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div> */}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllCandidate ;