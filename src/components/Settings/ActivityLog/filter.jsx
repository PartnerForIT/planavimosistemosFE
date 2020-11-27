import React from 'react';
import Label from '../../Core/InputLabel'
import SimpleSelect from '../../Core/SimpleSelect';
import Input from '../../Core/Input/Input';
import DRP from '../../Core/DRP/DRP';

export default function filterActivity({ style, inputValues,
  handleInputChange, places, t, dateRange, setDateRange }) {

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
        <Input
          value={inputValues.employee}
          name="employee"
          onChange={handleInputChange}
        />
      </div>
      <div className={style.formControl}>
        <Label text={t('Place')} />
        <div>
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