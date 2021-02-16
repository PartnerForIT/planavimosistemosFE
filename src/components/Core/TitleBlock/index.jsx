import React from 'react';
import Button from '../Button/Button';
import styles from './Title.module.scss';
import Tooltip from '../Tooltip';

export default function TitleBlock({
  children,
  title,
  info,
  infoReverse = false,
  TitleButtonNew,
  handleButtonNew = () => ({}),
  TitleButtonImport,
  handleButtonImport = () => ({}),
  tooltip,
}) {
  return (
    <div className={styles.titleBlock}>
      <div className={styles.leftBlock}>
        {children}
        <h4 className={styles.titleBlock__title}>{title}</h4>
        {
          info
          && (
            <div className={styles.infoBlock}>
              {Object.keys(info)
                .map((infoId) => (
                  <span key={infoId} className={styles.infoBlock__inner}>
                    {
                      infoReverse
                        ? (
                          <>
                            {infoId}
                            {' '}
                            {info[infoId]}
                          </>
                        )
                        : (
                          <>
                            {info[infoId]}
                            {' '}
                            {infoId}
                          </>
                        )
                    }
                  </span>
                ))}
            </div>
          )
        }
        {
          tooltip && <Tooltip title={tooltip} />
        }
      </div>
      <div className={styles.buttonBlock}>
        {
          TitleButtonNew
          && <Button inverse onClick={() => handleButtonNew()}>{TitleButtonNew}</Button>
        }
        {
          TitleButtonImport
          && <Button inverse onClick={() => handleButtonImport()}>{TitleButtonImport}</Button>
        }
      </div>
    </div>
  );
}
