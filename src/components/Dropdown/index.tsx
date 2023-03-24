import React, {useCallback, useEffect, useState} from 'react';
import cs from '@utils/cs';

import classes from './styles';

interface Props {
  renderLabel(): React.ReactNode;
  children: React.ReactChild;
  alignRight?: boolean;
}

const Dropdown: React.FC<Props> = ({renderLabel, children, alignRight}) => {
  const [open, setOpen] = useState<boolean>(false);

  const hideDropDown = useCallback(() => {
    setOpen(false);
    document.removeEventListener('click', hideDropDown);
  }, []);

  useEffect(
    () => () => {
      setOpen(false);
      document.removeEventListener('click', hideDropDown);
    },
    [hideDropDown],
  );

  const showDropDown = useCallback(() => {
    setOpen(true);
    setTimeout(() => {
      document.addEventListener('click', hideDropDown);
    }, 50);
  }, [hideDropDown]);

  const handleClick = useCallback(() => {
    if (open) {
      hideDropDown();
    } else {
      showDropDown();
    }
  }, [hideDropDown, open, showDropDown]);

  return (
    <div className={classes.container}>
      <button type='button' onClick={handleClick}>{renderLabel()}</button>
      {open && (
        <div
          className={cs(
            classes.itemContainer,
            [classes.alignRight, !!alignRight],
            [classes.alignLeft, !alignRight],
          )}
        >
          {children}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
