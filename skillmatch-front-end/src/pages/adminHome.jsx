import React, { useEffect, useState } from "react";
import api from "../api/axios";
import Sidebar from "../components/common/sideBars/sidebarPlatforme";
import NavbarAdmin from "../components/common/navbarAdmin";
import { useNavigate } from "react-router-dom";
import { 
  FaUsers, 
  FaBuilding, 
  FaUserTie, 
  FaCode, 
  FaUserLock, 
  FaTrophy, 
  FaPlus, 
  FaList, 
  FaBan, 
  FaChartBar,
  FaClipboardList
} from "react-icons/fa";

export default function AdminHome() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCompanies: 0,
    totalCandidates: 0,
    totalProblems: 0,
    bannedUsers: 0,
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch statistics
    const fetchStats = async () => {
      setIsLoading(true);
      try {
        // Fetch real statistics from backend
        const [usersStats, problemsCount, recentActivityData] = await Promise.all([
          api.get('/admin/stats/users'),
          api.get('/admin/stats/problems'),
          api.get('/admin/recent-activity')
        ]);
        
        // Update stats with real data
        setStats({
          totalUsers: usersStats.data.totalUsers || 0,
          totalCompanies: usersStats.data.totalCompanies || 0,
          totalCandidates: usersStats.data.totalCandidates || 0,
          totalProblems: problemsCount.data.total || 0,
          bannedUsers: usersStats.data.bannedUsers || 0,
        });
        
        // Use real activity data if available
        if (recentActivityData.data && Array.isArray(recentActivityData.data)) {
          // Reverse the array to display activities in ascending order (oldest first)
          setRecentActivity([...recentActivityData.data].reverse());
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching admin stats:", error);
        
        // Fallback to sample data if API calls fail
        setStats({
          totalUsers: 0,
          totalCompanies: 0,
          totalCandidates: 0,
          totalProblems: 0,
          bannedUsers: 0,
        });
        
        setRecentActivity([]);
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);
  
  // Action card items
  const actionItems = [
    { 
      title: "Manage Companies", 
      icon: <FaBuilding className="text-blue-500" />, 
      description: "View and manage company accounts",
      action: () => navigate("/admin/companiesList"),
      color: "bg-blue-50 hover:bg-blue-100",
      iconBg: "bg-blue-100"
    },
    { 
      title: "Manage Candidates", 
      icon: <FaUserTie className="text-green-500" />, 
      description: "View and manage candidate accounts",
      action: () => navigate("/admin/candidatesList"),
      color: "bg-green-50 hover:bg-green-100",
      iconBg: "bg-green-100"
    },
    { 
      title: "Banned Users", 
      icon: <FaBan className="text-red-500" />, 
      description: "Manage banned users",
      action: () => navigate("/admin/banUsers"),
      color: "bg-red-50 hover:bg-red-100",
      iconBg: "bg-red-100"
    },
    { 
      title: "Manage Problems", 
      icon: <FaCode className="text-purple-500" />, 
      description: "View and edit coding problems",
      action: () => navigate("/training/problems"),
      color: "bg-purple-50 hover:bg-purple-100",
      iconBg: "bg-purple-100"
    },
    { 
      title: "Add New Problem", 
      icon: <FaPlus className="text-indigo-500" />, 
      description: "Create a new coding challenge",
      action: () => navigate("/manage/addLeetcodeProblem"),
      color: "bg-indigo-50 hover:bg-indigo-100",
      iconBg: "bg-indigo-100"
    },
    { 
      title: "Manage Challenges", 
      icon: <FaTrophy className="text-amber-500" />, 
      description: "View and edit challenge series",
      action: () => navigate("/training/challenges"),
      color: "bg-amber-50 hover:bg-amber-100",
      iconBg: "bg-amber-100"
    },
    // { 
    //   title: "User Statistics", 
    //   icon: <FaChartBar className="text-cyan-500" />, 
    //   description: "View user performance metrics",
    //   action: () => navigate("/admin/usersPerformance"),
    //   color: "bg-cyan-50 hover:bg-cyan-100",
    //   iconBg: "bg-cyan-100"
    // },
    { 
      title: "Documents", 
      icon: <FaClipboardList className="text-gray-500" />, 
      description: "Manage user documents",
      action: () => navigate("/documents/companies"),
      color: "bg-gray-50 hover:bg-gray-100",
      iconBg: "bg-gray-100"
    }
  ];

  // Stat card items
  const statItems = [
    { 
      title: "Total Users", 
      value: stats.totalUsers, 
      icon: <FaUsers className="text-blue-500" />,
      color: "bg-blue-50",
      textColor: "text-blue-800"
    },
    { 
      title: "Companies", 
      value: stats.totalCompanies, 
      icon: <FaBuilding className="text-indigo-500" />,
      color: "bg-indigo-50",
      textColor: "text-indigo-800"
    },
    { 
      title: "Candidates", 
      value: stats.totalCandidates, 
      icon: <FaUserTie className="text-green-500" />,
      color: "bg-green-50",
      textColor: "text-green-800"
    },
    { 
      title: "Coding Problems", 
      value: stats.totalProblems, 
      icon: <FaCode className="text-purple-500" />,
      color: "bg-purple-50",
      textColor: "text-purple-800"
    },
    { 
      title: "Banned Users", 
      value: stats.bannedUsers, 
      icon: <FaUserLock className="text-red-500" />,
      color: "bg-red-50",
      textColor: "text-red-800"
    }
  ];

  // Function to render activity icon based on type
  const getActivityIcon = (type) => {
    switch(type) {
      case 'user_joined':
        return <FaUserTie className="text-green-500" />;
      case 'company_joined':
        return <FaBuilding className="text-blue-500" />;
      case 'problem_added':
        return <FaCode className="text-purple-500" />;
      case 'user_banned':
        return <FaBan className="text-red-500" />;
      case 'challenge_completed':
        return <FaTrophy className="text-amber-500" />;
      default:
        return <FaClipboardList className="text-gray-500" />;
    }
  };

  return (
    <>
      <NavbarAdmin />
      <div className='flex'>
        {/* <Sidebar className='inline' /> */}
        <div className="flex-1 p-8 bg-gray-50 min-h-screen">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>
          
          {/* Stats Overview */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Platform Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {statItems.map((item, index) => (
                <div 
                  key={index} 
                  className={`${item.color} rounded-lg p-4 shadow-sm border border-gray-200`}
                >
                  <div className="flex items-center mb-2">
                    <div className={`p-2 rounded-full ${item.color}`}>
                      {item.icon}
                    </div>
                    <h3 className="ml-2 font-medium text-gray-700">{item.title}</h3>
                  </div>
                  <p className={`text-2xl font-bold ${item.textColor}`}>{isLoading ? '-' : item.value}</p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Quick Actions */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {actionItems.map((item, index) => (
                <div 
                  key={index} 
                  className={`${item.color} rounded-lg p-4 shadow-sm cursor-pointer border border-gray-200 transition-all duration-200`}
                  onClick={item.action}
                >
                  <div className="flex items-center mb-2">
                    <div className={`p-2 rounded-full ${item.iconBg}`}>
                      {item.icon}
                    </div>
                    <h3 className="ml-2 font-medium text-gray-800">{item.title}</h3>
                  </div>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Recent Activity */}
          <div>
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Recent Activity</h2>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              {isLoading ? (
                <div className="flex justify-center items-center p-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
                </div>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {recentActivity.map((activity, index) => (
                    <li key={index} className="p-4 hover:bg-gray-50">
                      <div className="flex items-center">
                        <div className="p-2 rounded-full bg-gray-100">
                          {getActivityIcon(activity.type)}
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-800">
                            {activity.type === 'user_joined' && `New candidate joined: ${activity.user}`}
                            {activity.type === 'company_joined' && `New company registered: ${activity.company}`}
                            {activity.type === 'problem_added' && `New problem added: ${activity.title} (${activity.difficulty})`}
                            {activity.type === 'user_banned' && `User banned: ${activity.user} - ${activity.reason}`}
                            {activity.type === 'challenge_completed' && `${activity.user} completed challenge: ${activity.challenge}`}
                          </p>
                          <p className="text-xs text-gray-500">{activity.time}</p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}