import React, { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import { useSelector } from 'react-redux';

import Dropdown from '../../Dropdown';
import ReplacedEmployee from './ReplacedEmployee';
import ChangeWorkingTime from './ChangeWorkingTime';
import AddWorkingTime from './AddWorkingTime';
import ChangeEmployee from './ChangeEmployee';
import styles from './CellOptions.module.scss';
import classNames from 'classnames';
import { companyModules } from '../../../../store/company/selectors';

export default ({
  id,
  shiftId,
  employeeId,
  resourceId,
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
  copy_event,
  empty,
  empty_manual,
  editPermissions,
  addEmployee,
  addTimeline,
  isCompleted,
  unavailableEmployees,
  markers,
  handleCopyTool,
  copyTool,
  handleAddHistory,
  currentDay,
  currentMonth,
}) => {

  const { t } = useTranslation();

  const [content, setContent] = useState('menu');
  const modalRef = useRef(null);
  const modalAddRef = useRef(null);
  const modules = useSelector(companyModules);

  const classes = classNames(
    styles.cellOptions,
    {
      [styles.dayEnd]: isCompleted,
      [styles.cellOptions__withoutMenu]: !(!copy_event && withMenu && !empty && !empty_manual && (employeeName !== 'Empty' || newEmployee?.name)),
      [styles.cellOptions__time]: content === 'addWorkingTime',
    },
  );

  useEffect(() => {
    if (content === 'addWorkingTime') {
      if (modalAddRef.current) {
        modalAddRef.current.open();
      }
    } else {
      if (modalAddRef.current) {
        modalAddRef.current.close();
      }
    }
  }, [content]);

  const openChangeEmployee = () => {
    modalRef.current.open();
    setContent('changeEmployee');
  };
  const openChangeWorkingTime = () => {
    setContent('changeWorkingTime');
  };
  const openCopyMode = () => {
    if (modalAddRef.current) {
      modalAddRef.current.close();
    }
    modalRef.current.close();
    setContent('menu');
    setTimeout(() => {
      handleCopyTool({start, end});
    }, 0)
  };
  const openAddWorkingTime = () => {
    setContent('addWorkingTime');
  };
  const copyEvent = () => {
    let start_day = moment(start).format('YYYY-MM-DD');
    if (!start) {
      start_day = moment(currentMonth).date(currentDay).format('YYYY-MM-DD');
    }
    handleAddHistory({resourceId: resourceId, day: currentDay, start: start_day, end: start_day, copy_event: true});
  };
  const handleCancel = () => {
    if (modalAddRef.current) {
      modalAddRef.current.close();
    }
    setContent('menu');
  };
  const handleDeleteTimeline = () => {
    onDeleteTimeline({ id, shiftId });
    modalRef.current.close();
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
    modalRef.current.close();
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
    setContent('menu');
  };
  const handleChangeEmployee = (nextEmployeeId) => {
    onChangeEmployee({
      shiftId,
      employeeId: nextEmployeeId,
      id,
    });
    modalRef.current.close();
  };

  const [isShown, setIsShown] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const markerComment = () => {
    const current = markers ? markers.find(e => moment(e.date).isSame(moment(start), 'day') && e.employee_id === employeeId && e.user_request) : false;
    return current ? current.comment : false;
  }
  
  return (
    <div
      className={classes}
      id='dropdownButton'
      onMouseEnter={() => setIsShown(true)}
      onMouseLeave={() => setIsShown(false)}
    >
      {
          employeeName && (
            (empty_manual)
            ? (copyTool)
              ? <span onClick={copyEvent} className={classNames('copy-add', styles.copyAdd)}>{t('Paste the Time')}</span>
              : (editPermissions && (<span data-for={markerComment() ? 'user_marker' : ''}  data-tip={markerComment() ? markerComment() : ''} onClick={openAddWorkingTime} className={classNames('empty-add', styles.emptyAdd)}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>))
            : <span className={styles.cellOptions__title} >
                {
                  copyTool && <span onClick={copyEvent} className={classNames('copy-add event', styles.copyAdd, styles.event)}>{t('Paste the Time')}</span>
                }
                {
                  (!!newEmployee?.name)
                    ? null
                    : (employeeName === 'Empty' || empty)
                      ? <span data-for={markerComment() ? 'user_marker' : ''}  data-tip={markerComment() ? markerComment() : ''} onClick={addEmployee} className={classNames('empty-add', styles.emptyAdd)}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                      : null
                }
              </span>
        )
      }
      {
        !copy_event && newEmployee?.name !== oldEmployee?.name && (
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
          <Dropdown
            cancel={content !== 'menu'}
            onCancel={() => setContent('menu')}
            ref={modalAddRef}
            buttonClass={styles.cellOptions__invisible}
          >
            <AddWorkingTime
              onClose={() => setContent('menu')}
              photo={photo}
              jobTypeName={jobTypeName}
              employeeName={newEmployee?.name ? newEmployee?.name : employeeName}
              start={start}
              end={end}
              onChangeTime={handleAddWorkingTime}
            />
          </Dropdown>
        )
      }
      {
        !isCompleted && !copy_event && withMenu && !empty && !empty_manual && (employeeName !== 'Empty' || newEmployee?.name) ? (
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
                  <div className={styles.cellOptions__userInfo}>
                    {
                      (!!newEmployee?.name || empty)
                        ? (newEmployee?.photo === null || empty)
                          ? ''
                          :<img
                                  alt='avatar'
                                  src={newEmployee?.photo}
                                  className={styles.cellOptions__userInfo__avatar}
                              />
                          :photo && (
                          <img
                              alt='avatar'
                              src={photo}
                              className={styles.cellOptions__userInfo__avatar}
                          />
                      )
                    }
                    <div className={styles.cellOptions__userInfo__right}>
                      <div className={styles.cellOptions__userInfo__right__fullName}>
                        {newEmployee?.name ? newEmployee?.name : employeeName}
                      </div>
                      <div className={styles.cellOptions__userInfo__right__jobType}>
                        {jobTypeName}
                      </div>
                    </div>
                  </div>
                  <div className={styles.cellOptions__label}>
                    {t('Working Time')}
                  </div>
                  <div className={styles.cellOptions__value}>
                    {`${moment(start).format('HH:mm')} – ${moment(end).format('HH:mm')}`}
                  </div>
                  {/* Edgaras suggestion 2022-05-25 FOR REMOVE */}
                  {/* Edgaras suggestion 2025-04-17 FOR RETURN */}
                  {/* { !modules.manual_mode && ( */}
                  <Dropdown.ItemMenu
                    title={t('Change Employee')}
                    onClick={openChangeEmployee}
                  />
                  <Dropdown.ItemMenu
                    title={t('Change Working Time')}
                    onClick={openChangeWorkingTime}
                  />
                  { modules.manual_mode ? (
                    <Dropdown.ItemMenu
                      title={t('Run Copy Mode')}
                      onClick={openCopyMode}
                    />
                    ) : null
                  }
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
            <div className={styles.cellOptions__space} />
          </Dropdown>
        ) : null
      }
    </div>
  );

};

