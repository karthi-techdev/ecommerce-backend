import { FiSettings, FiBriefcase, FiTag, FiTrash2 } from 'react-icons/fi';
import type { ReactNode } from 'react';

export interface SubMenuItem {
  key: string;
  label: string;
  path: string;
}

export interface MenuItem {
  key: string;
  label: string;
  icon: ReactNode;
  path?: string;           
  submenu?: SubMenuItem[];
}

const menuItems: MenuItem[] = [
  {
    key: 'dashboard',
    label: 'Dashboard',
    icon: <FiBriefcase />,
    path: '/',           
  },
  {
    key: 'site-settings',
    label: 'Site Settings',
    icon: <FiSettings />,
    submenu: [
      { key: 'faq', label: 'FAQ', path: '/faq' },
    ],
  },
  {
    key: 'brand',
    label: 'Brand',
    icon: <FiTag />,
    path: '/brand',
  },
  {
    key: 'trash',
    label: 'Trash',
    icon: <FiTrash2 />,
    submenu: [
      { key: 'trash-brand', label: 'Brand', path: '/trash/brand' },
    ],
  },
];

export default menuItems;
