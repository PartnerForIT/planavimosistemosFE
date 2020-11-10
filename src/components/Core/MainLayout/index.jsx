import React from 'react';
import Header from '../Header'
import styles from './Layout.module.scss';

export default function MainLayout({children}) {

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