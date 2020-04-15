import React from 'react';
import classNames from 'classnames';
import styles from './Input.module.scss';

const Input = ({
  disabled, placeholder, icon, width, height, fullWidth, ...props
}) => {
  const classes = classNames(
    styles.input,
    { [styles.withIcon]: !!icon },
  );

  const wrapperClasses = classNames(
    styles.inputWrapper,
    { [styles.inputWrapperFullWidth]: fullWidth },
  );

  return (
    <div className={wrapperClasses}>
      {icon ? (
        <div className={classNames(styles.iconWrapper)}>
          {icon}
        </div>
      ) : null}
      <input
        style={{ width, height }}
        className={classes}
        type='text'
        placeholder={placeholder || 'Search...'}
        disabled={disabled}
        {...props}
      />
    </div>
  );
};
export default Input;
