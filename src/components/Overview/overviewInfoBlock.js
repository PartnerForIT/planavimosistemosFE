import React from 'react';
import styles from './Overview.module.scss';

export default function InfoBlock({ text, number }) {
  return (
    <div className={styles.overviewBlock}>
      <div className={styles.overviewHead}>
        {text}
      </div>
      <div className={styles.overviewText}>
        {number}
      </div>
    </div>
  );
}
