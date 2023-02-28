import React from 'react';
import classNames from 'classnames';

import styles from './MarkerButton.module.scss';
import ReactTooltip from 'react-tooltip';

/**
 * Simple Button encapsulating all design variations
 */
const MarkerButton = ({
  on, onClick
}) => {
  const classes = classNames(
    styles.button,
    {
      [styles.active]: on,
    }
  );

  return (
    <button
      className={classes}
      onClick={onClick}
      data-tip={"Marking/Highlighting tool can be used in any view. <br> People who don't have permission to add markings, <br> will see them anyways. To place it just enter into <br> edit state and press on the cell in the employee row. <br> To remove it, hover again over the cell and you will <br> see the removable red mark. Click to remove. <br> To exit from edit state just click tool icon again."}
      data-for='marker'
      data-html={true}
    >
      <ReactTooltip
        id='marker'
        className='marker-tooltip'
        effect='solid'
      />
    </button>
  );
};

export default MarkerButton;
