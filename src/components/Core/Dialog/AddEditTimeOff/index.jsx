import React, { useState, useEffect } from 'react';
import DialogClear from '../DialogClear';
import Button from '../../Button/Button';
import Input from '../../Input/Input';
import Textarea from '../../Textarea/Textarea';
import Select from '../../../Core/SimpleSelect';
import Label from '../../InputLabel';
import Tooltip from '../../../Core/Tooltip';
import style from '../Dialog.module.scss';
import timeOffFormLogo from '../../../Icons/timeOffForm.png';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import { useTranslation } from 'react-i18next';

const units = [
  {
    code: 'hours',
    name: 'Hours',
  },
  {
    code: 'days',
    name: 'Days',
  },
];

const paid_type = [
  {
    code: 'working',
    name: 'Working',
  },
  {
    code: 'paid',
    name: 'Paid, but not working',
  },
  {
    code: 'unpaid',
    name: 'Unpaid, and not working',
  },
];

const work_days = [
  {
    code: 'any_day',
    name: 'Any day',
  },
  {
    code: 'work_days',
    name: 'Work days only',
  },
];

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
              <Label text={t('Policy type name')} htmlFor='name' />
              <span className={style.required}>*</span>
            </div>
            <Input
              placeholder={t('Enter policy type name')}
              value={values.name}
              name='name'
              fullWidth
              onChange={handleChange}
            />
          </div>
          <div className={style.formControl}>
            <div className={style.labelBlock}>
              <Label text={t('Policy type unit')} htmlFor='unit' />
              <span className={style.required}>*</span>
              <div className={style.tooltipBlock}>
                <Tooltip title={
                  t('Choose which units to use for accruing and viewing the employee balance: hours or days.')
                }
                />
              </div>
            </div>
            <Select
              handleInputChange={handleChange}
              name='unit'
              placeholder={t('Choose the type')}
              value={values.unit ?? ''}
              options={units.map((item) => { return {...item, name: t(item.name)}})}
            />
          </div>
          <div className={style.formControl}>
            <div className={style.labelBlock}>
              <Label text={t('Paid or unpaid type')} htmlFor='paid_type' />
              <span className={style.required}>*</span>
              <div className={style.tooltipBlock}>
                <Tooltip title={
                  <>
                    {t("Select a policy type based on work and pay status:")}
                    <br />
                    <ul>
                    <li>
                      {t("Working – Actively working (e.g., office, remote work).")}
                    </li>
                    <li>
                      {t("Not working, but paid – Time off that is paid (e.g., holidays, sick leave)")}
                    </li>
                    <li>
                      {t("Not working, and not paid – Unpaid leave, which is excluded from attendance-based working hours.")}
                    </li>
                    </ul>
                  </>
                }
                />
              </div>
            </div>
            <Select
              handleInputChange={handleChange}
              name='paid_type'
              placeholder={t('Choose the type')}
              value={values.paid_type ?? ''}
              options={paid_type.map((item) => { return {...item, name: t(item.name)}})}
            />
          </div>
          <div className={style.formControl}>
            <div className={style.labelBlock}>
              <Label text={t('Work days or any days?')} htmlFor='work_days' />
              <span className={style.required}>*</span>
              <div className={style.tooltipBlock}>
                <Tooltip title={
                  t("If 'Any day' is selected, requests on weekends or non-working days will be deducted from the balance. This is useful for compensatory time off (TOIL) or travel-related leave policies.")
                }
                />
              </div>
            </div>
            <Select
              handleInputChange={handleChange}
              name='work_days'
              placeholder={t('Choose the type')}
              value={values.work_days ?? ''}
              options={work_days.map((item) => { return {...item, name: t(item.name)}})}
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
              disabled={!values.name || !values.unit || !values.paid_type || !values.work_days || !madeChanges}
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
