import React from 'react';
import { useTranslation } from 'react-i18next';
import Dialog from '../index';
import Button from '../../Button/Button';
import Input from '../../Input/Input';
import Label from '../../InputLabel';
import style from '../Dialog.module.scss';

export default function AddEditGroup({
  handleClose, title, open,
  buttonTitle, setGroupName, groupName, handleOk, oldGroupName = '',
}) {
  const { t } = useTranslation();

  return (
    <Dialog handleClose={handleClose} open={open} title={title}>
      <div className={style.formControl}>
        {
          oldGroupName
          && <p className={style.subtitle}>{oldGroupName}</p>
        }
        <Label text={t('Group name')} htmlFor='name' />
        <Input
          placeholder={`${t('Enter group name')}`}
          name='name'
          value={groupName}
          fullWidth
          onChange={(e) => setGroupName(e.target.value)}
        />
      </div>
      <div className={style.buttonBlock}>
        <Button
          disabled={!groupName}
          onClick={() => {
            handleOk(groupName);
            handleClose();
          }}
          fillWidth
          size='big'
        >
          {buttonTitle}
        </Button>
      </div>
    </Dialog>
  );
}
