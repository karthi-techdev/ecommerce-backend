import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FiBell, FiChevronDown, FiMaximize, FiMinimize } from 'react-icons/fi';
import { HiOutlineUser } from 'react-icons/hi';
import { motion, AnimatePresence } from 'framer-motion';
import logoImg from '../../assets/images/logo.png';
import LabeledInput from '../molecules/LabeledInput';
import ProfileDropdown from '../organisms/ProfileDropdown';
import NotificationList from '../molecules/NotificationList';
import { useAuthStore } from '../../stores/authStore';
import Swal from 'sweetalert2';

interface Notification {
  id: number;
  text: string;
  time: string;
  read: boolean;
}

const Navbar = () => {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationDropdownOpen, setNotificationDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const {logout , admin } = useAuthStore()

  // Handle fullscreen change
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleProfileDropdown = useCallback(() => {
    setProfileDropdownOpen(prev => !prev);
    setNotificationDropdownOpen(false);
  }, []);

  const toggleNotificationDropdown = useCallback(() => {
    setNotificationDropdownOpen(prev => !prev);
    setProfileDropdownOpen(false);
  }, []);

  const closeAllDropdowns = useCallback(() => {
    setProfileDropdownOpen(false);
    setNotificationDropdownOpen(false);
  }, []);

  const handleSignOut = useCallback(() => {
    closeAllDropdowns();

    Swal.fire({
      title: 'Are you sure?',
      text: 'You will be logged out from this session',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, Logout',
    }).then((result) => {
      if (result.isConfirmed) {
        logout();

        Swal.fire(
          'Logged Out!',
          'You have been successfully logged out.',
          'success'
        );
      }
    });

  }, [closeAllDropdowns, logout]);


  const handleSearch = useCallback((e: { target: { name: string; value: string | boolean } }) => {
    if (typeof e.target.value === 'string') {
      setSearchText(e.target.value);
    }
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }, []);

  const notifications: Notification[] = [
    { id: 1, text: 'New user registered', time: '2 mins ago', read: false },
    { id: 2, text: 'System update available', time: '1 hour ago', read: true },
    { id: 3, text: 'New message received', time: '3 hours ago', read: true },
  ];

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/80 backdrop-blur-lg shadow-sm' : 'bg-white'
      }`}
    >
      <div className="px-4 sm:px-4 lg:px-4 shadow-sm pl-15 md:pl-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center group">
              <img src={logoImg} alt="logo" className="object-fit h-15" />
            </Link>
          </div>

          <div className="flex-1 flex justify-center px-2 lg:ml-6 lg:justify-end">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="max-w-lg w-full lg:max-w-xs"
            >
              <LabeledInput
                name="search"
                type="text"
                value={searchText}
                onChange={handleSearch}
                placeholder="Search..."
                required={false}
              />
            </motion.div>
          </div>

          <div className="flex items-center">
            <div className="ml-2 relative">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={toggleFullscreen}
                className="p-2 rounded-full text-gray-400 hover:text-gray-500 hover:bg-gray-100/50 focus:outline-none transition-colors"
                aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
              >
                {isFullscreen ? (
                  <FiMinimize className="h-5 w-5" />
                ) : (
                  <FiMaximize className="h-5 w-5" />
                )}
              </motion.button>
            </div> 
            <div className="ml-2 relative">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={toggleNotificationDropdown}
                className="p-2 rounded-full text-gray-400 hover:text-gray-500 hover:bg-gray-100/50 focus:outline-none relative transition-colors"
              >
                <span className="sr-only">View notifications</span>
                <FiBell className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
              </motion.button>

              <AnimatePresence>
                {notificationDropdownOpen && (
                  <>
                    <button
                      className="fixed inset-0 z-40"
                      onClick={closeAllDropdowns}
                      onKeyDown={(e) => e.key === 'Escape' && closeAllDropdowns()}
                      aria-label="Close menu"
                    ></button>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      transition={{ duration: 0.2, ease: 'easeOut' }}
                      className="origin-top-right absolute right-0 mt-2 w-80 rounded-lg shadow-xl bg-white/80 backdrop-blur-lg ring-1 ring-black/10 z-50 overflow-hidden"
                    >
                      <NotificationList notifications={notifications} />
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            <div className="ml-4 relative">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={toggleProfileDropdown}
                className="flex items-center max-w-xs rounded-full focus:outline-none group"
              >
                <span className="sr-only">Open user menu</span>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="h-8 w-8 rounded-full bg-amber-500 flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow"
                >
                  <HiOutlineUser className="h-4 w-4 text-white" />
                </motion.div>
                <span className="hidden md:inline-block ml-2 text-sm font-medium text-gray-700">
                  {admin?.name || "Guest User"}
                </span>
                <FiChevronDown
                  className={`hidden md:inline-block ml-1 h-4 w-4 text-gray-500 transition-transform ${
                    profileDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </motion.button>

              <ProfileDropdown
                isOpen={profileDropdownOpen}
                onClose={closeAllDropdowns}
                onSignOut={handleSignOut}
              />
            </div>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;