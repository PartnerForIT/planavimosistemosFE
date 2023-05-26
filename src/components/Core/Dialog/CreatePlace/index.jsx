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

export default function CreatePlace({
  permissions, handleClose, title, open,
  buttonTitle, createPlace, initialValues
}) {
  const { t } = useTranslation();
  const [formValues, setFormValues] = useState(initialFormValues);

  const handlePlaceChange = (event) => {
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
    <Dialog handleClose={onClose} onExited={handleExited} open={open} title={title}>
      <div className={style.formControl}>
        <Label text={t('Place name')} htmlFor='place' />
        <Input
          placeholder={`${t('Enter Place name')}`}
          value={formValues.name}
          name='name'
          fullWidth
          onChange={handlePlaceChange}
        />
      </div>
      { permissions.integrations && (
        <div className={style.formControl}>
          <Label text={t('External ID')} htmlFor='external_id' />
          <Input
            placeholder={`${t('Enter External ID')}`}
            value={formValues.external_id}
            name='external_id'
            fullWidth
            onChange={handlePlaceChange}
          />
        </div>
      )}
      <div className={style.buttonSaveBlock}>
        <Button disabled={formValues.name === ''} onClick={() => createPlace(formValues)} fillWidth size='big'>
          {buttonTitle}
        </Button>
      </div>
    </Dialog>
  );
}
