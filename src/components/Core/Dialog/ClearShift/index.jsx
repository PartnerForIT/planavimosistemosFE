import React from 'react';
import Dialog from '../index';
import Button from '../../Button/Button';
import style from '../Dialog.module.scss';
import { useTranslation } from 'react-i18next';

export default function ClearShift({
  handleClose, title, open,
  buttonTitle, buttonTitle2, info, cancelDelete, submitDeleteShift,
}) {
  const { t } = useTranslation();
  
  return (
    <Dialog handleClose={handleClose} open={open} title={title}>
      <div className={style.daleteData}>
        <div>
          {t("You are about to remove all scheduled work times for shift {{shift}} for {{month}}", {
            shift: info.shift,
            month: info.month,
          })}
        </div>
        <div>
          {t("Are you sure you want to proceed? This action cannot be undone.")}
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
