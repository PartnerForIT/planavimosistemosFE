import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Dialog from '../index';
import style from '../Dialog.module.scss';
import Button from '../../Button/Button';
import Input from '../../Input/Input';

function EditActivity({
  handleClose,
  title,
  open,
  buttonTitle,
  submit,
  currentBalance
}) {
  const { t } = useTranslation();
  const [balance, setBalance] = useState(currentBalance || '');
  const handleChange = (e) => {
    setBalance(e.target.value); 
  };

  useEffect(() => {
    setBalance(currentBalance || '');
  }, [currentBalance]);

  return (
    <Dialog handleClose={handleClose} open={open} title={title} maxWidth='sm'>
      <div className={style.balanceInput}>
        <Input
          name="balance"
          value={balance}
          onChange={handleChange}
          type="number"
          required
          autoFocus
        />
      </div>
      <div className={style.buttonsBlock}>
        <Button
          disabled={false}
          onClick={() => handleClose()}
          size='big'
          cancel
          fillWidth
        >
          {t('Cancel')}
        </Button>
        <Button
          onClick={() => {
            submit({ balance });
            handleClose();
          }}
          size='big'
          primary
          fillWidth
        >
          {buttonTitle}
        </Button>
      </div>
    </Dialog>
  );
}

export default EditActivity;
