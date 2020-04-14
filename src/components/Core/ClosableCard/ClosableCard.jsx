import React from 'react';
import classNames from 'classnames';
import styles from './ClosableCard.module.scss';
import SuspendedIcon from '../../Icons/SuspendedIcon';

const ClosableCard = ({
  title, description, reportId, selected, onClick, onClose,
}) => {
  const cardClasses = classNames(
    styles.card,
    { [styles.cardSelected]: selected },
  );

  const closeButtonClasses = classNames(
    styles.closeButton,
    { [styles.closeButtonSelected]: selected },
  );

  const headerRowClasses = classNames(
    styles.headerRow,
    { [styles.headerRowSelected]: selected },
  );

  const timeBlockClasses = classNames(
    styles.timeBlock,
    { [styles.timeBlockSelected]: selected },
  );

  return (
    <div // eslint-disable-line jsx-a11y/no-static-element-interactions
      className={cardClasses}
      onClick={() => onClick(reportId)}
    >
      <div className={styles.leftSide}>
        <div className={headerRowClasses}>
          {title}
        </div>
        <div className={timeBlockClasses}>
          {description}
        </div>
      </div>
      <div className={styles.rightSide}>
        {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
        <div className={styles.closeButtonWrapper} onClick={(e) => onClose(e, reportId)}>
          <SuspendedIcon className={closeButtonClasses} />
        </div>
      </div>
    </div>
  );
};
export default ClosableCard;
