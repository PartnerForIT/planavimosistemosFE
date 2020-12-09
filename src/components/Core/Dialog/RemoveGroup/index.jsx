import React from 'react';
import { useTranslation } from 'react-i18next';
import Dialog from '../index';
import style from '../Dialog.module.scss';
import Button from '../../Button/Button';

function RemoveGroup({
  handleClose,
  title,
  open,
  buttonTitle,
  name,
  remove,
}) {
  const { t } = useTranslation();

  return (
    <Dialog handleClose={handleClose} open={open} title={title}>
      <div className={style.daleteData}>
        <p>{name ?? 'Group name'}</p>
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

export default RemoveGroup;
