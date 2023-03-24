import React, {
  useCallback,
  useState,
  useEffect,
  useRef,
} from 'react';

import cs from '@ra/cs';

import classes from './styles';

interface CommentInputProps {
  onSubmit: (text: string) => void;
  onCancel?: () => void;
  placeholder?: string;
  defaultValue?: string;
}

const CommentInput: React.FC<CommentInputProps> = ({
  onSubmit, onCancel, placeholder, defaultValue,
}) => {
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const [text, setText] = useState<string>('');
  const [textAreaRows, setTextAreaRows] = useState<number>(1);

  const handleTextChange = useCallback((e: React.FormEvent<HTMLTextAreaElement>) => {
    const textAreaElement = e.target as HTMLTextAreaElement;
    setText(textAreaElement.value);
    if (!textAreaElement.value) {
      setTextAreaRows(1);
    } else {
      setTextAreaRows(Math.min(Math.ceil(textAreaElement.scrollHeight / 24), 4));
    }
  }, []);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(text);
    (e.target as HTMLFormElement).reset?.();
  }, [onSubmit, text]);

  useEffect(() => {
    if (onCancel) {
      inputRef?.current?.focus();
    }
  }, [onCancel]);

  return (
    <form className={classes.container} onSubmit={handleSubmit}>
      <div className={classes.inputContainer}>
        <textarea
          ref={inputRef}
          onChange={handleTextChange}
          className={classes.input}
          placeholder={placeholder ?? 'Add new comment'}
          rows={textAreaRows}
          defaultValue={defaultValue}
        />
        <div className={classes.actionButtons}>
          {onCancel && (
            <button type='button' className={classes.cancelButton} onClick={onCancel}>
              Cancel
            </button>
          )}
          <button
            type='submit'
            disabled={!text}
            className={cs(classes.button, {
              [classes.buttonDisabled]: !text,
            })}
          >
            {defaultValue ? 'Save' : 'Comment'}
          </button>
        </div>
      </div>
    </form>
  );
};

export default CommentInput;
