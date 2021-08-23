import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import Tooltip from 'react-tooltip';
import { useToggle } from 'react-use';

import Dropdown from '../Dropdown';
import ChangeWorkingTime from './ChangeWorkingTime';
import classes from './EventContent.module.scss';

export default ({
  title,
  timeText,
  photo,
  jobTypeName,
  employeeName,
  withMenu,
  employeeId,
  onChangeEmployee,
  onChangeWorkingTime,
  onDeleteTimeline,
}) => {
  const { t } = useTranslation();

  const [isChangeWorkingTime, toggleChangeWorkingTime] = useToggle(false);

  useEffect(() => {
    Tooltip.rebuild();
  });

  const handleChangeEmployee = () => {
    onChangeEmployee(employeeId);
  };
  const handleChangeWorkingTime = () => {
    onChangeWorkingTime(employeeId);
    toggleChangeWorkingTime();
  };
  const handleDeleteTimeline = () => {
    onDeleteTimeline(employeeId);
  };
  const handleCancel = () => {
    toggleChangeWorkingTime();
  };

  return (
    <>
      <div
        className={classes.eventContent}
        data-for='time'
        data-tip={title}
      >
        {
          photo && (
            <img
              alt='avatar'
              src={photo}
              className={classes.eventContent__avatar}
            />
          )
        }
        {
          withMenu && (
            <Dropdown
              light
              cancel={isChangeWorkingTime}
              onCancel={handleCancel}
            >
              {
                isChangeWorkingTime && (
                  <ChangeWorkingTime
                    photo={photo}
                    jobTypeName={jobTypeName}
                    employeeName={employeeName}
                  />
                )
              }
              {
                !isChangeWorkingTime && (
                  <>
                    <div className={classes.eventContent__userInfo}>
                      {
                        photo && (
                          <img
                            className={classes.eventContent__userInfo__avatar}
                            alt='avatar'
                            src={photo}
                          />
                        )
                      }
                      <div className={classes.eventContent__userInfo__right}>
                        <div className={classes.eventContent__userInfo__right__fullName}>
                          {employeeName}
                        </div>
                        <div className={classes.eventContent__userInfo__right__jobType}>
                          {jobTypeName}
                        </div>
                      </div>
                    </div>
                    <div className={classes.eventContent__label}>
                      {t('Working Time')}
                    </div>
                    <div className={classes.eventContent__value}>
                      {title}
                    </div>
                    <Dropdown.ItemMenu
                      title={t('Change Employee')}
                      onClick={handleChangeEmployee}
                    />
                    <Dropdown.ItemMenu
                      title={t('Change Working Time')}
                      onClick={handleChangeWorkingTime}
                    />
                    <Dropdown.ItemMenu
                      title={t('Delete Timeline')}
                      onClick={handleDeleteTimeline}
                      remove
                    />
                  </>
                )
              }
              <div className={classes.eventContent__space} />
            </Dropdown>
          )
        }
        {/*<b>{timeText}</b>*/}
        {/*<i>{title}</i>*/}
      </div>
    </>
  );
};
