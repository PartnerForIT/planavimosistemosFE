import React from 'react';
import { useTranslation } from 'react-i18next';
import Dialog from '../index';
import Button from '../../Button/Button';
import Input from '../../Input/Input';
import Label from '../../InputLabel';
import style from '../Dialog.module.scss';

export default function CreateJob({
  handleClose, title, open,
  buttonTitle, createJob, job, setJob,
}) {
  const { t } = useTranslation();

  return (
    <Dialog handleClose={handleClose} open={open} title={title}>
      <div className={style.formControl}>
        <Label text={t('Job name')} htmlFor='name' />
        <Input
          placeholder={`${t('Enter Job name')}`}
          value={job}
          name='name'
          fullWidth
          onChange={(e) => setJob(e.target.value)}
        />
      </div>
      <div className={style.buttonSaveBlock}>
        <Button disabled={job === ''} onClick={() => createJob()} fillWidth size='big'>
          {buttonTitle}
        </Button>
      </div>
    </Dialog>
  );
}
