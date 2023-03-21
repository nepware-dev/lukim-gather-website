import React, {useCallback, useState} from 'react';
import {gql, useMutation} from '@apollo/client';
import {useSelector} from 'react-redux';

import DashboardHeader from '@components/DashboardHeader';
import DashboardLayout from '@components/DashboardLayout';
import AccountTab from '@components/AccountTab';
import InputField from '@components/InputField';
import Button from '@components/Button';
import OTPInput from '@components/OtpInput';

import useToast from '@hooks/useToast';
import {rootState} from '@store/rootReducer';
import {PHONE_NUMBER_CHANGE, PHONE_NUMBER_CHANGE_VERIFY} from '@services/queries';

import classes from './styles';

export const CHANGE_PASSWORD = gql`
    mutation ChangePassword($data: ChangePasswordInput!) {
        changePassword(data: $data) {
            ok
        }
    }
`;

const AccountSettings = () => {
  const toast = useToast();
  const {
    auth: {
      user: {email},
    },
  } = useSelector((state: rootState) => state);

  const [currentPassword, setCurrentPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [newPhoneNumber, setNewPhoneNumber] = useState<string>('');
  const [pin, setPin] = useState('');
  const [showOtpForm, setShowOtpForm] = useState<boolean>(false);

  const [changePassword, {loading}] = useMutation(CHANGE_PASSWORD, {
    onCompleted: () => {
      toast('success', 'Password has been successfully changed!');
      setCurrentPassword('');
      setNewPassword('');
    },
    onError: (err) => {
      setError(String(err));
      toast('error', String(err));
    },
  });

  const handleChangePassword = useCallback(async () => {
    await changePassword({
      variables: {
        data: {
          password: currentPassword,
          newPassword,
          rePassword: newPassword,
        },
      },
    });
  }, [changePassword, currentPassword, newPassword]);

  const handleCurrentPassword = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setCurrentPassword(e.target.value);
    },
    [],
  );

  const handleNewPassword = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setNewPassword(e.target.value);
    },
    [],
  );

  const handlePhoneChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setNewPhoneNumber(e.target.value);
    },
    [],
  );

  const [changePhone, {loading: changePhoneLoading}] = useMutation(PHONE_NUMBER_CHANGE, {
    onCompleted: () => {
      toast('success', 'OTP has been sent to your new mobile number.');
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

  const handlePinChange = useCallback(
    (otp) => {
      setPin(otp);
    },
    [],
  );

  const handleTab = useCallback(() => {
    setShowOtpForm(false);
    setPin('');
  }, []);

  const [changePhoneVerify, {loading: verifyLoading}] = useMutation(
    PHONE_NUMBER_CHANGE_VERIFY,
    {
      onCompleted: () => {
        toast('success', 'Your phone number has been successfully changed!');
        handleTab();
      },
      onError: (err) => {
        toast('error', String(err));
      },
    },
  );

  const handleChangePhoneVerify = useCallback(async () => {
    await changePhoneVerify({
      variables: {
        data: {
          pin: parseInt(pin, 10),
        },
      },
    });
  }, [changePhoneVerify, pin]);

  return (
    <DashboardLayout>
      <DashboardHeader />
      <div className={classes.container}>
        <h2 className={classes.title}>Account Settings</h2>
        <div className={classes.contentWrapper}>
          <div className={classes.tabsWrapper}>
            <AccountTab
              text={email ? 'Password' : 'Phone Number'}
              isActive
              onClick={handleTab}
            />
          </div>
          <div className='w-fit'>
            {email ? (
              <div className={classes.inputsWrapper}>
                <InputField
                  password
                  title='Current password'
                  placeholder='Enter your current password'
                  value={currentPassword}
                  onChange={handleCurrentPassword}
                  inputClassname={classes.input}
                />
                <InputField
                  password
                  title='New password'
                  placeholder='Enter your new password'
                  value={newPassword}
                  onChange={handleNewPassword}
                  inputClassname={classes.input}
                />
                <Button
                  text='Save Changes'
                  onClick={handleChangePassword}
                  disabled={!currentPassword || !newPassword}
                  loading={!error && loading}
                />
              </div>
            ) : (
              <div>
                {showOtpForm ? (
                  <div className={classes.inputsWrapper}>
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
                      onClick={handleChangePhoneVerify}
                      disabled={pin.length < 6 || verifyLoading}
                      loading={changePhoneLoading}
                    />
                    <div className={classes.textWrapper}>
                      <p className={classes.text}>{'Didn\'t receive code?'}</p>
                      <button
                        type='button'
                        disabled={verifyLoading}
                        className={classes.cursor}
                        onClick={handleVerifyPhone}
                      >
                        <p className={classes.sendAgain}>Send it again</p>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className={classes.inputsWrapper}>
                    <InputField
                      title='New phone number (with country code)'
                      value={newPhoneNumber}
                      placeholder='Enter your new phone number'
                      onChange={handlePhoneChange}
                      inputClassname={classes.input}
                    />
                    <Button
                      text='Continue'
                      onClick={handleVerifyPhone}
                      disabled={changePhoneLoading}
                      loading={changePhoneLoading}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AccountSettings;
