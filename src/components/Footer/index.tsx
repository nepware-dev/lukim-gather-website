import React from 'react';
import {Link} from 'react-router-dom';
import AppButton from '@components/AppButton';

import CepaLogo from '@images/cepa.webp';
import GefLogo from '@images/gef.webp';
import UndpLogo from '@images/undp.webp';
import biodiversity from '@images/biodiversity.svg';

import classes from './styles';

const Footer = ({hideContent = false}: {hideContent?: boolean}) => (
  <footer>
    {!hideContent && (
      <div className={classes.container}>
        <h2 className={classes.partnerTitle}>Partners</h2>
        <div className={classes.contentWrapper}>
          <div className={classes.partnersWrapper}>
            <div className={classes.partnersImgWrapper}>
              <img src={biodiversity} alt='biodiversity' className={classes.partnerImage} />
              <img src={GefLogo} alt='gef' className={classes.partnerImage} />
              <img src={CepaLogo} alt='cepa' className={classes.partnerImage} />
              <img src={UndpLogo} alt='undp' className={classes.undpImage} />
            </div>
          </div>
          <div className={classes.buttons}>
            <AppButton bgGrey />
            <a href='https://play.google.com/store/apps/details?id=org.lukimgather' target='_blank' rel='noreferrer'>
              <AppButton android bgGrey available beta />
            </a>
          </div>
        </div>
      </div>
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
