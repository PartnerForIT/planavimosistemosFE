import React, { useState, useEffect } from 'react';
import DialogClear from '../DialogClear';
import Button from '../../Button/Button';
import Select from '../../../Core/SimpleSelect';
import Textarea from '../../Textarea/Textarea';
import Label from '../../InputLabel';
import Input from '../../Input/Input';
import style from '../Dialog.module.scss';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import MomentUtils from '@date-io/moment';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import { useTranslation } from 'react-i18next';

const defaultValues = {
  name: '',
  cycle_period: null,
  adjustment_type: '',
  days: '',
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
  policies,
}) => {
  const { t } = useTranslation();
  const [values, setValues] = useState(defaultValues);

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };
  const handleSubmit = () => {
    onSubmit({...values, employees: employees.map((item) => item.id)});
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
        ...initialValue,
      });
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
                <Label text={t('Policy name')} htmlFor='policy_id' />
              </div>
              <Select
                handleInputChange={handleChange}
                name='policy_id'
                placeholder={t('Policy name')}
                value={values.policy_id ?? ''}
                options={policies.map((item) => { return { code: item.id, name: item.name }})}
                readOnly={initialValue?.policy_id}
              />
            </div>
            <div></div>
          </div>

          <div className={style.formRow}>
            <div className={style.formControl}>
              <div className={style.labelBlock}>
                <Label text={t('Cycle period')} htmlFor='cycle_period' />
              </div>
              <div className={style.dateInput}>
                <MuiPickersUtilsProvider utils={MomentUtils}>
                  <DatePicker
                    label={t('Cycle period')}
                    value={values.cycle_period}
                    onChange={(date) => handleChange({target: {name: 'cycle_period', value: date}})}
                    format='MMM, DD, YYYY'
                    name="cycle_period"
                  />
                </MuiPickersUtilsProvider>
              </div>
            </div>
            <div>
            </div>
          </div>

          <div className={style.formRow}>
            <div className={style.formControl}>
              <div className={style.labelBlock}>
                <Label text={t('Adjustment type')} htmlFor='adjustment_type' />
              </div>
              <Input
                placeholder={t('Adjustment type')}
                value={values.adjustment_type}
                name='adjustment_type'
                fullWidth
                onChange={handleChange}
              />
            </div>
            <div className={style.formControl}>
              <div className={style.labelBlock}>
                <Label text={t('Days')} htmlFor='days' />
              </div>
              <Input
                placeholder={t('Days')}
                value={values.days}
                name='days'
                fullWidth
                onChange={handleChange}
              />
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
