import { createBrowserRouter } from 'react-router-dom';
import Layout from '../components/shared/Layout';
import Dashboard from '../components/templates/dashboard/Dashboard';
import NewsLetterListTemplate from '../components/templates/newsLetter/NewsLetterListTemplate';
import NewsLetterFormTemplate from '../components/templates/newsLetter/NewsLetterFormTemplate';
import FaqListTemplate from '../components/templates/faq/FaqListTemplate';
import FaqFormTemplate from '../components/templates/faq/FaqFormTemplate';
import TestimonialFormTemplate from '../components/templates/testimonial/testFormTemplate';
import TestimonialListTemplate from '../components/templates/testimonial/testListTemplate';
import TestFormPage from '../components/pages/Testimonials/TestFormPage';
import CategoryListTemplate from '../components/templates/category/CategoryListTemplate';
import CategoryFormTemplate from '../components/templates/category/CategoryFormTemplate';
import CategoryTrashListPage from '../components/templates/trash/CategoryTrash/CategoryTrashListTemplate';
import MainCategoryListTemplate from '../components/templates/mainCategory/MainCategoryListTemplate';
import MainCategoryFormTemplate from '../components/templates/mainCategory/MainCategoryFormTemplate';
import TrashMainCategoryListTemplate from '../components/templates/trash/MainCategoryTrash/TrashMainCategoryListTemplate'
import BrandListTemplate from '../components/templates/brand/BrandListTemplate';
import BrandFormTemplate from '../components/templates/brand/BrandFormTemplate';

import BrandTrashPage from '../components/pages/trash/BrandTrashPage';
   
import ShipmentMethodListTemplate from '../components/templates/shipmentMethods/shipmentMethodsListTemplate';
import ShipmentMethodFormTemplate from '../components/templates/shipmentMethods/ShipmentMethodsFormTemplate';
import SubCategoryListTemplate from '@/components/templates/subcategory/SubcategoryListTemplate';
import SubCategoryFormTemplate from '@/components/templates/subcategory/SubcategoryFormTemplate';
import SubCategoryTrashListTemplate from '@/components/templates/trash/SubcategoryTrash/SubcategoryTrashListTemplate';
import AdminLoginTemplate from '@/components/templates/loginAuth/adminLoginTemplate';
import AdminForgetPasswordTemplate from '../components/templates/loginAuth/adminForgetPassword'
import CouponListTemplate from '../components/templates/coupon/CouponListTemplate';
import CouponFormTemplate from '../components/templates/coupon/CouponFormTemplate';


import ConfigListTemplate from '../components/templates/config/ConfigListTemplate';
import ConfigFormTemplate from '../components/templates/config/ConfigFormTemplate';
import PageFormTemplate from '@/components/templates/page/pageFormTemplate';
import PageListTemplate from '@/components/templates/page/pageListTemplate';
import OrderListTemplate from '@/components/templates/order/orderListTemplate';

import ProductListTemplate from '@/components/templates/products/ProductsListTemplate';
import ProductFormTemplate from '@/components/templates/products/ProductsFormTemplate';
import ProductTrashListTemplate from '@/components/templates/trash/ProductsTrash/ProductsTrashListTemplate';
import SliderListTemplate from '../components/templates/slider/SliderListTemplate';
import SliderFormTemplate from '../components/templates/slider/SliderFormTemplate'

import BlogCategoryListTemplate from '@/components/templates/blogCategory/BlogCategoryListTemplate';
import BlogCategoryFormTemplate from '@/components/templates/blogCategory/BlogCategoryFormTemplate';
import BlogTrashListPage from '@/components/templates/trash/BlogTrash/TrashBlogTemplate';
import OfferListTemplate from '@/components/templates/offer/offerListTemplate';
import OfferFormTemplate from '@/components/templates/offer/offerFormTemplate';

import BlogListTemplate from '@/components/templates/blog/BlogListTemplate';
import BlogFormTemplate from '@/components/templates/blog/BlogFormTemplate';
import BlogTrashTemplate from '@/components/templates/trash/BlogsTrash/BlogTrashTemplate';

import PromotionsListTemplate from '../components/templates/promotions/PromotionsListTemplate';
import PromotionsFormTemplate from '../components/templates/promotions/PromotionsFormTemplate';
import SettingsManager from '../components/templates/settings/settingsManager';

export const router = createBrowserRouter([
  {
        path: '/login',
        element: <AdminLoginTemplate />,
      },
      {
        path:'/forgetPassword',
        element:<AdminForgetPasswordTemplate/>
      },

  {
    path: '/',
    element: <Layout />,
    children: [  
      {  path: '/', element: <Dashboard /> },
      {  path: 'page',
        children:[
          {
            path:"",
            element:<PageListTemplate/>
          }
           ,{
            path: 'add',
            element: <PageFormTemplate />,
          },
        ]
       }, 
      {  path: 'orders',
        children:[
          {
            path:"",
            element:<OrderListTemplate/>
          }
          ,{
            path: 'add',
            element: <OrderListTemplate />,
          },
        ]
      }, 
      {
        path:'/category',
        children:[
          {
            path:"",
            element:<CategoryListTemplate/>
          }
           ,{
            path: 'add',
            element: <CategoryFormTemplate />,
          },
          {
            path: 'edit/:id',
            element: <CategoryFormTemplate />,
          },
        ]
      }
      ,
      {
        path: 'newsLetter',
        children: [
          { path: '', element: <NewsLetterListTemplate /> },
          { path: 'add', element: <NewsLetterFormTemplate /> },
          { path: 'edit/:id', element: <NewsLetterFormTemplate /> },
        ],
      },
      {
        path: 'brand',
        children: [
          { path: '', element: <BrandListTemplate /> },
          { path: 'add', element: <BrandFormTemplate /> },
          { path: 'edit/:id', element: <BrandFormTemplate /> },
        ],
      },

      {
        path: 'products',
        children: [
          { path: '', element: <ProductListTemplate /> },
          { path: 'add', element: <ProductFormTemplate /> },
          { path: 'edit/:id', element: <ProductFormTemplate /> },
        ],
      },
      {
        path: 'config',
        children: [
          { path: '', element: <ConfigListTemplate /> },
           { path: 'add', element: <ConfigFormTemplate /> },
          { path: 'edit/:id', element: <ConfigFormTemplate /> },
        ],
      },
      {
        path: 'slider',
        children: [
          { path: '', element: <SliderListTemplate /> },
           { path: 'add', element: <SliderFormTemplate /> },
          { path: 'edit/:id', element: <SliderFormTemplate /> },
        ],
      },
      {
  path: 'coupon',
  children: [
    { path: '', element: <CouponListTemplate /> },
    { path: 'add', element: <CouponFormTemplate /> },
    { path: 'edit/:id', element: <CouponFormTemplate /> },
  ],
},{
        path: 'coupon',
        children: [
          { path: '', element: <CouponListTemplate /> },
          { path: 'add', element: <CouponFormTemplate /> },
          { path: 'edit/:id', element: <CouponFormTemplate /> },
        ],
      },

      {
        path: 'blog-category', 
        children: [
          { path: '', element: <BlogCategoryListTemplate /> },      
          { path: 'add', element: <BlogCategoryFormTemplate /> }, 
          { path: 'edit/:id', element: <BlogCategoryFormTemplate /> }, 
        ]
      },

      {
      path: 'blogs',                 
      children: [
    { index:true, element: <BlogListTemplate /> },     
    { path: 'add', element: <BlogFormTemplate /> },  
    { path: 'edit/:id', element: <BlogFormTemplate /> }, 
    { path: 'trash', element: <BlogTrashTemplate /> },
  ]
},


      {
        path: 'subcategory',
        children: [
          { path: '', element: <SubCategoryListTemplate />, },
          { path: 'add', element: <SubCategoryFormTemplate />,},
          { path: 'edit/:id', element: <SubCategoryFormTemplate />,},
        ],
      },
      {
        path:'/offer',
        children:[
          {
            path:"",
            element:<OfferListTemplate/>
          }
           ,{
            path: 'add',
            element: <OfferFormTemplate />,
          },
          {
            path: 'edit/:id',
            element: <OfferFormTemplate />,
          },
        ]
      },
      {
        path: 'testimonial',
        children: [
          {
            path: '',
            element: <TestimonialListTemplate />,
          },
          {
            path: 'add',
            element: <TestimonialFormTemplate />,
          },
          {
            path: 'edit/:id',
            element: <TestFormPage />,
          },
        ],
      },
      {
        path: 'settings',
        element: <SettingsManager />,
      },
      {
        path: 'mainCategory',
        children: [
          { path: '', element: <MainCategoryListTemplate /> },
          { path: 'add', element: <MainCategoryFormTemplate /> },
          { path: 'edit/:id', element: <MainCategoryFormTemplate /> },
        ]
      }, 
      {
        path: 'shipment-methods',
        children: [
          { path: '', element: <ShipmentMethodListTemplate /> },
          { path: 'add', element: <ShipmentMethodFormTemplate /> },
          { path: 'edit/:id', element: <ShipmentMethodFormTemplate /> },
        ],
      },
      {
        path: 'trash',
          children : [
          {
             path: 'subcategory', 
             element: <SubCategoryTrashListTemplate /> 
          },
          { path: 'brand', element: <BrandTrashPage /> }, 
          {
            path: 'mainCategory',
            element: <TrashMainCategoryListTemplate />,
          },
          {
             path: 'category', 
             element: <CategoryTrashListPage /> 
          },
          { path: 'products', element: <ProductTrashListTemplate /> }, 

           { path: 'blog-category', 
            element: <BlogTrashListPage /> },

            { path: 'blogs', element: 
            <BlogTrashTemplate /> },
        ],
      },

      {
        path: 'promotions',
        children: [
          { path: '', element: <PromotionsListTemplate /> },
          { path: 'add', element: <PromotionsFormTemplate /> },
          { path: 'edit/:id', element: <PromotionsFormTemplate /> },
        ],
      },
      
    ],
  }
]);

