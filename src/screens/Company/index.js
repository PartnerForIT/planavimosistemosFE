import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Switch, useParams, Route, useLocation } from 'react-router-dom';

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
    name: 'logbook',
    module: 'logbook',
    permission: 'logbook_module_access',
  },
  {
    name: 'logbook_edit_settings',
    permission: 'logbook_edit_settings',
  },
  {
    name: 'events',
    module: 'events',
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
];

export default () => {
  const { id: companyId } = useParams();
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const permissions = usePermissions(permissionsConfig);

  const isLoading = useSelector(isLoadingCompanySelector);
  const isLoadingCompanyModules = useSelector(companyModulesLoading);

  useEffect(() => {
    if (companyId) {
      dispatch(getCompanyInfo(companyId, true));
      dispatch(getOrganisationModules(companyId));
    }
  }, [companyId]);
  useEffect(() => {
    if (!isLoadingCompanyModules) {
      const onlyPath = pathname.substring(pathname.indexOf('/', 1));
      console.log('pathname', pathname.substring(0, pathname.indexOf('/')));
      console.log('pathname', onlyPath);
      console.log('permissions', permissions);
    }
  }, [isLoadingCompanyModules]);

  if (isLoading || isLoadingCompanyModules) {
    return (
      <div className={styles.progressBlock}>
        <Progress />
      </div>
    );
  }

  return (
    <Switch>
      <Route exact path='/:id/logbook' component={Logbook} />
      <Route exact path='/:id/events' component={Events} />
      <Route exact path='/:id/schedule' component={Schedule} />
      <Route exact path='/:id/schedule/shift/:shiftId' component={CreateShift} />
      <Route exact path='/:id/schedule/shift/create' component={CreateShift} />
      <Route exact path='/:id/reports' component={Reports} />
      <Route exact path='/:id/settings' component={Settings} />
      <Route exact path='/:id/settings/general/company' component={SettingCompany} />
      <Route exact path='/:id/settings/general/work-time' component={SettingWorkTime} />
      <Route exact path='/:id/settings/general/security' component={SettingSecurity} />
      <Route exact path='/:id/settings/accounts/accounts-list' component={Accounts} />
      <Route exact path='/:id/settings/accounts/grouping' component={Grouping} />
      <Route exact path='/:id/settings/accounts/roles' component={Roles} />
      <Route exact path='/:id/settings/schedule' component={ScheduleSettings} />
      <Route exact path='/:id/settings/kiosk/kiosk-list' component={KioskList} />
      <Route exact path='/:id/settings/kiosk/users' component={KioskUsers} />
      <Route exact path='/:id/settings/categories' component={SettingCategories} />
      <Route exact path='/:id/settings/logbook/journal' component={SettingJournal} />
      <Route exact path='/:id/settings/logbook/overtime' component={Overtime} />
      <Route exact path='/:id/settings/activity-log' component={ActivityLog} />
      <Route exact path='/:id/settings/delete' component={SettingDelete} />
      <Route exact path='/:id/settings/events' component={SettingEvents} />
    </Switch>
  );
};
