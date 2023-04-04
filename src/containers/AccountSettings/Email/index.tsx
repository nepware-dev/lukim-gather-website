import React, {useState, useCallback, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {useMutation, useLazyQuery} from '@apollo/client';
import {BsArrowLeftShort} from 'react-icons/bs';

import InputField from '@components/InputField';
import Button from '@components/Button';

import useToast from '@hooks/useToast';
import {rootState} from '@store/rootReducer';
import {
  GET_ME,
  EMAIL_CHANGE,
  EMAIL_CHANGE_VERIFY,
  SET_PASSWORD,
} from '@services/queries';
import {dispatchLogout} from '@services/dispatch';
import {setUser} from '@store/slices/auth';

import OTPForm from '../OTPForm';

import classes from './styles';

type EmailSettingsProps = {
  onPasswordError: () => void;
};

const EmailSettings: React.FC<EmailSettingsProps> = ({onPasswordError}) => {
  const toast = useToast();

  const dispatch = useDispatch();
  const {
    auth: {
      user: {email},
    },
  } = useSelector((state: rootState) => state);

  const [showOtpForm, setShowOtpForm] = useState<boolean>(false);
  const handleHideOTPForm = useCallback(() => {
    setShowOtpForm(false);
  }, []);

  useEffect(() => () => {
    setShowOtpForm(false);
  }, []);

  const [getUserData] = useLazyQuery(GET_ME, {
    onCompleted: ({me}) => {
      dispatch(setUser(me));
    },
  });

  const [setPasswordMutation] = useMutation(SET_PASSWORD, {
    onCompleted: () => {
      getUserData();
    },
    onError: (err) => {
      getUserData();
      toast('error', `There was an error setting your password: ${String(err)} You may still set your password again from the Password tab.`);
      onPasswordError();
    },
  });

  const [emailChangeMutation, {loading: emailChangeLoading}] = useMutation(EMAIL_CHANGE, {
    onCompleted: () => {
      toast('success', 'Email confimation pin has been sent to your new email!');
      setShowOtpForm(true);
    },
    onError: (err) => {
      toast('error', String(err));
    },
  });

  const [newEmail, setNewEmail] = useState<string>(email);
  const [newPassword, setNewPassword] = useState<string>('');

  const handleNewEmailChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setNewEmail(e.target.value);
    },
    [],
  );
  const handleNewPasswordChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setNewPassword(e.target.value);
    },
    [],
  );

  const handleAddEmail = useCallback(async () => {
    if (/^\d+$/.test(newPassword)) {
      toast('error', 'Your password must not be entirely numeric!');
    } else if (newPassword.length < 8) {
      toast('error', 'Your password must contain at least 8 characters!');
    } else {
      await emailChangeMutation({
        variables: {
          data: {
            newEmail: newEmail.trim().toLowerCase(),
            option: 'ADD',
          },
        },
      });
    }
  }, [emailChangeMutation, newEmail, newPassword, toast]);

  const handleEmailChange = useCallback(async () => {
    await emailChangeMutation({
      variables: {
        data: {
          newEmail: newEmail.trim().toLowerCase(),
          option: 'CHANGE',
        },
      },
    });
  }, [emailChangeMutation, newEmail]);

  const [
    emailChangeVerifyMutation,
    {loading: emailChangeVerifyLoading},
  ] = useMutation(EMAIL_CHANGE_VERIFY, {
    onCompleted: async () => {
      setShowOtpForm(false);
      if (email) {
        toast('success', 'Your email has been successfully changed. You may login again with your new email or phone number!');
        dispatchLogout();
      } else {
        toast('success', 'Your email has been successfully changed.');
        await setPasswordMutation({
          variables: {
            data: {
              newPassword,
              rePassword: newPassword,
            },
          },
        });
      }
    },
    onError: (err) => {
      toast('error', String(err));
    },
  });

  const handlePinSubmit = useCallback(async (pin: string) => {
    await emailChangeVerifyMutation({
      variables: {
        data: {
          pin: Number(pin),
        },
      },
    });
  }, [emailChangeVerifyMutation]);

  const handleFormSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail) {
      toast('error', 'Please enter email to change!');
    } else if (email) {
      handleEmailChange();
    } else {
      handleAddEmail();
    }
  }, [handleAddEmail, handleEmailChange, email, newEmail, toast]);

  if (showOtpForm) {
    return (
      <div>
        <div className={classes.backLink} onClick={handleHideOTPForm}>
          <BsArrowLeftShort size={25} color='#101828' />
          <span className={classes.backLinkText}>Back</span>
        </div>
        <OTPForm
          onSubmitPin={handlePinSubmit}
          onResendPin={handleEmailChange}
          loading={emailChangeVerifyLoading || emailChangeLoading}
        />
      </div>
    );
  }

  return (
    <form className={classes.inputsWrapper} onSubmit={handleFormSubmit}>
      <div>
        <InputField
          value={newEmail}
          onChange={handleNewEmailChange}
          title={email ? 'Email' : 'Add email'}
          placeholder='Enter your new email'
          inputClassname={classes.input}
        />
        {email ? (
          <>
            <p className={classes.inputInfo}>
              When you change your email, we will send you an email at your new
              address to confirm it. The new address will not become active
              until confirmed.
            </p>
            <p className={classes.inputInfo}>
              Please note that you will be logged out of your account when your email
              is changed. You may log back in using your new email address.
            </p>
          </>
        ) : (
          <p className={classes.inputInfo}>
            When you add an email, we will send you an email at that address to
            confirm it. Your email will not be set until confirmed.
          </p>
        )}
      </div>
      {!email && (
        <div>
          <InputField
            value={newPassword}
            onChange={handleNewPasswordChange}
            title='Password'
            placeholder='Enter password'
            inputClassname={classes.input}
            password
          />
          <p className={classes.inputInfo}>
            Your password can&apos;t be too similar to your other personal information.
          </p>
          <p className={classes.inputInfo}>
            Your password must contain at least 8 characters.
          </p>
          <p className={classes.inputInfo}>
            Your password can&apos;t be a commonly used password.
          </p>
          <p className={classes.inputInfo}>
            Your password can&apos;t be entirely numeric.
          </p>
        </div>
      )}
      <Button
        text={email ? 'Continue' : 'Add email'}
        onClick={email ? handleEmailChange : handleAddEmail}
        disabled={!newEmail || email === newEmail || emailChangeLoading}
        loading={emailChangeLoading}
      />
    </form>
  );
};

export default EmailSettings;
