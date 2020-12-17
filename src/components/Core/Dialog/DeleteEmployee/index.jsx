import React from 'react';
import { useTranslation } from 'react-i18next';
import Dialog from '../index';
import style from '../Dialog.module.scss';
import Button from '../../Button/Button';

function DeleteEmployee({
  handleClose,
  title,
  open,
  buttonTitle,
  employees,
  remove,
}) {
  const { t } = useTranslation();

  return (
    <>
      <Dialog handleClose={handleClose} open={!!open} title={title}>
        <div className={style.daleteData}>
          <p>{employees.find((empl) => empl.id === open)?.name ?? ''}</p>
        </div>
        <div className={style.buttonsBlock}>
          <Button
            disabled={false}
            onClick={() => handleClose()}
            size='big'
            cancel
            fillWidth
          >
            {t('Cancel')}
          </Button>
          <Button
            onClick={() => {
              remove();
              handleClose();
            }}
            size='big'
            danger
            fillWidth
          >
            {buttonTitle ?? t('Delete')}
          </Button>
        </div>
      </Dialog>
    </>
  );
}

export default DeleteEmployee;
