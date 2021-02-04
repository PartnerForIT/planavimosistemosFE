/* eslint-disable max-len */
import SvgIcon from '@material-ui/core/SvgIcon';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import classnames from 'classnames';

const useStyles = makeStyles(() => ({
  root: {
    width: '1em',
    height: '1em',
  },
}));

export default function EmailIcon({ className }) {
  const classes = useStyles();
  return (
    <SvgIcon viewBox='0 0 16 12' className={classnames(classes.root, className)}>
      <g id='noun_1713379_cc' transform='translate(-240.616 -24.812)'>
        <g
          id='Сгруппировать_1390'
          data-name='Сгруппировать 1390'
          transform='translate(240.616 24.812)'
        >
          <path
            id='Контур_1085'
            data-name='Контур 1085'
            d='M9.714,971.362A1.737,1.737,0,0,0,8,973.1v8.516a1.737,1.737,0,0,0,1.714,1.742H22.286A1.737,1.737,0,0,0,24,981.62V973.1a1.737,1.737,0,0,0-1.714-1.742Zm.077,1.161H22.208l-5.827,5.625a.476.476,0,0,1-.774.006Zm-.649.974,5.673,5.5a1.7,1.7,0,0,0,2.357,0l5.685-5.5v8.123a.563.563,0,0,1-.571.581H9.714a.563.563,0,0,1-.571-.581Z'
            transform='translate(-8 -971.362)'
            fill='#808f94'
          />
        </g>
      </g>

    </SvgIcon>
  );
}
