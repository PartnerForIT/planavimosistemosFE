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
  title,
  schedule_title,
  handleEditWorkingTime,
  handleDuplicateWorkingTime,
  handleDeleteWorkingTime,
  onEditReccuring,
  onDeleteReccuring
}) => {
  const { t } = useTranslation();
  
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
        reccuring && <ReccuringInfo reccuring={reccuring} onEditReccuring={onEditReccuring} onDeleteReccuring={onDeleteReccuring} />
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

      <div className={styles.eventContent__label}>
        {t('Place')}
      </div>
      <div className={styles.eventContent__value}>
        { title.place ? title.place : '' }
      </div>

      <div className={styles.eventContent__label}>
        {t('Job Type')}
      </div>
      <div className={styles.eventContent__value}>
        { title.job_type ? title.job_type : '' }
      </div>

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
    </div>
  );
};
