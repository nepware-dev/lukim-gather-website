import React from 'react';
import MailchimpSubscribe from 'react-mailchimp-subscribe';

import Navbar from '@components/Navbar';
import Footer from '@components/Footer';
import MailChimpForm from '@components/MailChimp';

import useGaTracker from '@hooks/useGaTracker';

import mobile from '@images/mobile.png';

import classes from './styles';

const Layout = (
  {children, showAppInfo}: {children: JSX.Element, showAppInfo?: boolean},
) => {
  useGaTracker();
  return (
    <main>
      <div className={classes.mainContainer}>
        <Navbar />
        <div className={classes.container}>
          {children}
        </div>
      </div>
      <div className={classes.contentWrapper}>
        {showAppInfo && (
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
