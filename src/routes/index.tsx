import React from 'react';
import {Route, Routes} from 'react-router-dom';

import Home from '@containers/Home';
import Dashboard from '@containers/Dashboard';
import Surveys from '@containers/Surveys';

const AppRoutes = () => (
  <Routes>
    <Route path='/' element={<Home />} />
    <Route path='/dashboard' element={<Dashboard />} />
    <Route path='/surveys' element={<Surveys />} />
  </Routes>
);

export default AppRoutes;
