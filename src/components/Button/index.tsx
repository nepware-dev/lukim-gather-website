import React, {useCallback} from 'react';
import {RiArrowLeftSLine, RiArrowRightSLine} from 'react-icons/ri';

import cs from '@utils/cs';
import Loader from '@components/Loader';

import classes from './styles';

interface Props {
  text: string;
  className?: string;
  textClassName?: string;
  onClick?(): void;
  loading?: boolean;
  disabled?: boolean;
}

interface NumBtnProps {
  num: number;
  isActive?: boolean;
  isVisible?: boolean;
  onClick(num: number): void;
}

interface ArrowBtnProps {
  btnType: string;
  disabled: boolean;
  onClick(): void;
}

const Button: React.FC<Props> = ({
  text,
  className,
  textClassName,
  onClick,
  loading,
  disabled,
}) => (
  <button
    type='button'
    onClick={onClick}
    disabled={disabled || false}
    className={cs(classes.button, [classes.disabled, !!disabled], className)}
  >
    {loading ? (
      <Loader />
    ) : (
      <p
        className={cs(
          classes.text,
          [classes.loading, !!loading],
          textClassName,
        )}
      >
        {text}
      </p>
    )}
  </button>
);

export const NumBtn: React.FC<NumBtnProps> = ({
  num,
  isActive,
  isVisible,
  onClick,
}) => {
  const handleClick = useCallback(() => {
    onClick(num);
  }, [num, onClick]);

  return (
    <button
      type='button'
      onClick={handleClick}
      className={cs([classes.hidden, !isVisible], classes.NumButton, [
        classes.activeNumBtn,
        !!isActive,
      ])}
    >
      {num}
    </button>
  );
};

export const ArrowBtn: React.FC<ArrowBtnProps> = ({
  btnType,
  disabled,
  onClick,
}) => (
  <button
    type='button'
    disabled={disabled}
    onClick={onClick}
    className={cs(classes.ArrowBtn, [classes.disabled, disabled])}
  >
    {btnType === 'next' ? (
      <RiArrowRightSLine size={20} />
    ) : (
      <RiArrowLeftSLine size={20} />
    )}
  </button>
);

export default Button;
