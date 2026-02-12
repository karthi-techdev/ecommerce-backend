import {FiSettings,FiBriefcase,FiLayers,FiTag,FiList,FiTrash2} from 'react-icons/fi';
import type { ReactNode } from 'react';
import { BiCategory } from "react-icons/bi";


export interface SubMenuItem {
  key: string;
  label: string;
  path: string;
  icon?: ReactNode;
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
    path: '/dashboard',         
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
    key: 'category',
    label: 'Manage Categories',
    icon: <BiCategory />,
    path: '#',
    submenu: [
      {
        key: 'mainCategory',
        label: 'Main Category',
        path: '/mainCategory',
        icon: <FiList />,
  },
      {
          key: 'subcategory',
          label: 'Subcategory',
          path: '/subcategory',
      },
    ]
  },
      {
        key: 'trash',
        label: 'Trash',
        icon: <FiTrash2 />,
        path: '#',
        submenu: [
          { key: 'trash-brand', label: 'Brand', path: '/trash/brand' },
          {key: 'trash-main-category',label: 'Main Category',path: '/trash/mainCategory'},
          {
            key: 'subcategory-trash',
            label: 'Subcategory',
            path: '/trash/subcategory'
          },  
        ],
      },
    ];
      
  
export default menuItems;
