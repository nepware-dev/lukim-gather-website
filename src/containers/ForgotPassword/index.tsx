import React, {useCallback, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {BsArrowLeftShort} from 'react-icons/bs';
import {useMutation} from '@apollo/client';
import cs from '@utils/cs';

import Navbar from '@components/Navbar';
import InputField from '@components/InputField';
import Button from '@components/Button';

import {PASSWORD_RESET, PASSWORD_RESET_VERIFY} from '@services/gql';

import classes from './styles';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>('');
  const [pin, setPin] = useState<string>('');
  const [error, setError] = useState<string>();
  const [showMailSentInfo, setShowMailSentInfo] = useState<boolean>(false);

  const handleEmailChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setEmail(e.target.value);
    },
    [],
  );

  const handleOtpChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setPin(e.target.value);
    },
    [],
  );

  const handleGoBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const handleHideMailSentInfo = useCallback(() => {
    setShowMailSentInfo(false);
  }, []);

  const [passwordReset, {loading}] = useMutation(PASSWORD_RESET, {
    onCompleted: () => {
      console.log('Code successfully sent !!');
      setShowMailSentInfo(true);
    },
    onError: ({graphQLErrors}) => {
      setError(graphQLErrors[0].message);
    },
  });

  const handlePasswordReset = useCallback(async () => {
    await passwordReset({
      variables: {
        data: {
          username: email.toLowerCase(),
        },
      },
    });
  }, [passwordReset, email]);

  const [emailConfirmVerify, {loading: otpLoading}] = useMutation(PASSWORD_RESET_VERIFY, {
    onCompleted: (res) => {
      console.log(res);
      navigate('/reset-password');
    },
    onError: (err) => {
      console.log(err);
    },
  });

  const handleEmailVerify = useCallback(async () => {
    await emailConfirmVerify({
      variables: {
        data: {
          username: email.toLowerCase(),
          pin: parseInt(pin, 10),
        },
      },
    });
  }, [emailConfirmVerify, email, pin]);

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
              <h2 className={classes.title}>
                Forgot password?
              </h2>
            </div>
            <p className={classes.info}>
              Enter the email address you used to create your Lukim Gather
              account. We’ll send you a password reset email.
            </p>
            {error && <p className={classes.error}>{error}</p>}
            <InputField
              title='Email address'
              value={email}
              placeholder='John@example'
              onChange={handleEmailChange}
            />
            <Button
              text='Send reset mail'
              className={classes.button}
              disabled={!email || loading}
              loading={loading}
              onClick={handlePasswordReset}
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
            <InputField
              title='OTP'
              value={pin}
              placeholder=''
              onChange={handleOtpChange}
            />
            <Button
              text='Verify'
              className={classes.button}
              disabled={!pin || otpLoading}
              loading={otpLoading}
              onClick={handleEmailVerify}
            />
            <div className={classes.textWrapper}>
              <p className={classes.text}>{'Didn\'t receive email?'}</p>
              <div className={classes.cursor} onClick={handlePasswordReset}>
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
