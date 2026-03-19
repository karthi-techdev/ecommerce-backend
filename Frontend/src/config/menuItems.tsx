import { PiShoppingCartLight } from "react-icons/pi";
import { FiSettings,FiTruck,FiLayers,FiTag,FiMail,FiList,FiSliders , FiBriefcase,FiTrash2, FiShoppingCart} from 'react-icons/fi';

import { BiSolidOffer } from "react-icons/bi";
import { BiCategory, BiBook } from "react-icons/bi";
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
      { key: 'faq', label: 'Faq', path: '/faq' },
      {
        key: 'testimonial',
        label: 'Testimonial',
        path: '/testimonial'
      },
      { key: 'page', label: 'Pages', path: '/page', },
      {
        key: 'newsletter',
        label: 'NewsLetter',
        icon: <FiMail />,
        path: '/newsLetters'
      },
      {
        key: 'promotions',
        label: 'Promotions',
        icon: <BiSolidOffer />,
        path: '/promotions'
      },
    ],
  },
  
  {
    key: 'config',
    label: 'Config',
    icon: <FiSliders />,
    path: '/config',
  },
  
  {
    key: 'coupon',
    label: 'Coupon',
    icon: <FiLayers />,
    path: '/coupon',
  },

  {
    key: 'blogs',
    label: 'Manage Blogs',
    icon: <BiBook />,
    path: '/blog',
    submenu: [
      {
        key: 'blogCategory',
        label: 'Blog Categories',
        path: '/blog-category',
        icon: <FiList />,
      },



    ],
  },


  {
    key: 'orders',
    label: 'Orders',
    icon: <PiShoppingCartLight />,
    path: '/orders',
  },
  {
    key: 'offer',
    label: 'Offers',
    icon: <PiShoppingCartLight />,
    path: '/offer',
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
      }, {
        key: 'category',
        label: 'Category',
        path: '/category'
      }
    ]
  },
  {
    key: 'settings',
    label: 'Settings',
    icon: <FiSettings />,
    path: '/settings', 
  },
  {
    key: 'manage-products',
    label: 'Manage Products',
    icon: <FiShoppingCart />,
    path: '#',
    submenu: [
      {
        key: 'brand',
        label: 'Brand',
        path: '/brand',
        icon: <FiTag />,
      },
      {
        key: 'products',
        label: 'Products',
        path: '/products',
        icon: <FiShoppingCart />,
      },
      {
        key: 'shipment-methods',
        label: 'Shipment Methods',
        path: '/shipment-methods',
        icon: <FiTruck />,
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
      { key: 'trash-main-category', label: 'Main Category', path: '/trash/mainCategory' },
      {
        key: 'subcategory-trash',
        label: 'Subcategory',
        path: '/trash/subcategory'
      },
      {
        key: 'trash-category',
        label: 'Category',
        path: '/trash/category'
      },
      { key: 'trash-product', label: 'Products', path: '/trash/products' },
      {
        key: 'trash-faq',
        label: 'Faq',
        path: '/trash/faq'
      },

      {
        key: 'trash-blog',
        label: 'Blog',
        path: '/trash/blog-category'
      },

    ],
  },
];


export default menuItems;
