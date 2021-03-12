import React from 'react';
import Dialog from '../index';
import Button from '../../Button/Button';
import Input from '../../Input/Input';
import Label from '../../InputLabel';
import style from '../Dialog.module.scss';

export default ({
  handleClose, title, open,
  buttonTitle,
  onSubmit = Function.prototype,
  setName = Function.prototype,
  name = '',
  label,
  placeholder,
}) => (
  <Dialog handleClose={handleClose} open={open} title={title}>
    <div className={style.formControl}>
      <Label text={label} htmlFor='name' />
      <Input
        placeholder={placeholder}
        value={name}
        name='name'
        fullWidth
        onChange={(e) => setName(e.target.value)}
      />
    </div>
    <div className={style.buttonSaveBlock}>
      <Button
        disabled={!name.trim()}
        onClick={onSubmit}
        fillWidth
        size='big'
      >
        {buttonTitle}
      </Button>
    </div>
  </Dialog>
);
