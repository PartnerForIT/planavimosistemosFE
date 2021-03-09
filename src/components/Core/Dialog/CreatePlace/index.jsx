import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Dialog from '../index';
import Button from '../../Button/Button';
import Input from '../../Input/Input';
import Label from '../../InputLabel';
import style from '../Dialog.module.scss';

export default function CreatePlace({
  handleClose, title, open,
  buttonTitle, createPlace, initialValue,
}) {
  const { t } = useTranslation();
  const [placeName, setPlaceName] = useState('');

  useEffect(() => {
    if (initialValue) {
      setPlaceName(initialValue);
    }
  }, [initialValue]);

  return (
    <Dialog handleClose={handleClose} open={open} title={title}>
      <div className={style.formControl}>
        <Label text={t('Place name')} htmlFor='place' />
        <Input
          placeholder={`${t('Enter Place name')}`}
          value={placeName}
          name='palce'
          fullWidth
          onChange={(e) => setPlaceName(e.target.value)}
        />
      </div>
      <div className={style.buttonSaveBlock}>
        <Button disabled={placeName === ''} onClick={() => createPlace(placeName)} fillWidth size='big'>
          {buttonTitle}
        </Button>
      </div>
    </Dialog>
  );
}
