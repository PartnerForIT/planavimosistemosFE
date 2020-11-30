import React from 'react';
import Label from '../../Core/InputLabel'
import SimpleSelect from '../../Core/SimpleSelect';
import Input from '../../Core/Input/Input';
import DRP from '../../Core/DRP/DRP';

export default function filterActivity({ style, inputValues,
  handleInputChange, places, t, dateRange, setDateRange, employees }) {

  return (
    <div className={style.filterBlock}>
      <div className={style.formControl}>
        <Label text={t('From')} />
        <div className={style.filterBlock__date}>
          <DRP initRange={dateRange} onChange={setDateRange} />
        </div>
      </div>
      <div className={style.formControl}>
        <Label text={t('Employee')} />
        <div className={style.selectBlock}>
          <SimpleSelect
            handleInputChange={handleInputChange}
            name="employee"
            placeholder={'Employee'}
            value={inputValues.employee}
            options={employees}
          />
        </div>

      </div>
      <div className={style.formControl}>
        <Label text={t('Place')} />
        <div className={style.selectBlock}>
          <SimpleSelect
            handleInputChange={handleInputChange}
            name="place"
            placeholder={'Select Place'}
            value={inputValues.place}
            options={places}
          />
        </div>
      </div>
    </div>
  )
}