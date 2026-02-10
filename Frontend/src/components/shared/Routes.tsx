import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import Layout from './Layout';

const Dashboard = lazy(() => import('../templates/dashboard/Dashboard'));
const FaqPage = lazy(() => import('../pages/faq/FaqListPage'));
const FaqFormPage = lazy(() => import('../pages/faq/FaqFormPage'));
const SubcategoryPage = lazy(() => import('../pages/subcategory/SubcategoryListPage'));
const SubcategoryFormPage = lazy(() => import('../pages/subcategory/SubcategoryFormPage'));
const SubcategoryTrashPage = lazy(() => import('../pages/trash/SubcategoryTrashListPage'));

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
        path: 'subcategory',
        children: [
          { path: '', element: <SubcategoryPage /> },
          { path: 'add', element: <SubcategoryFormPage /> },
          { path: 'edit/:id', element: <SubcategoryFormPage /> },
        ],
      },
      {
        path: 'trash',
        children: [
          { path: 'subcategory', element: <SubcategoryTrashPage /> },
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