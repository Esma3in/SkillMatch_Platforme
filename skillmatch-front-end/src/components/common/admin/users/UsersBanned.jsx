import {
  // ArrowLeftIcon,
  // ArrowRightIcon,
  CheckIcon,
  CornerUpLeftIcon,
  SearchIcon,
  XIcon,
  Trash2Icon,
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
import { toast } from "react-toastify";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../table";

const UsersBanned = () => {
 
  const [users,setUser] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");


  
  useEffect(() => {
  const fetchUsers = async () => {
    try {
      const response = await api.get('api/admin/UsersList');
      if (response.status !== 200) {
        throw new Error('Failed to fetch Users');
      }

      const rawData = await response.data;

      const formattedUsers = await Promise.all(rawData.map(async (item) => {
        let state = '';  // Default value

        // Fetch state based on user role (candidate or company)
        if (item.role === 'candidate') {
          const candidateResponse = await api.get(`api/admin/candidates/${item.id}`);
          state = candidateResponse.data.state || '';  // Get state from candidate
        } else if (item.role === 'company') {
          const companyResponse = await api.get(`api/admin/companies/${item.id}`);
          state = companyResponse.data.state || '';  // Get state from company
        }

        return {
          id: item.id,
          user_id : item.user_id,
          name: item.name || 'Unknown',
          email: item.email || 'noemail@example.com',
          date: new Date(item.created_at).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          }),
          role:item.role ,
          isBanned: state === 'banned',  // Set isBanned based on the fetched state
        };
      }));

      setUser(formattedUsers);

    } catch (error) {
      console.error("Error fetching Users:", error);
    }
  };

  fetchUsers();
}, []);

  
  async function updateState(user_id, newState) {
    try {
      // call your API
      await api.post('api/admin/Users/setstate', { user_id, state: newState });

      // optimistically update the UI
      setUser(prev =>
        prev.map(u =>
          u.id === user_id
            ? { ...u, state: newState }
            : u
        )
      );
    } catch (err) {
      console.error(err.response?.data || err);
      // you could show a toast here
    }
  }

  async function deleteUser(user_id) {
    try {
      if (window.confirm("Are you sure you want to delete this user permanently? This action cannot be undone.")) {
        await api.post('api/admin/Users/delete', { user_id });
        
        // Remove the user from the state
        setUser(prev => prev.filter(u => u.id !== user_id));
        toast.success("User deleted successfully");
      }
    } catch (err) {
      console.error(err.response?.data || err);
      toast.error("Failed to delete user");
    }
  }

  async function unbanUser(user_id) {
    try {
      await api.post('api/admin/Users/unban', { user_id });
      
      // Remove the user from the state since they're no longer banned
      setUser(prev => prev.filter(u => u.id !== user_id));
      toast.success("User unbanned successfully");
    } catch (err) {
      console.error(err.response?.data || err);
      toast.error("Failed to unban user");
    }
  }


  
  // Column headers
  const columns = [
    { key: "id", label: "ID User" },
    { key: "user", label: "User" },
    { key: "role", label: "Role" },
    { key: "email", label: "email" },
    { key: "date", label: "Date inscription" },
    { key: "details", label: "Details" },
    { key: "action", label: "Action" },
  ];


  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  //pagination 
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handlePageClick = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="w-full h-full">
      <div className="relative w-full h-full">
        <div className="relative h-full">
          {<div className="w-full h-full bg-white">
          <div className="flex justify-between items-center px-4 py-2">
              <h1 className="font-semibold text-2xl text-black font-['Inter',Helvetica] leading-5">
                All Users Banned
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
                            column.key === "user" ? "text-center" : ""
                          }`}
                        >
                          {column.label}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedUsers
                      .map(user => (
                        <TableRow
                          key={user.id}
                          className="border-b border-[#eaecf0]"
                        >
                          <TableCell className="h-[69.5px] px-6 py-3 font-text-sm-medium text-gray-900">
                            {user.id}
                          </TableCell>
                          <TableCell className="h-[69.5px] px-6 py-3">
                            <div className="flex items-center gap-3">
                              <Avatar className="w-8 h-8">
                                <AvatarFallback className="bg-primary-50 text-primary-600 text-sm font-medium">
                                  {user.name.substring(0, 2).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex flex-col">
                                <span className="font-text-sm-normal text-gray-900">
                                  {user.name}
                                </span>
                                <span className="font-text-sm-normal text-gray-500">
                                  {user.email}
                                </span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="h-[69.5px] px-6 py-3 font-text-sm-normal text-gray-600">
                            {user.role}
                          </TableCell>
                          <TableCell className="h-[69.5px] px-6 py-3 font-text-sm-normal text-gray-600">
                            {user.email}
                          </TableCell>
                          <TableCell className="h-[69.5px] px-6 py-3 font-text-sm-normal text-gray-600">
                            {user.date}
                          </TableCell>
                          <TableCell className="h-[69.5px] px-6 py-3 font-text-sm-normal text-gray-600">
                            <Badge className="w-[66px] h-6 bg-error-50 border-error-50 text-error-700 font-text-xs-medium rounded-2xl py-[2px] px-2">
                              Banned
                            </Badge>
                          </TableCell>
                          <TableCell className="h-[69.5px] px-6 py-3">
                            <div className="flex gap-2">
                              <button
                                onClick={() => unbanUser(user.id)}
                                className="w-[103px] h-10 bg-[#42cd2f26] text-[#1bea59] font-semibold text-base rounded-[10px]"
                              >
                                <div className="flex items-center justify-center gap-1">
                                  <CornerUpLeftIcon size={16} />
                                  <span>Unban</span>
                                </div>
                              </button>
                              <button
                                onClick={() => deleteUser(user.id)}
                                className="w-[103px] h-10 bg-[#ff0a0a26] text-[#ff0a0a] font-semibold text-base rounded-[10px]"
                              >
                                <div className="flex items-center justify-center gap-1">
                                  <Trash2Icon size={16} />
                                  <span>Delete</span>
                                </div>
                              </button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>

                <div className="flex justify-center items-center gap-2 py-3">
                  <Button
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                    className="px-4 py-2"
                  >
                    Prev
                  </Button>
                  {[...Array(totalPages)].map((_, i) => (
                    <Button
                      key={i}
                      onClick={() => handlePageClick(i + 1)}
                      className={`px-4 py-2 ${
                        currentPage === i + 1
                          ? "bg-primary-600 text-white"
                          : "bg-white text-gray-700 border border-gray-300"
                      }`}
                    >
                      {i + 1}
                    </Button>
                  ))}
                  <Button
                    onClick={handleNextPage}
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
    </div>
  );
};

export default UsersBanned;


