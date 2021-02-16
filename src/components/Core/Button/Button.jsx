import React from 'react';
import classNames from 'classnames';

import styles from './Button.module.scss';

/**
 * Simple Button encapsulating all design variations
 */
const Button = ({
  children, cancel, yellow, green, inverse, white,
  onClick, fillWidth, type = 'button', size = 'normal',
  disabled = false, danger, black, navyBlue, inline, transparent,
}) => {
  const classes = classNames(
    styles.button,
    styles[size],
    {
      [styles.inverse]: inverse,
      [styles.white]: white,
      [styles.cancel]: cancel,
      [styles.fullWidth]: fillWidth,
      [styles.disabled]: disabled,
      [styles.danger]: danger,
      [styles.green]: green,
      [styles.yellow]: yellow,
      [styles.black]: black,
      [styles.navyBlue]: navyBlue,
      [styles.inline]: inline,
      [styles.transparent]: transparent,
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
