import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiBell } from 'react-icons/fi';

interface Notification {
  id: number;
  text: string;
  time: string;
  read: boolean;
}

interface NotificationListProps {
  notifications: Notification[];
}

const NotificationList: React.FC<NotificationListProps> = ({ notifications }) => {
  return (
    <div className="py-1">
      <div className="px-4 py-3 border-b border-gray-200/30">
        <p className="text-sm font-medium text-gray-900">
          Notifications
        </p>
      </div>
      <div className="max-h-96 overflow-y-auto overflow-x-hidden">
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            whileHover={{ scale: 1.01 }}
            className={`px-4 py-3 hover:bg-gray-100/50 transition-colors ${
              notification.read ? '' : 'bg-blue-50/50'
            }`}
          >
            <div className="flex items-start">
              <div className="flex-shrink-0 pt-0.5">
                <div className="h-10 w-10 rounded-full bg-indigo-100/80 flex items-center justify-center backdrop-blur-sm">
                  <FiBell className="h-5 w-5 text-indigo-600" />
                </div>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {notification.text}
                </p>
                <p className="text-xs text-gray-500">
                  {notification.time}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      <div className="border-t border-gray-200/30 px-4 py-2">
        <Link
          to="/notifications"
          className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
        >
          View all notifications
        </Link>
      </div>
    </div>
  );
};

export default NotificationList;