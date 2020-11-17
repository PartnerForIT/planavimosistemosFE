import * as _ from "lodash";
import React, { useEffect } from "react";
import {authCheck} from '../../store/auth/actions';
import {userSelector} from '../../store/auth/selectors'
import { useDispatch,useSelector } from 'react-redux';
import { Route, Redirect } from "react-router-dom";
import Progress from '../Core/Progress';
import styles from './Login.module.scss';

const AuthRoute = ({ component: Component, ...rest }) => {

  const user = useSelector(userSelector);
  const dispatch = useDispatch();

  useEffect(() => {
    if (localStorage.getItem("token")) {
      if (_.isEmpty(user)) {
         dispatch(authCheck());
      }
    }
  }, []);

  return (
    <Route
      {...rest}
      render={(routeProps) => {
        if (localStorage.getItem("token")) {
          if (_.isEmpty(user)) {
            return <div className={styles.porgressBlock}><Progress /></div>;
          } else {
            return <Component {...routeProps} />;
          }
        } else {
          return <Redirect to={"/"} />;
        }
      }}
    />
  );
};

export default AuthRoute;