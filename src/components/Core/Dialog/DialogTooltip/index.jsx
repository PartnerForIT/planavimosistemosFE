import React from 'react';
import DialogClear from '../DialogClear';
import style from '../Dialog.module.scss';

export default ({
  handleClose,
  open,
  children,
}) => {

  return (
    <DialogClear
      handleClose={handleClose}
      open={open}
    >
      <div className={style.dialogTooltip}>
        {children}
      </div>
    </DialogClear>
  );
};
