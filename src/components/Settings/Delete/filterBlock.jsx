import React from 'react';
import Label from '../../Core/InputLabel';
import Tooltip from '../../Core/Tooltip';
import EmployeesSelect from '../../Core/EmployeesSelect';
import DateRangePicker from '../../Core/DateRangePicker';
import Button from '../../Core/Button/Button';
import DialogCreateJob from '../../Core/Dialog/DeleteData';

export default function FilterDelete({
  style, inputValues, withDeleteButton = false,
  handleInputChange, t, employees, submitDeleteData, handleDialog, cancelDelete, openDialog, setOpenDialog,
}) {
  return (
    <div className={style.filterBlock}>
      <div className={style.filterBlock__inner}>
        <div className={style.formControl}>
          <div className={style.filterBlock__date}>
            <DateRangePicker initRange={inputValues.from} onChange={handleInputChange} />
          </div>
        </div>
        <div className={style.formControl}>
          <Label text={t('Employee')} />
          <div className={style.selectBlock}>
            <EmployeesSelect
              handleInputChange={handleInputChange}
              name='employee'
              placeholder='Employee'
              value={inputValues.employee}
              options={employees}
            />
            <Tooltip title='Select Employee' />
          </div>
        </div>
      </div>
      {
        withDeleteButton && (
          <Button
            size='big'
            danger
            onClick={() => setOpenDialog(true)}
            disabled={inputValues.employee === ''
            || Object.keys(inputValues.from).length === 0
            || inputValues.employee === 'Select employee'}
          >
            {t('Delete data')}
          </Button>
        )
      }
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
  );
}
