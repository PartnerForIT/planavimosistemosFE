import React from 'react';
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import PalceIcon from '../../Icons/Place';
import OverviewIcon from '../../Icons/Overview';
import AvatarComponent from './Avatar'
import styles from './header.module.scss';

const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1,
  },
  appBar: {
    backgroundColor: '#fff',
  },
  toolbar: {
    display: 'flex',
    justifyContent: "space-between",
  }
}));

export default function ButtonAppBar() {
  const classes = useStyles();
  const {pathname} = useLocation();
  return (
    <div className={classes.root}>
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar className={classes.toolbar}>
          <div className={styles.linkBlock}>
            <Link to='/' className={styles.link}>
              <OverviewIcon className={styles.icon} />
              <span className={styles.link__text}>Overview</span>
            </Link>
            <Link to='/organization-list' className={pathname=="/organization-list" ? styles.activelink : styles.link}>
              <PalceIcon className={styles.icon}  />
              <span className={styles.link__text}>Org. List</span>
            </Link>
          </div>
          <AvatarComponent />
        </Toolbar>
      </AppBar>
    </div>
  );
}
