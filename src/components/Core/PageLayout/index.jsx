import React from 'react';
import styles from './pageLayout.module.scss';

export default function MainLayout({ children }) {
  return (
    <div className={styles.pageLayout}>
      {children}
    </div>
  );
}
