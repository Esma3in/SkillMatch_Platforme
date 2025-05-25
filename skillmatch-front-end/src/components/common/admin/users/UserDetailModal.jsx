import React from 'react';
import { XIcon } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../avatar';
import { Badge } from '../badge';

const UserDetailModal = ({ isOpen, onClose, userData, userType }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Modal header */}
        <div className="border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">
            {userType === 'company' ? 'Company Details' : 'Candidate Details'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <XIcon size={24} />
          </button>
        </div>

        {/* Modal content */}
        <div className="px-6 py-4">
          {userData ? (
            <div className="space-y-6">
              {/* User header */}
              <div className="flex items-center space-x-4 pb-4 border-b">
                <Avatar className="w-16 h-16">
                  <AvatarImage 
                    src={userType === 'company' ? userData.logo : userData.avatar} 
                    alt={userData.name} 
                    className="rounded-full"
                  />
                  <AvatarFallback>{userData.name?.charAt(0) || 'U'}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-medium text-gray-900">{userData.name}</h3>
                  <p className="text-gray-500">{userData.email}</p>
                  <div className="mt-1">
                    <Badge 
                      className={`
                        ${userData.state === 'active' ? 'bg-green-100 text-green-800' : 
                          userData.state === 'unactive' ? 'bg-red-100 text-red-800' : 
                          userData.state === 'banned' ? 'bg-red-100 text-red-800' : 
                          'bg-gray-100 text-gray-800'}
                        px-2 py-1 rounded-full text-xs
                      `}
                    >
                      {userData.state}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* User information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-700">Basic Information</h4>
                  <p className="text-sm"><span className="font-medium">ID:</span> {userData.id}</p>
                  <p className="text-sm"><span className="font-medium">Registration Date:</span> {userData.date}</p>
                  
                  {userType === 'company' && (
                    <p className="text-sm"><span className="font-medium">Sector:</span> {userData.sector}</p>
                  )}
                </div>

                {/* Additional information */}
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-700">Contact Information</h4>
                  <p className="text-sm"><span className="font-medium">Email:</span> {userData.email}</p>
                  <p className="text-sm"><span className="font-medium">Phone:</span> {userData.phone || 'Not provided'}</p>
                  <p className="text-sm"><span className="font-medium">Address:</span> {userData.address || 'Not provided'}</p>
                </div>
              </div>

              {/* Additional sections based on user type */}
              {userType === 'company' && (
                <div className="space-y-2 pt-4 border-t">
                  <h4 className="font-medium text-gray-700">Company Profile</h4>
                  <p className="text-sm">{userData.description || 'No company description available.'}</p>
                  
                  {userData.website && (
                    <p className="text-sm">
                      <span className="font-medium">Website:</span>{' '}
                      <a href={userData.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        {userData.website}
                      </a>
                    </p>
                  )}
                  
                  {userData.skills && userData.skills.length > 0 && (
                    <div className="mt-2">
                      <span className="text-sm font-medium">Skills Required:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {userData.skills.map((skill, index) => (
                          <Badge key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {userType === 'candidate' && (
                <div className="space-y-2 pt-4 border-t">
                  <h4 className="font-medium text-gray-700">Candidate Profile</h4>
                  <p className="text-sm">{userData.description || 'No candidate description available.'}</p>
                  
                  {userData.skills && userData.skills.length > 0 && (
                    <div className="mt-2">
                      <span className="text-sm font-medium">Skills:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {userData.skills.map((skill, index) => (
                          <Badge key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {userData.education && userData.education.length > 0 && (
                    <div className="mt-2">
                      <span className="text-sm font-medium">Education:</span>
                      <ul className="list-disc list-inside mt-1 text-sm">
                        {userData.education.map((edu, index) => (
                          <li key={index}>
                            {edu.degree} in {edu.field} at {edu.institution} ({edu.startYear}-{edu.endYear || 'Present'})
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {userData.experience && userData.experience.length > 0 && (
                    <div className="mt-2">
                      <span className="text-sm font-medium">Experience:</span>
                      <ul className="list-disc list-inside mt-1 text-sm">
                        {userData.experience.map((exp, index) => (
                          <li key={index}>
                            {exp.position} at {exp.company} ({exp.startDate}-{exp.endDate || 'Present'})
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="py-10 text-center">
              <p className="text-gray-500">Loading user data...</p>
            </div>
          )}
        </div>
        
        {/* Modal footer */}
        <div className="border-t px-6 py-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDetailModal; 