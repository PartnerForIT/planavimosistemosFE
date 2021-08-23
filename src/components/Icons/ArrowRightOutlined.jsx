/* eslint-disable max-len */
import SvgIcon from '@material-ui/core/SvgIcon';
import React from 'react';
import classnames from 'classnames';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  root: {
    width: '22px',
    height: '22px',
  },
}));

const ArrowRightOutlined = ({ className }) => {
  const classes = useStyles();

  return (
    <SvgIcon viewBox='0 0 22.723 22.723' className={classnames(className, classes.root)}>
      <g id='Group_2290' data-name='Group 2290'>
        <path
          id='Контур_13611'
          data-name='Контур 13611'
          d='M13.348,3.363A11.436,11.436,0,0,0,24.7-8,11.444,11.444,0,0,0,13.336-19.359,11.434,11.434,0,0,0,1.98-8,11.446,11.446,0,0,0,13.348,3.363Zm0-2.027A9.3,9.3,0,0,1,4.02-8a9.293,9.293,0,0,1,9.316-9.34A9.33,9.33,0,0,1,22.688-8,9.3,9.3,0,0,1,13.348,1.336Zm2.2-3.855a.863.863,0,0,0,0-1.242l-4.488-4.23,4.488-4.219a.854.854,0,0,0-.012-1.242.879.879,0,0,0-1.219.035L9.738-9.105a1.537,1.537,0,0,0,0,2.238L14.32-2.555A.958.958,0,0,0,15.551-2.52Z'
          transform='translate(24.703 3.363) rotate(180)'
          fill='#0087ff'
        />
      </g>
    </SvgIcon>
  );
};

export default ArrowRightOutlined;
