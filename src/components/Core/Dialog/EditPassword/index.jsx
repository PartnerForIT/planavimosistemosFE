import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Dialog from '../index';
import Button from '../../Button/Button';
import Input from '../../Input/Input';
import Label from '../../InputLabel';
import style from '../Dialog.module.scss';

export default function EditPassword({
  handleClose, title, open, passwords = '', setPasswords = () => ({}),
  buttonTitle = '', onSubmit = () => ({}),
}) {
  const { t } = useTranslation();

  const handleChange = (event) => {
    const { target: { name, value } } = event;

    setPasswords((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const [disabled, setDisabled] = useState(true);

  useEffect(() => {
    if (!passwords.current.trim()) {
      setDisabled(true);
    } else if (!!passwords.new.trim() && !!passwords.repeatNew.trim() && passwords.new !== passwords.repeat) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
    return () => setDisabled(true);
  }, [disabled, passwords]);

  return (
    <Dialog handleClose={handleClose} open={open} title={title}>
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
          name='new'
          fullWidth
          autoComplete='new-password'
          onChange={handleChange}
        />
      </div>
      <div className={style.formControl}>
        <Label text={t('Repeat new password')} htmlFor='repeatNew' />
        <Input
          placeholder={`${t('Enter new password again')}`}
          value={passwords.repeatNew}
          name='repeatNew'
          type='password'
          fullWidth
          onChange={handleChange}
          autoComplete='new-password'
        />
      </div>
      <div className={style.buttonSaveBlock}>
        <Button
          disabled={disabled}
          onClick={!disabled ? onSubmit : () => ({})}
          fillWidth
          size='big'
        >
          {buttonTitle}
        </Button>
      </div>
    </Dialog>
  );
}
