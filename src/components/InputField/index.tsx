import React, {useCallback, useState} from 'react';
import {AiOutlineEye, AiOutlineEyeInvisible} from 'react-icons/ai';

interface Props {
  title: string;
  value: string;
  placeholder: string;
  password?: boolean;
  onChange(e: React.ChangeEvent<HTMLInputElement>): void;
}

const InputField: React.FC<Props> = ({
  title,
  value,
  placeholder,
  password,
  onChange,
}) => {
  const [type, setType] = useState<string>('password');

  const handleEyeIconToggle = useCallback(() => {
    if (type === 'password') {
      setType('email');
    } else {
      setType('password');
    }
  }, [type]);

  return (
    <div>
      <p className='text-color-text-grey font-inter font-medium text-base mb-2'>
        {title}
      </p>
      <div className='relative'>
        <input
          type={password ? type : 'text'}
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          className={`w-[409px] rounded-lg pl-3 py-4 border border-[#CCDCE8] font-inter font-normal text-base appearance-none ${
            password ? 'pr-12' : 'pr-4'
          }`}
        />
        <div
          className={`absolute top-[32%] right-[20px] cursor-pointer ${
            !password && 'hidden'
          }`}
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
        </div>
      </div>
    </div>
  );
};

export default InputField;
