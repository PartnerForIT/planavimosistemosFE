import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import SvgIcon from '@material-ui/core/SvgIcon';

const useStyles = makeStyles(() => ({
  root: {
    width: '1.5em',
    height: '1.5em',
  },
}));

function RolesIcon() {
  const classes = useStyles();

  return (
    <SvgIcon viewBox='0 0 33.784 35.644' className={classes.root}>
      <path
        id='Контур_13572'
        data-name='Контур 13572'
        d='M-9.978-27.824H10.293A2.063,2.063,0,0,0,7.936-29.9H-7.637A2.057,2.057,0,0,0-9.978-27.824Zm-3.387,4.416H13.364a2.3,2.3,0,0,0-2.54-2.258H-10.808A2.318,2.318,0,0,0-13.364-23.408Zm1.478,29.152H11.887c3.3,0,5-1.66,5-4.947V-15.9c0-3.271-1.693-4.947-5-4.947H-11.887c-3.337,0-5.014,1.66-5.014,4.947V.8C-16.9,4.084-15.224,5.744-11.887,5.744ZM.017-4.848a4.964,4.964,0,0,1-4.781-5.213,4.949,4.949,0,0,1,4.781-5.08,4.935,4.935,0,0,1,4.765,5.08A4.921,4.921,0,0,1,.017-4.848ZM-9.7,3.038A10.562,10.562,0,0,1-.017-2.623,10.619,10.619,0,0,1,9.7,3.038Z'
        transform='translate(16.9 29.899)'
        fill='rgba(226,235,244,0.85)'
      />
    </SvgIcon>
  );
}

export default RolesIcon;
