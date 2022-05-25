import React, { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import Tooltip from 'react-tooltip';
import moment from 'moment';
import { compareAsc, format } from 'date-fns'
import { useSelector } from 'react-redux';

import Dropdown from '../Dropdown';
import { TIMELINE } from '../../../const';
import ReplacedEmployee from './ReplacedEmployee';
import ChangeWorkingTime from './ChangeWorkingTime';
import AddWorkingTime from './AddWorkingTime';
import ChangeEmployee from './ChangeEmployee';
import classes from './EventContent.module.scss';
import PlaceholderAvatarIcon from "../../../components/Icons/PlaceholderAvatar";
import classNames from 'classnames';
import { padStart } from '@fullcalendar/react';
import { companyModules } from '../../../store/company/selectors';

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
  onEmptyTimeline,
  newEmployee,
  oldEmployee,
  start,
  end,
  viewType,
  empty,
  empty_manual,
                  addEmployee,
                  addTimeline,
                  dayNumber,
                  isCompleted,
                  activeDrag,
                  unavailableEmployees
}) => {
  const { t } = useTranslation();

  const [content, setContent] = useState('menu');
  const modalRef = useRef(null);
  const modules = useSelector(companyModules);

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
  const openAddWorkingTime = () => {
    setContent('addWorkingTime');
  };
  const handleCancel = () => {
    setContent('menu');
  };
  const handleDeleteTimeline = () => {
    onDeleteTimeline({ id, shiftId });
  };
  const handleEmptyTimeline = () => {
    onEmptyTimeline({ id, shiftId });
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
  const handleAddWorkingTime = (value) => {
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

    addTimeline({ id, shiftId, time });
  };
  const handleChangeEmployee = (nextEmployeeId) => {
    onChangeEmployee({
      shiftId,
      employeeId: nextEmployeeId,
      id,
    });
  };
  const tooltipType = () => {
    let type = 'time';

    if (start && end && moment().isBetween(start, end)) {
      type += '_active';
    } else if (isCompleted) {
      type += '_past';
    } else if (!newEmployee?.name && (employeeName == 'Empty' || empty)) {
      type += '_empty';
    }
      
    return type;
  }
 const today = format(new Date(), 'dd')

  const dayEndCheck = () => {
      if (isCompleted) {
        return `${classes.eventContent} ${classes.dayEnd} ${(content == 'addWorkingTime' ? classes.eventContent__time : '')}`
      } else return `${classes.eventContent} ${(content == 'addWorkingTime' ? classes.eventContent__time : '')}`
    }
  const [isShown, setIsShown] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div
      className={classNames(dayEndCheck(), activeDrag ? 'active-drag' : '')}
      data-for={tooltipType()}
      data-tip={activeDrag || empty_manual ? null : title}
      id='dropdownButton'
      onMouseEnter={() => setIsShown(true)}
      onMouseLeave={() => setIsShown(false)}
    >
      {
        !empty_manual && (
        (!!newEmployee?.name || empty)
          ? (newEmployee?.photo === null || empty)
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
        )
      }
      {
        
          (viewType === TIMELINE.DAY || viewType === TIMELINE.WEEK) && employeeName && (

            (empty_manual)
            ? <span onClick={openAddWorkingTime} className={'empty-add'}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
            : <span className={classes.eventContent__title} >
              {
                (!!newEmployee?.name)

                  ?`${newEmployee?.name} · ${moment(start).format('HH:mm')} – ${moment(end).format('HH:mm')}`
                    :(employeeName === 'Empty' || empty)
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
        content === 'addWorkingTime' && (
          <AddWorkingTime
            onClose={() => setContent('menu')}
            photo={photo}
            jobTypeName={jobTypeName}
            employeeName={newEmployee?.name ? newEmployee?.name : employeeName}
            start={start}
            end={end}
            onChangeTime={handleAddWorkingTime}
          />
        )
      }
      {
        withMenu && !empty && !empty_manual && (employeeName !== 'Empty' || newEmployee?.name) ? (
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
                  employeeName={newEmployee?.name ? newEmployee?.name : employeeName}
                  onChangeEmployee={handleChangeEmployee}
                  unavailableEmployees={unavailableEmployees}
                />
              )
            }
            {
              content === 'changeWorkingTime' && (
                <ChangeWorkingTime
                  photo={photo}
                  jobTypeName={jobTypeName}
                  employeeName={newEmployee?.name ? newEmployee?.name : employeeName}
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
                      (!!newEmployee?.name || empty)
                        ? (newEmployee?.photo === null || empty)
                          ? ''
                          :<img
                                  alt='avatar'
                                  src={newEmployee?.photo}
                                  className={classes.eventContent__userInfo__avatar}
                              />
                          :photo && (
                          <img
                              alt='avatar'
                              src={photo}
                              className={classes.eventContent__userInfo__avatar}
                          />
                      )
                    }
                    <div className={classes.eventContent__userInfo__right}>
                      <div className={classes.eventContent__userInfo__right__fullName}>
                        {newEmployee?.name ? newEmployee?.name : employeeName}
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
                  {/* Edgaras suggestion 2022-05-25 */}
                  { !modules.manual_mode && (
                      <Dropdown.ItemMenu
                        title={t('Change Employee')}
                        onClick={openChangeEmployee}
                      />
                    )
                  } 
                  <Dropdown.ItemMenu
                    title={t('Change Working Time')}
                    onClick={openChangeWorkingTime}
                  />
                  { !modules.manual_mode ? (
                      <Dropdown.ItemMenu
                        title={t('Empty Timeline')}
                        onClick={handleEmptyTimeline}
                        remove
                      />
                    ) : (
                      <Dropdown.ItemMenu
                        title={t('Delete Timeline')}
                        onClick={handleDeleteTimeline}
                        remove
                      />
                    )
                  }
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

