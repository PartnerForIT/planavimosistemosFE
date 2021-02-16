import React from 'react';
import { useTranslation } from 'react-i18next';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import Dialog from '../index';
import Button from '../../Button/Button';
import Input from '../../Input/Input';
import Label from '../../InputLabel';

import style from '../Dialog.module.scss';

export default function AddHolidays({
  handleClose, title, open,
  saveAddHoliday, handleDateChange, selectedDate, name, setName,
}) {
  const { t } = useTranslation();

  return (
    <Dialog handleClose={handleClose} open={open} title={title}>
      <Label text={t('Name')} htmlFor='name' />
      <Input
        placeholder={`${t('Enter holiday name')}`}
        value={name}
        name='name'
        fullWidth
        onChange={(e) => setName(e.target.value)}
      />
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <KeyboardDatePicker
          disableToolbar
          fullWidth
          variant='inline'
          format='yyyy-MM-dd'
          margin='normal'
          id='date-picker-inline'
          label='Date'
          value={selectedDate}
          onChange={handleDateChange}
          KeyboardButtonProps={{
            'aria-label': 'change date',
          }}
        />
      </MuiPickersUtilsProvider>
      <div className={style.buttonSaveBlock}>
        <Button
          size='big'
          onClick={() => saveAddHoliday()}
          disabled={name === ''}
        >
          {t('Create Holiday')}
        </Button>
      </div>
    </Dialog>
  );
}
