import React from 'react';
import { Home,BriefcaseBusiness, BarChart2, Users, User, Settings, LogOut, PieChart } from 'lucide-react';

export default function Sidebar() {
  return (
    <div className="w-64 min-h-screen bg-white border-r p-4 flex flex-col justify-between">
      <div>
      <button className="w-full bg-indigo-600 text-white py-2 rounded-lg font-bold mb-6 text-lg" disabled>
          welcome admin
      </button>
        <ul className="space-y-5">
          <div className="text-xs text-gray-400 mt-6 mb-2 tracking-wide m-3">PLATFORME ANALYTICS</div>
          <li className="flex items-center space-x-2 text-black font-semibold shadow-sm m-3 pb-5">
            <BarChart2 size={18} />
            <span >Performance</span>
          </li>

          <div className="text-xs text-gray-400 mt-6 mb-2 tracking-wide m-3">USERS ANALYTICS</div>
          <li className="flex items-center justify-between m-3">
            <div className="flex items-center space-x-2 text-gray-800 hover:font-semibold">
              <PieChart size={18} />
              <span>Statistics</span>
            </div>
            <span className="text-xs bg-gray-500 text-white px-2 py-0.5 rounded-full">15</span>
          </li>
          <li className="flex items-center space-x-2 text-gray-800 hover:font-semibold m-3">
            <BriefcaseBusiness size={18} />
            <span m-5>Company</span>
          </li>
          <li className="flex items-center space-x-2 text-gray-800 hover:font-semibold m-3">
            <Users size={18} />
            <span m-5>Candidate</span>
          </li>

          <hr />
          
          <div className="text-xs text-gray-400 mt-6 mb-2 tracking-wide m-3">USERS Management</div>
          <li className="flex items-center space-x-2 text-gray-800 hover:font-semibold m-3">
            <BriefcaseBusiness size={18} />
            <span m-5>Company</span>
          </li>
          <li className="flex items-center space-x-2 text-gray-800 hover:font-semibold m-3">
            <Users size={18} />
            <span m-5>Candidate</span>
          </li>

          <hr />

          <div className="text-xs text-gray-400 mt-6 mb-2 tracking-wide">OTHERS</div>
          <li className="flex items-center space-x-2 text-gray-800 hover:font-semibold m-3">
            <Users size={18} />
            <span>Users Banned</span>
          </li>
        </ul>
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-2 text-gray-800 hover:font-semibold">
          <Settings size={18} />
          <span>Settings</span>
        </div>
        <div className="flex items-center space-x-2 text-gray-800 hover:font-semibold">
          <LogOut size={18} />
          <span>Logout</span>
        </div>
      </div>
    </div>
  );
}
