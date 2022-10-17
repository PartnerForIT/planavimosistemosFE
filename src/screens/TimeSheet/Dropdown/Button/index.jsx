import React, { forwardRef } from 'react';
import classNames from 'classnames';

import Dots from '../../../../components/Icons/Dots';

import classes from './Button.module.scss';

export default forwardRef(({
  onClick,
  active,
  light,
  className,
}, ref) => {
  const buttonClasses = classNames(classes.button, {
    [classes.button_active]: active,
    [classes.button_light]: light,
    [className]: className,
  });

  return (
    <button
      className={buttonClasses}
      id='dropdownButton'
      onClick={onClick}
      ref={ref}
    >
      <Dots />
    </button>
  );
});
