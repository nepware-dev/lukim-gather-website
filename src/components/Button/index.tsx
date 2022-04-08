import React, {useCallback} from 'react';
import {RiArrowLeftSLine, RiArrowRightSLine} from 'react-icons/ri';

interface Props {
  text: string;
  className?: string;
  textClassName?: string;
  onClick(): void;
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
  text, className, textClassName, onClick,
}) => (
  <button
    type='button'
    onClick={onClick}
    className={`h-[49px] px-5 bg-color-green-alt rounded-lg ${className}`}
  >
    <p
      className={`font-semibold font-inter text-color-white text-base ${textClassName}`}
    >
      {text}
    </p>
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
      className={`${
        !isVisible && 'hidden'
      } w-[28px] h-[28px] font-inter font-[500] text-[14px] rounded-full ${
        isActive && 'bg-[#6AA12A] text-[#fff]'
      }`}
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
    className={`flex items-center justify-center w-[26px] h-[26px] rounded-full bg-[#E7ECF2] ${
      disabled && 'cursor-not-allowed'
    }`}
  >
    {btnType === 'next' ? (
      <RiArrowRightSLine size={20} />
    ) : (
      <RiArrowLeftSLine size={20} />
    )}
  </button>
);

export default Button;
