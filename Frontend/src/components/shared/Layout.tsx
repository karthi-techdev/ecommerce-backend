import { motion } from 'framer-motion';
import { Outlet, useLocation} from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { useState } from 'react';
import BannerTabs from '../molecules/BannerTabs';



const Layout: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const location = useLocation();


  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />

        <motion.main
          initial={{ marginLeft: '16rem' }}
          animate={{ marginLeft: isCollapsed ? '5rem' : '16rem' }}
          transition={{ type: 'tween', duration: 0.60, ease: 'easeInOut' }}
          className="flex-1 overflow-y-auto p-4 md:p-6 mt-16"
        >


          {location.pathname.startsWith("/banners") && <BannerTabs />}
          
          <Outlet />
        </motion.main>
      </div>
    </div>
  );
};

export default Layout;
