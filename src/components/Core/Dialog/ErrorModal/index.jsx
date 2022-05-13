import React from 'react';
import Dialog from '../index';
import Button from '../../Button/Button';
import style from '../Dialog.module.scss';

export default function ErrorModal({
  header, text, onClose,
}) {

  return (
    <Dialog handleClose={onClose} open={true} title={header}>
      <div className={style.daleteData}>
        <div>
          {text}
        </div>
      </div>
      <div className={style.buttonsBlock}>
        <Button onClick={() => onClose()} size='small'>
          Ok
        </Button>
      </div>
    </Dialog>
  );
}
