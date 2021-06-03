import React, { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { useDispatch, useSelector } from 'react-redux';

import PalceIcon from '../../Icons/Place';
import OverviewIcon from '../../Icons/Overview';
import LogbookIcon from '../../Icons/LogbookIcon';
import HelpIcon from '../../Icons/Help';
import SettingsIcon from '../../Icons/Settings';
// import AnalyticsIcon from '../../Icons/Analytics';
import EventsIcon from '../../Icons/Events';
// import VacationIcon from '../../Icons/Vacation';
import AvatarComponent from './Avatar';
import styles from './header.module.scss';
import MenuDialog from '../Dialog/MenuDialog';
import EditPassword from '../Dialog/EditPassword';
import SupportTicket from '../Dialog/SupportTicket';
import { changePassword, editSettingCompany, getSecurityCompany } from '../../../store/settings/actions';
import { postSupportTicket, doneSupportTicket } from '../../../store/company/actions';
import { securityCompanySelector } from '../../../store/settings/selectors';
import usePermissions from '../usePermissions';
import { userSelector } from '../../../store/auth/selectors';
import {
  postSupportTicketLoadingSelector,
  isCreateTicketSelector,
} from '../../../store/company/selectors';
import grownu from '../../Icons/Grownu.png';

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

const permissionsConfig = [
  {
    name: 'logbook',
    module: 'logbook',
  },
  {
    name: 'events',
    module: 'events',
  },
  {
    name: 'reports',
    module: 'reports',
  },
];

export default function ButtonAppBar({ logOut }) {
  const classes = useStyles();
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const pageName = pathname.split('/')[1];
  const { id: companyId } = useParams();
  const user = useSelector(userSelector);
  const dispatch = useDispatch();
  const permissions = usePermissions(permissionsConfig);

  const [anchorEl, setAnchorEl] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openSupportTicket, setOpenSupportTicket] = useState(false);
  const [editPasswordVisible, setEditPasswordVisible] = useState(false);
  const [passwords, setPasswords] = useState(initialPasswords);
  const security = useSelector(securityCompanySelector);
  const postSupportTicketLoading = useSelector(postSupportTicketLoadingSelector);
  const isCreateTicket = useSelector(isCreateTicketSelector);

  const editHandleClose = () => {
    setEditPasswordVisible(false);
    setPasswords(initialPasswords);
  };
  const submitPassword = () => {
    const { password } = passwords;
    const employeeId = JSON.parse(localStorage.getItem('user'))?.employee?.id;

    if (employeeId) {
      dispatch(changePassword(companyId, employeeId, password));
    }
    editHandleClose();
  };
  const changeLanguage = (data) => {
    dispatch(editSettingCompany({ lang: data.toUpperCase() }, companyId));
  };
  const handleSubmit = (description) => {
    dispatch(postSupportTicket({
      companyId,
      data: {
        description,
      },
    }));
  };

  useEffect(() => {
    if (companyId) {
      dispatch(getSecurityCompany(companyId));
    }
  }, [dispatch, companyId]);

  return (
    <div className={classes.root}>
      <AppBar position='fixed' className={classes.appBar}>
        <Toolbar className={classes.toolbar}>
          {/* SuperAdmin Links */}
          {
            (!companyId && user?.user?.role_id === 1)
            && (
            <div className={styles.linkBlock}>
              <div className={styles.logoWrapper}>
                <img
                  alt=''
                  src={grownu}
                  className={styles.logo}
                />
              </div>
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
          {/* Company Links */}
          {
            companyId && (
              <div className={styles.linkBlock}>
                <div className={styles.logoWrapper}>
                  <img
                    alt=''
                    src={grownu}
                    className={styles.logo}
                  />
                </div>
                {
                  // <Link
                  //   to={`/overview/${companyId}`}
                  //   className={pageName === 'overview' ? styles.activelink : styles.link}
                  // >
                  //   <OverviewIcon className={styles.icon}/>
                  //   <span className={styles.link__text}>{t('Overview')}</span>
                  // </Link>
                }
                {
                  // <Link to={`/place/${id}`} className={pageName === 'place' ? styles.activelink : styles.link}>
                  //   <PalceIcon className={styles.icon} />
                  //   <span className={styles.link__text}>{t('Place')}</span>
                  // </Link>
                }
                {
                  permissions.logbook && (
                    <Link
                      to={`/logbook/${companyId}`}
                      className={pageName === 'logbook' ? styles.activelink : styles.link}
                    >
                      <LogbookIcon className={styles.icon} width={19.28} height={24.9} />
                      <span className={styles.link__text}>{t('Logbook')}</span>
                    </Link>
                  )
                }
                {
                  // <Link
                  //     to={`/analytics/${id}`}
                  //     className={pageName === 'analytics' ? styles.activelink : styles.link}
                  // >
                  //   <AnalyticsIcon className={styles.icon} />
                  //   <span className={styles.link__text}>{t('Analytics')}</span>
                  // </Link>
                }
                {
                  permissions.events && (
                    <Link
                      to={`/events/${companyId}`}
                      className={pageName === 'events' ? styles.activelink : styles.link}
                    >
                      <EventsIcon fill='#808f94' viewBox='0 0 32 32' className={styles.icon} />
                      <span className={styles.link__text}>{t('Events')}</span>
                    </Link>
                  )
                }
                {
                  permissions.reports && (
                    <Link
                      to={`/reports/${companyId}`}
                      className={pageName === 'reports' ? styles.activelink : styles.link}
                    >
                      <OverviewIcon className={styles.icon} />
                      <span className={styles.link__text}>{t('Reports')}</span>
                    </Link>
                  )
                }
                {
                  // <Link to={`/vacation/${id}`} className={pageName === 'vacation' ? styles.activelink : styles.link}>
                  //   <VacationIcon className={styles.icon} />
                  //   <span className={styles.link__text}>{t('Vacation')}</span>
                  // </Link>
                }
              </div>
            )
          }
          <div className={styles.rightLinkBlock}>
            {/* Company Links */}
            {companyId && (
              <div className={styles.linkBlock}>
                <Link
                  to={`/settings/${companyId}`}
                  className={pageName === 'settings' ? styles.activelink : styles.link}
                >
                  <SettingsIcon className={styles.icon} />
                  <span className={styles.link__text}>{t('Settings')}</span>
                </Link>
                <button
                  className={styles.link}
                  onClick={() => {
                    setOpenSupportTicket(true);
                  }}
                >
                  <HelpIcon className={styles.icon} />
                  <span className={styles.link__text}>{t('Help')}</span>
                </button>
              </div>
            )}
            <AvatarComponent
              setAnchorEl={setAnchorEl}
              setMenuOpen={setMenuOpen}
            />
          </div>

        </Toolbar>
      </AppBar>

      <SupportTicket
        open={openSupportTicket}
        onExited={() => {
          if (isCreateTicket) {
            dispatch(doneSupportTicket());
          }
        }}
        handleClose={() => {
          setOpenSupportTicket(false);
        }}
        onSubmit={handleSubmit}
        loading={postSupportTicketLoading}
        isCreateTicket={isCreateTicket}
      />

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
