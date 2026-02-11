import {FiSettings,FiBriefcase,FiLayers,FiList,FiTrash2} from 'react-icons/fi';
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
  icon?: ReactNode;
}

const menuItems: MenuItem[] = [
  {
    key: 'dashboard',
    label: 'Dashboard',
    icon: <FiBriefcase />,
    path: '/dashboard',
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
    path: '/faq',
  },
   ]
  },
  {
    key: 'manage-categories',
    label: 'Manage Categories',
    icon: <FiLayers />,
    path: '#',
    submenu: [
      {
        key: 'main-category',
        label: 'Main Category',
        path: '/main-category',
        icon: <FiList />,
      },
    ],
  },
  {
    key: 'trash',
    label: 'Trash',
    icon: <FiTrash2 />,
    path: '#',
    submenu: [
      {
        key: 'trash-main-category',
        label: 'Main Category',
        path: '/trash/main-category',
        icon: <FiLayers />,
      },
    ],
  },
];


export default menuItems;
