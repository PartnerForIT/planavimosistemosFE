import React from 'react';
import { useTranslation } from 'react-i18next';
import Dialog from '../index';
import Button from '../../Button/Button';
import Input from '../../Input/Input';
import Label from '../../InputLabel';
import style from '../Dialog.module.scss';

export default function AddRole({
  handleClose, title, open,
  buttonTitle, roleName, setRoleName, createRole,
}) {
  const { t } = useTranslation();

  return (
    <Dialog handleClose={handleClose} open={open} title={title}>
      <div className={style.formControl}>
        <Label text={t('Role name')} htmlFor='name' />
        <Input
          placeholder={`${t('Enter role name')}`}
          value={roleName}
          name='name'
          fullWidth
          onChange={(e) => setRoleName(e.target.value)}
        />
      </div>
      <div className={style.buttonSaveBlock}>
        <Button disabled={!roleName.trim()} onClick={() => createRole()} fillWidth size='big'>
          {buttonTitle}
        </Button>
      </div>
    </Dialog>
  );
}
