import React from 'react';
import classNames from 'classnames';
import styles from './Textarea.module.scss';

const Textarea = ({
  disabled, placeholder, label,
  error, value='', ...props
}) => {
  const classes = classNames(
    styles.textarea,
    { [styles.error]: error },
  );

  const wrapperClasses = classNames(
    styles.textareaWrapper,
  );

  const handleKeyDown = (e) => {
    e.target.style.height = 'inherit';
    e.target.style.height = `${e.target.scrollHeight}px`;
  }

  return (
    <div className={wrapperClasses} >
      <div className={styles.label}>{label}</div>
      <textarea
        className={classes}
        placeholder={placeholder}
        disabled={disabled}
        value={value}
        onKeyDown={handleKeyDown}
        {...props}
      />
    </div>
  );
};
export default Textarea;
