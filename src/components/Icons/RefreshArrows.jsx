/* eslint-disable max-len */
import SvgIcon from '@material-ui/core/SvgIcon';
import classnames from 'classnames';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  root: {
    width: '1em',
    height: '1em',
  },
}));

export default function RefreshArrow({ className }) {
  const classes = useStyles();
  return (
    <SvgIcon viewBox='0 0 7 7' className={classnames(classes.root, className)}>
      <path
        id='Контур_13795'
        data-name='Контур 13795'
        d='M.7,3.725A2.875,2.875,0,0,1,1.617,1.62l.536.548a.174.174,0,0,0,.09.048.171.171,0,0,0,.1-.011.176.176,0,0,0,.078-.066.182.182,0,0,0,.029-.1V.5A.175.175,0,0,0,2.275.324H.774a.178.178,0,0,0-.123.3l.469.483a3.6,3.6,0,0,0,1.6,6.1.357.357,0,0,0,.434-.351.361.361,0,0,0-.276-.351A2.851,2.851,0,0,1,.7,3.725Zm6.3,0A3.569,3.569,0,0,0,4.284.234.357.357,0,0,0,3.85.585a.361.361,0,0,0,.277.351A2.876,2.876,0,0,1,5.383,5.831l-.535-.548a.174.174,0,0,0-.09-.048.172.172,0,0,0-.1.011.176.176,0,0,0-.078.066.182.182,0,0,0-.029.1V6.948a.175.175,0,0,0,.175.179h1.5a.178.178,0,0,0,.122-.3L5.88,6.339A3.594,3.594,0,0,0,7,3.725Z'
        transform='translate(0 -0.225)'
        fill='#fff'
      />
    </SvgIcon>
  );
}
