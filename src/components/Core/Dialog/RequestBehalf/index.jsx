import React, { useState, useEffect, useMemo, forwardRef, useImperativeHandle } from 'react';
import DialogClear from '../DialogClear';
import Button from '../../Button/Button';
//import Input from '../../Input/Input';
import Select from '../../../Core/SimpleSelect';
import Textarea from '../../Textarea/Textarea';
import Label from '../../InputLabel';
import style from '../Dialog.module.scss';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import MomentUtils from '@date-io/moment';
import RightSideIcon from '../../../Icons/request_behalf_right.svg';
import LeftSideIcon from '../../../Icons/request_behalf_left.png';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import { useTranslation } from 'react-i18next';
import useCompanyInfo from '../../../../hooks/useCompanyInfo';
import { getSettingWorkTime } from '../../../../store/settings/actions';
import { settingWorkTime } from '../../../../store/settings/selectors';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import classnames from 'classnames';
import moment from 'moment';

const defaultValues = {
  name: '',
  from: null,
  to: null,
  note: '',
};

const RequestBehalf = forwardRef(({
  handleClose,
  title,
  open,
  buttonTitle,
  onSubmit = Function.prototype,
  initialValue,
  employees,
  policies,
  activeTimeOff,
  singleRequest = false,
}, ref) => {
  const { t } = useTranslation();
  const [values, setValues] = useState(defaultValues);
  const [internalOpen, setInternalOpen] = useState(false)
  const workTime = useSelector(settingWorkTime);
  const { getDateFormat } = useCompanyInfo();
  const { id: companyId } = useParams();
  const dispatch = useDispatch();
  const [selectedTimeOff, setSelectedTimeOff] = useState(activeTimeOff);
  const formatDate = getDateFormat({
    'YY.MM.DD': 'yyyy.MM.DD',
    'DD.MM.YY': 'DD.MM.yyyy',
    'MM.DD.YY': 'MM.DD.yyyy',
  });

  console.log('formatDate', formatDate)

  useEffect(() => {
    if (activeTimeOff) {
      setSelectedTimeOff(activeTimeOff);
    } else if (values?.policy_id || initialValue.policy_id) {
      const p_id = values?.policy_id || initialValue.policy_id
      const policy = policies.find(policy => policy.id === p_id);
      if (policy) {
        setSelectedTimeOff(policy.time_off);
      }
    } else if (policies[0]) {
      setSelectedTimeOff(policies[0].time_off);
      
    }
    dispatch(getSettingWorkTime(companyId));

    // eslint-disable-next-line
  }, [activeTimeOff, initialValue?.policy_id, policies, values?.policy_id]);

  useImperativeHandle(ref, () => ({
    open: (initialParams) => {
      if (initialParams) {
        setValues(state => ({...state, ...initialParams}))
      }
      setInternalOpen(true)
    },
    close: onClose,
  }))

  const handleChange = (e) => {
    if (e.target.name === 'policy_id') {
      const policy = policies.find(policy => policy.id === e.target.value);
      if (policy) {
        const timeOff = policy.time_off;
        setSelectedTimeOff(timeOff);
      }
    }
    setValues({ ...values, [e.target.name]: e.target.value });
  };
  const handleSubmit = () => {
    onSubmit({...values, employees: employees.map((item) => item.id), from: values.from ? moment(values.from).format('YYYY-MM-DD') : null, to: values.to ? moment(values.to).format('YYYY-MM-DD') : null });
  };
  const handleExited = () => {
    setValues(defaultValues);
  };
  const onClose = () => {
    setInternalOpen(false)
    setValues(defaultValues);
    handleClose();

  };
  
  const datesList = useMemo(() => {
    if (!values.from || !values.to) return [];
    const start = moment(values.from);
    const end = moment(values.to);
    const dates = [];
    while (start.isSameOrBefore(end)) {
      const isWorkingDay = selectedTimeOff?.work_days === "any_day" ? true : [1, 2, 3, 4, 5].includes(start.day());
      const isHoliday = selectedTimeOff?.work_days === "any_day" ? false : workTime?.work_time?.holidays?.some(holiday => holiday.date === start.format('YYYY-MM-DD')) || workTime?.national_holidays?.some(holiday => holiday.date === start.format('YYYY-MM-DD'));
      dates.push({ date: start.format(formatDate), isWorkingDay, isHoliday });
      start.add(1, 'day');
    }
    return dates;

    // eslint-disable-next-line
  }, [values.from, values.to, formatDate, selectedTimeOff]);

  const totalDays = useMemo(() => {
    return datesList.filter(date => date.isWorkingDay && !date.isHoliday).length;
  }, [datesList, selectedTimeOff]);

  const endBalance = useMemo(() => {
    if (!employees?.[0] || !policies?.[0] || !values.policy_id) return false;
    const policy = policies.find(policy => policy.id === values.policy_id);
    const employee = policy.employees.find(emp => emp.id === employees[0].id);
    if (!employee) return false;
    return employee.balance - totalDays;
  }, [totalDays, selectedTimeOff]);
  
  // build once: allowed dates from the current selection (respecting workday/holiday)
  const allowedDatesSet = useMemo(() => {
    const set = new Set();
    datesList.forEach(d => {
      const allowed = selectedTimeOff?.work_days === "any_day" || (d.isWorkingDay && !d.isHoliday);
      if (allowed) set.add(d.date); // d.date is already in formatDate
    });
    return set;
    // eslint-disable-next-line
  }, [datesList, selectedTimeOff?.work_days]);

  const conflicts = useMemo(() => {
    const conflictMap = {};

    employees.forEach(employee => {
      const list = [];
      if (employee.request_behalves) {
        employee.request_behalves.forEach(request => {
          if (request.status !== 'pending' && request.status !== 'approved') return;

          // build overlap days ONCE per request
          const from = moment(request.from, 'YYYY-MM-DD');
          const to = moment(request.to, 'YYYY-MM-DD');

          const overlapDates = [];
          const cursor = from.clone();
          while (cursor.isSameOrBefore(to)) {
            const f = cursor.format(formatDate); // IMPORTANT: match datesList format
            if (allowedDatesSet.has(f)) overlapDates.push(f);
            cursor.add(1, 'day');
          }

          // push a SINGLE conflict per request (if there is any overlap)
          if (overlapDates.length > 0) {
            const clampedFrom = moment(overlapDates[0], formatDate).format('YYYY-MM-DD');
            const clampedTo = moment(overlapDates[overlapDates.length - 1], formatDate).format('YYYY-MM-DD');

            list.push({
              status: request.status,
              policy_name: request.policy_name,
              // show the CLAMPED range (so it becomes 2025-08-19 → 2025-08-21)
              from: clampedFrom,
              to: clampedTo,
              one_day_conflict: clampedFrom === clampedTo,
              overlap_days: overlapDates.length, // keep for missing calc
            });
          }
        });
      }
      if (list.length > 0) {
        conflictMap[employee.id] = list;
      }
    });

    return conflictMap;
    // eslint-disable-next-line
  }, [employees, formatDate, allowedDatesSet, selectedTimeOff]);

  const missingDays = useMemo(() => {
    // If you have balances per employee, use them; otherwise default to 0 so the section won’t show bogus numbers.
    const missing = {};
    employees.forEach(emp => {
      const conflictsForEmp = conflicts[emp.id] || [];
      const usedDays = conflictsForEmp.reduce((acc, c) => acc + (c.overlap_days || 0), 0);
      const balance = Number(emp?.balance_days ?? 0); // <-- wire your real balance field if you have one
      missing[emp.id] = Math.max(0, usedDays - balance);
    });
    return missing;
  }, [conflicts, employees]);

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
      open={open || internalOpen}
      title={title}
      maxWidth="lg"
    >
      <div className={style.sideForm}>
        {
          singleRequest ? (
            <div className={style.employeesSideImage}>
              <div className={style.detailsImage}>
                <img src={LeftSideIcon} />
              </div>
            </div>
          ) : (
            <div className={style.employeesSide}>
              <h4 className={style.dialogTitleClear}>{t('Users selected:')}</h4>
              {
                employees.map((employee) => (
                  <div key={employee.id} className={style.employeeItemWrapper}>
                    <div className={style.employeeItem}>
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
                    {
                      conflicts[employee.id] && conflicts[employee.id].length > 0 && (
                        <div className={style.conflictMessage}>
                          <p>{t('Conflict with other requests:')}</p>
                          {
                            conflicts[employee.id].map((conflict, index) => (
                              <div key={index}>
                                {
                                  conflict.status === 'pending' ? (
                                    <span>* {conflict.one_day_conflict
                                      ? t('Pending approval {{policy_name}} request from {{from}}.', { policy_name: conflict.policy_name, from: conflict.from })
                                      : t('Pending approval {{policy_name}} request from {{from}} to {{to}}.', { policy_name: conflict.policy_name, from: conflict.from, to: conflict.to })
                                    }</span>
                                  ) : (
                                    <span>* {conflict.one_day_conflict
                                      ? t('Approved {{policy_name}} request from {{from}}.', { policy_name: conflict.policy_name, from: conflict.from })
                                      : t('Approved {{policy_name}} request from {{from}} to {{to}}.', { policy_name: conflict.policy_name, from: conflict.from, to: conflict.to })
                                    }</span>
                                  )
                                }
                              </div>
                            ))
                          }

                          {
                            missingDays[employee.id] ? (
                              <>
                                <div className={style.conflictTotal}>
                                  {t('Insufficient balance for:')}
                                </div>
                                <div>
                                  * {t('Missing {{days}} d. for this request.', { days: missingDays[employee.id] })}
                                </div>
                              </>
                            ) : null}
                        </div>
                      )
                    }
                  </div>
                ))
              }
            </div>
          )
        }
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
                <Label text={t('From')} htmlFor='From' />
              </div>
              <div className={style.dateInput}>
                <MuiPickersUtilsProvider utils={MomentUtils}>
                  <DatePicker
                    label={t('Start date')}
                    value={values.from}
                    onChange={(date) => handleChange({target: {name: 'from', value: date.format('YYYY-MM-DD')}})}
                    format={formatDate} //'MMM, DD, YYYY'
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
                    onChange={(date) => handleChange({target: {name: 'to', value: date.format('YYYY-MM-DD')}})}
                    format={formatDate} //'MMM, DD, YYYY'
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
              value={values.note || ''}
            />
          </div>
          <div className={style.formRow}>
            <div></div>
            <div className={style.buttonSaveBlock}>
              <Button
                onClick={handleSubmit}
                fillWidth
                size='big'
                disabled={!(values.from && values.to) || (conflicts && Object.keys(conflicts).length > 0)}
              >
                {buttonTitle}
              </Button>
            </div>
          </div>
        </div>
        <div className={style.detailsSide}>
          { values.from && values.to ? (
              <>
                <h4 className={style.detailsTitleClear}>{t('Your request details')}</h4>
                <div className={classnames(style.detailsInfo, { [style.notSingle]: !singleRequest })}>
                  {datesList.map((item, index) => (
                    <div key={index} className={classnames(style.detailsItem, { [style.holiday]: !item.isWorkingDay || item.isHoliday })}>
                      <span>{item.date}</span>
                      <span>{item.isWorkingDay && !item.isHoliday ? t('All day') : t('Non working day')}</span>
                    </div>
                  ))}
                </div>
                <div className={style.detailsTotal}>
                  <div className={style.detailsRequested}
                    dangerouslySetInnerHTML={{
                      __html: t('You request total of <span>{{days}}</span> d.', { days: totalDays })
                    }}
                  />

                  { singleRequest && endBalance !== false && !isNaN(endBalance) && (
                    <div className={style.detailsBalance}
                      dangerouslySetInnerHTML={{
                        __html: t('Your end balance will be <span>{{days}}</span> d.', { days: endBalance })
                      }}
                    />
                  )}
                </div>

                {
                  singleRequest ? (
                    <>
                    {
                      employees.map((employee) => (
                        <div key={employee.id} className={style.employeeItemWrapper}>
                          {
                            conflicts[employee.id] && conflicts[employee.id].length > 0 && (
                              <div className={style.conflictMessage}>
                                <p>{t('Conflict with other requests:')}</p>
                                {
                                  conflicts[employee.id].map((conflict, index) => (
                                    <div key={index}>
                                      {
                                        conflict.status === 'pending' ? (
                                          <span>* {conflict.one_day_conflict
                                            ? t('Pending approval {{policy_name}} request from {{from}}.', { policy_name: conflict.policy_name, from: conflict.from })
                                            : t('Pending approval {{policy_name}} request from {{from}} to {{to}}.', { policy_name: conflict.policy_name, from: conflict.from, to: conflict.to })
                                          }</span>
                                        ) : (
                                          <span>* {conflict.one_day_conflict
                                            ? t('Approved {{policy_name}} request from {{from}}.', { policy_name: conflict.policy_name, from: conflict.from })
                                            : t('Approved {{policy_name}} request from {{from}} to {{to}}.', { policy_name: conflict.policy_name, from: conflict.from, to: conflict.to })
                                          }</span>
                                        )
                                      }
                                    </div>
                                  ))
                                }

                                {
                                  missingDays[employee.id] ? (
                                    <>
                                      <div className={style.conflictTotal}>
                                        {t('Insufficient balance for:')}
                                      </div>
                                      <div>
                                        * {t('Missing {{days}} d. for this request.', { days: missingDays[employee.id] })}
                                      </div>
                                    </>
                                  ) : null}
                              </div>
                            )
                          }
                        </div>
                      ))}
                    </>
                  ) : null
                }
              </>
            ) : (
              <>
                <div className={style.detailsImage}>
                  <img src={RightSideIcon} />
                </div>
              </>
            )
          }
        </div>
      </div>
    </DialogClear>
  );
});

export default RequestBehalf
