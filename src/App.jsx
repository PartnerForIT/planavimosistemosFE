import React, { Suspense } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';
import Test from './components/Test/Test';
import Logbook from './components/Logbook/Logbook';
import Reports from './components/Reports/Reports';

const App = () => (
  <Suspense fallback={<div>loading</div>}>
    <Router>
      <Switch>
        <Route exact path='/' component={Test} />
        <Route exact path='/logbook' component={Logbook} />
        <Route exact path='/reports' component={Reports} />
      </Switch>
    </Router>
  </Suspense>
);

export default App;
