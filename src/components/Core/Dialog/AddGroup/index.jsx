import React from 'react';
import { useTranslation } from 'react-i18next';
import Dialog from '../index';
import Button from '../../Button/Button';
import Input from '../../Input/Input';
import Label from '../../InputLabel';
import style from '../Dialog.module.scss';

export default function AddGroup({
  handleClose, title, open,
  buttonTitle, setGroupName, groupName, addNewGroup,
}) {
  const { t } = useTranslation();

  return (
    <Dialog handleClose={handleClose} open={open} title={title}>
      <div className={style.formControl}>
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
            addNewGroup(groupName);
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
