import React, {useEffect} from 'react';
import {
  Navigate, Outlet, Route, Routes, useLocation,
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
import Notice from '@components/NoticeBar';
import Page404 from '@containers/Page404';
import PrivacyPolicy from '@containers/PrivacyPolicy';
import ResetPassword from '@containers/ResetPassword';
import Resource from '@containers/Resource';
import Surveys from '@containers/Surveys';
import SurveyAnalytics from '@containers/SurveyAnalytics';
import TermsAndConditions from '@containers/TermsAndConditions';
import Tutorial from '@containers/Tutorial';
import VerifyPhone from '@containers/VerifyPhone';
import ContactUs from '@containers/ContactUs';

import {GET_ME} from '@services/queries';
import {setUser} from '@store/slices/auth';
import {dispatchLogout} from '@services/dispatch';

interface Props {
  isAuthenticated: boolean;
}

const PrivateRoute: React.FC<Props> = ({isAuthenticated}) => (isAuthenticated ? <Outlet /> : <Navigate to='/login' />);

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
        <Route path='/contact-us' element={<ContactUs />} />
        <Route
          path='/'
          element={<PrivateRoute isAuthenticated={isAuthenticated} />}
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
        <Route path='*' element={<Page404 />} />
      </Routes>
    </>
  );
};

export default AppRoutes;
