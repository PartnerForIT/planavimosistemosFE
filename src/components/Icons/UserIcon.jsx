/* eslint-disable max-len */
import SvgIcon from '@material-ui/core/SvgIcon';
import React from 'react';

export default ({ photo, classes }) => (
  <div className={classes.cellNameWithAvatar}>
    {
      photo && (
        <img
          alt=''
          className={classes.cellNameWithAvatar__image}
          src={photo}
        />
      )
    }
  </div>
);
