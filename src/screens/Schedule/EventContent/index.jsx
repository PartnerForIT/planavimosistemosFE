import React, { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import Tooltip from 'react-tooltip';
import moment from 'moment';
import { compareAsc, format } from 'date-fns'

import Dropdown from '../Dropdown';
import { TIMELINE } from '../../../const';
import ReplacedEmployee from './ReplacedEmployee';
import ChangeWorkingTime from './ChangeWorkingTime';
import ChangeEmployee from './ChangeEmployee';
import classes from './EventContent.module.scss';
import PlaceholderAvatarIcon from "../../../components/Icons/PlaceholderAvatar";
import classNames from 'classnames';

export default ({
  id,
  shiftId,
  title,
  photo,
  jobTypeName,
  employeeName,
  withMenu,
  onChangeEmployee,
  onChangeWorkingTime,
  onDeleteTimeline,
  newEmployee,
  oldEmployee,
  start,
  end,
  viewType,
                  addEmployee,
                  dayNumber,
                  isCompleted,
                  activeDrag
}) => {
  const { t } = useTranslation();

  const [content, setContent] = useState('menu');
  const modalRef = useRef(null);

  useEffect(() => {
    Tooltip.rebuild();
  });

  const openChangeEmployee = () => {
    modalRef.current.open();
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
  const handleChangeEmployee = (nextEmployeeId) => {
    onChangeEmployee({
      shiftId,
      employeeId: nextEmployeeId,
      id,
    });
  };
 const today = format(new Date(), 'dd')

  const dayEndCheck = () => {
      if (isCompleted) {
        return `${classes.eventContent} ${classes.dayEnd}`
      } else return classes.eventContent
    }
  const [isShown, setIsShown] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className={classNames(dayEndCheck(), activeDrag ? 'active-drag' : '')}
      data-for='time'
      data-tip={activeDrag ? null : title}
      id='dropdownButton'
      onMouseEnter={() => setIsShown(true)}
      onMouseLeave={() => setIsShown(false)}
    >
      {
        (!!newEmployee?.photo)
          ? (newEmployee?.photo === null)
            ? ''
            :<img
                    alt='avatar'
                    src={newEmployee?.photo}
                    className={classes.eventContent__avatar}
                />
            :photo && (
            <img
                alt='avatar'
                src={photo}
                className={classes.eventContent__avatar}
            />
        )
      }
      {
        
          (viewType === TIMELINE.DAY || viewType === TIMELINE.WEEK) && employeeName && (
              <span className={classes.eventContent__title} >
                {
                  (!!newEmployee?.name)

                    ?`${newEmployee?.name} · ${moment(start).format('HH:mm')} – ${moment(end).format('HH:mm')}`
                      :(employeeName === 'Empty')
                      ?<span onClick={addEmployee} className={'empty-add'}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                      :`${employeeName} · ${moment(start).format('HH:mm')} – ${moment(end).format('HH:mm')}`
                }
              </span>
        )
      }

      <div className={classes.eventContent__leftSpace} />
      {
        newEmployee?.name !== oldEmployee?.name && (
          <ReplacedEmployee
            newEmployee={newEmployee}
            oldEmployee={oldEmployee}
            onDelete={handleDeleteTimeline}
            onChangeEmployee={openChangeEmployee}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            isShown={isCompleted ? isShown : isOpen}
            isToday={isCompleted}
          />
        )
      }
      {
        withMenu && employeeName !== 'Empty' ? (
          <Dropdown
            light
            cancel={content !== 'menu'}
            onCancel={handleCancel}
            ref={modalRef}
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
                    {`${moment(start).format('HH:mm')} – ${moment(end).format('HH:mm')}`}
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
        ) : (
          <div className={classes.eventContent__rightSpace} />
        )
      }
    </div>
  );

};

