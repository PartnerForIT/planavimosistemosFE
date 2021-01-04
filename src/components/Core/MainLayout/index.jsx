import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Redirect } from 'react-router-dom';
import Header from '../Header';
import styles from './Layout.module.scss';
import { logout, refreshToken } from '../../../store/auth/actions';

export default function MainLayout({ children }) {
  const dispatch = useDispatch();

  useEffect(() => {
    const expires = localStorage.getItem('expires_in');
    if (new Date(parseInt(expires, 10)) < new Date(new Date().getTime() + 5 * 60 * 1000)) {
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

  return (

    redirect
      ? <Redirect to='/' />
      : (
        <div className={styles.mainLayout}>
          <Header logOut={logOut} />
          <main className={styles.mainBody}>
            <div className={styles.mainBlock}>
              {children}
            </div>
          </main>
        </div>
      )
  );
}
