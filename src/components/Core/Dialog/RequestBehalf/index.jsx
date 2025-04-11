import React, { useState, useEffect } from 'react';
import DialogClear from '../DialogClear';
import Button from '../../Button/Button';
import Input from '../../Input/Input';
import Textarea from '../../Textarea/Textarea';
import Label from '../../InputLabel';
import style from '../Dialog.module.scss';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import MomentUtils from '@date-io/moment';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import { useTranslation } from 'react-i18next';

const defaultValues = {
  name: '',
  from: null,
  to: null,
  note: '',
};

export default ({
  handleClose,
  title,
  open,
  buttonTitle,
  onSubmit = Function.prototype,
  initialValue,
  employees,
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
    if (initialValue) {
      setValues({
        ...defaultValues,
        name: initialValue.name || '',
        type: initialValue.type || '',
        description: initialValue.description || ''});
    } else {
      setValues(defaultValues);
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
        <div className={style.employeesSide}>
          <h4 className={style.dialogTitleClear}>{t('Users selected:')}</h4>
          {
            employees.map((employee) => (
              <div key={employee.id} className={style.employeeItem}>
                {
                  employee.photo && (
                    <div className={style.avatarBlock}>
                      <img
                        src={employee.photo}
                        alt='avatar'
                        className={style.avatar}
                      />
                    </div>
                  )
                }
                <div>
                  <div>{employee.name}</div>
                  <div className={style.skillName}>{employee.skills}</div>
                </div>
              </div>
            ))
          }
        </div>
        <div className={style.formSide}>
          <div className={style.dialogTitleBlock}>
            <h4 className={style.dialogTitleClear}>{title}</h4>
            <IconButton aria-label='close' className={style.closeButton} onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </div>
          <div className={style.formRow}>
            <div className={style.formControl}>
              <div className={style.labelBlock}>
                <Label text={t('Policy name')} htmlFor='name' />
              </div>
              <Input
                placeholder={t('Enter policy name')}
                value={values.name}
                name='name'
                fullWidth
                onChange={handleChange}
              />
            </div>
            <div></div>
          </div>

          <div className={style.formRow}>
            <div className={style.formControl}>
              <div className={style.labelBlock}>
                <Label text={t('From')} htmlFor='From' />
              </div>
              <div className={style.dateInput}>
                <MuiPickersUtilsProvider utils={MomentUtils}>
                  <DatePicker
                    label={t('Start date')}
                    value={values.from}
                    onChange={(date) => handleChange({target: {name: 'from', value: date}})}
                    format='MMM, DD, YYYY'
                    name="from"
                  />
                </MuiPickersUtilsProvider>
              </div>
            </div>
            <div className={style.formControl}>
            <div className={style.labelBlock}>
                <Label text={t('To')} htmlFor='to' />
              </div>
              <div className={style.dateInput}>
                <MuiPickersUtilsProvider utils={MomentUtils}>
                  <DatePicker
                    label={t('To date')}
                    value={values.to}
                    onChange={(date) => handleChange({target: {name: 'to', value: date}})}
                    format='MMM, DD, YYYY'
                    name="to"
                  />
                </MuiPickersUtilsProvider>
              </div>
            </div>
          </div>

          
          <div className={style.formControl}>
            <Label text={t('Note')} htmlFor='note' />
            <Textarea
              className={style.textarea}
              placeholder={`${t('Write a note')} (${t('optional')})`}
              onChange={handleChange}
              name='note'
              value={values.note}
            />
          </div>
          <div className={style.formRow}>
            <div></div>
            <div className={style.buttonSaveBlock}>
              <Button
                onClick={handleSubmit}
                fillWidth
                size='big'
              >
                {buttonTitle}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DialogClear>
  );
};
