import React from "react";
import Dialog from '../index';
import { useTranslation } from 'react-i18next';
import Button from '../../Button/Button';
import Input from '../../Input/Input';
import Label from '../../InputLabel';
import style from '../Dialog.module.scss';

export default function CreatePlace({ handleClose, title, open,
  buttonTitle, createPlace, place, setPlace }) {
  const { t } = useTranslation();

  return (
    <Dialog handleClose={handleClose} open={open} title={title}>
      <div className={style.formControl}>
        <Label text={t('Place name')} htmlFor={"place"} />
        <Input
          placeholder={`${t('Enter Place name')}`}
          value={place}
          name="palce"
          fullWidth
          onChange={(e) => setPlace(e.target.value)}
        />
      </div>
      <div className={style.buttonSaveBlock}>
        <Button disabled={place === ''} onClick={() => createPlace()} fillWidth size='big'>
          {buttonTitle}
        </Button>
      </div>
    </Dialog>
  )
}