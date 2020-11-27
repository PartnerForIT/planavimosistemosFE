import React from 'react';
import DasboardMenu from './DashboardMenu';
import styles from './dasboard.module.scss';


export default function Dashboard({ children }) {
  return (
    <div className={styles.dashboard}>
      <DasboardMenu />
      <div className={styles.dashboardBody}>
        <div className={styles.dashboardScroll}>
          {children}
        </div>
      </div>
    </div>
  )
}