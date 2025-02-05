import React, { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import moment from 'moment';

import Dropdown from '../../Dropdown';
import ChangeEmployee from './ChangeEmployee';
import styles from './CellOptions.module.scss';
import classNames from 'classnames';
import MenuContent from '../../EventContent/MenuContent';
import Content from '../../Dropdown/Content';
import RefreshArrows from '../../../../components/Icons/RefreshArrows';
import CommentIcon from '../../../../components/Icons/comment_icon.png';
import Dots from '../../../../components/Icons/Dots';

export default ({
  id,
  employeeId,
  resourceId,
  group,
  reccuring,
  title,
  description,
  schedule_title,
  photo,
  jobTypeName,
  skillName,
  employeeName,
  withMenu,
  onChangeEmployee,
  start,
  end,
  copy_event,
  empty,
  editPermissions,
  isCompleted,
  unavailableEmployees,
  markers,
  handleCopyTool,
  copyTool,
  handleAddHistory,
  currentDay,
  currentMonth,
  onEditWorkingTime,
  onDeleteWorkingTime,
  onDuplicateEmployee,
  openAddSchedule,
  onEditReccuring,
  onDeleteReccuring,
}) => {
  
  const { t } = useTranslation();
  
  const [content, setContent] = useState('menu');
  const modalRef = useRef(null);
  const modalAddRef = useRef(null);
  const [activeGroupItem, setActiveGroupItem] = useState(null);
  const [openedGroup, setOpenedGroup] = useState(false);
  const buttonRef = useRef(null);
  const dropdownRef = useRef(null);

  const classes = classNames(
    styles.cellOptions,
    {
      [styles.dayEnd]: isCompleted,
      [styles.cellOptions__withoutMenu]: !(!copy_event && withMenu) || empty,
    },
  );

  useEffect(() => {
    const handleOuterDropdownClick = (e) => {
      if (dropdownRef && dropdownRef.current
          && ((dropdownRef.current.contains(e.target)
              || (buttonRef.current && buttonRef.current.contains(e.target))))
      ) {
        return;
      }
      setOpenedGroup(false);
    };
    document.addEventListener('mousedown', handleOuterDropdownClick, false);

    return () => {
      document.removeEventListener('mousedown', handleOuterDropdownClick, false);
    };
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (modalAddRef.current) {
      modalAddRef.current.close();
    }
  }, [content]);

  const getGroupItemClasses = (item) => {
    return classNames(
      styles.cellOptions__groupModal__item,
      {
        [styles.eventContent__groupModal__item_completed]: item.is_completed,
      },
    );
  };

  const handleEditWorkingTime = () => {
    onEditWorkingTime(activeGroupItem?.id ? activeGroupItem?.id : id, moment(activeGroupItem ? activeGroupItem.start : start));
  };
  const handleDeleteWorkingTime = () => {
    onDeleteWorkingTime(activeGroupItem?.id ? activeGroupItem?.id : id, moment(activeGroupItem ? activeGroupItem.start : start));
  };
  const handleDuplicateWorkingTime = (employeeId) => {
    onDuplicateEmployee(activeGroupItem?.id ? activeGroupItem?.id : id, employeeId, moment(activeGroupItem ? activeGroupItem.start : start));
  };
  const handleClickGroupItem = (index) => {
    setActiveGroupItem(group[index]);
    modalRef.current.open();
  }

  const copyEvent = () => {
    let start_day = moment(start).format('YYYY-MM-DD');
    if (!start) {
      start_day = moment(currentMonth).date(currentDay).format('YYYY-MM-DD');
    }
    handleAddHistory({resourceId: resourceId, day: currentDay, start: start_day, end: start_day});
  };
  const handleCancel = () => {
    if (modalAddRef.current) {
      modalAddRef.current.close();
    }
    setContent('menu');
  };
  
  return (
    <>
      { group && !copy_event && withMenu && editPermissions && (
        <div
          className={styles.cellOptions__group_button}
          id='dropdownButton'
        >
          <div
            className={styles.cellOptions__group_button_dots}
            onClick={() => setOpenedGroup(!openedGroup)}
            ref={buttonRef}
          >
            <Dots />
          </div>
        </div>
      )}
      { openedGroup && (
        <Content
          onClose={() => setOpenedGroup(false)}
          wrapperRef={dropdownRef}
          offset={buttonRef.current.getBoundingClientRect()}
          onTop
        >
          <div className={styles.cellOptions__groupModal}>
            <div className={styles.cellOptions__userInfo}>
              { photo &&
                <div className={styles.cellOptions__photo}>
                  <img className={styles.cellOptions__avatar} src={photo} alt={employeeName} /> 
                </div>
              }
              <div className={styles.cellOptions__userInfo__right}>
                <div className={styles.cellOptions__userInfo__right__fullName}>
                  {employeeName}
                </div>
                <div className={styles.cellOptions__userInfo__right__jobType}>
                  {skillName}
                </div>
              </div>
            </div>
            <div className={styles.cellOptions__groupModal__count}>
              { group.length } { t('tasks') }
            </div>

            <div className={styles.cellOptions__groupModal__list}>
              {
                group.map((item, index) => (
                  <div key={index} className={getGroupItemClasses(item)} onClick={() => handleClickGroupItem(index)}>
                    <div className={styles.cellOptions__groupModal__item__title}>
                      { item.reccuring && <div className={styles.cellOptions__reccuring}><RefreshArrows /></div> }
                      {item.schedule_title ? item.schedule_title : ''}
                    </div>
                    <div className={styles.cellOptions__groupModal__item__time}>{moment(item.start).format('HH:mm')} - {moment(item.end).format('HH:mm')}{item.title?.job_type ? ` • ${item.title?.job_type}` : ''}</div>
                    { item.title?.place && <div className={styles.cellOptions__groupModal__item__place}>{item.title?.place}</div> }

                    { item.description ? 
                      <div className={styles.cellOptions__comment_icon} >
                        <img src={CommentIcon} alt={employeeName} />
                      </div>
                      : null
                    }
                  </div>
                ))
              }
            </div>
          </div>
        </Content>
      )}
      <div
        className={classes}
        id={empty ? 'withEmpty' : 'dropdownButton'}
      >
        {
          editPermissions && (
          (copyTool)
            ? <span onClick={copyEvent} className={classNames('copy-add', styles.copyAdd)}>{t('Paste the Time')}</span>
            : empty && (<span onClick={openAddSchedule} className={classNames('empty-add', styles.emptyAdd)}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>)
          )
        }
        {
          !copy_event && withMenu && !empty && editPermissions ? (
            <Dropdown
              light
              cancel={content !== 'menu'}
              onCancel={handleCancel}
              ref={modalRef}
              buttonClass={group ? styles.cellOptions__invisible : null}
              maxHeight={480}
            >
              {
                content === 'duplicateEmployee' && (
                  <ChangeEmployee
                    photo={photo}
                    jobTypeName={activeGroupItem ? activeGroupItem.job_type_name : jobTypeName}
                    skillName={skillName}
                    employeeName={employeeName}
                    onChangeEmployee={handleDuplicateWorkingTime}
                    unavailableEmployees={[]}
                  />
                )
              }
              {
                content === 'menu' && (
                  <MenuContent
                    reccuring={activeGroupItem ? activeGroupItem.reccuring : reccuring}
                    photo={photo}
                    employeeName={employeeName}
                    jobTypeName={activeGroupItem ? activeGroupItem.job_type_name : jobTypeName}
                    skillName={skillName}
                    description={activeGroupItem ? activeGroupItem.description : description}
                    schedule_title={activeGroupItem ? activeGroupItem.schedule_title : schedule_title}
                    start={activeGroupItem ? activeGroupItem.start : start}
                    end={activeGroupItem ? activeGroupItem.end : end}
                    title={activeGroupItem ? activeGroupItem.title : title}
                    handleEditWorkingTime={handleEditWorkingTime}
                    handleDuplicateWorkingTime={() => setContent('duplicateEmployee')}
                    handleDeleteWorkingTime={handleDeleteWorkingTime}
                    onEditReccuring={() => { onEditReccuring(activeGroupItem?.id ? activeGroupItem?.id : id, activeGroupItem ? activeGroupItem.start : start) }}
                    onDeleteReccuring={() => { onDeleteReccuring(activeGroupItem?.id ? activeGroupItem?.id : id, activeGroupItem ? activeGroupItem.start : start) }}
                  />
                )
              }
              <div className={styles.cellOptions__space} />
            </Dropdown>
          ) : null
        }
      </div>
    </>
  );

};

