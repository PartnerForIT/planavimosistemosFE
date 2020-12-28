import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TextField } from '@material-ui/core';
import Dialog from '../index';
import Button from '../../Button/Button';
import Input from '../../Input/Input';
import style from '../Dialog.module.scss';
import classes from './ImportAccounts.module.scss';
import Label from '../../InputLabel';

const example = `status;name;surname;role;email;skill;group;sub-group;assigned_place;
EXAMPLE: active;John;Doe;manager;example@email.com;testgroup;testsubgroupname;TestPlace;`;

export default function ImportAccounts({
  handleClose,
  title,
  open,
}) {
  const { t } = useTranslation();

  const [file, setFile] = useState('');

  return (
    <Dialog handleClose={handleClose} open={open} title={title}>
      <div className={classes.inner}>

        {/* import CSV */}
        <div className={style.formControl}>
          <Label htmlFor='text' text={t('Company name')} />
          <div className={classes.import}>
            <Input type='text' fullWidth disabled value={file} />
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <label className={classes.upload}>
              <input
                type='file'
                onChange={(e) => {
                  const fileName = e.target.files[0]?.name;
                  if (fileName) {
                    setFile(fileName);
                  }
                }}
              />
              {t('Select file')}
            </label>

            <Button size='medium'>{t('Upload')}</Button>
          </div>
        </div>

        {/* Example of CSV file contents */}
        <div className={style.formControl}>
          <Label text={t('Example of CSV file contents')} />
          <textarea disabled value={example} className={classes.textarea} />
        </div>

        <div className={style.formControl}>
          <table />
        </div>

        <div className={style.buttonBlock} />
      </div>
    </Dialog>
  );
}
