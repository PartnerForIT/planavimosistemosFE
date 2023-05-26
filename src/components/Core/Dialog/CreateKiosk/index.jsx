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
  user_name: '',
  password: '',
  place_id: '',
};
export default ({
  handleClose,
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
  const onClose = () => {
    setFormValues(initialFormValues);
    handleClose();

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
      min_password_length: minLength = 1, numbers = false,
      special_chars: specialChars = false, uppercase = false,
    } = security;

    const error = passwordValidator({
      password, minLength, numbers, specialChars, uppercase,
    });
    nextErrors.password = error.password.message || '';

    return nextErrors;
  }, [formValues, security]);
  const disabled = useMemo(() => !((isEdit || formValues.password)
    && formValues.user_name && formValues.place_id && formValues.name), [formValues, isEdit]);

  return (
    <Dialog
      handleClose={onClose}
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
        <Label text={t('Assign to place')} htmlFor='place_id' />
        <InputSelect
          id='country-select'
          labelId='country-select'
          name='place_id'
          value={formValues.place_id}
          onChange={handleInputChange}
          options={places}
          valueKey='id'
          labelKey='name'
        />
      </div>
      <div className={styles.formControl}>
        <Label text={t('Create a user')} htmlFor='user_name' />
        <Input
          placeholder={t('Enter user name')}
          value={formValues.user_name}
          name='user_name'
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
