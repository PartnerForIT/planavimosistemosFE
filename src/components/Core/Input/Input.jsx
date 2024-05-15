import React, { forwardRef } from 'react';
import classNames from 'classnames';
import styles from './Input.module.scss';

const Input = forwardRef(({
  disabled, placeholder, icon, type, width, height,
  min, max, fullWidth, underlined, iconLeft, error, light, value='', ...props
}, ref) => {
  const classes = classNames(
    styles.input,
    { [styles.withIcon]: !!icon },
    { [styles.underlined]: underlined },
    { [styles.error]: error },
    { [styles.light]: light },
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
        ref={ref}
        style={{ width: '100%', height }}
        className={classes}
        type={type || 'text'}
        min={min || ''}
        max={max || ''}
        placeholder={placeholder}
        disabled={disabled}
        value={value}
        {...props}
      />
    </div>
  );
});
export default Input;
