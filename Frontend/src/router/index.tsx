import { createBrowserRouter } from 'react-router-dom';
import Layout from '../components/shared/Layout';
import Dashboard from '../components/templates/dashboard/Dashboard';
import FaqListTemplate from '../components/templates/faq/FaqListTemplate';
import FaqFormTemplate from '../components/templates/faq/FaqFormTemplate';
import BrandListTemplate from '../components/templates/brand/BrandListTemplate';
import BrandFormTemplate from '../components/templates/brand/BrandFormTemplate';

import BrandTrashPage from '../components/pages/trash/BrandTrashPage';


export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Dashboard /> }, 
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
        path: 'trash',
        children: [
          { path: 'brand', element: <BrandTrashPage /> }, 
        ],
      },
    ],
  },
]);

