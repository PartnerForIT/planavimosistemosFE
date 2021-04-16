import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Dialog from '../index';
import Button from '../../Button/Button';
import Input from '../../Input/Input';
import Label from '../../InputLabel';
import style from '../Dialog.module.scss';

const initialFormValues = {
  name: '',
  user: '',
  password: '',
};
export default ({
  handleClose,
  title,
  open,
  buttonTitle,
  createSkill,
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

  useEffect(() => {
    if (initialValues) {
      setFormValues({
        ...initialValues,
        use_rates: Boolean(initialValues.use_rates),
      });
    }
  }, [initialValues]);

  return (
    <Dialog handleClose={handleClose} onExited={handleExited} open={open} title={title}>
      <div className={style.formControl}>
        <Label text={t('Name')} htmlFor='name' />
        <Input
          placeholder={t('Enter kiosk name')}
          value={formValues.name}
          name='name'
          fullWidth
          onChange={handleInputChange}
        />
      </div>
      <div className={style.formControl}>
        <Label text={t('Create a user')} htmlFor='user' />
        <Input
          placeholder={t('Enter user name')}
          value={formValues.user}
          name='user'
          fullWidth
          onChange={handleInputChange}
        />
      </div>
      <div className={style.formControl}>
        <Label text={t('Create a password')} htmlFor='password' />
        <Input
          placeholder={t('Enter password')}
          value={formValues.password}
          name='password'
          fullWidth
          onChange={handleInputChange}
        />
      </div>
      <div className={style.buttonSaveBlock}>
        <Button
          disabled={formValues.name === ''}
          onClick={() => createSkill(formValues)}
          fillWidth
          size='big'
        >
          {buttonTitle}
        </Button>
      </div>
    </Dialog>
  );
};
