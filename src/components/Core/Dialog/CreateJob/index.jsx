import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Dialog from '../index';
import Button from '../../Button/Button';
import Input from '../../Input/Input';
import Label from '../../InputLabel';
import style from '../Dialog.module.scss';

export default function CreateJob({
  handleClose, title, open,
  buttonTitle, createJob, initialValue,
}) {
  const { t } = useTranslation();
  const [jobName, setJobName] = useState('');

  useEffect(() => {
    if (initialValue) {
      setJobName(initialValue);
    } else {
      setJobName('');
    }
  }, [initialValue, open]);

  const handleExited = () => {
    setJobName('');
  };
  const onClose = () => {
    setJobName('');
    handleClose();

  };

  return (
    <Dialog handleClose={onClose} onExited={handleExited} open={open} title={title}>
      <div className={style.formControl}>
        <Label text={t('Job name')} htmlFor='name' />
        <Input
          placeholder={`${t('Enter Job name')}`}
          value={jobName}
          name='name'
          fullWidth
          onChange={(e) => setJobName(e.target.value)}
        />
      </div>
      <div className={style.buttonSaveBlock}>
        <Button disabled={jobName === ''} onClick={() => createJob(jobName)} fillWidth size='big'>
          {buttonTitle}
        </Button>
      </div>
    </Dialog>
  );
}
