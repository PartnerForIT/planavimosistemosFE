import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import PalceIcon from '../../Icons/Place';


const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1,
  },
  appBar: {
    backgroundColor: '#fff',
  },
  title: {
    flexGrow: 1,
    color: "#808f94",
  },
  icon: {
    cursor: 'pointer',
    '& path': {
      fill: `#808f94 !important`,
    },
    '&:hover path': {
      fill: `#4080fc !important`,
    },
  }
}));

export default function ButtonAppBar() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <PalceIcon className={classes.icon}  />
        </Toolbar>
      </AppBar>
    </div>
  );
}
