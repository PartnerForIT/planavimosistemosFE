import React from 'react';
import moment from 'moment';
import Dialog from '../index';
import Button from '../../Button/Button';
import style from '../Dialog.module.scss';

export default function DeleteData({
  handleClose, title, open,
  buttonTitle, buttonTitle2, deleteData, employees, cancelDelete, submitDeleteData,
}) {
  const name = () => {
    const fullName = employees.filter((item) => item.user_id === parseInt(deleteData.employee, 10));
    return fullName[0] ? `${fullName[0].name} ${fullName[0].surname}` : '';
  };

  return (
    <Dialog handleClose={handleClose} open={open} title={title}>
      <div className={style.daleteData}>
        <div>
          Employee
          {name()}
        </div>
        <div>
          From
          {' '}
          {moment(deleteData.from.startDate).format('YYYY-MM-DD')}
          {' '}
          to
          {' '}
          {moment(deleteData.from.endDate).format('YYYY-MM-DD')}
        </div>
      </div>
      <div className={style.buttonsBlock}>
        <Button onClick={() => cancelDelete()} cancel size='big'>
          {buttonTitle2}
        </Button>
        <Button onClick={() => submitDeleteData()} danger size='big'>
          {buttonTitle}
        </Button>
      </div>
    </Dialog>
  );
}
