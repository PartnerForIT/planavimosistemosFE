import React from 'react';
import { Redirect, Route } from 'react-router-dom';

const AuthRoute = ({ ...props }) => {
  const isAuthorized = localStorage.getItem('user');
  if (isAuthorized && isAuthorized.length) return <Route {...props} />;
  return <Redirect to='/' />;
};

export default AuthRoute;
