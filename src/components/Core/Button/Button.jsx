import React from 'react';
import classNames from 'classnames';
import CircularProgress from '@material-ui/core/CircularProgress';

import styles from './Button.module.scss';

/**
 * Simple Button encapsulating all design variations
 */
const Button = ({
  children, cancel, yellow, green, inverse, inverseblack, white, loading, className,
  onClick, fillWidth, type = 'button', size = 'normal',
  disabled = false, danger, black, navyBlue, darkBlue, inline, transparent,
}) => {
  const classes = classNames(
    styles.button,
    styles[size],
    {
      [styles.inverse]: inverse,
      [styles.inverseblack]: inverseblack,
      [styles.white]: white,
      [styles.cancel]: cancel,
      [styles.fullWidth]: fillWidth,
      [styles.disabled]: disabled,
      [styles.danger]: danger,
      [styles.green]: green,
      [styles.yellow]: yellow,
      [styles.black]: black,
      [styles.navyBlue]: navyBlue,
      [styles.darkBlue]: darkBlue,
      [styles.inline]: inline,
      [styles.transparent]: transparent,
      [styles.loading]: loading,
      [className]: className,
    },
  );

  return (
    <button
      className={classes}
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {children}
      {loading && <CircularProgress className={styles.progress} />}
    </button>
  );
};

export default Button;
