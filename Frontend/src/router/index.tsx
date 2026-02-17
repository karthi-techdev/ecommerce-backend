import { createBrowserRouter } from 'react-router-dom';
import Layout from '../components/shared/Layout';
import Dashboard from '../components/templates/dashboard/Dashboard';
import FaqListTemplate from '../components/templates/faq/FaqListTemplate';
import FaqFormTemplate from '../components/templates/faq/FaqFormTemplate';
import TestimonialFormTemplate from '../components/templates/testimonial/testFormTemplate';
import TestimonialListTemplate from '../components/templates/testimonial/testListTemplate';
import TestFormPage from '../components/pages/Testimonials/TestFormPage';

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
        path: 'testimonial',
        children: [
          {
            path: '',
            element: <TestimonialListTemplate />,
          },
          {
            path: 'add',
            element: <TestimonialFormTemplate />,
          },
          {
            path: 'edit/:id',
            element: <TestFormPage />,
          },
        ],
      },
    ],
  },
]);