/* eslint-disable camelcase */
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import _ from 'lodash';
import Dialog from '../index';
import Button from '../../Button/Button';
import Input from '../../Input/Input';
import Label from '../../InputLabel';
import style from '../Dialog.module.scss';
import passwordValidator from '../../../Helpers/passwordValidator';

export default function EditPassword({
  handleClose, title, open, passwords = '', setPasswords = () => ({}),
  buttonTitle = '', onSubmit = () => ({}),
  security = {},
}) {
  const { t } = useTranslation();

  const handleChange = (event) => {
    const { target: { name, value } } = event;

    setPasswords((prevState) => ({
      ...prevState,
      [name]: value.trim(),
    }));
  };

  const [disabled, setDisabled] = useState(true);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const { current, password, repeatPassword } = passwords;

    if (!current.trim()) {
      setDisabled(true);
    } else if (!!password.trim() && !!repeatPassword.trim()) {
      if (password === repeatPassword) {
        setErrors((prevState) => ({
          ...prevState, repeatPassword: {},
        }));
        setDisabled(false);
      } else {
        setErrors((prevState) => ({
          ...prevState, repeatPassword: { message: 'Passwords do not match' },
        }));
        setDisabled(true);
      }
    } else {
      setDisabled(true);
    }
    return () => setDisabled(true);
  }, [disabled, passwords]);

  useEffect(() => {
    const { password } = passwords;
    const {
      min_password_length: minLength = 8, numbers = false,
      special_chars: specialChars = true, uppercase = true,
    } = security;

    const error = passwordValidator({
      password, minLength, numbers, specialChars, uppercase,
    });

    setErrors((prevState) => ({
      ...prevState,
      ...error,
    }));
  }, [passwords, security]);

  return (
    <Dialog handleClose={handleClose} open={open} title={title}>
      <div style={{ maxWidth: 300 }}>
        <div className={style.formControl}>
          <Label text={t('Current password')} htmlFor='current' />
          <Input
            placeholder={`${t('Enter current password')}`}
            value={passwords.current}
            name='current'
            fullWidth
            type='password'
            autoComplete='current-password'
            onChange={handleChange}
          />
        </div>
        <div className={style.formControl}>
          <div className={style.border} />
        </div>
        <div className={style.formControl}>
          <Label text={t('New password')} htmlFor='new' />
          <Input
            placeholder={`${t('Enter new password')}`}
            value={passwords.new}
            type='password'
            name='password'
            fullWidth
            autoComplete='new-password'
            onChange={handleChange}
          />
          <small className='error'>{t(errors.password?.message)}</small>
        </div>
        <div className={style.formControl}>
          <Label text={t('Repeat new password')} htmlFor='repeatNew' />
          <Input
            placeholder={`${t('Enter new password again')}`}
            value={passwords.repeatPassword}
            name='repeatPassword'
            type='password'
            fullWidth
            onChange={handleChange}
            autoComplete='new-password'
          />
          {
              errors.repeatPassword
              && <small className='error'>{t(errors.repeatPassword?.message)}</small>
          }
        </div>
        <div className={style.buttonSaveBlock}>
          <Button
            disabled={disabled}
            onClick={!disabled && _.isEmpty(errors.password)
            && _.isEmpty(errors.repeatPassword) ? onSubmit : () => ({})}
            fillWidth
            size='big'
          >
            {buttonTitle}
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
