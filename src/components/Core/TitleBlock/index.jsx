import React from 'react';
import Button from '../Button/Button';
import styles from './Title.module.scss';

export default function TitleBlock({
  children, 
  title, 
  info, 
  TitleButtonNew, 
  handleButtonNew, 
  TitlebuttonImport, 
  handleButtonImport }) {
  return(
    <div className={styles.titleBlock}>
      <div className={styles.leftBlock}>
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
      {
        TitleButtonNew &&
        <Button inverse onClick={()=> handleButtonNew()}>{TitleButtonNew}</Button>
      }
    </div>
  )
}