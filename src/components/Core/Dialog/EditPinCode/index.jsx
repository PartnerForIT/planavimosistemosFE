import React, { useEffect, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import Dialog from '../index';
import Button from '../../Button/Button';
import Input from '../../Input/Input';
import Label from '../../InputLabel';
import styles from './EditPinCode.module.scss';

const initialFormValues = {
  repeatPinCode: '',
  pinCode: '',
};
export default ({
  handleClose,
  title,
  open,
  initialValues,
  currentPinCode,
  onSubmit,
  loading,
  generatePinCode,
  generatedPinCode,
}) => {
  const { t } = useTranslation();
  const [formValues, setFormValues] = useState(initialFormValues);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prevState) => ({ ...prevState, [name]: value }));
  };
  const handleExited = () => {
    setFormValues(initialFormValues);
  };
  const onGeneratePinCode = () => {
    generatePinCode();
  };
  const onClose = () => {
    setFormValues(initialFormValues);
    handleClose();
  }

  useEffect(() => {
    if (initialValues) {
      setFormValues({
        ...initialValues,
      });
    } else {
      setFormValues(initialFormValues);
    }
  }, [initialValues]);
  useEffect(() => {
    if (generatedPinCode) {
      setFormValues((prevState) => ({
        ...prevState,
        pinCode: generatedPinCode,
        repeatPinCode: generatedPinCode,
      }));
    }
  }, [generatedPinCode]);

  const errors = useMemo(() => {
    const nextErrors = {};
    const { repeatPinCode, pinCode } = formValues;

    if (!!pinCode.trim() && !!repeatPinCode.trim() && repeatPinCode !== pinCode) {
      nextErrors.repeatPinCode = 'Pin code do not match';
    }

    return nextErrors;
  }, [formValues]);

  return (
    <Dialog handleClose={onClose} onExited={handleExited} open={open} title={title}>
      <div className={styles.formControl}>
        <Label text={t('Current PIN')} htmlFor='current_pin_code' />
        <Input
          value={currentPinCode}
          name='current_pin_code'
          fullWidth
          disabled
        />
      </div>
      <div className={styles.hr} />
      <div className={styles.sectionTitle}>
        {t('Change PIN')}
        <Button
          onClick={onGeneratePinCode}
          fillWidth
          size='big'
          loading={loading}
        >
          {t('Generate')}
        </Button>
      </div>
      <div className={styles.hr} />
      <div className={styles.formControl}>
        <Label text={t('Enter new PIN (4 digits)')} htmlFor='pinCode' />
        <Input
          placeholder={t('Enter new 4 digit PIN code')}
          value={formValues.pinCode}
          name='pinCode'
          fullWidth
          onChange={handleInputChange}
          maxLength={4}
        />
      </div>
      <div className={styles.formControl}>
        <Label text={t('Re-enter new PIN code (4 digits)')} htmlFor='repeatPinCode' />
        <Input
          placeholder={t('Re-enter new 4 digit PIN code')}
          value={formValues.repeatPinCode}
          name='repeatPinCode'
          fullWidth
          onChange={handleInputChange}
          maxLength={4}
        />
        {
          errors.repeatPinCode && (
            <small className={styles.error}>
              {t(errors.repeatPinCode)}
            </small>
          )
        }
      </div>
      <div className={styles.buttonSaveBlock}>
        <Button
          disabled={!(formValues.repeatPinCode && formValues.pinCode && !errors.repeatPinCode)}
          onClick={() => { onSubmit(formValues); handleExited() }}
          fillWidth
          size='big'
        >
          {t('Change PIN code')}
        </Button>
      </div>
    </Dialog>
  );
};
