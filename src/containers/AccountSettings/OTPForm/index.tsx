import React, {useCallback, useState} from 'react';

import Button from '@components/Button';
import OTPInput from '@components/OtpInput';

import classes from './styles';

interface OTPFormProps {
  onSubmitPin: (pin: string) => void;
  onResendPin: () => void;
  loading?: boolean;
}

const OTPForm: React.FC<OTPFormProps> = (props) => {
  const {onSubmitPin, onResendPin, loading} = props;

  const [pin, setPin] = useState<string>('');

  const handlePinChange = useCallback(
    (otp: string) => {
      setPin(otp);
    },
    [],
  );

  const handleSubmitPin = useCallback(() => onSubmitPin(pin), [pin, onSubmitPin]);

  return (
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
        onClick={handleSubmitPin}
        disabled={pin.length < 6 || loading}
        loading={loading}
      />
      <div className={classes.textWrapper}>
        <p className={classes.text}>{'Didn\'t receive code?'}</p>
        <button
          type='button'
          disabled={loading}
          className={classes.cursor}
          onClick={onResendPin}
        >
          <p className={classes.sendAgain}>Send it again</p>
        </button>
      </div>
    </div>
  );
};

export default OTPForm;
