import React from 'react';
import classNames from 'classnames';
import CircularProgress from '@material-ui/core/CircularProgress';

import styles from './FlatButton.module.scss';

const FlatButton = ({
  children, cancel, yellow, green, inverse, white, loading, className,
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

export default FlatButton;
