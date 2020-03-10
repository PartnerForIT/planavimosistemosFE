import React from 'react';
import classNames from 'classnames';

import styles from './Button.module.scss';

/**
 * Simple Button encapsulating all design variations
 */
const Button = ({
  children, inverse, onClick, fillWidth, type = 'button', size = 'normal', disabled = false,
}) => {
  const classes = classNames(
    styles.button,
    styles[size],
    { [styles.inverse]: inverse, [styles.fullWidth]: fillWidth, [styles.disabled]: disabled },
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
