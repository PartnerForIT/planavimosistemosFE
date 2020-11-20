import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Label from '../../../Core/InputLabel';
import Tooltip from '../../../Core/Tooltip';
import Button from '../../../Core/Button/Button';
import AddHolidays from '../../../Core/Dialog/AddHoliday'

export default function Holidays({ styles }) {
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
    </div>
  )
}