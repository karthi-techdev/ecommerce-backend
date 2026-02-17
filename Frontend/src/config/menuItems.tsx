import { FiPieChart, FiSettings, FiHelpCircle, FiUsers, FiBriefcase } from 'react-icons/fi';
import type { ReactNode } from 'react';

export interface MenuItem {
  key: string;
  label: string;
  icon: ReactNode;
  path: string;
  submenu?: SubMenuItem[];
}

export interface SubMenuItem {
  key: string;
  label: string;
  path: string;
}

const menuItems: MenuItem[] = [
  {
    key: 'dashboard',
    label: 'Dashboard',
    icon: <FiBriefcase />,
    path: '/dashboard'
  },
  {
    key: 'site-settings',
    label: 'Site Settings',
    icon: <FiSettings />,
    path: '#',
    submenu: [
      {
        key: 'faq',
        label: 'FAQ',
        path: '/faq'
      },
      {
        key: 'testimonial',
        label: 'Testimonial',
        path: '/testimonial'
      }


    ]
  }
];

export default menuItems;