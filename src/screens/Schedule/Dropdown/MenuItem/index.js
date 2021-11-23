import React from 'react';
import classNames from 'classnames';

import ChevronIcon from '../../../../components/Icons/Chevron';
import classes from './MenuItem.module.scss';

export default ({
  title,
  remove,
  onClick,
}) => {
  const menuItemClasses = classNames(classes.menuItem, {
    [classes.menuItem_remove]: remove,
  });

  return (
    <button className={menuItemClasses} onClick={onClick}>
      {title}
      {
        !remove && (
          <ChevronIcon
            className={classes.menuItem__chevron}
          />
        )
      }
    </button>
  );
};
