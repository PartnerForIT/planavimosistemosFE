import React from 'react';
import classNames from 'classnames';
import CircularProgress from '@material-ui/core/CircularProgress';

import styles from './MarkerButton.module.scss';
import MarkerIcon from '../../Icons/MarkerIcon';

/**
 * Simple Button encapsulating all design variations
 */
const MarkerButton = ({
  on, onClick
}) => {
  const classes = classNames(
    styles.button,
  );

  return (
    <button
      className={classes}
      onClick={onClick}
    >
      <MarkerIcon
        on={on}
      />
    </button>
  );
};

export default MarkerButton;
