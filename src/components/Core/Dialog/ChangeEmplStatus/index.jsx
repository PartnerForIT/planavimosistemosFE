import React from 'react';
import { useTranslation } from 'react-i18next';
import Dialog from '../index';
import style from '../Dialog.module.scss';
import Button from '../../Button/Button';

function ChangeEmplStatus({
  handleClose,
  title,
  open,
  changeStatus,
}) {
  const { t } = useTranslation();

  return (
    <>
      <Dialog handleClose={handleClose} open={!!open} title={title}>
        <div className={style.daleteData}>
          <p />
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
              changeStatus(open);
              handleClose();
            }}
            size='big'
            danger
            fillWidth
          >
            <span style={{ textTransform: 'capitalize' }}>
              {t(open)}
            </span>
          </Button>
        </div>
      </Dialog>
    </>
  );
}

export default ChangeEmplStatus;
