import React, {useEffect} from 'react';
import {
  Navigate, Route, Routes, useLocation,
} from 'react-router-dom';
import {RootStateOrAny, useSelector, useDispatch} from 'react-redux';
import {useLazyQuery} from '@apollo/client';

import AccountSettings from '@containers/AccountSettings';
import CustomForms from '@containers/CustomForms';
import CustomFormAnalytics from '@containers/CustomFormAnalytics';
import Dashboard from '@containers/Dashboard';
import FAQ from '@containers/FAQ';
import ForgotPassword from '@containers/ForgotPassword';
import Home from '@containers/Home';
import Login from '@containers/Login';
import Organization from '@containers/Organization';
import Project from '@containers/Project';
import OrganizationDetails from '@containers/OrganizationDetails';
import ProjectDetail from '@containers/ProjectDetail';
import Page404 from '@containers/Page404';
import PrivacyPolicy from '@containers/PrivacyPolicy';
import PublicSurvey from '@containers/PublicSurvey';
import PublicCustomForm from '@containers/PublicCustomForm';
import ResetPassword from '@containers/ResetPassword';
import Resource from '@containers/Resource';
import Surveys from '@containers/Surveys';
import SurveyAnalytics from '@containers/SurveyAnalytics';
import TermsAndConditions from '@containers/TermsAndConditions';
import Tutorial from '@containers/Tutorial';
import VerifyPhone from '@containers/VerifyPhone';
import ContactUs from '@containers/ContactUs';

import DashboardLayout from '@components/DashboardLayout';

import {GET_ME} from '@services/queries';
import {setUser} from '@store/slices/auth';
import {dispatchLogout} from '@services/dispatch';
import Layout from '@components/Layout';

const PrivateRoute: React.FC<{
  isAuthenticated: boolean;
  children: React.ReactNode;
}> = ({isAuthenticated, children}) => {
  if (!isAuthenticated) {
    return <Navigate to='/login' />;
  }
  return <main>{children}</main>;
};

const AppRoutes = () => {
  const {pathname} = useLocation();

  const dispatch = useDispatch();
  const isAuthenticated = useSelector(
    (state: RootStateOrAny) => state.auth.isAuthenticated,
  );

  useEffect(() => {
    window.scrollTo({top: 0, behavior: 'smooth'});
  }, [pathname]);

  const [getUserData] = useLazyQuery(GET_ME, {
    onCompleted: ({me}) => {
      dispatch(setUser(me));
    },
    onError: () => {
      dispatchLogout();
    },
  });
  useEffect(() => {
    if (isAuthenticated) {
      getUserData();
    }
  }, [isAuthenticated, getUserData]);

  return (
    <Routes>
      <Route path='/' element={<Layout />}>
        <Route path='/' element={<Home />} />
        <Route path='/faq' element={<FAQ />} />
        <Route path='/privacy-policy' element={<PrivacyPolicy />} />
        <Route path='/resource' element={<Resource />} />
        <Route path='/terms-and-conditions' element={<TermsAndConditions />} />
        <Route path='/tutorial' element={<Tutorial />} />
        <Route path='/contact-us' element={<ContactUs />} />
      </Route>
      <Route path='/reset-password' element={<ResetPassword />} />
      <Route path='/forgot-password' element={<ForgotPassword />} />
      <Route path='/login' element={<Login />} />
      <Route path='/verify-phone' element={<VerifyPhone />} />
      <Route
        path='/'
        element={(
          <PrivateRoute isAuthenticated={isAuthenticated}>
            <DashboardLayout />
          </PrivateRoute>
        )}
      >
        <Route path='/account-settings' element={<AccountSettings />} />
        <Route path='/custom-forms' element={<CustomForms />} />
        <Route path='/custom-forms/analytics' element={<CustomFormAnalytics />} />
        <Route path='/custom-forms/:id' element={<CustomForms />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/organization' element={<Organization />} />
        <Route path='/projects' element={<Project />} />
        <Route path='/project/:id' element={<ProjectDetail />} />
        <Route path='/organization/:id' element={<OrganizationDetails />} />
        <Route path='/surveys' element={<Surveys />} />
        <Route path='/surveys/:uuid' element={<Surveys />} />
        <Route path='/surveys/analytics' element={<SurveyAnalytics />} />
      </Route>
      <Route path='/public/survey/:id' element={<PublicSurvey />} />
      <Route path='/public/mett-survey/:id' element={<PublicCustomForm />} />
      <Route path='*' element={<Page404 />} />
    </Routes>
  );
};

export default AppRoutes;
