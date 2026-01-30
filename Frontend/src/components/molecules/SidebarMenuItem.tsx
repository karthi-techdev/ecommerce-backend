import React, { memo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronDown } from 'react-icons/fi';

interface SubMenuItem {
  label: string;
  path: string;
}

interface SidebarMenuItemProps {
  label: string;
  icon: React.ReactNode;
  path?: string;
  submenu?: SubMenuItem[];
  isCollapsed: boolean;
  open: boolean;
  onToggle: () => void;
}

const SidebarMenuItem: React.FC<SidebarMenuItemProps> = memo(({
  label, icon, path, submenu, isCollapsed, open, onToggle
}) => {
  const location = useLocation();
  const isActive = path
    ? location.pathname === path || location.pathname.startsWith(`${path}/`)
    : submenu?.some((sub) => location.pathname.startsWith(sub.path));

  return (
    <li className={isCollapsed ? 'w-full flex justify-center' : ''}>
      {submenu ? (
        <>
          <button
            onClick={onToggle}
            className={`flex items-center justify-between p-3 rounded-lg w-full transition-all 
              ${isActive ? 'bg-amber-50 text-amber-500' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <div className="flex items-center">
              <span className={`text-lg ${isActive ? 'text-amber-500' : 'text-gray-500'}`}>{icon}</span>
              {!isCollapsed && <span className="ml-3 font-bold">{label}</span>}
            </div>
            {!isCollapsed && (
              <motion.span
                animate={{ rotate: open ? 0 : -90 }}
                transition={{ duration: 0.3 }}
              >
                <FiChevronDown size={16} />
              </motion.span>
            )}
          </button>
          <AnimatePresence>
            {open && !isCollapsed && (
              <motion.ul
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="pl-4 mt-1 space-y-1 overflow-hidden"
              >
                {submenu.map((sub) => (
                  <li key={sub.path}>
                    <Link
                      to={sub.path}
                      className={`flex items-center p-2 rounded-lg transition-all w-full
                        ${location.pathname.startsWith(sub.path) ? 'bg-amber-50 text-amber-500' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                      <span className="w-1 h-1 rounded-full bg-gray-400 mr-3" />
                      {!isCollapsed && <span>{sub.label}</span>}
                    </Link>
                  </li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </>
      ) : (
        <Link
          to={path!}
          className={`flex items-center p-3 rounded-lg transition-all w-full 
            ${isActive ? 'bg-amber-50 text-amber-500' : 'text-gray-600 hover:bg-gray-50'}`}
        >
          <span className={`text-lg ${isActive ? 'text-amber-500' : 'text-white-500'}`}>
            {icon}
          </span>
          {!isCollapsed && <span className="ml-3 font-bold">{label}</span>}
        </Link>
      )}
    </li>
  );
});

export default SidebarMenuItem;