import React from 'react';
import Label from '../../Core/InputLabel';
import SimpleSelect from '../../Core/SimpleSelect';
import DateRangePicker from '../../Core/DateRangePicker';

export default function filterActivity({
  style, inputValues,
  handleInputChange, places, t, employees,
}) {
  return (
    <div className={style.filterBlock}>
      <div className={style.formControl}>
        <div className={style.filterBlock__date}>
          <DateRangePicker
            initRange={inputValues.from}
            onChange={handleInputChange}
          />
        </div>
      </div>
      <div className={style.formControl}>
        <Label text={t('Employee')} />
        <div className={style.selectBlock}>
          <SimpleSelect
            handleInputChange={handleInputChange}
            name='employee'
            placeholder={t('Select employee')}
            value={inputValues.employee}
            options={employees}
            valueKey='id'
            labelKey='fullName'
          />
        </div>

      </div>
      <div className={style.formControl}>
        <Label text={t('Place')} />
        <div className={style.selectBlock}>
          <SimpleSelect
            handleInputChange={handleInputChange}
            name='place'
            placeholder={t('Select Place')}
            value={inputValues.place}
            options={places}
            valueKey='id'
            labelKey='name'
          />
        </div>
      </div>
    </div>
  );
}
