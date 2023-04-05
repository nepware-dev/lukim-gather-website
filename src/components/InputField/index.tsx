import React, {useCallback, useState} from 'react';
import {AiOutlineEye, AiOutlineEyeInvisible} from 'react-icons/ai';
import cs from '@utils/cs';

import classes from './styles';

interface Props {
  title: string;
  value: string;
  placeholder: string;
  password?: boolean;
  inputClassname?: string;
  onChange(e: React.ChangeEvent<HTMLInputElement>): void;
}

const InputField: React.FC<Props> = ({
  title,
  value,
  placeholder,
  password,
  inputClassname,
  onChange,
}) => {
  const [type, setType] = useState<string>('password');

  const handleEyeIconToggle = useCallback(() => {
    if (type === 'password') {
      setType('text');
    } else {
      setType('password');
    }
  }, [type]);

  return (
    <div>
      <p className={classes.title}>{title}</p>
      <div className={classes.inputWrapper}>
        <input
          type={password ? type : 'text'}
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          className={cs(
            classes.input,
            ['pr-12', !!password],
            ['pr-4', !password],
            inputClassname,
          )}
        />
        <button
          type='button'
          className={cs(classes.iconWrapper, [
            classes.hidden,
            !password,
          ])}
        >
          {type === 'password' ? (
            <AiOutlineEyeInvisible
              size={22}
              color='#585D69'
              onClick={handleEyeIconToggle}
            />
          ) : (
            <AiOutlineEye
              size={22}
              color='#585D69'
              onClick={handleEyeIconToggle}
            />
          )}
        </button>
      </div>
    </div>
  );
};

export default InputField;
