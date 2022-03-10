import React, {useState, useCallback} from 'react';

interface Props {
    status?: string | null;
    message?: string | Error | null;
    onValidated: {
      (formData:any): void /* eslint-disable-line  @typescript-eslint/no-explicit-any */
    };
}

const MailChimpForm: React.FC<Props> = ({status, message, onValidated}) => {
  const [email, setEmail] = useState<string>('');

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  }, []);

  const handleSubmit = useCallback(() => {
    if (email && email.indexOf('@') > -1) {
      onValidated({
        EMAIL: email,
      });
    }
  }, [email, onValidated]);

  return (
    <div className='flex flex-col'>
      <div className='flex flex-col sm:flex-row gap-[20px] sm:gap-[0] mt-[10px] rounded-xl'>
        <input
          type='email'
          value={email}
          placeholder='Email Address'
          onChange={handleChange}
          className='h-[50px] pl-[20px] pr-[5px] font-inter rounded-l-xl rounded-r-xl sm:rounded-r-none'
        />
        <button
          type='button'
          className='h-[50px] px-[25px] bg-color-green text-color-white font-inter rounded-r-xl rounded-l-xl sm:rounded-l-none'
          onClick={handleSubmit}
        >
          Sign up
        </button>
      </div>
      <div className='flex justify-center sm:justify-start gap-[20px] sm:gap-[0] mt-[10px]'>
        {status === 'sending' && <div className='text-color-white'>Sending...</div>}
        {status === 'success' && (
          <div
            className='text-color-green'
          >
            {message}
          </div>
        )}
        {status === 'error' && (
          <div
            className='text-color-red'
          >
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default MailChimpForm;
