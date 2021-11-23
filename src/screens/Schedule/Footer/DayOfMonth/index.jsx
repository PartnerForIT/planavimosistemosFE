import React, { useState } from 'react';
import classNames from 'classnames';

import classes from './DayOfMonth.module.scss';
import DayTotalModal from '../../DayTotal/DayTotalModal';

export default ({
  statistic,
  withCost,
  title,
  text,
  nested,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const dayOfMonthClasses = classNames(classes.dayOfMonth, {
    [classes.dayOfMonth_statistic]: statistic,
  });

  const handleClickOpenModal = () => {
    if (nested) {
      setIsOpen((prevState) => !prevState);
    }
  };
  const handleCloseModal = () => {
    setIsOpen(false);
  };

  return (
    <div className={dayOfMonthClasses}>
      {
        statistic ? (
          text
        ) : (
          <>
            <button
              onClick={handleClickOpenModal}
              className={classes.dayOfMonth__circle}
            >
              i
            </button>
            {
              isOpen && (
                <DayTotalModal
                  title={title}
                  onClose={handleCloseModal}
                  withCost={withCost}
                  nested={nested}
                />
              )
            }
          </>
        )
      }
    </div>
  );
};
