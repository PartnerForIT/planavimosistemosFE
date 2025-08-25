import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Redirect } from 'react-router-dom';
import cn from 'classnames'
import Header from '../Header';
import styles from './Layout.module.scss';
import { logout, refreshToken } from '../../../store/auth/actions';

export default function MainLayout({ children, layoutClassName, screenClassName }) {
  const dispatch = useDispatch();

  useEffect(() => {
    const expires = localStorage.getItem('expires_in');
    if (expires*1 > 0 && new Date(parseInt(expires, 10)) < new Date(new Date().getTime() + 5 * 150 * 1000)) {
      dispatch(refreshToken());
    }
  });

  const [redirect, setRedirect] = useState(false);
  const logOut = () => {
    dispatch(logout());
    localStorage.clear();
    setRedirect(true);
  };

  useEffect(() => () => setRedirect(false), []);

  if (redirect) {
    return <Redirect to='/' />;
  }

  return (
    <div className={styles.mainLayout}>
      <Header logOut={logOut} />
      <main className={cn(styles.mainBody, layoutClassName)}>
        <div className={cn(styles.mainBlock, screenClassName)}>
          {children}
        </div>
      </main>
    </div>
  );
}
