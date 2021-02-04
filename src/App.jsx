import React, { Suspense } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route, Redirect,
} from 'react-router-dom';
import Page404 from './components/404';
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
import Grouping from './components/Settings/Accounts/Grouping';
import Roles from './components/Settings/Accounts/Roles';

const App = () => (
  <Suspense fallback={<div>loading</div>}>
    <Router>
      <Switch>
        <Route exact path='/' component={Login} />
        <Route path='/404' component={Page404} />
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
        <AuthRoute exact path='/settings/accounts/grouping/:id' component={Grouping} />
        <AuthRoute exact path='/settings/accounts/roles/:id' component={Roles} />
        <AuthRoute exact path='/settings/categories/:id' component={SettingCategories} />
        <AuthRoute exact path='/settings/logbook/journal/:id' component={SettingJournal} />
        <AuthRoute exact path='/settings/logbook/overtime/:id' component={Overtime} />
        <AuthRoute exact path='/settings/activity-log/:id' component={ActivityLog} />
        <AuthRoute exact path='/settings/delete/:id' component={SettingDelete} />
        <AuthRoute exact path='/settings/events/:id' component={SettingEvents} />
        <AuthRoute exact path='/reports/:id' component={Reports} />
        <Redirect from='*' to='/404' />
      </Switch>
    </Router>
  </Suspense>
);

export default App;
