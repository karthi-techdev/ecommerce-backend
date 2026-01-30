import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import ProfileDropdownItem from '../molecules/ProfileDropdownItem';
import { FaRegUserCircle, FaSignOutAlt } from 'react-icons/fa';
import { FiSettings } from 'react-icons/fi';

interface ProfileDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  onSignOut: () => void;
}

const ProfileDropdown: React.FC<ProfileDropdownProps> = ({ isOpen, onClose, onSignOut }) => {

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <button 
            className="fixed inset-0 z-40 w-full h-full cursor-default"
            onClick={onClose}
            aria-label="Close menu"
            tabIndex={-1}
          />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="origin-top-right absolute right-0 mt-2 w-48 rounded-lg shadow-xl bg-white/80 backdrop-blur-lg ring-1 ring-black/10 z-50 divide-y divide-gray-200/30 overflow-hidden"
          >
            <div className="px-4 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white">
              <p className="text-xs opacity-80">Signed in as</p>
              <p className="text-sm font-semibold truncate">
                Admin
              </p>
            </div>
            <div className="py-2">
              <div className="px-3 py-2 text-xs font-medium text-gray-400 uppercase">Account</div>
              <ProfileDropdownItem 
                to="/profile" 
                icon={<FaRegUserCircle className="text-gray-500" />} 
                label="Profile" 
              />
            </div>
            <div className="py-2 bg-gray-50">
              <div className="px-3 py-2 text-xs font-medium text-gray-400 uppercase">Preferences</div>
              <ProfileDropdownItem 
                to="/settings" 
                icon={<FiSettings className="text-gray-500" />} 
                label="Settings" 
              />
            </div>
            <div className="py-2 border-t border-gray-100">
              <ProfileDropdownItem
                icon={<FaSignOutAlt className="text-red-500" />}
                label="Sign out"
                onClick={onSignOut}
                className="text-red-500 hover:bg-red-50"
              />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ProfileDropdown;