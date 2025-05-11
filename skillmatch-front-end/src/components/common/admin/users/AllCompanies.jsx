import {
  CheckIcon,
  CornerUpLeftIcon,
  SearchIcon,
  XIcon,
} from "lucide-react";
import { api } from "../../../../api/api";

import React, { useState, useEffect } from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../avatar";
import { Badge } from "../badge";
import { Button } from "../button";
import { Card, CardContent } from "../card";
import { Input } from "../input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../table";

const AllCompanies = () => {
  const [companies, setCompany] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;


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

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await api.get('api/admin/CompaniesList');
        if (response.status !== 200) throw new Error('Failed to fetch companies');

        const rawData = response.data;

        const formattedCompanies = rawData.map((item, index) => ({
          id: item.id,
          name: item.name || 'Unknown',
          email: item.email || 'noemail@example.com',
          sector: item.sector || 'N/A',
          logo: item.logo || `/avatar-${(index % 5) + 1}.svg`,
          avatarFallback: 'IMG',
          state: item.state,
          date: new Date(item.created_at).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          }),
        }));

        setCompany(formattedCompanies);
      } catch (error) {
        console.error("Error fetching companies:", error);
      }
    };

    fetchCompanies();
  }, []);

  async function updateState(id, newState) {
      try {
        // call your API
        await api.post('api/admin/CompaniesList/setstate', { id, state: newState });
  
        // optimistically update the UI
        setCompany(prev =>
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

  const columns = [
    { key: "id", label: "ID company" },
    { key: "logo", label: "Logo" },
    { key: "company", label: "Company" },
    { key: "email", label: "Email" },
    { key: "sector", label: "Sector" },
    { key: "state", label: "State" },
    { key: "date", label: "Date inscription" },
    { key: "details", label: "Details" },
    { key: "action", label: "Action" },
  ];

  const filteredCompanies = companies
    .filter(company => company.state !== 'banned')
    .filter(company =>
      company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const totalPages = 9;
  const paginatedCompanies = filteredCompanies.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="w-full h-full">
      <div className="flex justify-between items-center px-4 py-2">
        <h1 className="font-semibold text-2xl text-black font-['Inter',Helvetica]">All Companies</h1>
        <div className="relative w-[644px] h-8">
          <div className="flex items-center bg-white border border-[#dde1e3] rounded-md overflow-hidden">
            <SearchIcon className="w-6 h-6 ml-1" />
            <Input
              className="border-0 h-full pl-2"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <Card className="border border-[#eaecf0] shadow-md rounded-lg overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                {columns.map(column => (
                  <TableHead key={column.key} className="h-11 px-6 py-3 text-xs font-medium text-gray-500">
                    {column.label}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedCompanies.map(company => (
                <TableRow key={company.id} className="border-b border-[#eaecf0]">
                  <TableCell className="px-6 py-4">{company.id}</TableCell>
                  <TableCell className="px-6 py-4">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={company.logo} alt={company.name} className="rounded-full" />
                      <AvatarFallback>{company.avatarFallback}</AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-gray-900">{company.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <div className="flex flex-col">
                       <span className="text-gray-500">{company.email}</span>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4">{company.sector}</TableCell>
                  <TableCell className="h-[69.5px] px-3 py-3 text-center">
                    {company.state === "active" && (
                      <Badge className="bg-green-100 text-[#39f170] rounded-2xl flex items-center gap-1 pl-1.5 pr-2 py-0.5 font-text-xs-medium">
                        <CheckIcon className="w-3 h-3" />
                        Active
                      </Badge>
                    )}
                    {company.state === "unactive" && (
                      <Badge className="bg-red-100 text-[#ff0a0a] rounded-2xl flex items-center gap-1 pl-1.5 pr-2 py-0.5 font-text-xs-medium">
                        <XIcon className="w-3 h-3" />
                        unActive
                      </Badge>
                    )}
                    {company.state === "waiting" && (
                      <Badge className="bg-gray-100 text-gray-700 rounded-2xl flex items-center gap-1 pl-1.5 pr-2 py-0.5 font-text-xs-medium">
                        <CornerUpLeftIcon className="w-3 h-3" />
                        Waiting
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-gray-500">{company.date}</TableCell>
                  <TableCell className="px-6 py-4">
                    <Button className="w-[103px] h-10 bg-[#0a84ff26] text-[#0a84ff] font-semibold text-base rounded-[10px]">
                      Details
                    </Button>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <div className="flex gap-2">
                        <button
                            onClick={() =>
                                updateState(
                                company.id,
                                company.state === 'active' ? 'unactive' : 'active'
                                )
                            }
                            className={`
                                w-[103px] h-10 font-semibold text-base rounded-[10px] border
                                ${company.state === 'active'
                                ? 'bg-white text-[#ff0a0a] border-[#ff0a0a]'
                                : 'bg-[#42cd2f26] text-[#1bea59] border-none'
                                }
                            `}
                            >
                            {company.state === 'active' ? 'desactivate' : 'activate'}
                            </button>
                            <button
                            onClick={() => updateState(company.id, 'banned')}
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

          <div className="flex justify-center items-center gap-2">
            <Button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
              Prev
            </Button>
            {Array.from({ length: totalPages }, (_, i) => (
              <Button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-4 py-2 ${
                  currentPage === i + 1 ? 'bg-blue-500 text-white' : 'bg-white'
                }`}
              >
                {i + 1}
              </Button>
            ))}
            <Button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>
              Next
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AllCompanies;
