import React, {useMemo} from 'react';
import {Outlet, useLocation} from 'react-router-dom';
import MailchimpSubscribe from 'react-mailchimp-subscribe';

import Navbar from '@components/Navbar';
import Footer from '@components/Footer';
import MailChimpForm from '@components/MailChimp';
import Notice from '@components/NoticeBar';

import useGaTracker from '@hooks/useGaTracker';

import cs from '@utils/cs';

import mobile from '@images/mobile.png';

import classes from './styles';

const Layout = () => {
  useGaTracker();
  const location = useLocation();

  const isDarkNavbar = useMemo(() => {
    if (location.pathname === '/faq' || location.pathname === '/tutorial') {
      return true;
    } return false;
  }, [location.pathname]);

  return (
    <main>
      <Notice />
      <div className={classes.mainContainer}>
        <Navbar isDark={isDarkNavbar} />
        <div className={cs(!isDarkNavbar ? classes.container : '')}>
          <Outlet />
        </div>
      </div>
      <div className={classes.contentWrapper}>
        {location.pathname === '/' && (
          <p className={classes.appInfo}>
            It enables local communities to report both threats and perceived
            benefits and values that occur within and around protected areas. It
            does this by empowering users to collect and share local data,
            ensuring that Papua New Guinea’s rich biodiversity is afforded
            greater protection from the negative impacts of climate change and
            other environmental threats.
          </p>
        )}
        <div>
          <section className={classes.formWrapper}>
            <div className={classes.formContent}>
              <h2 className={classes.formTitle}>
                Want to keep updated?
              </h2>
              <p className={classes.formText}>
                Sign up for updates on Lukim Gather
              </p>
              <MailchimpSubscribe
                url={`${process.env.REACT_APP_MAILCHIMP_URL}`}
                render={({subscribe, status, message}) => (
                  <MailChimpForm
                    status={status}
                    message={message}
                    onValidated={(formData) => subscribe(formData)}
                  />
                )}
              />
            </div>
            <div className={classes.mobileImgWrapper}>
              <img src={mobile} alt='' className={classes.mobileImage} />
            </div>
          </section>
        </div>
        <Footer />
      </div>
    </main>
  );
};

export default Layout;
