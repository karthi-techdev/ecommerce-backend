import { createBrowserRouter } from 'react-router-dom';
import Layout from '../components/shared/Layout';
import Dashboard from '../components/templates/dashboard/Dashboard';
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
import CouponListTemplate from '../components/templates/coupon/CouponListTemplate';
import CouponFormTemplate from '../components/templates/coupon/CouponFormTemplate';


import ConfigListTemplate from '../components/templates/config/ConfigListTemplate';
import ConfigFormTemplate from '../components/templates/config/ConfigFormTemplate';
import PageFormTemplate from '@/components/templates/page/pageFormTemplate';
import PageListTemplate from '@/components/templates/page/pageListTemplate';

import ProductListTemplate from '@/components/templates/products/ProductsListTemplate';
import ProductFormTemplate from '@/components/templates/products/ProductsFormTemplate';
import ProductTrashListTemplate from '@/components/templates/trash/ProductsTrash/ProductsTrashListTemplate';

export const router = createBrowserRouter([
  {
        path: '/login',
        element: <AdminLoginTemplate />,
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
        path: 'faq',
        children: [
          { path: '', element: <FaqListTemplate /> },
          { path: 'add', element: <FaqFormTemplate /> },
          { path: 'edit/:id', element: <FaqFormTemplate /> },
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
  path: 'coupon',
  children: [
    { path: '', element: <CouponListTemplate /> },
    { path: 'add', element: <CouponFormTemplate /> },
    { path: 'edit/:id', element: <CouponFormTemplate /> },
  ],
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
          { path: 'product', element: <ProductTrashListTemplate /> }, 
        ],
      },
      
    ],
  }
]);

