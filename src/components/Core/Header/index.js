import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';

import PalceIcon from '../../Icons/Place';
import OverviewIcon from '../../Icons/Overview';
import LogbookIcon from '../../Icons/LogbookIcon';
import HelpIcon from '../../Icons/Help';
import SettingsIcon from '../../Icons/Settings';
import EventsIcon from '../../Icons/Events';
import TimeSheetIcon from '../../Icons/TimeSheet';
import TimeOffIcon from '../../Icons/TimeOff';
import ScheduleIcon from '../../Icons/Schedule';
import TaskerIcon from '../../Icons/Tasker';
import Grownu from '../../Icons/Grownu';
import AvatarComponent from './Avatar';
import styles from './header.module.scss';
import MenuDialog from '../Dialog/MenuDialog';
import EditPassword from '../Dialog/EditPassword';
import SupportTicket from '../Dialog/SupportTicket';
import { changePassword, editLangSettingCompany, getSecurityCompany } from '../../../store/settings/actions';
import { postSupportTicket, doneSupportTicket } from '../../../store/company/actions';
import { securityCompanySelector } from '../../../store/settings/selectors';
import usePermissions from '../usePermissions';
import { userSelector, eventsCounterSelector, timeoffCounterSelector } from '../../../store/auth/selectors';
import {
  postSupportTicketLoadingSelector,
  isCreateTicketSelector,
} from '../../../store/company/selectors';

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
    permission: 'logbook_module_access',
  },
  {
    name: 'events',
    module: 'events',
    permission: 'events_module_access',
  },
  {
    name: 'reports',
    module: 'reports',
    permission: 'reports_module_access',
  },
  {
    name: 'schedule_shift',
    module: 'schedule_shift',
    permission: 'schedule_module_access',
  },
  {
    name: 'schedule_simple',
    module: 'schedule_simple',
    permission: 'schedule_module_access',
  },

  {
    name: 'activity_log',
    permission: 'activity_log_view',
    module: 'activity_log',
  },
  {
    name: 'groups',
    module: 'create_groups',
    permission: 'groups_create',
  },
  {
    name: 'logbook_edit_settings',
    permission: 'logbook_edit_settings',
  },
  {
    name: 'events_create',
    permission: 'events_create',
  },
  {
    name: 'company_edit_settings',
    permission: 'company_edit_settings',
  },
  {
    name: 'roles_create',
    permission: 'roles_create',
  },
  {
    name: 'data_delete',
    permission: 'data_delete',
  },
  {
    name: 'categories_create',
    permission: 'categories_create',
  },
  {
    name: 'accounts_see_and_edit',
    permission: 'accounts_see_and_edit',
  },
  {
    name: 'kiosk',
    permission: 'kiosk_create',
    module: 'kiosk',
  },
  {
    name: 'schedule_create_and_edit',
    permission: 'schedule_create_and_edit',
  },
  {
    name: 'schedule_module',
    permission: 'schedule_module_access',
  },
  {
    name: 'time_sheet_edit_settings',
    module: 'time_sheet',
    permission: 'time_sheet_edit_settings',
  },
  {
    name: 'time_sheet',
    module: 'time_sheet',
    permission: 'time_sheet_module_access',
  },
  {
    name: 'time_off',
    module: 'time_off',
  },
];

export default function ButtonAppBar({ logOut }) {
  const classes = useStyles();
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const [,, pageName] = pathname.split('/');
  const { id: companyId } = useParams();
  const user = useSelector(userSelector);
  const eventsCounter = useSelector(eventsCounterSelector);
  const timeOffCounter = useSelector(timeoffCounterSelector);
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
    const employeeId = JSON.parse(localStorage.getItem('user'))?.employee?.id;

    if (employeeId) {
      dispatch(changePassword(companyId, employeeId, passwords));
    }
    editHandleClose();
  };
  const changeLanguage = (data) => {
    dispatch(editLangSettingCompany({ lang: data.toUpperCase() }, companyId));
  };
  const handleSubmit = (description) => {
    dispatch(postSupportTicket({
      companyId,
      data: {
        description,
      },
    }));
  };

  const menuLeftItems = useMemo(() => {
    const nextMenuItems = [];
    const isSuperAdmin = user?.user?.role_id === 1;

    /* Super Admin Links */
    if (!companyId && isSuperAdmin) {
      return [
        {
          Icon: OverviewIcon,
          title: t('Overview'),
          name: 'overview',
          to: '/overview',
        },
        {
          Icon: PalceIcon,
          title: t('Org. List'),
          name: 'organization-list',
          to: '/organization-list',
        },
      ];
    }

    /* Company Links */
    if (permissions.logbook) {
      nextMenuItems.push({
        Icon: LogbookIcon,
        title: t('Logbook'),
        name: 'logbook',
        to: `/${companyId}/logbook`,
        width: 19.28,
        height: 24.9,
      });
    }
    if (permissions.events) {
      nextMenuItems.push({
        Icon: EventsIcon,
        title: t('Events'),
        name: 'events',
        to: `/${companyId}/events`,
        counter: 'events_counter',
      });
    }
    if (permissions.reports) {
      nextMenuItems.push({
        Icon: OverviewIcon,
        title: t('Reports'),
        name: 'reports',
        to: `/${companyId}/reports`,
      });
    }
    if (permissions.time_sheet) {
      nextMenuItems.push({
        Icon: TimeSheetIcon,
        title: t('Time Sheet'),
        name: 'time-sheet',
        to: `/${companyId}/time-sheet`,
      });
    }
    if ((permissions.schedule_shift || permissions.schedule_simple)) {
      nextMenuItems.push({
        Icon: permissions.schedule_simple ? TaskerIcon : ScheduleIcon,
        title: permissions.schedule_simple ? t('Tasker') : t('Schedule'),
        name: 'schedule',
        to: `/${companyId}/schedule`,
        width: 33,
        height: 28,
      });
    }

    if (permissions.time_off) {
      nextMenuItems.push({
        Icon: TimeOffIcon,
        title: t('Time Off'),
        name: 'time-off',
        to: `/${companyId}/time-off`,
        counter: 'timeoff_counter',
      });
    }

    return nextMenuItems;
  }, [permissions, companyId, t, user]);
  const withSettingsButton = useMemo(() => (
    permissions.accounts_see_and_edit
    || permissions.company_edit_settings
    || permissions.time_sheet_edit_settings
    || permissions.roles_create
    || permissions.groups
    || (permissions.logbook && permissions.logbook_edit_settings)
    || permissions.kiosk
    || (permissions.events && permissions.events_create)
    || ((permissions.schedule_shift || permissions.schedule_simple) && permissions.schedule_edit)
    || permissions.activity_log
    || permissions.time_off
    || permissions.data_delete
    || permissions.categories_create
  ), [permissions]);

  useEffect(() => {
    if (companyId) {
      dispatch(getSecurityCompany(companyId));
    }
  }, [dispatch, companyId]);

  return (
    <div className={classes.root}>
      <AppBar position='fixed' className={classes.appBar}>
        <Toolbar className={classes.toolbar}>
          <div className={styles.linkBlock}>
            <div className={styles.logoWrapper}>
              <Grownu />
            </div>
            {menuLeftItems.map((item) => (
              <Link
                to={item.to}
                key={item.name}
                className={classNames(styles.link, { [styles.link_active]: pageName === item.name })}
              >
                <item.Icon
                  className={classNames(styles.icon, { [styles.taskerIcon]: item.Icon === TaskerIcon })}
                  width={item.width}
                  heigt={item.height}
                />
                <span className={styles.link__text}>
                  {item.title}
                </span>
                {item.counter && <span className={styles.counter}>{item.counter === 'events_counter' ? eventsCounter : (item.counter === 'timeoff_counter' ? timeOffCounter : (item[item.counter] ? item[item.counter] : ''))}</span>}
              </Link>
            ))}
          </div>

          <div className={styles.rightLinkBlock}>
            {/* Company Links */}
            {companyId && (
              <>
                {
                  withSettingsButton && (
                    <Link
                      to={`/${companyId}/settings`}
                      className={classNames(styles.link, { [styles.link_active]: pageName === 'settings' })}
                    >
                      <SettingsIcon />
                      <span className={styles.link__text}>{t('Settings')}</span>
                    </Link>
                  )
                }
                <button
                  className={styles.link}
                  onClick={() => {
                    setOpenSupportTicket(true);
                  }}
                >
                  <HelpIcon className={styles.icon} />
                  <span className={styles.link__text}>{t('Help')}</span>
                </button>
              </>
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
