import React, { useState, useMemo } from 'react';
import classNames from 'classnames';

import ChevronIcon from '../../../../../components/Icons/Chevron';
import classes from './ModalItem.module.scss';
import CurrencySign from "../../../../../components/shared/CurrencySign";

const ModalItem = ({
  title,
  subTitle,
  cost,
  time,
  night_duration,
  nested,
  avatar,
  main,
  childLevel = 0,
  withCost = false,
}) => {
  const [isExtended, setIsExtended] = useState(true);
  const dots = useMemo(() => new Array(childLevel - (childLevel > 0 ? 1 : 0))
    .fill()
    .map((_, index) => index),
  [childLevel]);

  const modalItemClasses = classNames(classes.modalItem, {
    [classes.modalItem_main]: main,
    [classes.modalItem_extended]: isExtended,
  });

  const handleClick = () => {
    if (nested) {
      setIsExtended((prevState) => !prevState);
    }
  };
  
  return (
    <>
      <div
        role='presentation'
        className={modalItemClasses}
        onClick={handleClick}
      >
        {
          dots.map((dot) => (
            <div
              key={dot}
              className={classes.modalItem__dot}
            />
          ))
        }
        <div className={classes.modalItem__content}>
          <div className={classes.modalItem__content__row}>
            <div className={classes.modalItem__content__row__first}>
              {title}
            </div>
            {
              withCost && (
                <div className={classes.modalItem__content__row__first}>
                  {`${cost}`} <CurrencySign/>
                </div>
              )
            }
          </div>
          <div className={classes.modalItem__content__row}>
            <div className={classes.modalItem__content__row__second}>
              {subTitle}
            </div>
            <div className={classes.modalItem__content__row__second}>
              {`${time} hours`}
              { night_duration && night_duration != '0' ? (
                  <span className={classes.modalItem__content__night}>
                    {`${night_duration} hours`}
                  </span>
                ) : ''
              }
            </div>
          </div>
        </div>
        <div className={classes.modalItem__right}>
          {
            nested && (
              <ChevronIcon
                className={classes.modalItem__right__chevron}
              />
            )
          }
          {
            !nested && (
              avatar ? (
                <img
                  className={classes.modalItem__right__avatar}
                  src={avatar}
                  alt='avatar'
                />
              ) : (
                <div className={classes.modalItem__right__emptyAvatar} />
              )
            )
          }
        </div>
      </div>
      {
        isExtended && nested && nested.map((item, index) => {
            return (<ModalItem
              key={index}
              title={item.name}
              subTitle={item.job_type_name || `${item.employeesCount} employee`}
              cost={item.cost}
              time={item.time}
              night_duration={item.night_duration}
              nested={item.children}
              avatar={item.avatar}
              childLevel={childLevel + 1}
              withCost={withCost}
            
            />
          );
        })
      }
    </>
  );
};

export default ModalItem;
