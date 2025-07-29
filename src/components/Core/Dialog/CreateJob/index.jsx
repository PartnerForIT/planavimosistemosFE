import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Dialog from '../index';
import Button from '../../Button/Button';
import Input from '../../Input/Input';
import Label from '../../InputLabel';
import style from '../Dialog.module.scss';

export default function CreateJob({
  handleClose, title, open,
  buttonTitle, createJob, initialValues, permissions,
}) {
  const { t } = useTranslation();
  const [values, setValues] = useState({});

  useEffect(() => {
    if (initialValues) {
      setValues(initialValues);
    } else {
      setValues({});
    }
  }, [initialValues, open]);

  const handleExited = () => {
    setValues({});
  };
  const onClose = () => {
    setValues({});
    handleClose();

  };

  return (
    <Dialog handleClose={onClose} onExited={handleExited} open={open} title={title}>
      <div className={style.formControl}>
        <Label text={t('Job name')} htmlFor='name' />
        <Input
          placeholder={`${t('Enter Job name')}`}
          value={values.title || ''}
          name='title'
          fullWidth
          onChange={(e) => setValues({ ...values, title: e.target.value })}
        />
      </div>
      {
        permissions.use_job_value && (
          <div className={style.formControl}>
            <Label text={t(`Value`)} htmlFor='value' />
            <Input
              placeholder={`${t('Value')}`}
              value={values.value || ''}
              name='value'
              fullWidth
              onChange={(e) => setValues({ ...values, value: e.target.value })}
            />
          </div>
        )
      }
      <div className={style.buttonSaveBlock}>
        <Button disabled={values.title === ''} onClick={() => createJob(values)} fillWidth size='big'>
          {buttonTitle}
        </Button>
      </div>
    </Dialog>
  );
}
