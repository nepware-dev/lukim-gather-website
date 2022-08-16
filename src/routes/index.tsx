import React, {useEffect} from 'react';
import {
  Navigate, Outlet, Route, Routes, useLocation,
} from 'react-router-dom';
import {RootStateOrAny, useSelector} from 'react-redux';

import Home from '@containers/Home';
import Dashboard from '@containers/Dashboard';
import Surveys from '@containers/Surveys';
import CustomForms from '@containers/CustomForms';
import Login from '@containers/Login';
import AccountSettings from '@containers/AccountSettings';
import ResetPassword from '@containers/ResetPassword';
import ForgotPassword from '@containers/ForgotPassword';
import Page404 from '@containers/Page404';
import PrivacyPolicy from '@containers/PrivacyPolicy';
import TermsAndConditions from '@containers/TermsAndConditions';
import FAQ from '@containers/FAQ';
import Resource from '@containers/Resource';
import Notice from '@components/NoticeBar';

interface Props {
  isAuthenticated: boolean;
}

const PrivateRoute: React.FC<Props> = ({isAuthenticated}) => (isAuthenticated ? <Outlet /> : <Navigate to='/login' />);

const AppRoutes = () => {
  const {pathname} = useLocation();
  const isAuthenticated = useSelector(
    (state: RootStateOrAny) => state.auth.isAuthenticated,
  );

  useEffect(() => {
    window.scrollTo({top: 0, behavior: 'smooth'});
  }, [pathname]);
  return (
    <>
      <Notice />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/resource' element={<Resource />} />
        <Route path='/faq' element={<FAQ />} />
        <Route path='/privacy' element={<PrivacyPolicy />} />
        <Route path='/terms' element={<TermsAndConditions />} />
        <Route path='/login' element={<Login />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path='/reset-password' element={<ResetPassword />} />
        <Route
          path='/'
          element={<PrivateRoute isAuthenticated={isAuthenticated} />}
        >
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/surveys' element={<Surveys />} />
          <Route path='/surveys/:uuid' element={<Surveys />} />
          <Route path='/custom-forms' element={<CustomForms />} />
          <Route path='/custom-forms/:id' element={<CustomForms />} />
          <Route path='/account-settings' element={<AccountSettings />} />
        </Route>
        <Route path='*' element={<Page404 />} />
      </Routes>
    </>
  );
};

export default AppRoutes;
