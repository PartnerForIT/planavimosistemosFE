import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Switch, useParams, Route } from 'react-router-dom';

import Progress from '../../components/Core/Progress';
import Logbook from '../../components/Logbook/Logbook';
import { getCompanyInfo, getOrganisationModules } from '../../store/company/actions';
import { companyModulesLoading, isLoadingCompanySelector } from '../../store/company/selectors';

import styles from './Company.module.scss';
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

export default () => {
  const { id: companyId } = useParams();
  const dispatch = useDispatch();

  const isLoading = useSelector(isLoadingCompanySelector);
  const isLoadingCompanyModules = useSelector(companyModulesLoading);

  useEffect(() => {
    if (companyId) {
      dispatch(getCompanyInfo(companyId, true));
      dispatch(getOrganisationModules(companyId));
    }
  }, [companyId]);

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
