import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import Dialog from '../index';
import style from '../Dialog.module.scss';
import Button from '../../Button/Button';

function ChangeEmplStatus({
  handleClose,
  title,
  open,
  changeStatus,
  employees = [],
  selected = [],
}) {
  const { t } = useTranslation();

  const nameEmployees = useMemo(() => {
    if (selected && open) {
      return selected.reduce((acc, item) => {
        const foundItem = employees.find((itemJ) => (itemJ.id === item));
        if (!foundItem) {
          return '';
        }
        if (acc) {
          return `${acc}, ${foundItem.name}`;
        }

        return `${foundItem.name}`;
      }, '');
    }

    return '';
  }, [selected, employees, open]);

  return (
    <>
      <Dialog handleClose={handleClose} open={!!open} title={title}>
        <div className={style.daleteData}>
          <p>{nameEmployees}</p>
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
            danger={open === 'suspend'}
            green={open === 'activate'}
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
