import React, { Suspense, useEffect } from 'react';
import { useRoutes } from 'react-router-dom';
import routes from './components/shared/Routes';
import Loader from './components/atoms/Loader';

const App: React.FC = () => {
  const element = useRoutes(routes);

 

  return (
    <Suspense fallback={<Loader />}>
      {element}
    </Suspense>
  );
};

export default App;