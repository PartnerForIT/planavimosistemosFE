import React, { Suspense } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import { StylesProvider, createGenerateClassName } from '@material-ui/core/styles';
import Page404 from './components/404';
import ForgotPassword from './components/Auth/ForgotPassword';
import ResetPassword from './components/Auth/ResetPassword';
import InvitePage from './components/Auth/InvitePage';
import LockedAccount from './components/Auth/LockedAccount';
import OrganizationList from './components/OrganizationList';
import Login from './components/Auth/Login';
import AuthRoute from './components/Auth/AuthRoute';
import SnackbarBlock from './components/Core/SnackbarBlock';
import Company from './screens/Company';
import Overview from './components/Overview';

const generateClassName = createGenerateClassName({
  productionPrefix: 'grouwn',
});

const App = () => (
  <StylesProvider generateClassName={generateClassName}>
    <Suspense fallback={<div>loading</div>}>
      <Router>
        <Switch>
          <Route exact path='/' component={Login} />
          <Route path='/404' component={Page404} />
          <Route exact path='/forgot-password' component={ForgotPassword} />
          <Route exact path='/invite/:token' component={InvitePage} />
          <Route exact path='/reset/:token' component={ResetPassword} />
          <Route exact path='/locked' component={LockedAccount} />
          <AuthRoute exact path='/overview' component={Overview} />
          <AuthRoute exact path='/organization-list' component={OrganizationList} />
          <AuthRoute path='/:id' component={Company} />
          <Redirect from='*' to='/404' />
        </Switch>
      </Router>
    </Suspense>
    <SnackbarBlock />
    <div id='portal' />
  </StylesProvider>
);

export default App;
