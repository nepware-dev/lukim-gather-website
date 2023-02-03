import React, {useCallback, useMemo} from 'react';
import {BsFillCheckCircleFill} from 'react-icons/bs';

import cs from '@utils/cs';

import classes from './styles';

interface InputProps {
    optionItem: boolean;
    activeOptionItem: boolean;
    onClick?: React.MouseEventHandler;
    title: string;
    disabled?: boolean;
}

interface Props {
  activeOptionItem: boolean;
  onClick?: React.MouseEventHandler;
  disabled?: boolean;
}

const DataOptionIcon = ({
  option, active,
}: {option: string | null; active: boolean}) => {
  const status = option?.toLowerCase();

  const renderIcon = useCallback(
    () => {
      switch (status) {
      case 'test':
        return <span className={cs('material-symbols-rounded', active ? 'text-[#EC6D25]' : '')}>filter_alt</span>;
      default:
        return <span className={cs('material-symbols-rounded', active ? 'text-[#EC6D25]' : '')}>task_alt</span>;
      }
    },
    [active, status],
  );

  return (
    <>
      {renderIcon()}
    </>
  );
};

const Input: React.FC<InputProps> = (
  {
    optionItem,
    activeOptionItem,
    onClick,
    title,
    disabled,
  },
) => {
  const isActive = useMemo(() => activeOptionItem === optionItem, [activeOptionItem, optionItem]);
  return (
    <div
      className={cs(
        classes.optionItem,
        [classes.activeOptionItem, isActive],
        [classes.disabledOptionItem, Boolean(disabled)],
      )}
      onClick={onClick}
    >
      {isActive && (
        <div
          className={classes.checkIcon}
        >
          <BsFillCheckCircleFill size={14} color='#2263AA' />
        </div>
      )}
      <DataOptionIcon option={optionItem ? 'test' : ''} active={isActive} />
      <p className={cs(
        classes.optionItemTitle,
        [classes.activeOptionItemTitle, isActive],
      )}
      >
        {title}
      </p>
    </div>
  );
};

const DataOptionInput: React.FC<Props> = (props) => {
  const {activeOptionItem, onClick, disabled} = props;

  return (
    <div className={classes.optionWrapper}>
      <Input optionItem={false} activeOptionItem={activeOptionItem} onClick={onClick} title='Real Data' disabled={disabled} />
      <Input optionItem activeOptionItem={activeOptionItem} onClick={onClick} title='Test Data' disabled={disabled} />
    </div>
  );
};

export default DataOptionInput;
