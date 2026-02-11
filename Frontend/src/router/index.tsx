import { createBrowserRouter } from 'react-router-dom';
import Layout from '../components/shared/Layout';
import Dashboard from '../components/templates/dashboard/Dashboard';
import FaqListTemplate from '../components/templates/faq/FaqListTemplate';
import FaqFormTemplate from '../components/templates/faq/FaqFormTemplate';
import MainCategoryListTemplate from '../components/templates/mainCategory/MainCategoryListTemplate';
import MainCategoryFormTemplate from '../components/templates/mainCategory/MainCategoryFormTemplate';
import TrashMainCategoryListTemplate from'../components/templates/mainCategory/TrashMainCategoryListTemplate';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <Dashboard />,
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
        path: 'main-category',
        children: [
          { path: '', element: <MainCategoryListTemplate /> },
          { path: 'add', element: <MainCategoryFormTemplate /> },
          { path: 'edit/:id', element: <MainCategoryFormTemplate /> },
        ],
      },
      {
        path: 'trash',
        children: [
          {
            path: 'main-category',
            element: <TrashMainCategoryListTemplate />,
          },
        ],
      },
    ],
  },
]);