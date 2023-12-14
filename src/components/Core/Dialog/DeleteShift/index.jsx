import React from 'react';
import Dialog from '../index';
import Button from '../../Button/Button';
import style from '../Dialog.module.scss';

export default function DeleteShift({
  handleClose, title, open,
  buttonTitle, buttonTitle2, shiftName, cancelDelete, submitDeleteShift,
}) {

  return (
    <Dialog handleClose={handleClose} open={open} title={title}>
      <div className={style.daleteData}>
        <div>
          Shift {shiftName} will be deleted permanently from Schedule.
        </div>
      </div>
      <div className={style.buttonsBlock}>
        <Button onClick={() => cancelDelete()} cancel size='big'>
          {buttonTitle2}
        </Button>
        <Button onClick={() => submitDeleteShift()} danger size='big'>
          {buttonTitle}
        </Button>
      </div>
    </Dialog>
  );
}
