import React, { useState } from 'react';
import * as _ from 'lodash';
import { useTranslation } from 'react-i18next';
import Label from '../../../Core/InputLabel';
import Tooltip from '../../../Core/Tooltip';
import Button from '../../../Core/Button/Button';
import AddHolidays from '../../../Core/Dialog/AddHoliday';
import DeleteIcon from '../../../Icons/DeleteIcon';

export default function Holidays({ styles, holidays }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false)

  const handleClose = () => {
    setOpen(false)
  }
  return (
    <div className={styles.holidays}>
      <div className={styles.labelButtonBlock}>
        <div className={styles.labelBlock}>
          <Label text={t('Holidays')} />
          <Tooltip title={'Add new Holidays'} />
        </div>
        <Button inverse onClick={() => setOpen(true)} >
          {t('+ add new')}
        </Button>
        <AddHolidays
          open={open}
          handleClose={handleClose}
          title={t('New holidays')}
        />
      </div>
      {_.map(holidays, (item) =>
        <div key={item.name} className={styles.holidays__block}>
          <div className={styles.holidays__innerBlock}>
            <div className={styles.holidays_data}>{item.date}</div>
            <div className={styles.holidays_name}>{item.name}</div>
          </div>
          <span className={styles.deleteHoliday}><DeleteIcon fill={"#fd0d1b"} viewBox={'0 0 32 14'} /></span>
        </div>
      )}
    </div>
  )
}