import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';
import { Navigate, Outlet } from 'react-router-dom';
import Layout from './Layout';
import AdminLoginTemplate from '../templates/loginAuth/adminLoginTemplate';
import { useAuthStore } from '../../stores/authStore';
import NotFoundPage from '../utils/notFound';

const Dashboard = lazy(() => import('../templates/dashboard/Dashboard'));

const FaqPage = lazy(() => import('../pages/faq/FaqListPage'));
const FaqFormPage = lazy(() => import('../pages/faq/FaqFormPage'));
const CategoryPage = lazy(() => import('../pages/category/CategoryListPage'));
const CategoryFormPage = lazy(() => import('../pages/category/CategoryFormPage'));
const CategoryTrashPage = lazy(() => import('../pages/trash/CategoryTrashListPage'));
const SubcategoryPage = lazy(() => import('../pages/subcategory/SubcategoryListPage'));
const SubcategoryFormPage = lazy(() => import('../pages/subcategory/SubcategoryFormPage'));
const SubcategoryTrashPage = lazy(() => import('../pages/trash/SubcategoryTrashListPage'));
const PageListPage = lazy(() => import('../pages/page/pageListPages'));
const PageFormPage = lazy(() => import('../pages/page/pageFormPages'));

const PrivateRoute = () => {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

const PublicRoute = () => {
  const { isAuthenticated } = useAuthStore();
  return !isAuthenticated ? <Outlet /> : <Navigate to="/dashboard" replace />;
};

const BrandListPage = lazy(() => import('../pages/brand/BrandListPage'));
const BrandFormPage = lazy(() => import('../pages/brand/BrandFormPage'));
const BrandTrashPage = lazy(() => import('../pages/trash/BrandTrashPage'));



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
    element: <PublicRoute />,
    children: [
      {
        path: 'login',
        element: <AdminLoginTemplate />,
      },
    ],
  },
  {
    element: <PrivateRoute />,
    children: [
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
            path: 'page',
            children:[
              {
                path:"",
                element:<PageListPage/>
              }
              ,{
                path: 'add',
                element: <PageFormPage />,
              },
              { 
                path: 'edit/:id', 
                element: <PageFormPage /> 
              },
            ]
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
        path: 'main-category',
        children: [
          { path: '', element: <MainCategoryPage /> },
          { path: 'add', element: <MainCategoryFormPage /> },
          { path: 'edit/:id', element: <MainCategoryFormPage /> },
        ],
      },{
        path:'category',
       children:[
        {path:'',element:<CategoryPage/>},
        {path:'add',element:<CategoryFormPage/>},
        {path:'edit/:id',element:<CategoryFormPage/>},
       ]
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
          { path: 'brand', element: <BrandTrashPage /> },
          {path: 'main-category',element: <TrashMainCategoryPage />},
          {path: 'category',element: <CategoryTrashPage />,},
        ]
      }
        ],
      },
    ],
  },

  {
    path: '*',
    element: <NotFoundPage />,
  },
];

export default routes;





