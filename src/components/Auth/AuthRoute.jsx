import isEmpty from 'lodash/isEmpty';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';
import { authCheck } from '../../store/auth/actions';
import { userSelector } from '../../store/auth/selectors';
import Progress from '../Core/Progress';
import styles from './Login.module.scss';

const AuthRoute = ({ component: Component, ...rest }) => {
  const user = useSelector(userSelector);
  const dispatch = useDispatch();

  useEffect(() => {
    if (localStorage.getItem('token')) {
      // if (_.isEmpty(user)) {
      dispatch(authCheck());
      // }
    }
  }, [dispatch]);

  return (
    <Route
      {...rest}
      render={(routeProps) => {
        if (localStorage.getItem('token')) {
          if (isEmpty(user)) {
            return <div className={styles.porgressBlock}><Progress /></div>;
          }
          return <Component {...routeProps} />;
        }
        return <Redirect to='/' />;
      }}
    />
  );
};

export default AuthRoute;
