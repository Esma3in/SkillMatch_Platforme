import React, { useEffect, useState } from 'react';
import NavbarCandidate from '../components/common/navbarCandidate';
import { Footer } from '../components/common/footer';
import { api } from '../api/api';

const NotificationItem = ({ notification, onDismiss }) => {
  const [isRead, setIsRead] = useState(notification.isRead);
  const [isFading, setIsFading] = useState(false);

  const handleMarkAsRead = async () => {
    try {
      // Assuming there's an API endpoint to mark notification as read
      await api.put(`/api/notifications/${notification.id}/read`);
      setIsRead(true);
    } catch (error) {
      console.error('Error marking notification as read:', error.message);
    }
  };

  const handleDismiss = () => {
    setIsFading(true);
    setTimeout(() => onDismiss(notification.id), 300);
  };

  return (
    <div
      className={`flex items-center justify-between p-4 border-b border-gray-100 bg-white hover:bg-gray-50 transition-all duration-300 ${
        isFading ? 'opacity-0 transform -translate-x-4' : 'opacity-100'
      } ${isRead ? 'opacity-75' : ''}`}
    >
      <div className="flex items-start space-x-4">
        <div className={`w-2 h-2 rounded-full mt-2 ${isRead ? 'bg-gray-300' : 'bg-indigo-600'}`} />
        <div>
          <h3 className="text-base font-medium text-gray-900">{notification.title}</h3>
          <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
          <p className="text-xs text-gray-400 mt-1">{notification.timestamp}</p>
        </div>
      </div>
      <div className="flex items-center space-x-3">
        {!isRead && (
          <button
            onClick={handleMarkAsRead}
            className="text-sm text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            Mark as Read
          </button>
        )}
        <button
          onClick={handleDismiss}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

const NotificationCandidate = () => {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const candidate_id = JSON.parse(localStorage.getItem('candidate_id'));

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!candidate_id) {
        setError('No candidate ID found');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await api.get(`/api/notifications/${candidate_id}`);
        setNotifications(response.data.data || []);
      } catch (error) {
        setError('Failed to load notifications: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [candidate_id]);

  const handleDismiss = (id) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id));
  };

  const filteredNotifications =
    filter === 'all'
      ? notifications
      : notifications.filter((n) => (filter === 'read' ? n.isRead : !n.isRead));

  return (
    <>
      <NavbarCandidate />
      <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg">
        {/* Description Section */}
        <div className="mb-8 p-4 bg-indigo-50 rounded-lg">
          <h2 className="text-lg font-semibold text-indigo-900">Your Notification Hub</h2>
          <p className="text-sm text-indigo-700 mt-2">
            Stay updated with all communications from companies and platform admins. You’ll receive
            real-time notifications about your application status, including acceptance, refusal, interview
            schedules, and document requests. Manage your notifications by marking them as read or dismissing
            them to keep your inbox organized.
          </p>
        </div>

        {/* Filter and Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Notifications</h1>
          <div className="flex space-x-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 text-sm rounded-full ${
                filter === 'all' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600'
              } hover:bg-indigo-500 hover:text-white transition-colors`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-3 py-1 text-sm rounded-full ${
                filter === 'unread' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600'
              } hover:bg-indigo-500 hover:text-white transition-colors`}
            >
              Unread
            </button>
            <button
              onClick={() => setFilter('read')}
              className={`px-3 py-1 text-sm rounded-full ${
                filter === 'read' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600'
              } hover:bg-indigo-500 hover:text-white transition-colors`}
            >
              Read
            </button>
          </div>
        </div>

        {/* Loading and Error States */}
        {loading && (
          <div className="text-center py-10">
            <p className="text-gray-500 text-sm">Loading notifications...</p>
          </div>
        )}
        {error && (
          <div className="text-center py-10">
            <p className="text-red-500 text-sm">{error}</p>
          </div>
        )}

        {/* Notification List */}
        {!loading && !error && filteredNotifications.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500 text-sm">No notifications to display.</p>
            <p className="text-gray-400 text-xs mt-2">
              Check back later for updates from companies or admins.
            </p>
          </div>
        ) : (
          !loading && !error && (
            <>
              <div className="flex justify-between items-center mb-4 text-sm text-gray-600">
                <p>
                  Showing {filteredNotifications.length} of {notifications.length} notifications
                </p>
                <p className="text-indigo-600 font-medium">
                  {filteredNotifications.filter((n) => !n.isRead).length} unread
                </p>
              </div>
              <div className="divide-y divide-gray-100">
                {filteredNotifications.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onDismiss={handleDismiss}
                  />
                ))}
              </div>
            </>
          )
        )}

        {/* Footer Description */}
        {!loading && !error && filteredNotifications.length > 0 && (
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              End of notifications. New updates will appear here automatically.
            </p>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default NotificationCandidate;