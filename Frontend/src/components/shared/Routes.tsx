import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import Layout from './Layout';

const Dashboard = lazy(() => import('../templates/dashboard/Dashboard'));
const FaqPage = lazy(() => import('../pages/faq/FaqListPage'));
const FaqFormPage = lazy(() => import('../pages/faq/FaqFormPage'));

const BrandListPage = lazy(() => import('../pages/brand/BrandListPage'));
const BrandFormPage = lazy(() => import('../pages/brand/BrandFormPage'));
const BrandTrashPage = lazy(() => import('../pages/trash/BrandTrashPage'));




const routes: RouteObject[] = [
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: <Dashboard />,
      },
      {
        path: 'faq',
        children: [
          { path: '', element: <FaqPage /> },
          { path: 'add', element: <FaqFormPage /> },
          { path: 'edit/:id', element: <FaqFormPage /> },
        ],
      },
      {
        path: 'brand',
        children: [
          { path: '', element: <BrandListPage /> }, 
          { path: 'add', element: <BrandFormPage /> },   
          { path: 'edit/:id', element: <BrandFormPage /> }, 
        ],
      },

      
{
  path: 'trash',
  children: [
    { path: 'brand', element: <BrandTrashPage /> },
  ]
}
     
       
    ],
  },
  {
    path: '*',
    element: <Navigate to="/dashboard" replace />,
  },
];

export default routes;