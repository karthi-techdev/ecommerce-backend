import { createBrowserRouter } from 'react-router-dom';
import Layout from '../components/shared/Layout';
import Dashboard from '../components/templates/dashboard/Dashboard';
import FaqListTemplate from '../components/templates/faq/FaqListTemplate';
import FaqFormTemplate from '../components/templates/faq/FaqFormTemplate';
import BrandListTemplate from '../components/templates/brand/BrandListTemplate';
import BrandFormTemplate from '../components/templates/brand/BrandFormTemplate';

import BrandTrashPage from '../components/pages/trash/BrandTrashPage';

import SubCategoryListTemplate from '@/components/templates/subcategory/SubcategoryListTemplate';
import SubCategoryFormTemplate from '@/components/templates/subcategory/SubcategoryFormTemplate';
import SubCategoryTrashListTemplate from '@/components/templates/trash/SubcategoryTrash/SubcategoryTrashListTemplate';
import AdminLoginTemplate from '@/components/templates/loginAuth/adminLoginTemplate';

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
        path: 'faq',
        children: [ 
          {
            path: '',
            element: <FaqListTemplate />,
          },
          {
            path: 'add',
            element: <FaqFormTemplate />,
          },
          {
            path: 'edit/:id',
            element: <FaqFormTemplate />,
          },
        ],
      },
      {
        path: 'subcategory',
        children: [
          {
            path: '',
            element: <SubCategoryListTemplate />,
          },
          {
            path: 'add',
            element: <SubCategoryFormTemplate />,
          },
          {
            path: 'edit/:id',
            element: <SubCategoryFormTemplate />,
          },
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
        ]
      }
      
    ],
  },
]);

