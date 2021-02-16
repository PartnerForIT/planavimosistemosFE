import React from 'react';
import classNames from 'classnames';
import styles from './Input.module.scss';

const Input = ({
  disabled, placeholder, icon, type, width, height,
  min, max, fullWidth, underlined, iconLeft, error, ...props
}) => {
  const classes = classNames(
    styles.input,
    { [styles.withIcon]: !!icon },
    { [styles.underlined]: underlined },
    { [styles.error]: error },
  );

  const wrapperClasses = classNames(
    styles.inputWrapper,
    { [styles.inputWrapperFullWidth]: fullWidth },
    { [styles.iconLeft]: iconLeft },
  );

  return (
    <div className={wrapperClasses} style={{ width }}>
      {icon ? (
        <div className={classNames(styles.iconWrapper)}>
          {icon}
        </div>
      ) : null}
      <input
        style={{ width: '100%', height }}
        className={classes}
        type={type || 'text'}
        min={min || ''}
        max={max || ''}
        placeholder={placeholder}
        disabled={disabled}
        {...props}
      />
    </div>
  );
};
export default Input;
