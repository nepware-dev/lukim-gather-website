import React, {useCallback, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {BsArrowLeftShort} from 'react-icons/bs';

import cs from '@utils/cs';

import Navbar from '@components/Navbar';
import InputField from '@components/InputField';
import Button from '@components/Button';

import classes from './styles';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>('');
  const [showMailSentInfo, setShowMailSentInfo] = useState<boolean>(false);

  const handleEmailChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setEmail(e.target.value);
    },
    [],
  );

  const handleSendResetMail = useCallback(() => {
    setShowMailSentInfo(true);
  }, []);

  const handleGoBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const handleHideMailSentInfo = useCallback(() => {
    setShowMailSentInfo(false);
  }, []);

  return (
    <div className={classes.mainContainer}>
      <div className={classes.container}>
        <Navbar />
        <div
          className={cs(classes.contentContainer, ['hidden', showMailSentInfo])}
        >
          <div className={classes.contentWrapper}>
            <div className={classes.header}>
              <BsArrowLeftShort
                size={35}
                color='#101828'
                onClick={handleGoBack}
                className={classes.cursor}
              />
              <h2 className={classes.title}>Forgot password?</h2>
            </div>
            <p className={classes.info}>
              Enter the email address you used to create your Lukim Gather
              account. We’ll send you a password reset email.
            </p>
            <InputField
              title='Email address'
              value={email}
              placeholder='John@example'
              onChange={handleEmailChange}
            />
            <Button
              text='Send reset mail'
              className={classes.button}
              onClick={handleSendResetMail}
              disabled={!email}
            />
          </div>
        </div>
        <div
          className={cs(classes.contentContainer, [
            'hidden',
            !showMailSentInfo,
          ])}
        >
          <div className={classes.contentWrapper}>
            <div className={classes.header}>
              <BsArrowLeftShort
                size={35}
                color='#101828'
                onClick={handleHideMailSentInfo}
                className={classes.cursor}
              />
              <h2 className={classes.title}>Forgot password?</h2>
            </div>
            <p className={classes.info}>
              We’ve sent an email to
              <span className={classes.email}>{` ${email}`}</span>
              . Please check
              your inbox and follow instructions to reset your password.
            </p>
            <div className={classes.textWrapper}>
              <p className={classes.text}>{'Didn\'t receive email?'}</p>
              <div className={classes.cursor}>
                <p className={classes.sendAgain}>Send it again</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
