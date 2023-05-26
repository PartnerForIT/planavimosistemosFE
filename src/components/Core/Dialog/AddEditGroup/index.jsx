import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Dialog from '../index';
import Button from '../../Button/Button';
import Input from '../../Input/Input';
import Label from '../../InputLabel';
import style from '../Dialog.module.scss';

const initialFormValues = {
  name: '',
  external_id: '',
};

export default ({
  handleClose,
  title,
  open,
  buttonTitle,
  onSubmit = Function.prototype,
  placeholder,
  initialValues,
}) => {
  const { t } = useTranslation();
  const [formValues, setFormValues] = useState(initialFormValues);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prevState) => ({ ...prevState, [name]: value }));
  };
  const handleExited = () => {
    setFormValues(initialFormValues);

  };
  const onClose = () => {
    setFormValues(initialFormValues);
    handleClose();

  };
  useEffect(() => {
    if (initialValues) {
      setFormValues({
        ...initialValues,
      });
    }
  }, [initialValues]);

  return (
    <Dialog
      handleClose={onClose}
      onExited={handleExited}
      open={open}
      title={title}
    >
      <div className={style.formControl}>
        <Label text={t('Enter group name')} htmlFor='name' />
        <Input
          placeholder={placeholder}
          value={formValues.name}
          name='name'
          fullWidth
          onChange={handleInputChange}
        />
      </div>

      <div className={style.formControl}>
        <Label text={t('External ID')} htmlFor='external_id' />
        <Input
          placeholder={placeholder}
          value={formValues.external_id}
          name='external_id'
          fullWidth
          onChange={handleInputChange}
        />
      </div>

      <div className={style.buttonSaveBlock}>
        <Button
          disabled={!formValues.name || !formValues.name.trim()}
          onClick={() => onSubmit(formValues)}
          fillWidth
          size='big'
        >
          {buttonTitle}
        </Button>
      </div>
    </Dialog>
  );
};
