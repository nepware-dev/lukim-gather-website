import React from 'react';
import {
  Navigate, Outlet, Route, Routes,
} from 'react-router-dom';
import {RootStateOrAny, useSelector} from 'react-redux';

import Home from '@containers/Home';
import Dashboard from '@containers/Dashboard';
import Surveys from '@containers/Surveys';
import Login from '@containers/Login';

interface Props {
  isAuthenticated: boolean;
}

const PrivateRoute: React.FC<Props> = ({
  isAuthenticated,
}) => (isAuthenticated ? <Outlet /> : <Navigate to='/login' />);

const AppRoutes = () => {
  const isAuthenticated = useSelector((state: RootStateOrAny) => state.auth.isAuthenticated);
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/login' element={<Login />} />
      <Route path='/' element={<PrivateRoute isAuthenticated={isAuthenticated} />}>
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/surveys' element={<Surveys />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;