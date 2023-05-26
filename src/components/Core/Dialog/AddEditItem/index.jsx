import React, { useState } from 'react';
import Dialog from '../index';
import Button from '../../Button/Button';
import Input from '../../Input/Input';
import Label from '../../InputLabel';
import style from '../Dialog.module.scss';

export default ({
  handleClose,
  title,
  open,
  buttonTitle,
  onSubmit = Function.prototype,
  label,
  placeholder,
  initialValue,
}) => {
  const [value, setValue] = useState('');

  const handleChange = (e) => {
    setValue(e.target.value);
  };
  const handleSubmit = () => {
    onSubmit(value || initialValue);
  };
  const handleExited = () => {
    setValue('');
  };
  const onClose = () => {
    setValue('');
    handleClose();

  };

  return (
    <Dialog
      handleClose={onClose}
      onExited={handleExited}
      open={open}
      title={title}
    >
      <div className={style.formControl}>
        <Label text={label} htmlFor='name' />
        <Input
          placeholder={placeholder}
          value={value || initialValue}
          name='name'
          fullWidth
          onChange={handleChange}
        />
      </div>
      <div className={style.buttonSaveBlock}>
        <Button
          disabled={!value.trim()}
          onClick={handleSubmit}
          fillWidth
          size='big'
        >
          {buttonTitle}
        </Button>
      </div>
    </Dialog>
  );
};
