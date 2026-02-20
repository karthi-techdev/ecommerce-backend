import { FiPieChart, FiSettings, FiHelpCircle, FiUsers, FiBriefcase,FiTrash2, FiShoppingCart} from 'react-icons/fi';
import { BiCategory } from "react-icons/bi";
import {FiLayers,FiTag,FiList} from 'react-icons/fi';
import type { ReactNode } from 'react';


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
       {
        key: 'testimonial',
        label: 'Testimonial',
        path: '/testimonial'
      },
      { key: 'page', label: 'Pages', path: '/page',},
    ],
  },

  {
    key: 'brand',
    label: 'Brand',
    icon: <FiTag />,
    path: '/brand',
  },
   {
    key: 'config',
    label: 'Config',
    icon: <FiLayers />,
    path: '/config',
  },
  {
    key: 'product',
    label: 'Products',
    icon: <FiShoppingCart />,
    path: '/products',
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
      },{
        key:'category',
        label:'Category',
        path:'/category'
      }
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
          {
      key:'trash-category',
      label:'Category',
      path:'/trash/category'   
    },
        { key: 'trash-product', label: 'Product', path: '/trash/product' },
        {
      key:'trash-faq',
      label:'Faq',
      path:'/trash/faq'   
    },
        ],
      },
    ];
      
  
export default menuItems;
