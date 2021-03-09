import React from 'react';
import { useTranslation } from 'react-i18next';
import Dialog from '../index';
import style from '../Dialog.module.scss';
import Button from '../../Button/Button';

export default ({
  handleClose,
  title,
  open,
  buttonTitle,
  description,
  onConfirmRemove,
}) => {
  const { t } = useTranslation();

  return (
    <Dialog handleClose={handleClose} open={!!open} title={`${t(title)}?`} maxWidth='sm'>
      <div className={style.daleteData}>
        <p>{description}</p>
      </div>
      <div className={style.buttonsBlock}>
        <Button
          onClick={() => handleClose()}
          size='big'
          cancel
          fillWidth
        >
          {t('Cancel')}
        </Button>
        <Button
          onClick={() => {
            onConfirmRemove();
            handleClose();
          }}
          size='big'
          danger
          fillWidth
        >
          {buttonTitle || t('Delete')}
        </Button>
      </div>
    </Dialog>
  );
};
