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
import { useTranslation } from 'react-i18next';
import useCompanyInfo from '../../../../hooks/useCompanyInfo';
import moment from 'moment';

const adjustment_type_arr = [
  {
    code: 'increase',
    name: 'Incease balance',
  },
  {
    code: 'decrease',
    name: 'Decrease balance',
  },
];

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
  const [cycle_period_arr, setCyclePeriodArr] = useState([]);
  const { getDateFormat } = useCompanyInfo();
  const formatDate = getDateFormat({
    'YY.MM.DD': 'yyyy.MM.DD',
    'DD.MM.YY': 'DD.MM.yyyy',
    'MM.DD.YY': 'MM.DD.yyyy',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setValues((prev) => ({ ...prev, [name]: value }));
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

    setCyclePeriodArr(() => {
        const arr = [];
        const allowance_calculation_period = policies?.find((item) => item.id === initialValue?.policy_id)?.allowance_calculation_period; 
        const earliestDate = employees.reduce((earliest, employee) => {
          const employmentDate = moment(employee.employment_effective_date_text, formatDate);
          return earliest.isBefore(employmentDate) ? earliest : employmentDate;
        }, moment());
        
        if (allowance_calculation_period) {
          const now = moment();
          let current = earliestDate.clone();
          if (allowance_calculation_period === 'weekly') {
            while (current.isBefore(now)) {
              const startOfWeek = current.clone().startOf('week');
              const endOfWeek = current.clone().endOf('week');
              arr.push({
                code: `${startOfWeek.format(formatDate)}|${endOfWeek.format(formatDate)}`,
                name: `${startOfWeek.format(formatDate)} - ${endOfWeek.format(formatDate)}`,
              });
              current.add(1, 'week');
            }
            
          } else if (allowance_calculation_period === 'monthly') {
            while (current.isBefore(now)) {
              const startOfMonth = current.clone().startOf('month');
              const endOfMonth = current.clone().endOf('month');
              arr.push({
                code: `${startOfMonth.format(formatDate)}|${endOfMonth.format(formatDate)}`,
                name: `${startOfMonth.format(formatDate)} - ${endOfMonth.format(formatDate)}`,
              });
              current.add(1, 'month');
            }
            
          } else if (allowance_calculation_period === 'annual') {
            while (current.isBefore(now)) {
              const startOfYear = current.clone().startOf('year');
              const endOfYear = current.clone().endOf('year');
              arr.push({
                code: `${startOfYear.format(formatDate)}|${endOfYear.format(formatDate)}`,
                name: `${startOfYear.format(formatDate)} - ${endOfYear.format(formatDate)}`,
              });
              current.add(1, 'year');
            } 
          }
        }

        return arr;
      }
    );
  }, [initialValue, open, employees, policies, formatDate]);

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
              <Select
                handleInputChange={handleChange}
                name='cycle_period'
                placeholder={t('Cycle period')}
                value={values.cycle_period ?? ''}
                options={cycle_period_arr}
              />
            </div>
          </div>

          <div className={style.formRow}>
            <div className={style.formControl}>
              <div className={style.labelBlock}>
                <Label text={t('Adjustment type')} htmlFor='adjustment_type' />
              </div>
              <Select
                handleInputChange={handleChange}
                name='adjustment_type'
                placeholder={t('Adjustment type')}
                value={values.adjustment_type ?? ''}
                options={adjustment_type_arr.map((item) => { return {...item, name: t(item.name)}})}
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
                type='number'
                min={0}
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
                disabled={!values.cycle_period || !values.adjustment_type || !values.days}
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
