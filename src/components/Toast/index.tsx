import React, {useCallback} from 'react';
import {HiOutlineX, HiXCircle, HiCheckCircle} from 'react-icons/hi';

import {dispatchDeleteToast} from '@services/dispatch';
import {ToastType} from '@store/types/toasts';
import cs from '@utils/cs';

import classes from './styles';

const Toast: React.FC<ToastType> = ({type, message, id}) => {
  const handleClick = useCallback(() => {
    dispatchDeleteToast(id);
  }, [id]);
  return (
    <div className={cs(classes.container, type === 'success' ? 'bg-color-green' : 'bg-color-red')}>
      <div className='flex'>
        <div className={classes.iconWrapper}>
          {type === 'success' ? (
            <HiCheckCircle size={25} color='#fff' />
          ) : (
            <HiXCircle size={25} color='#fff' />
          )}
        </div>
        <div className='ml-3'>
          <p className={classes.message}>{message}</p>
        </div>
        <div className={classes.buttonMainWrapper}>
          <div className={classes.buttonWrapper}>
            <button type='button' onClick={handleClick} className={classes.button}>
              <HiOutlineX size={25} color='#888C94' />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Toast;
