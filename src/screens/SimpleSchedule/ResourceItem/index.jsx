import React from 'react';

import Dropdown from '../Dropdown';

import classes from './ResourceItem.module.scss';

export default ({
  title,
  photo,
  withMenu,
}) => {
  
  return (
    <>
      {
        (title.includes('Empty'))
            ?  <div className={classes.resourceItem__empty}><span>Empty</span></div>
            : title
      }
      {
        photo && (
          <img
            alt=''
            // className={styles.cellNameWithAvatar__image}
            src={photo}
          />
        )
      }
      {
        withMenu && (
          <Dropdown buttonClass={classes.resourceItem__buttonDots}>
            <div className={classes.resourceItem__title}>
              {title}
            </div>
            <div className={classes.resourceItem__space} />
          </Dropdown>
        )
      }
      {/*<div onClick={addEmployee}>Empty</div>*/}
    </>
  );
};
