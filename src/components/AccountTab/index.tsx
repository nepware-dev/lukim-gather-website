import React, {useCallback} from 'react';

interface Props {
  text: string;
  isActive: boolean;
  className?: string;
  onClick(text: string): void;
}

const AccountTab: React.FC<Props> = ({
  text, isActive, className, onClick,
}) => {
  const handleClick = useCallback(() => {
    onClick(text);
  }, [onClick, text]);

  return (
    <button
      type='button'
      onClick={handleClick}
      className={`w-[105px] border-r-[2.8px] font-inter font-[500] text-[16px] text-left ${
        isActive ? 'border-[#6AA12A] text-[#6AA12A]' : 'border-transparent text-[#70747E]'
      } ${className}`}
    >
      {text}
    </button>
  );
};

export default AccountTab;
