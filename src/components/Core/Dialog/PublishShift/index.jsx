import React from 'react';
import Dialog from '../index';
import Button from '../../Button/Button';
import style from '../Dialog.module.scss';

export default function DeleteShift({
  handleClose, title, open,
  buttonTitle, buttonTitle2, cancelDelete, submitDeleteShift,
}) {

  return (
    <Dialog handleClose={handleClose} open={open} title={title}>
      <div className={style.daleteData}>
        <div>
        </div>
      </div>
      <div className={style.buttonsBlock}>
        <Button onClick={() => cancelDelete()} cancel size='big'>
          {buttonTitle2}
        </Button>
        <Button onClick={() => submitDeleteShift()} blue size='big'>
          {buttonTitle}
        </Button>
      </div>
    </Dialog>
  );
}
