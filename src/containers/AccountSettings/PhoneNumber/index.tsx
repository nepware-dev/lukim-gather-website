import React, {useState, useCallback} from 'react';
import {useSelector, type RootStateOrAny} from 'react-redux';
import {useMutation} from '@apollo/client';
import {BsArrowLeftShort} from 'react-icons/bs';

import InputField from '@components/InputField';
import Button from '@components/Button';

import useToast from '@hooks/useToast';
import {PHONE_NUMBER_CHANGE, PHONE_NUMBER_CHANGE_VERIFY} from '@services/queries';
import {dispatchLogout} from '@services/dispatch';

import OTPForm from '../OTPForm';

import classes from './styles';

const PhoneSettings:React.FC = () => {
  const {user} = useSelector((state: RootStateOrAny) => state.auth);
  const phoneNumber = user?.phoneNumber;

  const toast = useToast();

  const [newPhoneNumber, setNewPhoneNumber] = useState<string>(phoneNumber || '');
  const [showOtpForm, setShowOtpForm] = useState<boolean>(false);
  const handleHideOTPForm = useCallback(() => {
    setShowOtpForm(false);
  }, []);

  const handlePhoneChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setNewPhoneNumber(e.target.value);
    },
    [],
  );

  const [changePhone, {loading: changePhoneLoading}] = useMutation(PHONE_NUMBER_CHANGE, {
    onCompleted: () => {
      toast('success', 'OTP has been sent to your new phone number.');
      setShowOtpForm(true);
    },
    onError: (err) => {
      toast('error', String(err));
    },
  });

  const handleVerifyPhone = useCallback(async () => {
    await changePhone({
      variables: {
        data: {
          newPhoneNumber,
        },
      },
    });
  }, [changePhone, newPhoneNumber]);

  const handleFormSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    handleVerifyPhone();
  }, [handleVerifyPhone]);

  const [changePhoneVerify, {loading: verifyLoading}] = useMutation(
    PHONE_NUMBER_CHANGE_VERIFY,
    {
      onCompleted: () => {
        toast('success', 'Your phone number has been successfully changed! Please login again using your new phone number, or your email');
        dispatchLogout();
      },
      onError: (err) => {
        toast('error', String(err));
      },
    },
  );

  const handleChangePhoneVerify = useCallback(async (pin: string) => {
    await changePhoneVerify({
      variables: {
        data: {
          pin: Number(pin),
        },
      },
    });
  }, [changePhoneVerify]);

  if (showOtpForm) {
    return (
      <div>
        <div className={classes.backLink} onClick={handleHideOTPForm}>
          <BsArrowLeftShort size={25} color='#101828' />
          <span className={classes.backLinkText}>Back</span>
        </div>
        <OTPForm
          onSubmitPin={handleChangePhoneVerify}
          onResendPin={handleVerifyPhone}
          loading={changePhoneLoading || verifyLoading}
        />
      </div>
    );
  }

  return (
    <form className={classes.inputsWrapper} onSubmit={handleFormSubmit}>
      <div>
        <InputField
          title='New phone number (with country code)'
          value={newPhoneNumber}
          placeholder='Enter your new phone number'
          onChange={handlePhoneChange}
          inputClassname={classes.input}
        />
        <p className={classes.infoText}>
          {'Please note that you will be logged out once you\'ve verified your new phone number. You may login again using your new phone number, or email.'}
        </p>
      </div>
      <Button
        text='Continue'
        onClick={handleVerifyPhone}
        disabled={!newPhoneNumber || newPhoneNumber === phoneNumber || changePhoneLoading}
        loading={changePhoneLoading}
      />
    </form>
  );
};

export default PhoneSettings;
