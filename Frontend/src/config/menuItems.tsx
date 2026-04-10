
import { PiShoppingCartLight } from "react-icons/pi";
import { FiSettings, FiTruck, FiFileText, FiLayers, FiTag, FiMail, FiList, FiSliders, FiTool, FiBriefcase, FiTrash2, FiShoppingCart } from 'react-icons/fi';
import { MdOutlineRateReview } from "react-icons/md";
import { BiSolidOffer } from "react-icons/bi";
import { BiCategory, BiBook, BiBitcoin } from "react-icons/bi";
import type { ReactNode } from 'react';
import { SlidersHorizontal, Settings2 } from 'lucide-react';

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
    key: 'slider',
    label: 'Slider',
    icon: <SlidersHorizontal />,
    path: '/slider',
  },
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
    key: 'orders',
    label: 'Orders',
    icon: <PiShoppingCartLight />,
    path: '/orders',
  },

  // 1. Inga Reviews-ai add pannunga
  {
    key: 'reviews',
    label: 'Customer Reviews',
    icon: <MdOutlineRateReview />,
    path: '/reviews',
  },

  {
    key: 'banners',
    label: 'Manage Banners',
    icon: <BiBitcoin />,
    path: '#',
    submenu: [
      {
        key: 'homepage-banners',
        label: 'Home page Banners',
        path: '/banners',
      }
    ]
  },


  {
    key: 'blogs',
    label: 'Manage Blogs',
    icon: <BiBook />,
    submenu: [
      {
        key: 'blogCategory',
        label: 'Category',
        path: '/blog-category',
        icon: <FiList />,
      },
      {
        key: 'blog',
        label: 'Blog',
        path: '/blogs',
        icon: <FiFileText />,
      },
      {
        key: 'shipment-methods',
        label: 'Shipment Methods',
        path: '/shipment-methods',
        icon: <FiTruck />,
      },

    ],
  },

  {
    key: 'offer',
    label: 'Offers',
    icon: <PiShoppingCartLight />,
    path: '/offer',
  },
  {
    key: 'commerce-settings',
    label: 'Commerce Settings',
    icon: <FiTool />,
    path: '#',
    submenu: [
      {
        key: 'coupon',
        label: 'Coupon',
        icon: <FiLayers />,
        path: '/coupon',
      },
      {
        key: 'config',
        label: 'Config',
        icon: <Settings2 />,
        path: '/config',
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
        label: 'Blog Category',
        path: '/trash/blog-category'
      },

      {
        key: 'trash-blogs',
        label: 'Blogs',
        path: '/trash/blogs',
      },


    ],
  },
];


export default menuItems;
