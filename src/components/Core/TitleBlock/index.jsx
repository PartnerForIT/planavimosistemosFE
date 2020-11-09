import React from 'react';
import styles from './Title.module.scss';

export default function TitleBlock({children, title, info, buttonNew, buttonImport}) {
  return(
    <div className={styles.titleBlock}>
      {children}
      <h4 className={styles.titleBlock__title}>{title}</h4>
      {
        info &&
        <div className={styles.infoBlock}>
          {Object.keys(info).map(infoId => (
            <span key={infoId} className={styles.infoBlock__inner}>
              {infoId} {info[infoId]} 
            </span>
          ))}
        </div>
      }

    </div>
  )
}