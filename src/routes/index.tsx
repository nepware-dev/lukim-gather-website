import React, {useEffect} from 'react';
import {
  Navigate, Outlet, Route, Routes, useLocation,
} from 'react-router-dom';
import {RootStateOrAny, useSelector} from 'react-redux';

import AccountSettings from '@containers/AccountSettings';
import CustomForms from '@containers/CustomForms';
import Dashboard from '@containers/Dashboard';
import FAQ from '@containers/FAQ';
import ForgotPassword from '@containers/ForgotPassword';
import Home from '@containers/Home';
import Login from '@containers/Login';
import Organization from '@containers/Organization';
import Project from '@containers/Project';
import OrganizationDetails from '@containers/OrganizationDetails';
import ProjectDetail from '@containers/ProjectDetail';
import Notice from '@components/NoticeBar';
import Page404 from '@containers/Page404';
import PrivacyPolicy from '@containers/PrivacyPolicy';
import ResetPassword from '@containers/ResetPassword';
import Resource from '@containers/Resource';
import Surveys from '@containers/Surveys';
import TermsAndConditions from '@containers/TermsAndConditions';
import Tutorial from '@containers/Tutorial';
import VerifyPhone from '@containers/VerifyPhone';

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
        <Route path='/faq' element={<FAQ />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path='/login' element={<Login />} />
        <Route path='/verify-phone' element={<VerifyPhone />} />
        <Route path='/privacy' element={<PrivacyPolicy />} />
        <Route path='/reset-password' element={<ResetPassword />} />
        <Route path='/resource' element={<Resource />} />
        <Route path='/terms' element={<TermsAndConditions />} />
        <Route path='/tutorial' element={<Tutorial />} />
        <Route
          path='/'
          element={<PrivateRoute isAuthenticated={isAuthenticated} />}
        >
          <Route path='/account-settings' element={<AccountSettings />} />
          <Route path='/custom-forms' element={<CustomForms />} />
          <Route path='/custom-forms/:id' element={<CustomForms />} />
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/organization' element={<Organization />} />
          <Route path='/projects' element={<Project />} />
          <Route path='/project/:id' element={<ProjectDetail />} />
          <Route path='/organization/:id' element={<OrganizationDetails />} />
          <Route path='/surveys' element={<Surveys />} />
          <Route path='/surveys/:uuid' element={<Surveys />} />
        </Route>
        <Route path='*' element={<Page404 />} />
      </Routes>
    </>
  );
};

export default AppRoutes;
