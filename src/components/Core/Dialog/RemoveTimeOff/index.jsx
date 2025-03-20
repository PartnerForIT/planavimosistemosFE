import React from 'react';
import { useTranslation } from 'react-i18next';
import Dialog from '../index';
import style from '../Dialog.module.scss';
import Button from '../../Button/Button';

function RemoveTimeOff({
  handleClose,
  title,
  open,
  buttonTitle,
  name,
  remove,
}) {
  const { t } = useTranslation();

  return (
    <Dialog handleClose={handleClose} open={open} title={title} maxWidth='sm'>
      <div className={style.daleteData}>
        <p>{name ?? ''} {t('policy type will be deleted with all its Policies inside it, are you sure you want to proceed with it?')}</p>
        <p>{t('Policies will be unassigned from the assigned employees')}</p>
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
          {buttonTitle}
        </Button>
      </div>
    </Dialog>
  );
}

export default RemoveTimeOff;
