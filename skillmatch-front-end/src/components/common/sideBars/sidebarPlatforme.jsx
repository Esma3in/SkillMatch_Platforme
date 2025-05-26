import React from 'react';
import { Home,BriefcaseBusiness, BarChart2, Users, User, Settings, LogOut, PieChart } from 'lucide-react';
import UseLogout from '../../../hooks/useLogout';

export default function Sidebar() {
  const logout = UseLogout();
  return (
    <div className="w-64 min-h-screen bg-white border-r p-4 flex flex-col justify-between">
      <div>
      <button className="w-full bg-indigo-600 text-white py-2 rounded-lg font-bold mb-6 text-lg" disabled>
          welcome admin
      </button>
        <ul className="space-y-5">
          {/* <div className="text-xs text-gray-400 mt-6 mb-2 tracking-wide m-3">PLATFORME ANALYTICS</div>
          <li className="flex items-center space-x-2 text-black font-semibold shadow-sm m-3 pb-5">
            <BarChart2 size={18} />
            <a href="/admin/Session/:id">Acceuil</a> 
          </li> */}

          <div className="text-xs text-gray-400 mt-6 mb-2 tracking-wide m-3">USERS ANALYTICS</div>
          <li className="flex items-center justify-between m-3">
            <div className="flex items-center space-x-2 text-gray-800 hover:font-semibold">
              <PieChart size={18} />
              <a href="/admin/usersPerformance"><span>All Users Statistics</span></a>
            </div>
          </li>
          <li className="flex items-center space-x-2 text-gray-800 hover:font-semibold m-3">
            <BriefcaseBusiness size={18} />
            <a href="/admin/companiesPerformance"><span>Companies</span></a>
          </li>
          <li className="flex items-center space-x-2 text-gray-800 hover:font-semibold m-3">
            <Users size={18} />
            <a href="/admin/candidatesPerformance"><span>candidates</span></a>
          </li>

          <hr />
          
          <div className="text-xs text-gray-400 mt-6 mb-2 tracking-wide m-3">USERS Management</div>
          <li className="flex items-center space-x-2 text-gray-800 hover:font-semibold m-3">
            <BriefcaseBusiness size={18} />
            <a href="/admin/companiesList"><span>companies</span></a>
          </li>
          <li className="flex items-center space-x-2 text-gray-800 hover:font-semibold m-3">
            <Users size={18} />
            <a href="/admin/candidatesList"><span>candidates</span></a>
          </li>

          <hr />

          <div className="text-xs text-gray-400 mt-6 mb-2 tracking-wide">OTHERS</div>
          <li className="flex items-center space-x-2 text-gray-800 hover:font-semibold m-3">
            <Users size={18} />
            <a href="/admin/banUsers"><span>banned users</span></a>
          </li>
        </ul>
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-2 text-gray-800 hover:font-semibold">
          <button onClick={logout} className="profile-option">
            <LogOut size={18} />
            Log out
          </button>
        </div>
      </div>
    </div>
  );
}
