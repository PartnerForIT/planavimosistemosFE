import React, { useState } from 'react';
import Label from '../../Core/InputLabel'
import Tooltip from '../../Core/Tooltip';
import EmployeesSelect from '../../Core/EmployeesSelect';
import DRP from '../../Core/DRP/DRP';
import Button from '../../Core/Button/Button';
import DialogCreateJob from '../../Core/Dialog/DeleteData';

export default function FilterDelete({ style, inputValues,
  handleInputChange, t, employees, submitDeleteData, handleDialog, cancelDelete, openDialog, setOpenDialog }) {

  return (
    <div className={style.filterBlock}>
      <div className={style.filterBlock__inner}>
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
      <Button size='big'
        danger onClick={() => setOpenDialog(true)}
        disabled={inputValues.employee === '' ||
          Object.keys(inputValues.from).length === 0 ||
          inputValues.employee === 'Select employees'}
      >
        {t('Delete data')}
      </Button>
      <DialogCreateJob
        open={openDialog}
        handleClose={handleDialog}
        title={t('Delete Data?')}
        buttonTitle2={t('Cancel')}
        buttonTitle={t('Delete')}
        deleteData={inputValues}
        employees={employees}
        submitDeleteData={submitDeleteData}
        cancelDelete={cancelDelete}
      />
    </div>
  )
}