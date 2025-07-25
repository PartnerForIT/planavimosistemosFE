import React from 'react';
import { useTranslation } from 'react-i18next';
import Dialog from '../index';
import style from '../Dialog.module.scss';
import Button from '../../Button/Button';

function RemoveActivity({
  handleClose,
  title,
  open,
  buttonTitle,
  remove,
}) {
  const { t } = useTranslation();

  return (
    <Dialog handleClose={handleClose} open={open} title={title} maxWidth='sm'>
      <div className={style.daleteData}>
        {/* <p>{t('Are you sure you want to delete this activity?')}</p> */}
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

export default RemoveActivity;
