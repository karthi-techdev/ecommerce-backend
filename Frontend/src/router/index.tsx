import { createBrowserRouter } from 'react-router-dom';
import Layout from '../components/shared/Layout';
import Dashboard from '../components/templates/dashboard/Dashboard';
import NewsLetterListTemplate from '../components/templates/newsLetter/NewsLetterListTemplate';
import NewsLetterFormTemplate from '../components/templates/newsLetter/NewsLetterFormTemplate';
import CategoryListTemplate from '../components/templates/category/CategoryListTemplate';
import CategoryFormTemplate from '../components/templates/category/CategoryFormTemplate';
import CategoryTrashListPage from '../components/templates/trash/CategoryTrash/CategoryTrashListTemplate';
import MainCategoryListTemplate from '../components/templates/mainCategory/MainCategoryListTemplate';
import MainCategoryFormTemplate from '../components/templates/mainCategory/MainCategoryFormTemplate';
import TrashMainCategoryListTemplate from'../components/templates/mainCategory/TrashMainCategoryListTemplate';
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
        path: 'main-category',
        children: [
          { path: '', element: <MainCategoryListTemplate /> },
          { path: 'add', element: <MainCategoryFormTemplate /> },
          { path: 'edit/:id', element: <MainCategoryFormTemplate /> },
        ]
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
            path: 'main-category',
            element: <TrashMainCategoryListTemplate />,
          },
          {
             path: 'category', 
             element: <CategoryTrashListPage /> 
          }, 
        ],
      },
      
    ],
  }
]);

