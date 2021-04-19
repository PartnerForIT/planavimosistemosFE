import React, { useEffect, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import Dialog from '../index';
import Button from '../../Button/Button';
import Input from '../../Input/Input';
import Label from '../../InputLabel';
import passwordValidator from '../../../Helpers/passwordValidator';
import styles from './EditPasswordKiosk.module.scss';

const initialFormValues = {
  repeatPassword: '',
  password: '',
};
export default ({
  handleClose,
  title,
  open,
  initialValues,
  currentPassword,
  security,
  onSubmit,
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

  useEffect(() => {
    if (initialValues) {
      setFormValues({
        ...initialValues,
      });
    }
  }, [initialValues]);

  const errors = useMemo(() => {
    const nextErrors = {};
    const { repeatPassword, password } = formValues;

    const {
      min_password_length: minLength = 8, numbers = false,
      special_chars: specialChars = true, uppercase = true,
    } = security;

    const error = passwordValidator({
      password, minLength, numbers, specialChars, uppercase,
    });
    nextErrors.password = error.password.message || '';

    if (!!password.trim() && !!repeatPassword.trim() && repeatPassword !== password) {
      nextErrors.repeatPassword = 'Passwords do not match';
    }

    return nextErrors;
  }, [formValues, security]);

  return (
    <Dialog handleClose={handleClose} onExited={handleExited} open={open} title={title}>
      <div className={styles.formControl}>
        <Label text={t('Current password')} htmlFor='current_password' />
        <Input
          placeholder={t('Enter kiosk name')}
          value={currentPassword}
          name='current_password'
          fullWidth
          disabled
        />
      </div>
      <div className={styles.hr} />
      <div className={styles.sectionTitle}>
        {t('Change password')}
      </div>
      <div className={styles.hr} />
      <div className={styles.formControl}>
        <Label text={t('Enter new password')} htmlFor='password' />
        <Input
          placeholder={t('Enter new password')}
          value={formValues.password}
          name='password'
          fullWidth
          onChange={handleInputChange}
          autoComplete='new-password'
          type='password'
        />
        {
          errors.password && (
            <small className={styles.error}>{t(errors.password)}</small>
          )
        }
      </div>
      <div className={styles.formControl}>
        <Label text={t('Re-enter new password')} htmlFor='repeatPassword' />
        <Input
          placeholder={t('Re-enter new password')}
          value={formValues.repeatPassword}
          name='repeatPassword'
          fullWidth
          onChange={handleInputChange}
          autoComplete='new-password'
          type='password'
        />
        {
          errors.repeatPassword
          && <small className={styles.error}>{t(errors.repeatPassword)}</small>
        }
      </div>
      <div className={styles.buttonSaveBlock}>
        <Button
          disabled={!(formValues.repeatPassword && formValues.password && !errors.password && !errors.repeatPassword)}
          onClick={() => onSubmit(formValues)}
          fillWidth
          size='big'
        >
          {t('Change password')}
        </Button>
      </div>
    </Dialog>
  );
};
