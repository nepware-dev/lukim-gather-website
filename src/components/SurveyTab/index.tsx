import React, {useCallback} from 'react';
import cs from '@utils/cs';

import classes from './styles';

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
      className={cs(classes.button, [classes.active, isActive], className)}
    >
      {text}
    </button>
  );
};

export default SurveyTab;
