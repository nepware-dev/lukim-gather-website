import React, {useCallback} from 'react';

interface Props {
  text: string;
  isActive: boolean;
  className?: string;
  onClick(text: string): void;
}

const SurveyTab: React.FC<Props> = ({
  text, isActive, className, onClick,
}) => {
  const handleClick = useCallback(() => {
    onClick(text);
  }, [onClick, text]);

  return (
    <button
      type='button'
      onClick={handleClick}
      className={`h-[42px] px-[20px] border border-[#CCDCE8] font-inter font-[500] text-[14px] text-[#70747E] ${
        isActive && 'border-[#6AA12A] bg-[#F0F6EA] text-[#6AA12A]'
      } ${className}`}
    >
      {text}
    </button>
  );
};

export default SurveyTab;
