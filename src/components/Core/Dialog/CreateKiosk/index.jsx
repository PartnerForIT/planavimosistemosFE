import React, { useMemo, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { isEmpty } from 'lodash';

import Dialog from '../index';
import Button from '../../Button/Button';
import Input from '../../Input/Input';
import Label from '../../InputLabel';
import styles from './CreateKiosk.module.scss';
import InputSelect from '../../InputSelect';
import passwordValidator from '../../../Helpers/passwordValidator';

const initialFormValues = {
  name: '',
  user: '',
  password: '',
  place: '',
};
export default ({
  handleClose,
  title,
  open,
  onSubmit,
  initialValues,
  security,
  places,
}) => {
  const { t } = useTranslation();
  const [formValues, setFormValues] = useState(initialFormValues);
  const [isEdit, setIsEdit] = useState(false);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prevState) => ({ ...prevState, [name]: value }));
  };
  const handleExited = () => {
    setFormValues(initialFormValues);
    setIsEdit(false);
  };

  useEffect(() => {
    if (!isEmpty(initialValues)) {
      setFormValues((prevState) => ({
        ...prevState,
        ...initialValues,
      }));
      setIsEdit(true);
    }
  }, [initialValues]);

  const errors = useMemo(() => {
    const nextErrors = {};
    const { password } = formValues;

    const {
      min_password_length: minLength = 8, numbers = false,
      special_chars: specialChars = true, uppercase = true,
    } = security;

    const error = passwordValidator({
      password, minLength, numbers, specialChars, uppercase,
    });
    nextErrors.password = error.password.message || '';

    return nextErrors;
  }, [formValues, security]);
  const disabled = useMemo(() => {
    return !((isEdit || formValues.password) && formValues.user && formValues.place && formValues.name);
  }, [formValues, isEdit]);

  return (
    <Dialog
      handleClose={handleClose}
      onExited={handleExited}
      open={open}
      title={isEdit ? t('Edit kiosk') : t('New kiosk')}
    >
      <div className={styles.formControl}>
        <Label text={t('Name')} htmlFor='name' />
        <Input
          placeholder={t('Enter kiosk name')}
          value={formValues.name}
          name='name'
          fullWidth
          onChange={handleInputChange}
        />
      </div>
      <div className={styles.formControl}>
        <Label text={t('Assign to place')} htmlFor='place' />
        <InputSelect
          id='country-select'
          labelId='country-select'
          name='place'
          value={formValues.place}
          onChange={handleInputChange}
          options={places}
          valueKey='id'
          labelKey='name'
        />
      </div>
      <div className={styles.formControl}>
        <Label text={t('Create a user')} htmlFor='user' />
        <Input
          placeholder={t('Enter user name')}
          value={formValues.user}
          name='user'
          fullWidth
          onChange={handleInputChange}
        />
      </div>
      {
        !isEdit && (
          <div className={styles.formControl}>
            <Label text={t('Create a password')} htmlFor='password' />
            <Input
              placeholder={t('Enter password')}
              value={formValues.password}
              name='password'
              fullWidth
              onChange={handleInputChange}
            />
            {
              errors.password && (
                <small className={styles.error}>{t(errors.password)}</small>
              )
            }
          </div>
        )
      }
      <div className={styles.buttonSaveBlock}>
        <Button
          disabled={disabled}
          onClick={() => onSubmit(formValues)}
          fillWidth
          size='big'
        >
          {isEdit ? t('Update Kiosk') : t('Create Kiosk')}
        </Button>
      </div>
    </Dialog>
  );
};
