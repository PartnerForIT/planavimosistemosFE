import React from 'react';
import Label from '../../Core/InputLabel'
import Tooltip from '../../Core/Tooltip';
import EmployeesSelect from '../../Core/EmployeesSelect';
import DRP from '../../Core/DRP/DRP';

export default function filterDelete({ style, inputValues,
  handleInputChange, t, employees }) {
  return (
    <div className={style.filterBlock}>
      <div className={style.formControl}>
        <Label text={t('From')} />
        <div className={style.filterBlock__date}>
          <DRP initRange={inputValues.from} name="from" onChange={handleInputChange} />
        </div>
      </div>
      <div className={style.formControl}>
        <Label text={t('Employee')} />
        <div className={style.selectBlock}>
          <EmployeesSelect
            handleInputChange={handleInputChange}
            name="employee"
            placeholder={'Employee'}
            value={inputValues.employee}
            options={employees}
          />
          <Tooltip title={'Select Employee'} />
        </div>
      </div>
    </div>
  )
}