import { FiTrash2 , FiSettings, FiBriefcase  } from 'react-icons/fi';
import { BiCategory } from "react-icons/bi";
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
    ]
  },
  {
    key: 'category',
    label: 'Manage Categories',
    icon: <BiCategory />,
    path: '#',
    submenu: [
      {
        key: 'subcategory',
        label: 'Subcategory',
        path: '/subcategory'
      },
    ]
  },
  {
    key: 'trash',
    label: 'Trash',
    icon: <FiTrash2 />,
    path: '#',
    submenu: [
      {
        key: 'subcategory-trash',
        label: 'Subcategory',
        path: '/trash/subcategory'
      }  
    ]
  }
];

export default menuItems;