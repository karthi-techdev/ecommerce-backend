import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import Layout from './Layout';

const Dashboard = lazy(() => import('../templates/dashboard/Dashboard'));

// FAQ
const FaqPage = lazy(() => import('../pages/faq/FaqListPage'));
const FaqFormPage = lazy(() => import('../pages/faq/FaqFormPage'));

// MAIN CATEGORY
const MainCategoryPage = lazy(
  () => import('../pages/mainCategory/MainCategoryListPage')
);
const MainCategoryFormPage = lazy(
  () => import('../pages/mainCategory/MainCategoryFormPage')
);
const TrashMainCategoryPage = lazy(
  () => import('../pages/mainCategory/TrashMainCategoryListPage')
);


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

      // FAQ ROUTES
      {
        path: 'faq',
        children: [
          { path: '', element: <FaqPage /> },
          { path: 'add', element: <FaqFormPage /> },
          { path: 'edit/:id', element: <FaqFormPage /> },
        ],
      },

      // MAIN CATEGORY ROUTES 
      {
        path: 'main-category',
        children: [
          { path: '', element: <MainCategoryPage /> },
          { path: 'add', element: <MainCategoryFormPage /> },
          { path: 'edit/:id', element: <MainCategoryFormPage /> },
        ],
      },
      {
    path: 'trash',
    children: [
      {
        path: 'main-category',
        element: <TrashMainCategoryPage />,
      },
    ],
  },

    ],
  },

  {
    path: '*',
    element: <Navigate to="/dashboard" replace />,
  },
];

export default routes;





