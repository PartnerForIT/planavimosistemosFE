import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';

const useStylesBootstrap = makeStyles(() => ({
  arrow: {
    color: '#313946',
  },
  tooltip: {
    backgroundColor: '#313946',
    fontSize: '13px',
    padding: '10px',
  },

}));

const useStyles = makeStyles(() => ({
  block: {
    width: '18px',
    height: '18px',
    fontSize: '14px',
    lineHeight: '18px',
    borderRadius: '50%',
    background: '#808F94',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
}));

function BootstrapTooltip(props) {
  const classes = useStylesBootstrap();
  return <Tooltip placement='right' arrow classes={classes} {...props} />;
}

export default function TooltipStyled({ title }) {
  const classes = useStyles();
  return (
    <BootstrapTooltip title={title}>
      <div className={classes.block}>
        <span>?</span>
      </div>
    </BootstrapTooltip>
  );
}
