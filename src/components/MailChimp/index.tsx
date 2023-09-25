import React, {useState, useCallback} from 'react';

import useToast from '@hooks/useToast';

import classes from './styles';

interface Props {
  status?: string | null;
  message?: string | Error | null;
  onValidated: {
    (formData:any): void /* eslint-disable-line  @typescript-eslint/no-explicit-any */
  };
}

const MailChimpForm: React.FC<Props> = ({status, message, onValidated}) => {
  const toast = useToast();
  const [email, setEmail] = useState<string>('');

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  }, []);

  const handleSubmit = useCallback(() => {
    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)) {
      toast('error', 'Invalid email address !');
    } else if (email && email.indexOf('@') > -1) {
      onValidated({
        EMAIL: email,
      });
    }
  }, [email, onValidated, toast]);

  return (
    <div className={classes.container}>
      <div className={classes.wrapper}>
        <input
          type='email'
          value={email}
          placeholder='Email Address'
          onChange={handleChange}
          className={classes.input}
        />
        <button
          type='button'
          className={classes.button}
          onClick={handleSubmit}
        >
          Sign up
        </button>
      </div>
      <div className={classes.messageWrapper}>
        {status === 'sending' && (
          <div className={classes.sending}>Sending...</div>
        )}
        {status === 'success' && (
          <div className={classes.success}>{message}</div>
        )}
        {status === 'error' && (
          <div className={classes.error}>{message}</div>
        )}
      </div>
    </div>
  );
};

export default MailChimpForm;
