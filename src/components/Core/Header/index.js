import React from 'react';
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useParams } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next'
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import PalceIcon from '../../Icons/Place';
import OverviewIcon from '../../Icons/Overview';
import LogbookIcon from '../../Icons/Logbook';
import HelpIcon from '../../Icons/Help';

import AvatarComponent from './Avatar'
import styles from './header.module.scss';

const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1,
  },
  appBar: {
    backgroundColor: '#fff',
    boxShadow: '0px 2px 4px -1px rgba(0,0,0,0.05), 0px 1px 1px 0px rgba(0,0,0,0.04), 0px 1px 2px 0px rgba(0,0,0,0.02)',
  },
  toolbar: {
    display: 'flex',
    justifyContent: "space-between",
  }
}));

export default function ButtonAppBar() {
  const classes = useStyles();
  const { pathname } = useLocation();
  const { t } = useTranslation();
  const params = useParams();
  const user = JSON.parse(localStorage.getItem('user'))

  return (
    <div className={classes.root}>
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar className={classes.toolbar}>
          {
            (!params.id && user && user.role_id === 1) &&
            <div className={styles.linkBlock}>
              <Link to='/overview' className={pathname == "/overview" ? styles.activelink : styles.link}>
                <OverviewIcon className={styles.icon} />
                <span className={styles.link__text}>{t('Overview')}</span>
              </Link>
              <Link to='/organization-list' className={pathname == "/organization-list" ? styles.activelink : styles.link}>
                <PalceIcon className={styles.icon} />
                <span className={styles.link__text}> {t('Org. List')}</span>
              </Link>
            </div>
          }
          {
            (params.id && user || user.role_id !== 1) &&
            <div className={styles.linkBlock}>
              <Link to={`/overview/${params.id}`} className={pathname == `/overview/${params.id}` ? styles.activelink : styles.link}>
                <OverviewIcon className={styles.icon} />
                <span className={styles.link__text}>{t('Overview')}</span>
              </Link>
              <Link to={`/logbook/${params.id}`} className={pathname == `/logbook/${params.id}` ? styles.activelink : styles.link}>
                <LogbookIcon className={styles.icon} />
                <span className={styles.link__text}>{t('Logbook')}</span>
              </Link>

            </div>
          }

          <div>
            {(params.id && user || user.role_id !== 1) &&
              <div className={styles.linkBlock}>
                <Link to={`/overview/${params.id}`} className={pathname == `/help/${params.id}` ? styles.activelink : styles.link}>
                  <HelpIcon className={styles.icon} />
                  <span className={styles.link__text}>{t('Help')}</span>
                </Link>
              </div>
            }
            <AvatarComponent />
          </div>

        </Toolbar>
      </AppBar>
    </div >
  );
}
