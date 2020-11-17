import React, { Suspense } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';
import Logbook from './components/Logbook/Logbook';
import Reports from './components/Reports/Reports';
import Company from './components/Company';
import OrganizationList from './components/OrganizationList';
import Overview from './components/Overview';
import Login from './components/Auth/Login';
import Logout from './components/Auth/Logout';
import AuthRoute from './components/Auth/AuthRoute';
import SettingCompany from './components/Settings/General/Company'

const App = () => (
  <Suspense fallback={<div>loading</div>}>
    <Router>
      <Switch>
        <Route exact path='/' component={Login} />
        <Route exact path='/logout' component={Logout} />
        <AuthRoute exact path='/logbook/:id' component={Logbook} />
        <AuthRoute exact path='/reports' component={Reports} />
        <AuthRoute exact path='/company' component={Company} />
        <AuthRoute exact path='/organization-list' component={OrganizationList} />
        <AuthRoute exact path='/overview' component={Overview} />
        <AuthRoute exact path='/overview/:id' component={Overview} />
        <AuthRoute exact path='/settings/general/company/:id' component={SettingCompany} />
      </Switch>
    </Router>
  </Suspense>
);

export default App;
