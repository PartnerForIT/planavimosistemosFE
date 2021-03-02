import React, { useEffect, useLayoutEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect, useParams } from 'react-router-dom';
import _ from 'lodash';
import { userSelector } from '../../../store/auth/selectors';
import Header from '../Header';
import styles from './Layout.module.scss';
import { logout, refreshToken } from '../../../store/auth/actions';
import getOrganisationModules from '../../../store/company/actions';

export const AdminContext = React.createContext(false);

export default function MainLayout({ children }) {
  const dispatch = useDispatch();
  const { id: companyId } = useParams();

  const user = useSelector(userSelector);
  const [admin, setAdmin] = useState(false);

  useEffect(() => {
    const expires = localStorage.getItem('expires_in');
    if (new Date(parseInt(expires, 10)) < new Date(new Date().getTime() + 5 * 150 * 1000)) {
      dispatch(refreshToken());
    }
  });

  useLayoutEffect(() => {
    if (companyId) dispatch(getOrganisationModules(companyId));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [redirect, setRedirect] = useState(false);
  const logOut = () => {
    dispatch(logout());
    localStorage.clear();
    setRedirect(true);
  };

  useEffect(() => {
    if (!_.isEmpty(user)) {
      setAdmin(user.role_id === 1);
    }
  }, [user]);

  useEffect(() => () => setRedirect(false), []);

  return (

    redirect
      ? <Redirect to='/' />
      : (
        <AdminContext.Provider value={admin}>
          <div className={styles.mainLayout}>
            <Header logOut={logOut} isSuperAdmin={admin} />
            <main className={styles.mainBody}>
              <div className={styles.mainBlock}>
                {children}
              </div>
            </main>
          </div>
        </AdminContext.Provider>
      )
  );
}
