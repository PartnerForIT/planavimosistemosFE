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
import { companyModulesLoading, isLoadingCompanySelector } from '../../store/company/selectors';

import Events from '../../components/Events/Events';
import Schedule from '../Schedule';
import CreateShift from '../Schedule/Shift';
import Settings from '../../components/Settings';
import SettingCompany from '../../components/Settings/General/Company';
import SettingWorkTime from '../../components/Settings/General/WorkTime';
import SettingSecurity from '../../components/Settings/General/Security';
import Accounts from '../../components/Settings/Accounts/AccountsList';
import Grouping from '../../components/Settings/Accounts/Grouping';
import Roles from '../../components/Settings/Accounts/Roles';
import ScheduleSettings from '../../components/Settings/Schedule';
import KioskList from '../../components/Settings/Kiosk/KioskList';
import KioskUsers from '../../components/Settings/Kiosk/KioskUsers';
import SettingCategories from '../../components/Settings/Categories';
import SettingJournal from '../../components/Settings/Logbook/Journal';
import Overtime from '../../components/Settings/Logbook/Overtime';
import ActivityLog from '../../components/Settings/ActivityLog';
import SettingDelete from '../../components/Settings/Delete';
import SettingEvents from '../../components/Settings/Events';
import Reports from '../../components/Reports/Reports';
import usePermissions from '../../components/Core/usePermissions';

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
];

export default () => {
  const { id: companyId } = useParams();
  const dispatch = useDispatch();
  // const { pathname } = useLocation();
  // const history = useHistory();
  const permissions = usePermissions(permissionsConfig);

  const isLoading = useSelector(isLoadingCompanySelector);
  const isLoadingCompanyModules = useSelector(companyModulesLoading);

  useEffect(() => {
    if (companyId) {
      dispatch(getCompanyInfo(companyId, true));
      dispatch(getOrganisationModules(companyId));
    }
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

  if (isLoading || isLoadingCompanyModules) {
    return (
      <div className={styles.progressBlock}>
        <Progress />
      </div>
    );
  }

  return (
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
        (permissions.schedule_shift_access || permissions.schedule_simple_access) && (
          <Route exact path='/:id/schedule' component={Schedule} />
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
        ((permissions.schedule_shift || permissions.schedule_simple) && permissions.schedule_module) && (
          <Route exact path='/:id/settings/schedule' component={ScheduleSettings} />
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
        permissions.activity_log && (
          <Route exact path='/:id/settings/activity-log' component={ActivityLog} />
        )
      }
      {
        permissions.data_delete && (
          <Route exact path='/:id/settings/delete' component={SettingDelete} />
        )
      }
      {
        (permissions.events && permissions.events_create) && (
          <Route exact path='/:id/settings/events' component={SettingEvents} />
        )
      }
      <Redirect from='*' to='/404' />
    </Switch>
  );
};
