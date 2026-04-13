import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';
import { Navigate, Outlet } from 'react-router-dom';
import Layout from './Layout';
import AdminLoginTemplate from '../templates/loginAuth/adminLoginTemplate';
import AdminForgetPasswordTemplate from '../templates/loginAuth/adminForgetPassword';
import AdminResetPasswordTemplate from '../templates/loginAuth/adminResetPassword'
import { useAuthStore } from '../../stores/authStore';
import NotFoundPage from '../utils/notFound';   
import ReviewListPage from '../pages/reviews/ReviewListPage';

const Dashboard = lazy(() => import('../templates/dashboard/Dashboard'));

const NewsLetterPage = lazy(() => import('../pages/newsLetter/NewsLetterListPage'));
const NewsLetterFormPage = lazy(() => import('../pages/newsLetter/NewsLetterFormPage'));
const FaqPage = lazy(() => import('../pages/faq/FaqListPage'));
const TestmonialPage = lazy(() => import('../pages/Testimonials/TestListPage'));
const FaqFormPage = lazy(() => import('../pages/faq/FaqFormPage'));
const FaqTrashPage = lazy(() => import('../pages/trash/FaqTrashListPage'));
const TestimonialFormPage = lazy(() => import('../pages/Testimonials/TestFormPage'));
const CategoryPage = lazy(() => import('../pages/category/CategoryListPage'));
const CategoryFormPage = lazy(() => import('../pages/category/CategoryFormPage'));
const CategoryTrashPage = lazy(() => import('../pages/trash/CategoryTrashListPage'));
const SubcategoryPage = lazy(() => import('../pages/subcategory/SubcategoryListPage'));
const SubcategoryFormPage = lazy(() => import('../pages/subcategory/SubcategoryFormPage'));
const SubcategoryTrashPage = lazy(() => import('../pages/trash/SubcategoryTrashListPage'));
const ShipmentMethodsFormPage = lazy(() => import('../pages/shipmentMethods/ShipmentMethodsFormPage'))
const ShipmentMethodsListPage = lazy(() => import('../pages/shipmentMethods/ShipmentMethodsListPage'))
const BrandListPage = lazy(() => import('../pages/brand/BrandListPage'));
const BrandFormPage = lazy(() => import('../pages/brand/BrandFormPage'));
const BrandTrashPage = lazy(() => import('../pages/trash/BrandTrashPage'));
const CouponListPage = lazy(() => import('../pages/coupon/CouponListPage'));
const CouponFormPage = lazy(() => import('../pages/coupon/CouponFormPage'));
const PageListPage = lazy(() => import('../pages/page/pageListPages'));
const PageFormPage = lazy(() => import('../pages/page/pageFormPages'));
const OrderListPage = lazy(() => import('../templates/order/orderListTemplate'));
const BlogListPage = lazy(() => import('../pages/blogCategory/BlogListPage'));
const BlogFormPage = lazy(() => import('../pages/blogCategory/BlogFormPage'));
const BlogTrashPage = lazy(() => import('../pages/trash/BlogTrashPage'));
const OfferListPage = lazy(() => import('../pages/offer/offerListPage'));
const OfferFormPage = lazy(() => import('../pages/offer/offerFormPage'));

const BlogsListPage = lazy(() => import('../pages/blog/BlogsListPage'));
const BlogsFormPage = lazy(() => import('../pages/blog/BlogsFormPage'));
const BlogsTrashPage = lazy(() => import('../pages/trash/BlogsTrashPage'));
import BlogViewTemplate from '../templates/blog/BlogViewTemplate';
const PromotionsListPage = lazy(() => import('../pages/promotions/PromotionsListPage'));
const PromotionsFormPage = lazy(() => import('../pages/promotions/PromotionsFormPage'));
const BannerOneFormPage = lazy(() => import('../pages/bannerOne/BannerFormPage'));
const BannerTwoFormPage = lazy(() => import('../pages/bannerTwo/BannerTwoFormPage'));
const SettingsManager = lazy(() => import('../templates/settings/settingsManager'));

const PrivateRoute = () => {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

const PublicRoute = () => {
  const { isAuthenticated } = useAuthStore();
  return !isAuthenticated ? <Outlet /> : <Navigate to="/dashboard" replace />;
};



const ProductListPage = lazy(() => import('../pages/products/ProductsListPage'));
const ProductFormPage = lazy(() => import('../pages/products/ProductsFormPage'));
const ProductTrashPage = lazy(() => import('../pages/trash/ProductsTrashListPage'));


const MainCategoryPage = lazy(
  () => import('../pages/mainCategory/MainCategoryListPage')
);
const MainCategoryFormPage = lazy(
  () => import('../pages/mainCategory/MainCategoryFormPage')
);
const TrashMainCategoryPage = lazy(
  () => import('../pages/trash/TrashMainCategoryListPage')
);

const ConfigListPage = lazy(() => import('../pages/config/ConfigListPage'));
const ConfigFormPage = lazy(() => import('../pages/config/ConfigFormPage'));
const SliderListPage = lazy(() => import('../pages/slider/SliderListPage'));
const SliderFormPage = lazy(() => import('../pages/slider/SliderFormPage'));

const routes: RouteObject[] = [
  {
    element: <PublicRoute />,
    children: [
      {
        path: 'login',
        element: <AdminLoginTemplate />,
      },
    ],
  }, {
    path: 'forgetPassword',
    element: <AdminForgetPasswordTemplate />
  }, {
    path: 'resetPassword',
    element: <AdminResetPasswordTemplate />
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
            children: [
              {
                path: "",
                element: <PageListPage />
              }
              , {
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
            path: 'orders',
            children: [
              {
                path: "",
                element: <OrderListPage />
              }
              , {
                path: 'add',
                element: <OrderListPage />,
              },
              {
                path: 'edit/:id',
                element: <OrderListPage />
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
        path: 'testimonial',
        children: [
          { path: '', element: < TestmonialPage /> },
          { path: 'add', element: <TestimonialFormPage /> },
          { path: 'edit/:id', element: < TestimonialFormPage /> },
        ],
      },
           {
        path: 'config',
        children: [
          { path: '', element: <ConfigListPage /> }, 
          { path: 'add', element: <ConfigFormPage /> },   
          { path: 'edit/:id', element: <ConfigFormPage /> },  
        ],
      },
      {
        path: 'slider',
        children: [
          { path: '', element: <SliderListPage /> }, 
          { path: 'add', element: <SliderFormPage /> },   
          { path: 'edit/:id', element: <SliderFormPage /> },  
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
  path: 'coupon',
  children: [
    { path: '', element: <CouponListPage /> },
    { path: 'add', element: <CouponFormPage /> },
    { path: 'edit/:id', element: <CouponFormPage /> },
  ],
},
      

      {
        path: 'blog-category',
        children: [
          { path: '', element: <BlogListPage /> },
          { path: 'add', element: <BlogFormPage /> },
          { path: 'edit/:id', element: <BlogFormPage /> },
          
        ]
      },

      {
        path: 'blogs',
        element: <Outlet />, 
        children: [
          { path:'', element: <BlogsListPage /> },
          { path: 'add', element: <BlogsFormPage /> },
          { path: 'edit/:id', element: <BlogsFormPage /> },
          { path: 'view/:id', element: <BlogViewTemplate /> },
        ]
      },

      {
        path: 'settings', // Simplified path
        element: <SettingsManager />, 
      },

      {
        
        path: 'products',
        children: [
          { path: '', element: <ProductListPage /> },
          { path: 'add', element: <ProductFormPage /> },
          { path: 'edit/:id', element: <ProductFormPage /> },
        ],
      },

      {
        path: 'mainCategory',
        children: [
          { path: '', element: <MainCategoryPage /> },
          { path: 'add', element: <MainCategoryFormPage /> },
          { path: 'edit/:id', element: <MainCategoryFormPage /> },
        ],
      },

      {
        path:'category',
       children:[
        {path:'',element:<CategoryPage/>},
        {path:'add',element:<CategoryFormPage/>},
        {path:'edit/:id',element:<CategoryFormPage/>},
       ]
      },
          {
            path: 'testimonial',
            children: [
              { path: '', element: < TestmonialPage /> },
              { path: 'add', element: <TestimonialFormPage /> },
              { path: 'edit/:id', element: < TestimonialFormPage /> },
            ],
          },
          {
            path: 'config',
            children: [
              { path: '', element: <ConfigListPage /> },
              { path: 'add', element: <ConfigFormPage /> },
              { path: 'edit/:id', element: <ConfigFormPage /> },
            ],
          },
          {
            path: 'slider',
            children: [
              { path: '', element: <SliderListPage /> },
              { path: 'add', element: <SliderFormPage /> },
              { path: 'edit/:id', element: <SliderFormPage /> },
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
            path: 'coupon',
            children: [
              { path: '', element: <CouponListPage /> },
              { path: 'add', element: <CouponFormPage /> },
              { path: 'edit/:id', element: <CouponFormPage /> },
            ],
          },


          {
            path: 'blog-category',
            children: [
              { path: '', element: <BlogListPage /> },
              { path: 'add', element: <BlogFormPage /> },
              { path: 'edit/:id', element: <BlogFormPage /> },
            ]
          },

          {
            path: 'blogs',
            element: <Outlet />,
            children: [
              { path: '', element: <BlogsListPage /> },
              { path: 'add', element: <BlogsFormPage /> },
              { path: 'edit/:id', element: <BlogsFormPage /> },
            ]
          },

          {
            path: 'settings', // Simplified path
            element: <SettingsManager />,
          },

          {

            path: 'products',
            children: [
              { path: '', element: <ProductListPage /> },
              { path: 'add', element: <ProductFormPage /> },
              { path: 'edit/:id', element: <ProductFormPage /> },
            ],
          },

          {
            path: 'mainCategory',
            children: [
              { path: '', element: <MainCategoryPage /> },
              { path: 'add', element: <MainCategoryFormPage /> },
              { path: 'edit/:id', element: <MainCategoryFormPage /> },
            ],
          },

          {
            path: 'category',
            children: [
              { path: '', element: <CategoryPage /> },
              { path: 'add', element: <CategoryFormPage /> },
              { path: 'edit/:id', element: <CategoryFormPage /> },
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

            path: 'offer',
            children: [
              { path: '', element: <OfferListPage /> },
              { path: 'add', element: <OfferFormPage /> },
              { path: 'edit/:id', element: <OfferFormPage /> },
            ],
          },
          {
            path: 'shipment-methods',
            children: [
              { path: '', element: <ShipmentMethodsListPage /> },
              { path: 'add', element: <ShipmentMethodsFormPage /> },
              { path: 'edit/:id', element: <ShipmentMethodsFormPage /> },
            ],
          },
          {
            path: 'trash',
            children: [
              { path: 'subcategory', element: <SubcategoryTrashPage /> },
              { path: 'brand', element: <BrandTrashPage /> },
              { path: 'products', element: <ProductTrashPage /> },
              { path: 'mainCategory', element: <TrashMainCategoryPage /> },
              { path: 'category', element: <CategoryTrashPage />, },
              { path: 'faq', element: <FaqTrashPage />, },
              { path: 'blog-category', element: <BlogTrashPage /> },
              { path: 'blogs', element: <BlogsTrashPage /> },
            ]
          },
          {
            path: 'newsLetters',
            children: [
              { path: '', element: <NewsLetterPage /> },
              { path: 'add', element: <NewsLetterFormPage /> },
              { path: 'edit/:id', element: <NewsLetterFormPage /> },
            ],
          },
          {
            path: 'promotions',
            children: [
              { path: '', element: <PromotionsListPage /> },
              { path: 'add', element: <PromotionsFormPage /> },
              { path: 'edit/:id', element: <PromotionsFormPage /> },
            ],
          },
          {
            path: 'banners',
            children: [
              {
                index: true,
                element: <Navigate to="banner-one?tab=banner-one" replace />
              },
              {
                path: 'banner-one',
                element: <BannerOneFormPage />
              },
              {
                path: 'banner-two',
                element: <BannerTwoFormPage />
              }
            ]
          },
          {
            path: 'reviews',
            children: [
              { path: '', element: <ReviewListPage /> },
            ]
          },

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




