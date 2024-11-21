import React from 'react';
import Label from '../../../Core/InputLabel';
import Tooltip from '../../../Core/Tooltip';
import DateRangePicker from '../../../Core/DateRangePicker';
import Button from '../../../Core/Button/Button';
import DialogDeleteData from '../../../Core/Dialog/DeleteData';
import SimpleSelect from '../../../Core/SimpleSelect';

export default function FilterDelete({
  style, inputValues,
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
            <SimpleSelect
              handleInputChange={handleInputChange}
              name='employee'
              placeholder={t('Select employee')}
              value={inputValues.employee}
              options={employees}
              valueKey='id'
              labelKey='fullName'
            />
            <Tooltip title={t('Select Employee')} />
          </div>
        </div>
      </div>
      <Button
        size='big'
        danger
        onClick={() => setOpenDialog(true)}
        disabled={inputValues.employee === ''
        || Object.keys(inputValues.from).length === 0
        || inputValues.employee === t('Select employee')}
      >
        {t('Delete data')}
      </Button>
      <DialogDeleteData
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
