import React from 'react';
import { useTranslation } from 'react-i18next';
import Dialog from '../index';
import style from '../Dialog.module.scss';
import Button from '../../Button/Button';

function RemovePolicy({
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
        <p>{name ?? ''} {t(' policy will be deleted and all employees will be unassigned from it, are you sure you want to proceed with it?')}</p>
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

export default RemovePolicy;
