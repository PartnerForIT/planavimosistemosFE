import React from 'react';
import { useTranslation } from 'react-i18next';
import Dialog from '../index';
import Button from '../../Button/Button';
import Input from '../../Input/Input';
import Label from '../../InputLabel';
import style from '../Dialog.module.scss';

export default function AddEditSubgroup({
  handleClose, title, open,
  buttonTitle, setName, name, handleOk, selectedGroup = {},
  edit = false,
}) {
  const { t } = useTranslation();

  return (
    <Dialog handleClose={handleClose} open={open} title={title}>
      <div className={style.formControl}>
        {
         edit && selectedGroup.name
          && <p className={style.subtitle}>{selectedGroup.name}</p>
        }
        <Label text={t('Sub-group name')} htmlFor='name' />
        <Input
          placeholder={`${t('Enter sub-group name')}`}
          name='name'
          value={edit ? selectedGroup.name ?? '' : name}
          fullWidth
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className={style.buttonSaveBlock}>
        <Button
          disabled={!name}
          onClick={() => {
            handleOk({ name, parentGroupId: selectedGroup.id });
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
