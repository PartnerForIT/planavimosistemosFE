import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Tooltip from 'react-tooltip';
import moment from 'moment';

import Dropdown from '../Dropdown';
import ChangeWorkingTime from './ChangeWorkingTime';
import ChangeEmployee from './ChangeEmployee';
import classes from './EventContent.module.scss';

export default ({
  id,
  shiftId,
  title,
  photo,
  jobTypeName,
  employeeName,
  withMenu,
  employeeId,
  onChangeEmployee,
  onChangeWorkingTime,
  onDeleteTimeline,
  start,
  end,
}) => {
  const { t } = useTranslation();

  const [content, setContent] = useState('menu');

  useEffect(() => {
    Tooltip.rebuild();
  });

  const openChangeEmployee = () => {
    setContent('changeEmployee');
  };
  const openChangeWorkingTime = () => {
    setContent('changeWorkingTime');
  };
  const handleCancel = () => {
    setContent('menu');
  };
  const handleDeleteTimeline = () => {
    onDeleteTimeline({ id, shiftId });
  };
  const handleChangeWorkingTime = (value) => {
    const timeStart = value.start.split(':');
    const timeEnd = value.end.split(':');
    let time;
    if ((timeStart[0] * 60 + +timeStart[1]) > (timeEnd[0] * 60 + +timeEnd[1])) {
      // night time
      time = {
        start: moment(start).set({ h: timeStart[0], m: timeStart[1] }),
        end: moment(end).set({ h: timeEnd[0], m: timeEnd[1] }),
      };
    } else {
      time = {
        start: moment(start).set({ h: timeStart[0], m: timeStart[1] }),
        end: moment(start).set({ h: timeEnd[0], m: timeEnd[1] }),
      };
    }

    onChangeWorkingTime({ id, shiftId, time });
  };
  const handleChangeEmployee = () => {
    onChangeEmployee({ shiftId, employeeId, id });
  };

  return (
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
            cancel={content !== 'menu'}
            onCancel={handleCancel}
          >
            {
              content === 'changeEmployee' && (
                <ChangeEmployee
                  photo={photo}
                  jobTypeName={jobTypeName}
                  employeeName={employeeName}
                  onChangeEmployee={handleChangeEmployee}
                />
              )
            }
            {
              content === 'changeWorkingTime' && (
                <ChangeWorkingTime
                  photo={photo}
                  jobTypeName={jobTypeName}
                  employeeName={employeeName}
                  start={start}
                  end={end}
                  onChangeTime={handleChangeWorkingTime}
                />
              )
            }
            {
              content === 'menu' && (
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
                    onClick={openChangeEmployee}
                  />
                  <Dropdown.ItemMenu
                    title={t('Change Working Time')}
                    onClick={openChangeWorkingTime}
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
    </div>
  );
};
