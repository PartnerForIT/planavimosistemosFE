import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';

import DayTotalModal from './DayTotalModal';
import classes from './DayTotal.module.scss';
import CurrencySign from "../../../components/shared/CurrencySign";

export default ({
  employeesCount,
  hours,
  night_time,
  money,
  photos,
  nested,
  title,
  empty,
  withCost,
}) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const dayTotalClasses = classNames(classes.dayTotal, {
    [classes.dayTotal_empty]: empty,
    'dayTotalItem': true
  });

  const buttonRef = useRef(null);

  const handleClickOpenModal = () => {
    setIsOpen((prevState) => !prevState);
  };
  const handleCloseModal = () => {
    setIsOpen(false);
  };

  const parsablePhotos = () => {
    if (typeof photos === 'object') {
      let result = [];
      for (let i in photos) {
        if (typeof photos[i] === 'object') {

        } else {
          result.push(photos[i]);
        }
      }

      return result;
    }

    return photos;
  };

  // if (empty) {
  //   return (
  //     <div className={classes.dayTotal}>
  //       <div className={classes.dayTotal__content}>
  //         <div className={classes.dayTotal__content__emptyIcon} />
  //         <div className={classes.dayTotal__content__noWorkers}>
  //           {t('No workers this day')}
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }
  
  return (
    <div className={dayTotalClasses}>
      {
        employeesCount > 0
        ? (
          <button
            className={classes.dayTotal__content}
            onClick={handleClickOpenModal}
            ref={buttonRef}
          >
            <div className={classes.dayTotal__content__users}>
              {
                parsablePhotos().map((photo) => photo && (
                  <img
                    key={photo}
                    alt='avatar'
                    className={classes.dayTotal__content__users__avatar}
                    src={photo}
                  />
                ))
              }
              <div className={classes.dayTotal__content__users__count}>
                {employeesCount}
              </div>
            </div>
            <div className={classes.dayTotal__content__statistic}>
              <div className={classes.dayTotal__content__statistic__hours}>
                {`${hours} ${t('hours')}`}
                { (night_time && night_time != 0) ? (
                  <span className={classes.dayTotal_night}>
                  {night_time} {t('hours')}
                  </span>
                ) : ''
              }
              </div>
              {
                withCost && (
                  <div className={classes.dayTotal__content__statistic__money}>
                    {`${money}`}<CurrencySign/>
                  </div>
                )
              }
            </div>
          </button>
        ) : (
          <div className={classes.dayTotal__empty}>
            <span className={classes.dayTotal__empty__circle}></span>{t('No workers this day')}
          </div>
        )
      }
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
    </div>
  );
};
