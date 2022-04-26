import React, {useCallback} from 'react';
import cs from '@utils/cs';

interface Props {
  text: string;
  isActive: boolean;
  className?: string;
  onClick(text: string): void;
}

const classes = {
  container: 'md:w-[105px] border-b-[2.8px] md:border-b-0 md:border-r-[2.8px] font-inter font-[500] text-[16px] text-left',
  active: 'border-[#6AA12A] text-[#6AA12A]',
  inactive: 'border-transparent text-[#70747E]',
};

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
      className={cs(
        classes.container,
        [classes.active, isActive],
        [classes.inactive, !isActive],
        className,
      )}
    >
      {text}
    </button>
  );
};

export default AccountTab;
