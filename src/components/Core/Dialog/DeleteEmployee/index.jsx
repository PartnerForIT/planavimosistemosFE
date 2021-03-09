import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import Dialog from '../index';
import style from '../Dialog.module.scss';
import Button from '../../Button/Button';

export default ({
  handleClose,
  title,
  open,
  buttonTitle,
  employees,
  remove,
}) => {
  const { t } = useTranslation();

  const nameEmployees = useMemo(() => {
    if (open) {
      return open.reduce((acc, item) => {
        const foundItem = employees.find((itemJ) => (itemJ.id === item));
        if (acc) {
          return `${acc}, ${foundItem.name}`;
        }

        return `${foundItem.name}`;
      }, '');
    }

    return '';
  }, [open, employees]);

  return (
    <>
      <Dialog handleClose={handleClose} open={!!open} title={title} maxWidth='sm'>
        <div className={style.daleteData}>
          <p>{nameEmployees}</p>
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
              remove();
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
    </>
  );
};
