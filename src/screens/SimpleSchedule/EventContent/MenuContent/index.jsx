import React from 'react';
import { useTranslation } from 'react-i18next';
import moment from 'moment';

import Dropdown from '../../Dropdown';
import ReccuringInfo from '../ReccuringInfo';

import styles from '../EventContent.module.scss';

export default ({
  reccuring,
  photo,
  employeeName,
  jobTypeName,
  skillName,
  description,
  start,
  end,
  worked_start,
  worked_end,
  title,
  schedule_title,
  isCompleted,
  isFinished,
  handleEditWorkingTime,
  handleDuplicateWorkingTime,
  handleDeleteWorkingTime,
  handleAddTask,
  onEditReccuring,
  onDeleteReccuring
}) => {
  const { t } = useTranslation();

  const calculateWorkedHours = (start, end) => {
    const startMoment = moment(start);
    const endMoment = moment(end);
    const duration = moment.duration(endMoment.diff(startMoment));
    const hours = Math.floor(duration.asHours());
    const minutes = Math.floor(duration.asMinutes()) - hours * 60;
    return [hours, minutes];
  }

  const calculateDifference = (worked_start, worked_end, start, end) => {
    const startMoment = moment(start);
    const endMoment = moment(end);
    const workedStartMoment = moment(worked_start);
    const workedEndMoment = moment(worked_end);
    const duration = moment.duration(workedEndMoment.diff(workedStartMoment));
    const hours = Math.floor(duration.asHours());
    const minutes = Math.floor(duration.asMinutes()) - hours * 60;
    const workedDuration = hours * 60 + minutes;
    const duration2 = moment.duration(endMoment.diff(startMoment));
    const hours2 = Math.floor(duration2.asHours());
    const minutes2 = Math.floor(duration2.asMinutes()) - hours2 * 60;
    const plannedDuration = hours2 * 60 + minutes2;
    const difference = workedDuration - plannedDuration;
    const diffHours = Math.floor(Math.abs(difference) / 60);
    const diffMinutes = Math.abs(difference) % 60;
    return [diffHours, diffMinutes, difference >= 0 ? '+' : '-'];
  }
  
  return (
    <div className={styles.eventContent__menu}>
      <div className={styles.eventContent__userInfo}>
        { photo &&
          <div className={styles.eventContent__photo}>
            <img src={photo} alt={employeeName} /> 
          </div>
        }
        <div className={styles.eventContent__userInfo__right}>
          <div className={styles.eventContent__userInfo__right__fullName}>
            {employeeName}
          </div>
          <div className={styles.eventContent__userInfo__right__jobType}>
            {skillName}
          </div>
        </div>
      </div>
      <div className={styles.eventContent__label}>
        {t('Task name')}
      </div>
      <div className={styles.eventContent__value}>
        {schedule_title}
      </div>
      {
        reccuring && <ReccuringInfo allowEdit={!isCompleted && !isFinished} reccuring={reccuring} onEditReccuring={onEditReccuring} onDeleteReccuring={onDeleteReccuring} />
      }
      {
        description && (
          <>
            <div className={styles.eventContent__label}>
              {t('Description')}
            </div>
            <div className={styles.eventContent__value}>
              {description}
            </div>
          </>
        )
      }
      <div className={styles.eventContent__label}>
        {t('Planned Time')}
      </div>
      <div className={styles.eventContent__value}>
        {`${moment(start).format('HH:mm')} – ${moment(end).format('HH:mm')}`}
      </div>

      { worked_start && worked_end && (
        <>
          <div className={styles.eventContent__label}>
            {t('Worked Time')}
          </div>
          <div className={styles.eventContent__value}>
            {`${moment(worked_start).format('HH:mm')} – ${moment(worked_end).format('HH:mm')}`}
          </div>
          <div className={styles.eventContent__label}>
            {t('Worked Hours')}
          </div>
          <div className={styles.eventContent__value}>
            {calculateWorkedHours(worked_start, worked_end)[0]}<span className={styles.eventContent__light}>h</span> {calculateWorkedHours(worked_start, worked_end)[1]}<span className={styles.eventContent__light}>m</span>
          </div>
          <div className={styles.eventContent__label}>
            {t('Difference')}
          </div>
          <div className={styles.eventContent__value}>
            {calculateDifference(worked_start, worked_end, start, end)[2]}{calculateDifference(worked_start, worked_end, start, end)[0]}<span className={styles.eventContent__light}>h</span> {calculateDifference(worked_start, worked_end, start, end)[1]}<span className={styles.eventContent__light}>m</span>
          </div>
        </>
      )}

      { title.place && (
        <>
          <div className={styles.eventContent__label}>
            {t('Place')}
          </div>
          <div className={styles.eventContent__value}>
            { title.place ? title.place : '' }
          </div>
        </>
      )}

      { title.job_type && (
        <>
          <div className={styles.eventContent__label}>
            {t('Job Type')}
          </div>
          <div className={styles.eventContent__value}>
            { title.job_type ? title.job_type : '' }
          </div>
        </>
      )}

      { !isCompleted && !isFinished && (
        <>
        <Dropdown.ItemMenu
          title={t('Edit the entry')}
          onClick={handleEditWorkingTime}
        />

        <Dropdown.ItemMenu
          title={t('Duplicate to')}
          onClick={handleDuplicateWorkingTime}
        />

        <Dropdown.ItemMenu
          title={t('Delete')}
          onClick={handleDeleteWorkingTime}
          remove
        />

        <Dropdown.ItemMenu
          title={t('Add additional task')}
          onClick={handleAddTask}
        />
        </>
      )}
    </div>
  );
};
