import React, {useCallback, useEffect, useState} from 'react';
import cs from '@utils/cs';

interface Props {
  renderLabel(): React.ReactNode;
  children: React.ReactChild;
  alignRight?: boolean;
}

const classes = {
  container: 'relative',
  alignRight: 'right-0',
  alignLeft: 'left-0',
  itemContainer: 'absolute top-[50px] rounded-lg shadow-[0_4px_42px_rgba(79,114,205,0.15)] z-10',
};

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
      <div onClick={handleClick}>{renderLabel()}</div>
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
