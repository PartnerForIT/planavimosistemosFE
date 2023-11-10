import React, { useState } from 'react';
import * as _ from 'lodash';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import moment from 'moment';
import Label from '../../../Core/InputLabel';
import Tooltip from '../../../Core/Tooltip';
import Button from '../../../Core/Button/Button';
import AddHolidays from '../../../Core/Dialog/AddHoliday';
import DeleteIcon from '../../../Icons/DeleteIcon';
import { getHolidays, addHoliday, deleteHoliday } from '../../../../store/settings/actions';
import { onKeyDown } from '../../../Helpers';
import ArrowLeftButton from '../../../Icons/ArrowLeftButton';
import ArrowRightButton from '../../../Icons/ArrowRightButton';

export default function Holidays({
  styles, holidays, companyId, companyHolidays, setYear = () => ({}), year = '',
  readOnly,
}) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();

  const [name, setName] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const saveAddHoliday = () => {
    const data = {
      name,
      company_work_time_id: companyId,
      date: moment(selectedDate).format('YYYY-MM-DD'),
    };
    dispatch(addHoliday(data, companyId));
    setOpen(false);
  };

  const delHoliday = (id) => {
    dispatch(deleteHoliday(id, companyId));
  };

  const yearChangeHandler = (opt) => {
    setYear(year+opt);
    dispatch(getHolidays(companyId, year+opt));
  };

  return (
    <div className={styles.holidays}>
      <div className={styles.labelButtonBlock}>
        <div className={styles.labelBlock}>
          <Label text={t('Holidays')} />
          <Tooltip title={t('Add new Holidays')} />
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

        {/* add new */}
        {
          !readOnly && (
            <Button inverse onClick={() => setOpen(true)}>
              {t('+ add new')}
            </Button>
          )
        }
        <AddHolidays
          open={open}
          handleClose={handleClose}
          title={t('New holidays')}
          saveAddHoliday={saveAddHoliday}
          setName={setName}
          name={name}
          selectedDate={selectedDate}
          handleDateChange={handleDateChange}
        />
      </div>
      {_.map(companyHolidays, (item) => (
        <div key={item.id + item.name} className={styles.holidays__block}>
          <div className={styles.holidays__innerBlock}>
            <div className={styles.holidays_data}>{item.date}</div>
            <div className={styles.holidays_name}>{item.name}</div>
          </div>
          {
            !readOnly && (
              <button
                onClick={() => delHoliday(item.id)}
                onKeyDown={(event) => onKeyDown(event, () => delHoliday(item.id))}
                className={styles.deleteHoliday}
                aria-label='delete holiday'
              >
                <DeleteIcon fill='#fd0d1b' viewBox='0 0 32 14' aria-hidden />
              </button>
            )
          }
        </div>
      ))}
      {_.map(holidays, (item) => (
        <div key={item.name} className={styles.holidays__block}>
          <div className={styles.holidays__innerBlock}>
            <div className={styles.holidays_data}>{item.date}</div>
            <div className={styles.holidays_name}>{item.name}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
