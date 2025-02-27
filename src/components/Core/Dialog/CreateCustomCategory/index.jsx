import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Dialog from '../index';
import Button from '../../Button/Button';
import Input from '../../Input/Input';
import Label from '../../InputLabel';
import StyledCheckbox from '../../Checkbox/Checkbox2';
import style from '../Dialog.module.scss';

const initialFormValues = {
  name: '',
  entry_field: true,
};

export default function CreateCustomCategory({
  handleClose, title, open,
  buttonTitle, createCategory, initialValues
}) {
  const { t } = useTranslation();
  const [formValues, setFormValues] = useState(initialFormValues);

  const handleCategoryChange = (event) => {
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
    } else {
      setFormValues({
        ...initialFormValues,
      });
    }
  }, [initialValues, open]);

  return (
    <Dialog handleClose={onClose} onExited={handleExited} open={open} title={title}>
      <div className={style.formControl}>
        <Label text={t('Category name')} htmlFor='category' />
        <Input
          placeholder={`${t('Enter category name')}`}
          value={formValues.name}
          name='name'
          fullWidth
          onChange={handleCategoryChange}
        />
      </div>
      <div className={style.formControl}>
        <StyledCheckbox
          label={t('Entry field')}
          checked={formValues.entry_field}
          disabled={true}
          onChange={(e) => setFormValues({ ...formValues, entry_field: !formValues.entry_field })}
        />
      </div>
      <div className={style.buttonSaveBlock}>
        <Button disabled={formValues.name === ''} onClick={() => createCategory(formValues)} fillWidth size='big'>
          {buttonTitle}
        </Button>
      </div>
    </Dialog>
  );
}
