/* eslint-disable max-len */
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TextField } from '@material-ui/core';
import classnames from 'classnames';
import Dialog from '../index';
import Button from '../../Button/Button';
import Input from '../../Input/Input';
import style from '../Dialog.module.scss';
import classes from './ImportAccounts.module.scss';
import Label from '../../InputLabel';
import DataTable from '../../DataTableCustom/OLT';
import CurrencySign from '../../../shared/CurrencySign';
import StyledCheckbox from '../../Checkbox/Checkbox';
import OverView from './OverView';

const LabelWithCurrencySign = ({ text }) => (
  <>
    {text}
    <CurrencySign />
  </>
);

const columns = [

  {
    label: 'Status',
    field: 'status',
    checked: true,
  },
  {
    label: 'Employee',
    field: 'name',
    checked: true,
  },
  {
    label: 'Role',
    field: 'role',
    checked: true,
  },
  {
    label: 'Email',
    field: 'email',
    checked: true,
  },
  {
    label: 'Skill',
    field: 'skills',
    checked: true,
  },
  {
    label: 'Group',
    field: 'groups',
    checked: true,
  },
  {
    label: 'Sub-group',
    field: 'subgroup',
    checked: true,
  },
  {
    label: 'Assigned Place',
    field: 'place',
    checked: true,
  },
  {
    label: <LabelWithCurrencySign text='Cost/h/' />,
    field: 'cost',
    checked: true,
  },
  {
    label: <LabelWithCurrencySign text='Charge/h/' />,
    field: 'charge',
    checked: true,
  },
  {
    label: 'Created on',
    field: 'created_at',
    checked: true,
  },
  {
    label: 'Status change',
    field: 'updated_at',
    checked: true,
  },
];

export default function ImportAccounts({
  handleClose,
  title,
  open,
}) {
  const { t } = useTranslation();

  const [file, setFile] = useState('');
  const [data, setData] = useState([]);

  const example = `${t('status')};${t('name')};${t('surname')};${t('role')};${t('email')};${t('skill')};${t('group')};${t('sub-group')};${t('assigned_place')};
${t('EXAMPLE')}: ${t('active')};John;Doe;${t('manager')};example@email.com;${t('test') + t('group')};${t('test') + t('subgroup') + t('name')};${t('Test') + t('Place')};`;

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

        <div className={classnames(style.formControl, classes.importTable)}>
          <DataTable
            data={data}
            columns={columns ?? []}
            verticalOffset='55vh'
          />
          {
            !data.length
            && <OverView />
          }
          {
            //   loader?
          }
        </div>
        <div className={style.formControl}>
          <StyledCheckbox label={t('Create missing Role, Skill, Group, Sub-Group, Place')} />
          <StyledCheckbox label={t('Ignore empty values')} />
        </div>
        <div className={style.buttonBlock} />
      </div>
    </Dialog>
  );
}
