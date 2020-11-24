import React, { useState } from "react";
import Dialog from '../index';
import { useTranslation } from 'react-i18next';
import Button from '../../Button/Button';
import Input from '../../Input/Input';
import Label from '../../InputLabel';
import style from '../Dialog.module.scss';

export default function AddHolidays({ handleClose, title, open, saveAddHoliday }) {
  const { t } = useTranslation();
  const [name, setName] = useState('');

  return (
    <Dialog handleClose={handleClose} open={open} title={title}>
      <Label text={t('Name')} htmlFor={"name"} />
      <Input
        placeholder={`${t('Enter holiday name')}`}
        value={name}
        name="name"
        fullWidth
        onChange={(e) => setName(e.target.value)}
      />
      <div className={style.buttonSaveBlock}>
        <Button size="big" onClick={() => saveAddHoliday()}>{t('Create Holiday')}</Button>
      </div>
    </Dialog>
  )
}