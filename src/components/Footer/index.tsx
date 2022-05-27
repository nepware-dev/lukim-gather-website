import React from 'react';
import {Link} from 'react-router-dom';
import AppButton from '@components/AppButton';

import FooterLogo from '@images/lukim-nav-logo.png';
import CepaLogo from '@images/cepa.webp';
import GefLogo from '@images/gef.webp';
import UndpLogo from '@images/undp.webp';

import classes from './styles';

const Footer = ({hideContent = false}: {hideContent?: boolean}) => (
  <footer>
    {!hideContent && (
      <>
        <div className={classes.container}>
          <img src={FooterLogo} alt='lukim-logo' className={classes.logo} />
          <div className={classes.buttons}>
            <AppButton bgGrey />
            <AppButton android bgGrey />
          </div>
        </div>
        <div className={classes.partnersWrapper}>
          <h2 className={classes.partnerTitle}>Partners</h2>
          <div className={classes.partnersImgWrapper}>
            <img src={CepaLogo} alt='cepa' className={classes.partnerImage} />
            <img src={GefLogo} alt='gef' className={classes.partnerImage} />
            <div className={classes.separator} />
            <img src={UndpLogo} alt='undp' className={classes.partnerImage} />
          </div>
        </div>
      </>
    )}
    <div className={classes.footerCred}>
      <p className={classes.text}>
        © Lukim Gather 2022. All rights reserved.
      </p>
      <div className={classes.legalLink}>
        <Link to='/terms'>
          <p className={classes.text}>
            Terms And Conditions
          </p>
        </Link>
        <Link to='/privacy'>
          <p className={classes.text}>
            Privacy Policy
          </p>
        </Link>
      </div>
    </div>
  </footer>
);

export default Footer;
