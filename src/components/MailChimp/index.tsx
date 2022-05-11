import React, {useState, useCallback} from 'react';

import classes from './styles';

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
