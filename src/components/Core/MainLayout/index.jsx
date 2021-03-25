import React, { useEffect, useLayoutEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect, useParams } from 'react-router-dom';
import { companyModulesLoading, companyModulesRequestWasSent } from '../../../store/company/selectors';
import Header from '../Header';
import styles from './Layout.module.scss';
import { logout, refreshToken } from '../../../store/auth/actions';
import getOrganisationModules from '../../../store/company/actions';
import Progress from '../Progress';

export default function MainLayout({ children }) {
  const dispatch = useDispatch();
  const { id: companyId } = useParams();

  const isLoading = useSelector(companyModulesLoading);
  const requestWasSent = useSelector(companyModulesRequestWasSent);

  useEffect(() => {
    const expires = localStorage.getItem('expires_in');
    if (new Date(parseInt(expires, 10)) < new Date(new Date().getTime() + 5 * 150 * 1000)) {
      dispatch(refreshToken());
    }
  });

  useLayoutEffect(() => {
    if (!requestWasSent) {
      dispatch(getOrganisationModules(companyId));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
  if (isLoading) {
    return (
      <div className={styles.progressBlock}>
        <Progress />
      </div>
    );
  }

  return (
    <div className={styles.mainLayout}>
      <Header logOut={logOut} />
      <main className={styles.mainBody}>
        <div className={styles.mainBlock}>
          {children}
        </div>
      </main>
    </div>
  );
}
