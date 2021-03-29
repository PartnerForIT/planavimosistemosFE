import React from 'react';
import DasboardMenu from './DashboardMenu';
import styles from './dasboard.module.scss';

export default function Dashboard({ children, withoutScroll }) {
  return (
    <div className={styles.dashboard}>
      <DasboardMenu />
      <div className={`${styles.dashboardBody} ${withoutScroll ? styles.dashboardBody_withoutScroll : ''}`}>
        {children}
      </div>
    </div>
  );
}
