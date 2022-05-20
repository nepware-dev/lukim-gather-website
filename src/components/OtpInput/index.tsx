import React, {
  memo, useState, useCallback, CSSProperties,
} from 'react';
import SingleInput from './SingleInput';

interface OTPInputProps {
  length: number;
  onChangeOTP: (otp: string) => any;
  autoFocus?: boolean;
  isNumberInput?: boolean;
  disabled?: boolean;
  style?: CSSProperties;
  className?: string;
  inputStyle?: CSSProperties;
  inputClassName?: string;
}

const OTPInputComponent = (props: OTPInputProps) => {
  const {
    length,
    isNumberInput,
    autoFocus,
    disabled,
    onChangeOTP,
    inputClassName,
    inputStyle,
    ...rest
  } = props;

  const [activeInput, setActiveInput] = useState(0);
  const [otpValues, setOTPValues] = useState(Array<string>(length).fill(''));

  const handleOtpChange = useCallback(
    (otp: string[]) => {
      const otpValue = otp.join('');
      onChangeOTP(otpValue);
    },
    [onChangeOTP],
  );

  const getRightValue = useCallback(
    (str: string) => {
      const changedValue = str;

      if (!isNumberInput || !changedValue) {
        return changedValue;
      }

      return Number(changedValue) >= 0 ? changedValue : '';
    },
    [isNumberInput],
  );

  const changeCodeAtFocus = useCallback(
    (str: string) => {
      const updatedOTPValues = [...otpValues];
      updatedOTPValues[activeInput] = str[0] || '';
      setOTPValues(updatedOTPValues);
      handleOtpChange(updatedOTPValues);
    },
    [activeInput, handleOtpChange, otpValues],
  );

  const focusInput = useCallback(
    (inputIndex: number) => {
      const selectedIndex = Math.max(Math.min(length - 1, inputIndex), 0);
      setActiveInput(selectedIndex);
    },
    [length],
  );

  const focusPrevInput = useCallback(() => {
    focusInput(activeInput - 1);
  }, [activeInput, focusInput]);

  const focusNextInput = useCallback(() => {
    focusInput(activeInput + 1);
  }, [activeInput, focusInput]);

  const handleOnFocus = useCallback(
    (index: number) => () => {
      focusInput(index);
    },
    [focusInput],
  );

  const handleOnChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = getRightValue(e.currentTarget.value);
      if (!val) {
        e.preventDefault();
        return;
      }
      changeCodeAtFocus(val);
      focusNextInput();
    },
    [changeCodeAtFocus, focusNextInput, getRightValue],
  );

  const onBlur = useCallback(() => {
    setActiveInput(-1);
  }, []);

  const handleOnKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      const pressedKey = e.key;

      switch (pressedKey) {
      case 'Backspace':
      case 'Delete': {
        e.preventDefault();
        if (otpValues[activeInput]) {
          changeCodeAtFocus('');
        } else {
          focusPrevInput();
        }
        break;
      }
      case 'ArrowLeft': {
        e.preventDefault();
        focusPrevInput();
        break;
      }
      case 'ArrowRight': {
        e.preventDefault();
        focusNextInput();
        break;
      }
      default: {
        if (pressedKey.match(/^[^a-zA-Z0-9]$/)) {
          e.preventDefault();
        }
        if (isNumberInput && pressedKey.match(/\D/)) {
          e.preventDefault();
        }

        break;
      }
      }
    },
    [activeInput, changeCodeAtFocus, focusNextInput, focusPrevInput, isNumberInput, otpValues],
  );

  const handleOnPaste = useCallback(
    (e: React.ClipboardEvent<HTMLInputElement>) => {
      e.preventDefault();
      const pastedData = e.clipboardData
        .getData('text/plain')
        .trim()
        .slice(0, length - activeInput)
        .split('');
      if (pastedData) {
        let nextFocusIndex = 0;
        const updatedOTPValues = [...otpValues];
        updatedOTPValues.forEach((val, index) => {
          if (index >= activeInput) {
            const changedValue = getRightValue(pastedData.shift() || val);
            if (changedValue) {
              updatedOTPValues[index] = changedValue;
              nextFocusIndex = index;
            }
          }
        });
        setOTPValues(updatedOTPValues);
        setActiveInput(Math.min(nextFocusIndex + 1, length - 1));
      }
    },
    [activeInput, getRightValue, length, otpValues],
  );

  return (
    <div {...rest}>
      {Array(length)
        .fill('')
        .map((_, index) => (
          <SingleInput
            key={`SingleInput-${index}`} // eslint-disable-line react/no-array-index-key
            type={isNumberInput ? 'number' : 'text'}
            focus={activeInput === index}
            value={otpValues && otpValues[index]}
            autoFocus={autoFocus}
            onFocus={handleOnFocus(index)}
            onChange={handleOnChange}
            onKeyDown={handleOnKeyDown}
            onBlur={onBlur}
            onPaste={handleOnPaste}
            style={inputStyle}
            className={inputClassName}
            disabled={disabled}
          />
        ))}
    </div>
  );
};

const OTPInput = memo(OTPInputComponent);
export default OTPInput;
