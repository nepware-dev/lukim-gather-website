import React, {useCallback, useEffect, useState} from 'react';

import cs from '@ra/cs';
import {isArray} from '@ra/utils';

import classes from './styles';

type MetaState = {
    invalid: boolean;
    touched: boolean;
    error: any;
    warning: any;
};

interface TextareaInputProps
    extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange'> {
    showRequired?: boolean;
    warning?: any;
    errorMessage: any;
    onChange: (arg: HTMLTextAreaElement) => void;
}

const TextareaInput: React.FC<TextareaInputProps> = (props) => {
  const {
    showRequired, className, onChange, warning, errorMessage, required, ...inputProps
  } = props;

  const [meta, setMeta] = useState<MetaState>({
    invalid: false,
    touched: false,
    error: null,
    warning,
  });

  useEffect(() => {
    if (showRequired) {
      setMeta((prevMeta) => ({...prevMeta, warning: 'Required'}));
    }
    if (errorMessage) {
      setMeta((prevMeta) => ({
        ...prevMeta,
        error: isArray(errorMessage) ? errorMessage[0] : errorMessage,
      }));
    }
  }, [showRequired, errorMessage]);

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      setMeta((prevMeta) => ({
        ...prevMeta,
        error: null,
        warning: required && !event.target.value ? 'Required' : null,
        invalid: false,
        touched: true,
      }));
      onChange(event.target);
    },
    [onChange, required],
  );

  return (
    <div>
      <textarea
        className={cs(className, classes.textarea, {
          [classes.textareaWarning]: meta.warning,
        })}
        onChange={handleChange}
        {...inputProps}
      />
      {Boolean(meta.warning) && <span className={classes.warningText}>{meta.warning}</span>}
    </div>
  );
};

export default TextareaInput;
