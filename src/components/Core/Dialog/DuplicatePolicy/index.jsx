import React, { useState, useEffect } from 'react';
import Dialog from '../index';
import Button from '../../Button/Button';
import Input from '../../Input/Input';
import Label from '../../InputLabel';
import Switch from 'react-switch';
import style from '../Dialog.module.scss';
import { useTranslation } from 'react-i18next';

const defaultValues = {
  name: '',
  duplicate_employee: true,
};

export default ({
  handleClose,
  title,
  open,
  buttonTitle,
  onSubmit = Function.prototype,
}) => {
  const { t } = useTranslation();
  const [values, setValues] = useState(defaultValues);

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };
  const handleSubmit = () => {
    onSubmit(values);
  };
  const handleExited = () => {
    setValues(defaultValues);
  };
  const onClose = () => {
    setValues(defaultValues);
    handleClose();
  };

  useEffect(() => {
    setValues(defaultValues);
  }, [open]);

  return (
    <Dialog
      handleClose={onClose}
      onExited={handleExited}
      open={open}
      title={title}
    >
      <div className={style.formControl}>
        <Label text={t('Name for duplicate')} htmlFor='name' />
        <Input
          placeholder={t('Enter new name')}
          value={values.name}
          name='name'
          fullWidth
          onChange={handleChange}
        />
      </div>
      <div className={style.formCheckbox}>
        <Switch
          onChange={(checked) => { setValues({ ...values, duplicate_employee: checked }); }}
          offColor='#808F94'
          onColor='#0085FF'
          uncheckedIcon={false}
          checkedIcon={false}
          checked={values.duplicate_employee || false}
          height={21}
          width={40}
        />
        <Label text={t('Duplicate employee assignation')} />
      </div>
      <div className={style.buttonSaveBlock}>
        <Button
          disabled={!values?.name.trim()}
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
