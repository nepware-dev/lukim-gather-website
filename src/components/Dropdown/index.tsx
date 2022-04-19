import React, {useCallback, useEffect, useState} from 'react';

interface Props {
  renderLabel(): React.ReactNode;
  children: React.ReactChild;
}

const Dropdown: React.FC<Props> = ({renderLabel, children}) => {
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
    <div className='relative'>
      <div onClick={handleClick}>{renderLabel()}</div>
      {open && (
        <div className='absolute top-[50px] right-0 rounded-lg shadow-[0_4px_42px_rgba(79,114,205,0.15)]'>
          {children}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
