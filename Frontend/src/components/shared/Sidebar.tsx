import { useState, useEffect } from 'react';
import { FiChevronRight, FiMenu, FiX } from 'react-icons/fi';
import { motion } from 'framer-motion';
import SidebarMenuItem from '../molecules/SidebarMenuItem';
import IconButton from '../atoms/IconButton';
import menuItems from '../../config/menuItems';

const Sidebar = ({ isCollapsed, setIsCollapsed }: { isCollapsed: boolean; setIsCollapsed: (v: boolean) => void }) => {
  const [openSubmenus, setOpenSubmenus] = useState<Record<string, boolean>>({});

  // Using imported menu items configuration

  const toggleSubmenu = (key: string) => {
    if (isCollapsed) {
      setIsCollapsed(false);
      setOpenSubmenus((prev) => ({ ...prev, [key]: !prev[key] }));
    } else {
      setOpenSubmenus((prev) => ({ ...prev, [key]: !prev[key] }));
    }
  };

  useEffect(() => {
    const currentPath = globalThis.location.pathname;
    
    menuItems.forEach(item => {
      if (item.submenu) {
        // Check if any submenu item's path matches the current path
        const isSubmenuActive = item.submenu.some(sub => currentPath.startsWith(sub.path));
        if (isSubmenuActive) {
          setOpenSubmenus(prev => ({ ...prev, [item.key]: true }));
        }
      }

      // Auto expand parent menu when child route is active
      if (item.submenu?.some(sub => currentPath.startsWith(sub.path))) {
        setOpenSubmenus(prev => ({ ...prev, [item.key]: true }));
      }
    });
  }, []);

  return (
    <>
      <div className="md:hidden fixed top-4 left-4 z-[9999]">
        <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
          {isCollapsed ? <FiX size={20} /> : <FiMenu size={20} />}
        </IconButton>
      </div>

      <motion.div
        initial={{ x: -300 }}
        animate={{
          x: 0,
          width: isCollapsed ? '5rem' : '16rem'
        }}
        transition={{ type: 'tween', duration: 0.25 }}
        className={`fixed top-0 left-0 h-screen bg-white shadow-md z-40 flex flex-col transition-all ${isCollapsed ? 'w-20' : 'w-64'}`}
      >
        <div className="flex items-center justify-between p-3">
          <div className="holder-top h-[55px]" />
          <IconButton
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden md:flex text-gray-500 bg-gray-100 hover:bg-gray-200"
          >
            <FiChevronRight className={`${!isCollapsed && 'rotate-180'}`} />
          </IconButton>
        </div>

        <div className="flex-1 overflow-y-auto py-4 px-2">
          <ul className="space-y-1">
            {menuItems.map(item => (
              <SidebarMenuItem
                key={item.key}
                label={item.label}
                icon={item.icon}
                path={item.path}
                submenu={item.submenu}
                isCollapsed={isCollapsed}
                open={openSubmenus[item.key]}
                onToggle={() => toggleSubmenu(item.key)}
              />
            ))}
          </ul>
        </div>

        <div className="p-4 border-t border-gray-200">
          <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
            {!isCollapsed && (
              <div>
                <p className="text-sm font-bold text-gray-800">Guest User</p>
              </div>
            )}
            <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-white">
              <span className="text-sm font-medium">G</span>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default Sidebar;