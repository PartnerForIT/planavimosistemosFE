import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Header from '../Header';
import styles from './Layout.module.scss';
import { refreshToken } from '../../../store/auth/actions';

export default function MainLayout({ children }) {
  const dispatch = useDispatch();

  useEffect(() => {
    const expires = localStorage.getItem('expires_in');
    if (new Date(parseInt(expires, 10)) < new Date(new Date().getTime() + 5 * 1000)) {
      dispatch(refreshToken());
    }
  });
  return (
    <div className={styles.mainLayout}>
      <Header />
      <main className={styles.mainBody}>
        <div className={styles.mainBlock}>
          {children}
        </div>
      </main>
    </div>
  );
}
