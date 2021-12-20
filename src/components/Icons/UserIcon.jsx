/* eslint-disable max-len */
import SvgIcon from '@material-ui/core/SvgIcon';
import React from 'react';

export default ({ photo, classes }) => (
  <div >
    {
      photo && (
        <img
          alt=''
          // className={classes}
          src={photo}
        />
      )
    }
  </div>
);
