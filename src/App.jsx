import React, { Suspense } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';
import Logbook from './components/Logbook/Logbook';
import Reports from './components/Reports/Reports';
import OrganizationList from './components/OrganizationList';
import Overview from './components/Overview';
import Help from './components/HelpPage';
import Settings from './components/Settings';
import Login from './components/Auth/Login';
import Logout from './components/Auth/Logout';
import AuthRoute from './components/Auth/AuthRoute';
import SettingCompany from './components/Settings/General/Company';
import SettingJournal from './components/Settings/Logbook/Journal';
import SettingEvents from './components/Settings/Events';
import SettingWorkTime from './components/Settings/General/WorkTime';
import SettingSecurity from './components/Settings/General/Security';
import SettingCategories from './components/Settings/Categories';
import Overtime from './components/Settings/Logbook/Overtime';
import SettingDelete from './components/Settings/Delete';
import Accounts from './components/Settings/Accounts/AccountsList';
import ActivityLog from './components/Settings/ActivityLog';

const App = () => (
  <Suspense fallback={<div>loading</div>}>
    <Router>
      <Switch>
        <Route exact path='/' component={Login} />
        <Route exact path='/logout' component={Logout} />
        <AuthRoute exact path='/organization-list' component={OrganizationList} />
        <AuthRoute exact path='/logbook/:id' component={Logbook} />
        <AuthRoute exact path='/overview' component={Overview} />
        <AuthRoute exact path='/overview/:id' component={Overview} />
        <AuthRoute exact path='/help/:id' component={Help} />
        <AuthRoute exact path='/settings/:id' component={Settings} />
        <AuthRoute exact path='/settings/general/company/:id' component={SettingCompany} />
        <AuthRoute exact path='/settings/general/work-time/:id' component={SettingWorkTime} />
        <AuthRoute exact path='/settings/general/security/:id' component={SettingSecurity} />
        <AuthRoute exact path='/settings/accounts/accounts-list/:id' component={Accounts} />
        <AuthRoute exact path='/settings/categories/:id' component={SettingCategories} />
        <AuthRoute exact path='/settings/logbook/journal/:id' component={SettingJournal} />
        <AuthRoute exact path='/settings/logbook/overtime/:id' component={Overtime} />
        <AuthRoute exact path='/settings/activity-log/:id' component={ActivityLog} />
        <AuthRoute exact path='/settings/delete/:id' component={SettingDelete} />
        <AuthRoute exact path='/settings/events/:id' component={SettingEvents} />
        <AuthRoute exact path='/reports' component={Reports} />
      </Switch>
    </Router>
  </Suspense>
);

export default App;
