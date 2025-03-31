import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Dialog from '../index';
import Button from '../../Button/Button';
import Input from '../../Input/Input';
import Label from '../../InputLabel';
import styles from './EditRFID.module.scss';

const initialFormValues = {
  rfid: '',
};
export default ({
  handleClose,
  title,
  open,
  currentRFID,
  onSubmit,
}) => {
  const { t } = useTranslation();
  const [formValues, setFormValues] = useState(initialFormValues);

  const handleExited = () => {
    setFormValues(initialFormValues);
  };

  const onClose = () => {
    setFormValues(initialFormValues);
    handleClose();
  }

  useEffect(() => {
    if (currentRFID) {
      setFormValues({
        rfid: currentRFID,
      });
    } else {
      setFormValues(initialFormValues);
    }
  }, [currentRFID]);

  return (
    <Dialog handleClose={onClose} onExited={handleExited} open={open} title={title}>
      <div className={styles.formControl}>
        <Label text={t('Current RFID number')} htmlFor='rfid' />
        <Input
          value={formValues.rfid}
          onChange={e => setFormValues({ ...formValues, rfid: e.target.value })}
          name='rfid'
          fullWidth
        />
      </div>
      <div className={styles.buttonSaveBlock}>
        <Button
          disabled={!(formValues.rfid)}
          onClick={() => { onSubmit(formValues); handleExited() }}
          fillWidth
          size='big'
        >
          {t('Change RFID number')}
        </Button>
      </div>
    </Dialog>
  );
};
