import {
  // ArrowLeftIcon,
  // ArrowRightIcon,
  CheckIcon,
  CornerUpLeftIcon,
  SearchIcon,
  XIcon,
  Trash2Icon,
} from "lucide-react";
import api from "../../../../api/axios";

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
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    fetchBannedUsers();
  }, []);

  const fetchBannedUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/admin/UsersList');
      
      if (response.status !== 200) {
        throw new Error('Failed to fetch banned users');
      }

      const bannedUsers = response.data;
      
      // Format user data for display, extracting information from candidates and companies tables
      const formattedUsers = bannedUsers.map(user => {
        // Extract information based on the user role
        let userData = {
          id: user.id,
          role: user.role,
        };
        
        if (user.role === 'candidate' && user.candidate) {
          // Get information from candidate table
          userData = {
            ...userData,
            name: user.candidate.name || 'Unknown',
            email: user.candidate.email || user.email || 'noemail@example.com',
            candidateId: user.candidate.id,
            avatar: user.candidate.image || null,
            date: new Date(user.candidate.created_at || user.created_at).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            }),
          };
        } else if (user.role === 'company' && user.company) {
          // Get information from company table
          userData = {
            ...userData,
            name: user.company.name || 'Unknown',
            email: user.company.email || user.email || 'noemail@example.com',
            companyId: user.company.id,
            avatar: user.company.logo || null,
            date: new Date(user.company.created_at || user.created_at).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            }),
          };
        } else {
          // Fallback to user table if no related data
          userData = {
            ...userData,
            name: user.name || 'Unknown',
            email: user.email || 'noemail@example.com',
            date: new Date(user.created_at).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            }),
          };
        }
        
        return userData;
      });

      setUsers(formattedUsers);
    } catch (error) {
      console.error("Error fetching banned users:", error);
      toast.error("Failed to load banned users");
    } finally {
      setLoading(false);
    }
  };

  async function deleteUser(userId) {
    try {
      if (window.confirm("Are you sure you want to delete this user permanently? This action cannot be undone.")) {
        await api.post('/admin/Users/delete', { user_id: userId });
        
        // Remove the user from the state
        setUsers(prev => prev.filter(user => user.id !== userId));
        toast.success("User deleted successfully");
      }
    } catch (err) {
      console.error(err.response?.data || err);
      toast.error("Failed to delete user");
    }
  }

  async function unbanUser(userId) {
    try {
      await api.post('/admin/Users/unban', { user_id: userId });
      
      // Remove the user from the state since they're no longer banned
      setUsers(prev => prev.filter(user => user.id !== userId));
      toast.success("User unbanned successfully");
    } catch (err) {
      console.error(err.response?.data || err);
      toast.error("Failed to unban user");
    }
  }

  // Column headers
  const columns = [
    { key: "id", label: "ID" },
    { key: "user", label: "User" },
    { key: "role", label: "Role" },
    { key: "email", label: "Email" },
    { key: "date", label: "Date Inscription" },
    { key: "status", label: "Status" },
    { key: "actions", label: "Actions" },
  ];

  // Filter users based on search term
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Paginate the filtered users
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  return (
    <div className="w-full h-full">
      <div className="flex justify-between items-center px-4 py-5">
        <h1 className="font-semibold text-2xl text-black font-['Inter',Helvetica]">Banned Users</h1>
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
          {loading ? (
            <div className="flex justify-center items-center p-10">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : (
            <>
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
                  {paginatedUsers.length > 0 ? (
                    paginatedUsers.map(user => (
                      <TableRow key={user.id} className="border-b border-[#eaecf0]">
                        <TableCell className="px-6 py-4">{user.id}</TableCell>
                        <TableCell className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="w-8 h-8">
                              {user.avatar ? (
                                <AvatarImage src={user.avatar} alt={user.name} />
                              ) : (
                                <AvatarFallback className="bg-primary-50 text-primary-600 text-sm font-medium">
                                  {user.name.substring(0, 2).toUpperCase()}
                                </AvatarFallback>
                              )}
                            </Avatar>
                            <div className="flex flex-col">
                              <span className="text-gray-900">{user.name}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="px-6 py-4 capitalize">{user.role}</TableCell>
                        <TableCell className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="text-gray-500">{user.email}</span>
                          </div>
                        </TableCell>
                        <TableCell className="px-6 py-4 text-gray-500">{user.date}</TableCell>
                        <TableCell className="px-6 py-4">
                          <Badge className="bg-red-100 text-red-700 rounded-2xl flex items-center gap-1 pl-1.5 pr-2 py-0.5">
                            <XIcon className="w-3 h-3" />
                            Banned
                          </Badge>
                        </TableCell>
                        <TableCell className="px-6 py-4">
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
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={columns.length} className="text-center py-8 text-gray-500">
                        No banned users found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>

              {filteredUsers.length > itemsPerPage && (
                <div className="flex justify-center items-center gap-2 px-10 py-4">
                  <Button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
                    Prev
                  </Button>
                  {Array.from({ length: totalPages }, (_, i) => (
                    <Button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`px-6 py-4 ${
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
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UsersBanned;


