import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Switch,
  useParams,
  Route,
  Redirect,
} from 'react-router-dom';

import Progress from '../../components/Core/Progress';
import Logbook from '../../components/Logbook/Logbook';
import { getCompanyInfo, getOrganisationModules } from '../../store/company/actions';
import { loadLogbookAdditionalRates } from '../../store/settings/actions';
import { companyModulesLoading, isLoadingCompanySelector } from '../../store/company/selectors';
import { userSelector } from '../../store/auth/selectors';

import Events from '../../components/Events/Events';
import ScheduleV2 from '../ScheduleV2';
import TimeOffScreen from '../TimeOff'
import SimpleSchedule from '../SimpleSchedule';
import CreateShift from '../Schedule/Shift';
import TimeSheet from '../TimeSheet';
import Settings from '../../components/Settings';
import SettingCompany from '../../components/Settings/General/Company';
import SettingWorkTime from '../../components/Settings/General/WorkTime';
import SettingSecurity from '../../components/Settings/General/Security';
import Accounts from '../../components/Settings/Accounts/AccountsList';
import Grouping from '../../components/Settings/Accounts/Grouping';
import Roles from '../../components/Settings/Accounts/Roles';
import ScheduleSettings from '../../components/Settings/Schedule';
import SimpleScheduleSettings from '../../components/Settings/SimpleSchedule';
import KioskList from '../../components/Settings/Kiosk/KioskList';
import KioskUsers from '../../components/Settings/Kiosk/KioskUsers';
import SettingCategories from '../../components/Settings/Categories';
import SettingJournal from '../../components/Settings/Logbook/Journal';
import Overtime from '../../components/Settings/Logbook/Overtime';
import AdditionalRates from '../../components/Settings/Logbook/AdditionalRates';
import Clock from '../../components/Settings/Logbook/Clock';
import ActivityLog from '../../components/Settings/ActivityLog';
import TimeOff from '../../components/Settings/TimeOff';
import TimeSheetSettings from '../../components/Settings/TimeSheet';
import IntegrationsSettings from '../../components/Settings/Integrations';
import SettingDelete from '../../components/Settings/Delete/DataDelete';
import AutoDelete from '../../components/Settings/Delete/AutoDelete';
import SettingEvents from '../../components/Settings/Events';
import Reports from '../../components/Reports/Reports';
import usePermissions from '../../components/Core/usePermissions';
import { NotificationContainer, addNotification } from "../../components/Core/NotificationContainer/NotificationContainer";
import pusher from '../../pusher';
import getToken from '../../store/getToken';

import styles from './Company.module.scss';

const permissionsConfig = [
  {
    name: 'company_edit_settings',
    permission: 'company_edit_settings',
  },
  {
    name: 'logbook',
    module: 'logbook',
    permission: 'logbook_module_access',
  },
  {
    name: 'logbook_edit_settings',
    permission: 'logbook_edit_settings',
  },
  {
    name: 'additional_rates',
    permission: 'additional_rates',
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
    name: 'events',
    module: 'events',
    permission: 'events_module_access',
  },
  {
    name: 'events_create',
    permission: 'events_create',
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
    name: 'schedule_shift_access',
    module: 'schedule_shift',
    permission: 'schedule_module_access',
  },
  {
    name: 'schedule_simple_access',
    module: 'schedule_simple',
    permission: 'schedule_module_access',
  },
  {
    name: 'schedule_shift',
    module: 'schedule_shift',
    permission: 'schedule_create_and_edit',
  },
  {
    name: 'schedule_simple',
    module: 'schedule_simple',
    permission: 'schedule_create_and_edit',
  },
  {
    name: 'schedule_module',
    permission: 'schedule_module_access',
  },
  {
    name: 'reports',
    module: 'reports',
    permission: 'reports_module_access',
  },
  {
    name: 'time_sheet_edit_settings',
    module: 'time_sheet',
    permission: 'time_sheet_edit_settings',
  },
  {
    name: 'time_sheet_module',
    module: 'time_sheet',
    permission: 'time_sheet_module_access',
  },
  {
    name: 'integrations_edit_settings',
    module: 'integrations',
    permission: 'integrations_edit_settings',
  },
  {
    name: 'schedule_create_and_edit',
    permission: 'schedule_create_and_edit',
  },
  {
    name: 'time_off',
    module: 'time_off',
  },
];

export default () => {
  const { id: companyId } = useParams();
  const dispatch = useDispatch();
  // const { pathname } = useLocation();
  // const history = useHistory();
  const permissions = usePermissions(permissionsConfig);

  const isLoading = useSelector(isLoadingCompanySelector);
  const isLoadingCompanyModules = useSelector(companyModulesLoading);
  const user = useSelector(userSelector);

  useEffect(() => {
    if (companyId) {
      dispatch(getCompanyInfo(companyId, true));
      dispatch(getOrganisationModules(companyId));
      dispatch(loadLogbookAdditionalRates(companyId));
      pusher.init(getToken(), (status) => {});
      pusher.openUserChannel(user?.user?.id);
      pusher.listenUserNotify(addNotification);

    }
    // eslint-disable-next-line
  }, [companyId]);
  // useEffect(() => {
  //   if (!isLoadingCompanyModules) {
  //     const [,,, section, innerSection] = pathname.split('/');
  //     // const onlyPath = pathname.substring(pathname.indexOf('/', 1));
  //     console.log('pathname', pathname.substring(0, pathname.indexOf('/')));
  //     console.log('permissions', permissions);
  //
  //     // !(true && true)
  //     if (
  //       (section === 'general' && !permissions.company_edit_settings)
  //       || (section === 'accounts' && (
  //         (innerSection === 'accounts-list' && !permissions.accounts_see_and_edit)
  //         || (innerSection === 'roles' && !permissions.roles_create)
  //         || (innerSection === 'grouping' && !permissions.groups)
  //       ))
  //       || (section === 'logbook' && !(permissions.logbook && permissions.logbook_edit_settings))
  //       // || (section === 'kiosk' && !permissions.kiosk)
  //     ) {
  //       history.push('/');
  //     }
  //   }
  // }, [isLoadingCompanyModules, pathname]);

  const isSuperAdmin = user?.user?.role_id === 1;
  if (!isSuperAdmin && user.employee.company_id !== +companyId) {
    return (
      <Redirect from='*' to='/404' />
    );
  }

  if (isLoading || isLoadingCompanyModules) {
    return (
      <div className={styles.progressBlock}>
        <Progress />
      </div>
    );
  }

  return (
    <>
      <NotificationContainer />
      <Switch>
        {
          permissions.logbook && (
            <Route exact path='/:id/logbook' component={Logbook} />
          )
        }
        {
          permissions.events && (
            <Route exact path='/:id/events' component={Events} />
          )
        }
        {
          (permissions.time_sheet_module) && (
            <Route exact path='/:id/time-sheet' component={TimeSheet} />
          )
        }
        {/* {
          (permissions.schedule_shift_access || permissions.schedule_simple_access) && (
            <Route exact path='/:id/schedule' component={permissions.schedule_simple_access ? SimpleSchedule : Schedule} />
          )
        } */}
        {
          (permissions.schedule_shift_access || permissions.schedule_simple_access) && (
            <Route exact path='/:id/schedule' component={permissions.schedule_simple_access ? SimpleSchedule : ScheduleV2} />
          )
        }
        {
          (permissions.schedule_shift_access || permissions.schedule_simple_access) && (
            <Route exact path='/:id/schedule/shift/:shiftId' component={CreateShift} />
          )
        }
        {
          (permissions.schedule_shift_access || permissions.schedule_simple_access) && (
            <Route exact path='/:id/schedule/shift/create' component={CreateShift} />
          )
        }
        {
          permissions.reports && (
            <Route exact path='/:id/reports' component={Reports} />
          )
        }
        <Route exact path='/:id/settings' component={Settings} />
        {
          permissions.company_edit_settings && (
            <Route exact path='/:id/settings/general/company' component={SettingCompany} />
          )
        }
        {
          permissions.company_edit_settings && (
            <Route exact path='/:id/settings/general/work-time' component={SettingWorkTime} />
          )
        }
        {
          permissions.company_edit_settings && (
            <Route exact path='/:id/settings/general/security' component={SettingSecurity} />
          )
        }
        {
          permissions.accounts_see_and_edit && (
            <Route exact path='/:id/settings/accounts/accounts-list' component={Accounts} />
          )
        }
        {
          permissions.groups && (
            <Route exact path='/:id/settings/accounts/grouping' component={Grouping} />
          )
        }
        {
          permissions.roles_create && (
            <Route exact path='/:id/settings/accounts/roles' component={Roles} />
          )
        }
        {
          (permissions.schedule_create_and_edit && (permissions.schedule_module || permissions.schedule_simple)) && (
            <Route exact path='/:id/settings/schedule' component={permissions.schedule_simple_access ? SimpleScheduleSettings : ScheduleSettings} />
          )
        }
        {
          permissions.kiosk && (
            <Route exact path='/:id/settings/kiosk/kiosk-list' component={KioskList} />
          )
        }
        {
          permissions.kiosk && (
            <Route exact path='/:id/settings/kiosk/users' component={KioskUsers} />
          )
        }
        {
          permissions.categories_create && (
            <Route exact path='/:id/settings/categories' component={SettingCategories} />
          )
        }
        {
          (permissions.logbook && permissions.logbook_edit_settings) && (
            <Route exact path='/:id/settings/logbook/journal' component={SettingJournal} />
          )
        }
        {
          (permissions.logbook && permissions.logbook_edit_settings) && (
            <Route exact path='/:id/settings/logbook/overtime' component={Overtime} />
          )
        }
        {
          (permissions.logbook && permissions.logbook_edit_settings) && (
            <Route exact path='/:id/settings/logbook/additional-rates' component={AdditionalRates} />
          )
        }
        {
          (permissions.logbook && permissions.logbook_edit_settings) && (
            <Route exact path='/:id/settings/logbook/clock' component={Clock} />
          )
        }
        {
          permissions.activity_log && (
            <Route exact path='/:id/settings/activity-log' component={ActivityLog} />
          )
        }
        {
          permissions.time_off && (
            <Route exact path='/:id/settings/time-off' component={TimeOff} />
          )
        }
        {
          permissions.time_off && (
            <Route exact path='/:id/time-off' component={TimeOffScreen} />
          )
        }
        {
          permissions.time_sheet_edit_settings && (
            <Route exact path='/:id/settings/time_sheet' component={TimeSheetSettings} />
          )
        }
        {
          permissions.integrations_edit_settings && (
            <Route exact path='/:id/settings/integrations' component={IntegrationsSettings} />
          )
        }
        {
          permissions.data_delete && (
            <Route exact path='/:id/settings/delete/data-delete' component={SettingDelete} />
          )
        }
        {
          permissions.data_delete && (
            <Route exact path='/:id/settings/delete/auto-delete' component={AutoDelete} />
          )
        }
        {
          (permissions.events && permissions.events_create) && (
            <Route exact path='/:id/settings/events' component={SettingEvents} />
          )
        }
        <Redirect from='*' to='/404' />
      </Switch>
    </>
  );
};