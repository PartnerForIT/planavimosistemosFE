import React, { useEffect, useLayoutEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Redirect, useParams } from 'react-router-dom';
import Header from '../Header';
import styles from './Layout.module.scss';
import { logout, refreshToken } from '../../../store/auth/actions';
import getOrganisationModules from '../../../store/company/actions';

export default function MainLayout({ children }) {
  const dispatch = useDispatch();
  const { id: companyId } = useParams();
  useEffect(() => {
    const expires = localStorage.getItem('expires_in');
    if (new Date(parseInt(expires, 10)) < new Date(new Date().getTime() + 5 * 60 * 1000)) {
      dispatch(refreshToken());
    }
  });

  useLayoutEffect(() => {
    dispatch(getOrganisationModules(companyId));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
