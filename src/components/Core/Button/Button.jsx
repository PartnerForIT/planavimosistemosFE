import React from 'react';
import classNames from 'classnames';

import styles from './Button.module.scss';

/**
 * Simple Button encapsulating all design variations
 */
const Button = ({
  children, cancel, inverse, onClick, fillWidth, type = 'button', size = 'normal', disabled = false, danger,
}) => {
  const classes = classNames(
    styles.button,
    styles[size],
    {
      [styles.inverse]: inverse,
      [styles.cancel]: cancel,
      [styles.fullWidth]: fillWidth,
      [styles.disabled]: disabled,
      [styles.danger]: danger,
    },
  );

  return (
    <button
      className={classes}
      type={type}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
