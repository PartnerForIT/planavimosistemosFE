import React, { useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import PalceIcon from '../../Icons/Place';
import OverviewIcon from '../../Icons/Overview';
import LogbookIcon from '../../Icons/Logbook';
import HelpIcon from '../../Icons/Help';
import SettingsIcon from '../../Icons/Settings';
import AnalyticsIcon from '../../Icons/Analytics';
import EventsIcon from '../../Icons/Events';
import VacationIcon from '../../Icons/Vacation';
import AvatarComponent from './Avatar';
import styles from './header.module.scss';
import MenuDialog from '../Dialog/MenuDialog';

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
    justifyContent: 'space-between',
  },
}));

export default function ButtonAppBar() {
  const classes = useStyles();
  const { pathname } = useLocation();
  const pageName = pathname.split('/')[1];
  const { t } = useTranslation();
  const params = useParams();
  const user = JSON.parse(localStorage.getItem('user'));

  const [anchorEl, setAnchorEl] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className={classes.root}>
      <AppBar position='fixed' className={classes.appBar}>
        <Toolbar className={classes.toolbar}>
          {/* SuperAdmin Link */}
          {
            (!params.id && user && user.role_id === 1)
            && (
            <div className={styles.linkBlock}>
              <Link to='/overview' className={pageName === 'overview' ? styles.activelink : styles.link}>
                <OverviewIcon className={styles.icon} />
                <span className={styles.link__text}>{t('Overview')}</span>
              </Link>
              <Link
                to='/organization-list'
                className={pageName === 'organization-list' ? styles.activelink : styles.link}
              >
                <PalceIcon className={styles.icon} />
                <span className={styles.link__text}>
                  {' '}
                  {t('Org. List')}
                </span>
              </Link>
            </div>
            )
          }
          {/* Admin Link */}
          {
            ((params.id && user) || user.role_id !== 1)
            && (
            <div className={styles.linkBlock}>
              <Link to={`/overview/${params.id}`} className={pageName === 'overview' ? styles.activelink : styles.link}>
                <OverviewIcon className={styles.icon} />
                <span className={styles.link__text}>{t('Overview')}</span>
              </Link>
              <Link to={`/place/${params.id}`} className={pageName === 'place' ? styles.activelink : styles.link}>
                <PalceIcon className={styles.icon} />
                <span className={styles.link__text}>{t('Place')}</span>
              </Link>
              <Link to={`/logbook/${params.id}`} className={pageName === 'logbook' ? styles.activelink : styles.link}>
                <LogbookIcon className={styles.icon} />
                <span className={styles.link__text}>{t('Logbook')}</span>
              </Link>
              <Link
                to={`/analytics/${params.id}`}
                className={pageName === 'analytics' ? styles.activelink : styles.link}
              >
                <AnalyticsIcon className={styles.icon} />
                <span className={styles.link__text}>{t('Analytics')}</span>
              </Link>
              <Link to={`/events/${params.id}`} className={pageName === 'events' ? styles.activelink : styles.link}>
                <EventsIcon fill='#808f94' viewBox='0 0 32 32' className={styles.icon} />
                <span className={styles.link__text}>{t('Events')}</span>
              </Link>
              <Link to={`/reports/${params.id}`} className={pageName === 'reports' ? styles.activelink : styles.link}>
                <OverviewIcon className={styles.icon} />
                <span className={styles.link__text}>{t('Reports')}</span>
              </Link>
              <Link to={`/vacation/${params.id}`} className={pageName === 'vacation' ? styles.activelink : styles.link}>
                <VacationIcon className={styles.icon} />
                <span className={styles.link__text}>{t('Vacation')}</span>
              </Link>
            </div>
            )
          }
          {/* Admin Link */}
          <div className={styles.rightLinkBlock}>
            {/* Admin Link */}
            {((params.id && user) || user.role_id !== 1)
              && (
              <div className={styles.linkBlock}>
                <Link
                  to={`/settings/${params.id}`}
                  className={pageName === 'settings' ? styles.activelink : styles.link}
                >
                  <SettingsIcon className={styles.icon} />
                  <span className={styles.link__text}>{t('Settings')}</span>
                </Link>
                <Link
                  to={`/help/${params.id}`}
                  className={pageName === 'help' ? styles.activelink : styles.link}
                >
                  <HelpIcon className={styles.icon} />
                  <span className={styles.link__text}>{t('Help')}</span>
                </Link>
              </div>
              )}
            {/* Admin Link */}
            <AvatarComponent
              setAnchorEl={setAnchorEl}
              setMenuOpen={setMenuOpen}
            />
          </div>

        </Toolbar>
      </AppBar>

      <MenuDialog
        setAnchorEl={setAnchorEl}
        anchorEl={anchorEl}
        open={menuOpen}
        setMenuOpen={setMenuOpen}
      />
    </div>
  );
}
