import React, { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { useDispatch, useSelector } from 'react-redux';
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
import EditPassword from '../Dialog/EditPassword';
import { changePassword, editSettingCompany, getSecurityCompany } from '../../../store/settings/actions';
import { securityCompanySelector } from '../../../store/settings/selectors';

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

const initialPasswords = {
  current: '',
  password: '',
  repeatPassword: '',
};

export default function ButtonAppBar({ logOut }) {
  const classes = useStyles();
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const pageName = pathname.split('/')[1];
  const { id } = useParams();
  const user = JSON.parse(localStorage.getItem('user'));
  const dispatch = useDispatch();

  const [anchorEl, setAnchorEl] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [editPasswordVisible, setEditPasswordVisible] = useState(false);
  const [passwords, setPasswords] = useState(initialPasswords);
  const security = useSelector(securityCompanySelector);

  useEffect(() => {
    if (id) {
      dispatch(getSecurityCompany(id));
    }
  }, [dispatch, id]);

  const editHandleClose = () => {
    setEditPasswordVisible(false);
    setPasswords(initialPasswords);
  };
  const submitPassword = () => {
    const { password } = passwords;
    const employeeId = JSON.parse(localStorage.getItem('user'))?.employee?.id;

    if (employeeId) {
      dispatch(changePassword(id, employeeId, password));
    }
    editHandleClose();
  };

  const changeLanguage = (data) => {
    dispatch(editSettingCompany({ lang: data.toUpperCase() }, id));
  };

  return (
    <div className={classes.root}>
      <AppBar position='fixed' className={classes.appBar}>
        <Toolbar className={classes.toolbar}>
          {/* SuperAdmin Link */}
          {
            (!id && user && user.role_id === 1)
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
            ((id && user) || user.role_id !== 1)
            && (
            <div className={styles.linkBlock}>
              <Link to={`/overview/${id}`} className={pageName === 'overview' ? styles.activelink : styles.link}>
                <OverviewIcon className={styles.icon} />
                <span className={styles.link__text}>{t('Overview')}</span>
              </Link>
              {/*<Link to={`/place/${id}`} className={pageName === 'place' ? styles.activelink : styles.link}>*/}
              {/*  <PalceIcon className={styles.icon} />*/}
              {/*  <span className={styles.link__text}>{t('Place')}</span>*/}
              {/*</Link>*/}
              <Link to={`/logbook/${id}`} className={pageName === 'logbook' ? styles.activelink : styles.link}>
                <LogbookIcon className={styles.icon} />
                <span className={styles.link__text}>{t('Logbook')}</span>
              </Link>
              {/*<Link*/}
              {/*  to={`/analytics/${id}`}*/}
              {/*  className={pageName === 'analytics' ? styles.activelink : styles.link}*/}
              {/*>*/}
              {/*  <AnalyticsIcon className={styles.icon} />*/}
              {/*  <span className={styles.link__text}>{t('Analytics')}</span>*/}
              {/*</Link>*/}
              <Link to={`/events/${id}`} className={pageName === 'events' ? styles.activelink : styles.link}>
                <EventsIcon fill='#808f94' viewBox='0 0 32 32' className={styles.icon} />
                <span className={styles.link__text}>{t('Events')}</span>
              </Link>
              <Link to={`/reports/${id}`} className={pageName === 'reports' ? styles.activelink : styles.link}>
                <OverviewIcon className={styles.icon} />
                <span className={styles.link__text}>{t('Reports')}</span>
              </Link>
              {/*<Link to={`/vacation/${id}`} className={pageName === 'vacation' ? styles.activelink : styles.link}>*/}
              {/*  <VacationIcon className={styles.icon} />*/}
              {/*  <span className={styles.link__text}>{t('Vacation')}</span>*/}
              {/*</Link>*/}
            </div>
            )
          }
          {/* Admin Link */}
          <div className={styles.rightLinkBlock}>
            {/* Admin Link */}
            {((id && user) || user.role_id !== 1)
              && (
              <div className={styles.linkBlock}>
                <Link
                  to={`/settings/${id}`}
                  className={pageName === 'settings' ? styles.activelink : styles.link}
                >
                  <SettingsIcon className={styles.icon} />
                  <span className={styles.link__text}>{t('Settings')}</span>
                </Link>
                <Link
                  to={`/help/${id}`}
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
        logOut={logOut}
        editPassword={() => setEditPasswordVisible(true)}
        changeLanguage={changeLanguage}
      />

      <EditPassword
        open={editPasswordVisible}
        handleClose={editHandleClose}
        title={t('Change password')}
        buttonTitle={t('Change password')}
        passwords={passwords}
        setPasswords={setPasswords}
        onSubmit={submitPassword}
        security={security}
      />
    </div>
  );
}
