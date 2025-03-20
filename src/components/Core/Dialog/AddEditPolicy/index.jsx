import React, { useState, useEffect } from 'react';
import DialogClear from '../DialogClear';
import Button from '../../Button/Button';
import Input from '../../Input/Input';
import Textarea from '../../Textarea/Textarea';
import Label from '../../InputLabel';
import style from '../Dialog.module.scss';
import timeOffFormLogo from '../../../Icons/timeOffForm.png';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import { useTranslation } from 'react-i18next';

export default ({
  handleClose,
  title,
  open,
  buttonTitle,
  onSubmit = Function.prototype,
  initialValue,
}) => {
  const { t } = useTranslation();
  const [values, setValues] = useState({});
  const [madeChanges, setMadeChanges] = useState(false);

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
    setMadeChanges(true);
  };
  const handleSubmit = () => {
    onSubmit(values);
  };
  const handleExited = () => {
    setValues({});
  };
  const onClose = () => {
    setValues({});
    handleClose();

  };

  useEffect(() => {
    if (initialValue) {
      setValues(initialValue);
    } else {
      setValues({});
    }
  }, [initialValue, open]);

  return (
    <DialogClear
      handleClose={onClose}
      onExited={handleExited}
      open={open}
      title={title}
    >
      <div className={style.sideForm}>
        <div className={style.logoSide}>
          <img src={timeOffFormLogo} alt='Time Off' />
        </div>
        <div className={style.formSide}>
          <div className={style.dialogTitleBlock}>
            <h4 className={style.dialogTitleClear}>{title}</h4>
            <IconButton aria-label='close' className={style.closeButton} onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </div>
          <div className={style.formControl}>
            <div className={style.labelBlock}>
              <Label text={t('Policy name')} htmlFor='name' />
              <span className={style.required}>*</span>
            </div>
            <Input
              placeholder={t('Enter policy name')}
              value={values.name}
              name='name'
              fullWidth
              onChange={handleChange}
            />
          </div>

          <div className={style.formControl}>
            <div className={style.labelBlock}>
              <Label text={t('Policy type')} htmlFor='type' />
              <span className={style.required}>*</span>
            </div>
            <Input
              placeholder={t('Policy type')}
              value={values.type}
              name='type'
              fullWidth
              disabled
            />
          </div>
          
          <div className={style.formControl}>
            <Label text={t('Description')} htmlFor='description' />
            <Textarea
              className={style.textarea}
              placeholder={`${t('Write a description')} (${t('optional')})`}
              onChange={handleChange}
              name='description'
              value={values.description}
            />
          </div>
          <div className={style.buttonSaveBlock}>
            <Button
              disabled={!values.name || !madeChanges}
              onClick={handleSubmit}
              fillWidth
              size='big'
            >
              {buttonTitle}
            </Button>
          </div>
        </div>
      </div>
    </DialogClear>
  );
};
