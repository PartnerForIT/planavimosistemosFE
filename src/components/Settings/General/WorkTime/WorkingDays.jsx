import React from 'react';
import * as _ from 'lodash';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import Label from '../../../Core/InputLabel';
import { getWorkingDays } from '../../../../store/settings/actions';
import ArrowLeftButton from '../../../Icons/ArrowLeftButton';
import ArrowRightButton from '../../../Icons/ArrowRightButton';
import Input from '../../../Core/Input/Input';
import Checkbox from '../../../Core/Checkbox/Checkbox2';

export default function WorkingDays({
  styles, inputValues, workingDays, setWorkingHours, companyId, setYear = () => ({}), year = '',
}) {
  const { t } = useTranslation();
  const dispatch = useDispatch();


  const yearChangeHandler = (opt) => {
    setYear(year+opt);
    dispatch(getWorkingDays(companyId, year+opt));
  };

  const workingHoursChangeHandler = (e) => {
    setWorkingHours(e);
    setTimeout(() => dispatch(getWorkingDays(companyId, year)), 500);
  };

  const hourBeforeHolidayChangeHandler = (e) => {
    setWorkingHours({target: {name: 'hour_before_holiday', value: e.target.checked}});
    setTimeout(() => dispatch(getWorkingDays(companyId, year)), 500);
  };

  return (
    <div className={styles.workingDays}>
      <div className={styles.labelButtonBlock}>
        <div className={styles.labelBlockWD}>
          <Label text={t('Working days and hours of the')} />
        </div>

        {/* year */}
        <div className={styles.year}>
          {/* left */}
          <button
            aria-label='year decreasing'
            onClick={() => yearChangeHandler(-1)}
          >
            <ArrowLeftButton
              aria-hidden
              className={styles.icon}
            />
          </button>
          <input value={year} disabled />
          <button
            aria-label='year increasing'
            onClick={() => yearChangeHandler(1)}
          >
            <ArrowRightButton
              aria-hidden
              className={styles.icon}
            />
          </button>
        </div>
      </div>

      <div className={styles.settingsBlock2}>
        <Checkbox
          onChange={hourBeforeHolidayChangeHandler}
          checked={!!inputValues.hour_before_holiday}
          label={t('Calculate -1 hour for the working day before holiday day')}
          name='hour_before_holiday'
        />
      </div>
      <div className={styles.settingsBlock}>
        <div className={styles.innerText}>{t('Work Hours per day')}</div>
        <Input
          value={inputValues.working_hours}
          name='working_hours'
          type='number'
          placeholder='8'
          min='0'
          max='24'
          onChange={workingHoursChangeHandler}
        />
      </div>
        {_.map([
          t("January"),
          t("February"),
          t("March"),
          t("April"),
          t("May"),
          t("June"),
          t("July"),
          t("August"),
          t("September"),
          t("October"),
          t("November"),
          t("December")
        ], (name, index) => (
      
        <div className={styles.workingHoursBlock} key={index+'m'}>
          <div className={styles.innerText}>{name}</div>
          <div className={styles.workingHoursInput}>
            <Input
              value={workingDays?.month?.[index+1].workingDays}
              readOnly={true}
            />
          </div>
          <div className={styles.innerText}>{t('working days')}</div>
          <div className={styles.workingHoursInput}>
            <Input
              value={workingDays?.month?.[index+1].workingHours}
              readOnly={true}
            />
          </div>
          <div className={styles.innerText}>{t('working hours')}</div>
          <div className={styles.workingHoursInput}>
            <Input
              value={workingDays?.month?.[index+1].freeDays}
              readOnly={true}
            />
          </div>
          <div className={styles.innerText}>{t('free days')}</div>
          <div className={styles.workingHoursInput}>
            <Input
              value={workingDays?.month?.[index+1].holidayDays}
              readOnly={true}
            />
          </div>
          <div className={styles.innerText}>{t('holiday days')}</div>
        </div>
      ))}

      <div className={styles.formLineShort} />

      {_.map([
          t("Q1"),
          t("Q2"),
          t("Q3"),
          t("Q4"),
        ], (name, index) => (
      
        <div className={styles.workingHoursBlock} key={index+'q'}>
          <div className={styles.innerText}>{name}</div>
          <div className={styles.workingHoursInput}>
            <Input
              value={workingDays?.q?.[index+1].workingDays}
              readOnly={true}
            />
          </div>
          <div className={styles.innerText}>{t('working days')}</div>
          <div className={styles.workingHoursInput}>
            <Input
              value={workingDays?.q?.[index+1].workingHours}
              readOnly={true}
            />
          </div>
          <div className={styles.innerText}>{t('working hours')}</div>
          <div className={styles.workingHoursInput}>
            <Input
              value={workingDays?.q?.[index+1].freeDays}
              readOnly={true}
            />
          </div>
          <div className={styles.innerText}>{t('free days')}</div>
          <div className={styles.workingHoursInput}>
            <Input
              value={workingDays?.q?.[index+1].holidayDays}
              readOnly={true}
            />
          </div>
          <div className={styles.innerText}>{t('holiday days')}</div>
        </div>
      ))}

      <div className={styles.formLineShort} />

        <div className={styles.workingHoursBlock}>
          <div className={styles.innerText}>{t('Year')}</div>
          <div className={styles.workingHoursInput}>
            <Input
              value={workingDays?.year?.workingDays}
              readOnly={true}
            />
          </div>
          <div className={styles.innerText}>{t('working days')}</div>
          <div className={styles.workingHoursInput}>
            <Input
              value={workingDays?.year?.workingHours}
              readOnly={true}
            />
          </div>
          <div className={styles.innerText}>{t('working hours')}</div>
          <div className={styles.workingHoursInput}>
            <Input
              value={workingDays?.year?.freeDays}
              readOnly={true}
            />
          </div>
          <div className={styles.innerText}>{t('free days')}</div>
          <div className={styles.workingHoursInput}>
            <Input
              value={workingDays?.year?.holidayDays}
              readOnly={true}
            />
          </div>
          <div className={styles.innerText}>{t('holiday days')}</div>
        </div>

      <div className={styles.formLine} />
    </div>
  );
}
