import React from 'react';
import { useTranslation } from 'react-i18next';
import Dialog from '../index';
import style from '../Dialog.module.scss';
import Button from '../../Button/Button';
import SuccessModalIcon from 'components/Icons/SuccessModalIcon';

function ApproveEmptySuccess({
  handleClose,
  open,
  text,
}) {
  const { t } = useTranslation();

  return (
    <Dialog handleClose={handleClose} open={open} maxWidth='xs'>
      <div className={style.successData}>
        <SuccessModalIcon />
        <p>{text ?? ''}</p>
      </div>
      <div className={style.buttonsBlock}>
        <Button
          disabled={false}
          onClick={() => handleClose()}
          size='big'
        >
          {t('OK')}
        </Button>
      </div>
    </Dialog>
  );
}

export default ApproveEmptySuccess;
