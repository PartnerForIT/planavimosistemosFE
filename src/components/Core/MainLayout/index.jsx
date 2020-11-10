import React, {useEffect} from 'react';
import {authCheck} from '../../../store/auth/actions';
import { useDispatch } from 'react-redux';
import Header from '../Header'
import styles from './Layout.module.scss';

export default function MainLayout({children}) {
  // const dispatch = useDispatch();
  // useEffect(() => {
  //   dispatch(authCheck());
  // },[])

  return (
    <div className={styles.mainLayout}>
      <Header />
      <main className={styles.mainBody}>
        <div className={styles.mainBlock}>
          {children}
        </div>
        </main>
    </div>
  )
}