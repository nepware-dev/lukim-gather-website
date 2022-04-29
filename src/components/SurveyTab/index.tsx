import React, {useCallback} from 'react';
import cs from '@utils/cs';

interface Props {
  text: string;
  isActive: boolean;
  className?: string;
  onClick(text: string): void;
}

const classes = {
  button: 'h-[42px] px-[20px] border border-[#CCDCE8] font-interMedium text-[14px] text-[#70747E]',
  active: 'border-[#6AA12A] bg-[#F0F6EA] text-[#6AA12A]',
};

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
      className={cs(classes.button, [classes.active, isActive], className)}
    >
      {text}
    </button>
  );
};

export default SurveyTab;
