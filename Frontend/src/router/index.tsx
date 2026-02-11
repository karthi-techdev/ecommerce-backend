import { createBrowserRouter } from 'react-router-dom';
import Layout from '../components/shared/Layout';
import Dashboard from '../components/templates/dashboard/Dashboard';
import FaqListTemplate from '../components/templates/faq/FaqListTemplate';
import FaqFormTemplate from '../components/templates/faq/FaqFormTemplate';
import CategoryListTemplate from '../components/templates/category/CategoryListTemplate';
import CategoryFormTemplate from '../components/templates/category/CategoryFormTemplate';
import CategoryTrashListPage from '../components/templates/trash/CategoryTrash/CategoryTrashListTemplate';
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
        path: 'trash',
        children : [
          {
             path: 'category', 
             element: <CategoryTrashListPage /> 
          }, 
        ]
      },
    ],
  },
]);