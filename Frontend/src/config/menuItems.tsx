import { FiPieChart, FiSettings, FiHelpCircle, FiUsers, FiBriefcase,FiTrash2 } from 'react-icons/fi';
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
      }
      
    ]
  },{
    key:'manage-categories',
    label:"Manage Categories",
    icon:<BiCategory/>,
    path:'#',
    submenu:[
      {
        key:'category',
        label:'Category',
        path:'/category'
      }
    ]
  },
  {
  key:'manage-trash',
  label:"Trash",
  icon:<FiTrash2/>,
  path:'#',
  submenu:[
    {
      key:'trash-category',
      label:'Category',
      path:'/trash/category'   
    }
  ]
}
];

export default menuItems;