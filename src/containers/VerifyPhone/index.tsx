import React, {useCallback, useState, useEffect} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import {gql, useMutation} from '@apollo/client';
import {BsArrowLeftShort} from 'react-icons/bs';

import cs from '@utils/cs';
import useToast from '@hooks/useToast';
import {dispatchLogin} from '@services/dispatch';

import Navbar from '@components/Navbar';
import Button from '@components/Button';
import OTPInput from '@components/OtpInput';

import classes from './styles';

const PHONE_NUMBER_CONFIRM = gql`
    mutation PhoneNumberConfirm($data: PhoneNumberConfirmInput!) {
        phoneNumberConfirm(data: $data) {
            ok
            errors
        }
    }
`;

const PHONE_NUMBER_CONFIRM_VERIFY = gql`
    mutation PhoneNumberConfirmVerify($data: PhoneNumberConfirmInput!) {
        phoneNumberVerify(data: $data) {
            token
            refreshToken
            user {
                id
                firstName
                lastName
                email
                organization
                avatar
            }
        }
    }
`;

const VerifyPhone = () => {
  const location: {state: any} = useLocation();
  const navigate = useNavigate();
  const toast = useToast();
  const [error, setError] = useState<string>();
  const [pin, setPin] = useState('');

  const handlePinChange = useCallback(
    (otp) => {
      setPin(otp);
    },
    [],
  );

  const [phoneConfirmVerify, {loading}] = useMutation(PHONE_NUMBER_CONFIRM_VERIFY, {
    onCompleted: ({phoneNumberVerify}) => {
      const {token, refreshToken, user} = phoneNumberVerify;
      dispatchLogin(token, refreshToken, user);
      toast('success', 'Successfully verified Phone!!');
      navigate('/dashboard');
    },
    onError: ({graphQLErrors}) => {
      setError(graphQLErrors[0].message);
      toast('error', graphQLErrors[0]?.message || 'Something went wrong, Please enter valid credentials');
    },
  });

  const handlePhoneConfirmVerify = useCallback(async () => {
    await phoneConfirmVerify({
      variables: {
        data: {
          username: location?.state?.username,
          pin: parseInt(pin, 10),
        },
      },
    });
  }, [phoneConfirmVerify, pin, location]);

  const [phoneConfirm, {loading: resendLoading}] = useMutation(PHONE_NUMBER_CONFIRM, {
    onCompleted: () => {
      toast('success', 'Code successfully sent !!');
    },
    onError: ({graphQLErrors}) => {
      setError(graphQLErrors[0].message);
      toast('error', graphQLErrors[0]?.message || 'Something went wrong, Please enter valid credentials');
    },
  });

  const handleResendCode = useCallback(async () => {
    await phoneConfirm({
      variables: {
        data: {
          username: location?.state?.username,
        },
      },
    });
  }, [location?.state?.username, phoneConfirm]);

  const handleGoBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  useEffect(() => {
    if (!location?.state?.username) {
      navigate(-1);
    }
  }, [location?.state?.username, navigate]);

  return (
    <div className={classes.mainContainer}>
      <div className={classes.container}>
        <Navbar />
        <div
          className={cs(classes.contentContainer)}
        >
          <div className={classes.contentWrapper}>
            <div className={classes.header}>
              <BsArrowLeftShort
                size={35}
                color='#101828'
                onClick={handleGoBack}
                className={classes.cursor}
              />
              <h2 className={classes.title}>Verify phone number?</h2>
            </div>
            <div>
              <OTPInput
                autoFocus
                isNumberInput
                length={6}
                className={classes.otpContainer}
                inputClassName={classes.otpInput}
                onChangeOTP={handlePinChange}
              />
              <Button
                text='Verify'
                className={classes.button}
                onClick={handlePhoneConfirmVerify}
                disabled={pin.length < 6 || loading}
                loading={!error && loading}
              />
            </div>
            <div className={classes.textWrapper}>
              <p className={classes.text}>{'Didn\'t receive code?'}</p>
              <button
                type='button'
                disabled={resendLoading}
                className={classes.cursor}
                onClick={handleResendCode}
              >
                <p className={classes.sendAgain}>Send it again</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyPhone;
