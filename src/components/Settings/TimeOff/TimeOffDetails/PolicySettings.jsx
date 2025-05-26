/* eslint-disable camelcase,no-confusing-arrow */
import React, {
  useCallback, useEffect, useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';

import Content from './Content';
import Input from '../../../Core/Input/Input';
import Label from '../../../Core/InputLabel';
import Textarea from '../../../Core/Textarea/Textarea';
import classes from '../timeoff.module.scss';
import Switch from 'react-switch';
import Select from '../../../Core/SimpleSelect';
import Tooltip from '../../../Core/Tooltip';
import DeleteIcon from '../../../Icons/DeleteIcon';
import InputColor from '../../../Core/InputColor';
import TimeOffSymbol1 from '../../../Icons/TimeOffSymbol1';
import TimeOffSymbol2 from '../../../Icons/TimeOffSymbol2';
import TimeOffSymbol3 from '../../../Icons/TimeOffSymbol3';
import TimeOffSymbol4 from '../../../Icons/TimeOffSymbol4';
import TimeOffSymbol5 from '../../../Icons/TimeOffSymbol5';
import TimeOffSymbol6 from '../../../Icons/TimeOffSymbol6';
import TimeOffSymbol7 from '../../../Icons/TimeOffSymbol7';
import TimeOffSymbol8 from '../../../Icons/TimeOffSymbol8';
import TimeOffSymbol9 from '../../../Icons/TimeOffSymbol9';

const initialValues = {
  name: '',
  type: '',
  description: '',
  use_approve_flow: false,
  set_default: false,
  private: false,
  allowance_type: '',
  allowance_calculation_period: '',
  allowance_amount: '',
  proration_type: '',
  allowance_carryover_type: '',
  allowance_carryover_amount: '',
  prorotate_based_on_em_status: false,
  use_carryover_expiration_period: false,
  allowance_carryover_expiration_period: '',
  use_maximum_balance_capacity: false,
  maximum_balance: '',
  allow_negative_balance: false,
  maximum_negative_balance: '',
  add_extra_amount_based_on_years_of_service: false,
  mark_in_time_sheet_excel: false,
  value_in_time_sheet_excel: '',
  mark_in_schedule_and_time_sheet: false,
  symbol: '',
  color: '',
  extra_amounts: [],
}

const allowance_type_arr = [
  { code: 'earned', name: 'Earned allowance' },
  { code: 'unlimited', name: 'Unlimited allowance' },
  { code: 'annual_grant', name: 'Annual grant' },
];

const allowance_calculation_period_arr = [
  { code: 'annual', name: 'Annual allowance' },
  { code: 'monthly', name: 'Monthly allowance' },
  { code: 'weekly', name: 'Weekly allowance' },
];

const proration_type_arr = [
  { code: 'prorate_by_calendar_days', name: 'Prorate by Calendar days' },
  { code: 'do_not_prorate', name: 'Do not prorate' },
];

const allowance_carryover_type_arr = [
  { code: 'yes', name: 'Yes, allow' },
  { code: 'no', name: 'No, do not allow' },
];

const allowance_carryover_expiration_period_arr = [
  { code: '1_week', name: '1 week' },
  { code: '2_weeks', name: '2 weeks' },
  { code: '1_month', name: '1 month' },
  { code: '2_months', name: '2 months' },
  { code: '3_months', name: '3 months' },
  { code: '4_months', name: '4 months' },
  { code: '5_months', name: '5 months' },
  { code: '6_months', name: '6 months' },
  { code: '12_months', name: '12 months' },
  { code: '24_months', name: '24 months' },
];

const PolicySettings = React.memo(({
  activePolicy,
  handleEditPolicy,
}) => {
  const { t } = useTranslation();
  const [values, setValues] = useState(initialValues);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
  
    setValues((prev) => {
      const updatedValues = {
        ...prev,
        [name]: value,
      };
  
      const requiredFields = [
        'name',
        'allowance_type',
      ];
  
      if (updatedValues.allowance_type === 'earned') {
        requiredFields.push('allowance_calculation_period');
        requiredFields.push('proration_type');
      }
  
      if (['earned', 'annual_grant'].includes(updatedValues.allowance_type)) {
        requiredFields.push('allowance_amount');
        requiredFields.push('allowance_carryover_type');
  
        if (updatedValues.use_maximum_balance_capacity) {
          requiredFields.push('maximum_balance');
        }
        if (updatedValues.allow_negative_balance) {
          requiredFields.push('maximum_negative_balance');
        }
        if (updatedValues.mark_in_time_sheet_excel) {
          requiredFields.push('value_in_time_sheet_excel');
        }
        if (updatedValues.mark_in_schedule_and_time_sheet) {
          requiredFields.push('symbol');
          requiredFields.push('color');
        }
        if (updatedValues.use_carryover_expiration_period) {
          requiredFields.push('allowance_carryover_expiration_period');
        }
      }
  
      if (updatedValues.allowance_carryover_type === 'yes') {
        requiredFields.push('allowance_carryover_amount');
      }
  
      if (updatedValues.allowance_type === 'unlimited') {
        if (updatedValues.mark_in_time_sheet_excel) {
          requiredFields.push('value_in_time_sheet_excel');
        }
        if (updatedValues.mark_in_schedule_and_time_sheet) {
          requiredFields.push('symbol');
          requiredFields.push('color');
        }
      }
  
      const isValid = requiredFields.every(
        (field) => updatedValues[field] !== '' && updatedValues[field] !== undefined && updatedValues[field] !== null,
      );
  
      if (handleEditPolicy) {
        handleEditPolicy({ ...updatedValues, ready: isValid });
      }
  
      return updatedValues;
    });
  
    // eslint-disable-next-line
  }, [handleEditPolicy]);


  const addExtraAmount = () => {
    setValues((prev) => ({
      ...prev,
      extra_amounts: [...(prev.extra_amounts ? prev.extra_amounts : []), { years: '', amount: '' }],
    }));
  };

  const handleExtraAmountChange = (index, field, value) => {
    setValues((prev) => {
      const updatedExtraAmounts = [...prev.extra_amounts];
      updatedExtraAmounts[index] = {
        ...updatedExtraAmounts[index],
        [field]: value,
      };
      return {
        ...prev,
        extra_amounts: updatedExtraAmounts,
      };
    });
  };

  const handleRemoveExtraAmount = (index) => {
    setValues((prev) => {
      const updatedExtraAmounts = [...prev.extra_amounts];
      updatedExtraAmounts.splice(index, 1);
      return {
        ...prev,
        extra_amounts: updatedExtraAmounts,
      };
    });
  };

  useEffect(() => {
    if (activePolicy) {
      setValues(activePolicy);
    } else {
      setValues(initialValues);
    }
  }, [activePolicy]);
    
  return (
    <Content tooltip='Tooltip' title={t('Policy settings')}>
      <>
        <div className={classes.policyForm}>
          <div className={classes.policyForm_row}>
            <div className={classes.formControl}>
              <div className={classes.labelBlock}>
                <Label text={t('Policy name')} htmlFor='name' />
                <span className={classes.required}>*</span>
              </div>
              <Input
                placeholder={t('Enter policy name')}
                value={values.name}
                name='name'
                fullWidth
                onChange={handleChange}
              />
            </div>
            <div className={classes.formControl}>
              <div className={classes.labelBlock}>
                <Label text={t('Policy type')} htmlFor='name' />
                <span className={classes.required}>*</span>
              </div>
              <Input
                placeholder={t('Policy type')}
                value={values.type}
                name='type'
                fullWidth
                disabled
                onChange={handleChange}
              />
            </div>
          </div>
          <div className={classes.policyForm_row}>
            <div className={classes.formControl}>
              <div className={classes.labelBlock}>
                <Label text={t('Description')} htmlFor='description' />
              </div>
              <Textarea
                placeholder={`${t('Write a description')} (${t('optional')})`}
                value={values.description ?? ''}
                className={classes.textarea}
                name='description'
                onChange={handleChange}
              />
            </div>
          </div>
          <div className={classes.policyForm_row}>
            <div className={classes.formControlSwhitch}>
              <div className={classes.tooltipBlock}>
                <Label text={t('Use approve flow')} />
                <Tooltip
                  title={t("Enable the approval flow if you want the request from this policy to be approved by the first and second level approvers (if appointed in the account list) before processing further.")}
                />
              </div>
              <Switch
                onChange={(checked) => handleChange({ target: { name: 'use_approve_flow', value: checked } })}
                offColor='#808F94'
                onColor='#0085FF'
                uncheckedIcon={false}
                checkedIcon={false}
                checked={values.use_approve_flow || false}
                height={21}
                width={40}
              />
            </div>
            <div className={classes.formControlSwhitch}>
              <div className={classes.tooltipBlock}>
                <Label text={t('Set default for new accounts')} />
                <Tooltip
                  title={t("Automatically set this policy as the default for all new users who are created or imported via account list.")}
                />
              </div>
              <Switch
                onChange={(checked) => handleChange({ target: { name: 'set_default', value: checked } })}
                offColor='#808F94'
                onColor='#0085FF'
                uncheckedIcon={false}
                checkedIcon={false}
                checked={values.set_default || false}
                height={21}
                width={40}
              />
            </div>
          </div>
          <div className={classes.policyForm_row}>
            <div className={classes.formControlSwhitch}>
              <div className={classes.tooltipBlock}>
                <Label text={t('Make the policy private')} />
                <Tooltip
                  title={t("Make this policy private, and then other employees will not be able to see those employees who are using it.")}
                />
              </div>
              <Switch
                onChange={(checked) => handleChange({ target: { name: 'private', value: checked } })}
                offColor='#808F94'
                onColor='#0085FF'
                uncheckedIcon={false}
                checkedIcon={false}
                checked={values.private || false}
                height={21}
                width={40}
              />
            </div>
          </div>
          <hr className={classes.hr} />
          <div className={classes.policyForm_row}>
            <div className={classes.selectBlock}>
              <div className={classes.tooltipBlock}>
                <Label text={t('Choose allowance type')} />
                <span className={classes.required}>*</span>
                <Tooltip
                  title={
                    <>
                      {t('Allowance types:')}
                      <ul>
                        <li>
                        {t('Earned allowance - time off that is accumulated based on the hours or days worked. This allowance is typically granted gradually over time as the employee works, such as paid vacation or sick leave.')}
                        </li>
                        <li>
                        {t('Unlimited allowance - there is no fixed limit to the amount of time off the employee can take. The allowance is flexible and can be taken as needed, without being restricted by a specific number of days or hours.')}
                        </li>
                        <li>
                        {t('Annual grant - A fixed amount of time off (in hours or days) that is granted to the employee on a yearly basis, often for vacation or other types of leave. This allowance resets annually.')}
                        </li>  
                      </ul>
                    </>
                  }
                />
              </div>
              <Select
                handleInputChange={handleChange}
                name='allowance_type'
                value={values.allowance_type}
                options={allowance_type_arr.map((item) => { return {...item}})}
              />
            </div>
            <div></div>
          </div>
          <hr className={classes.hr} />
          {
            values.allowance_type === 'earned' ? (
              <>
                <div className={classes.policyForm_row}>
                  <div className={classes.selectBlock}>
                    <div className={classes.tooltipBlock}>
                      <Label text={t('Allowance calculation period')} />
                      <span className={classes.required}>*</span>
                      <Tooltip
                        title={
                          <>
                            {t('Allowance calculation period:')}
                            <ul>
                              <li>
                              {t('Annual allowance - The total allowance is granted for the entire year at once. Employees receive a fixed amount of time off (in hours or days) for the year, which may be used at any time within that period.')}
                              </li>
                              <li>
                              {t('Monthly allowance - The allowance is distributed on a monthly basis. Employees receive a set number of hours or days each month, rather than receiving the full allowance upfront for the year.')}
                              </li>
                              <li>
                              {t('Weekly allowance - The allowance is calculated and allocated weekly. Employees get a specific amount of time off per week, ensuring a steady and short-term distribution of available leave.')}
                              </li>  
                            </ul>
                          </>
                        }
                      />
                    </div>
                    <Select
                      handleInputChange={handleChange}
                      name='allowance_calculation_period'
                      value={values.allowance_calculation_period}
                      options={allowance_calculation_period_arr.map((item) => { return {...item}})}
                    />
                  </div>
                  <div className={classes.formControl}>
                    <div className={classes.labelBlock}>
                      <Label text={t('Allowance amount')} htmlFor='allowance_amount' />
                      <span className={classes.required}>*</span>
                    </div>
                    <Input
                      placeholder={t('Enter allowance amount')}
                      value={values.allowance_amount}
                      name='allowance_amount'
                      fullWidth
                      onChange={handleChange}
                      disabled={!values.allowance_calculation_period}
                    />
                  </div>
                </div>

                <div className={classes.policyForm_row}>
                  <div className={classes.selectBlock}>
                    <div className={classes.tooltipBlock}>
                      <Label text={t('Proration type')} />
                      <span className={classes.required}>*</span>
                      <Tooltip
                        title={
                          <>
                            {t('Proration type:')}
                            <ul>
                              <li>
                              {t('Prorate by calendar days - the allowance is calculated proportionally based on the number of calendar days in a given period. This ensures that employees receive an adjusted amount of leave depending on their start date.')}
                              </li>
                              <li>
                              {t('Do not prorate - the full allowance is granted regardless of when the employee joined company and system. No proportional adjustments are made based on calendar days.')}
                              </li>
                            </ul>
                          </>
                        }
                      />
                    </div>
                    <Select
                      handleInputChange={handleChange}
                      name='proration_type'
                      value={values.proration_type}
                      options={proration_type_arr.map((item) => { return {...item}})}
                    />
                  </div>
                  <div></div>
                </div>
              </>
            ) : null
          }
          {
            values.allowance_type === 'annual_grant' ? (
              <>
                <div className={classes.policyForm_row}>
                  <div className={classes.formControl}>
                    <div className={classes.labelBlock}>
                      <Label text={t('Allowance amount')} htmlFor='allowance_amount' />
                      <span className={classes.required}>*</span>
                    </div>
                    <Input
                      placeholder={t('Enter allowance amount')}
                      value={values.allowance_amount}
                      name='allowance_amount'
                      fullWidth
                      onChange={handleChange}
                    />
                  </div>
                  <div></div>
                </div>
              </>
            ) : null
          }
          {
            (values.allowance_type === 'earned' || values.allowance_type === 'annual_grant') ? (
              <>
                <div className={classes.policyForm_row}>
                  <div className={classes.selectBlock}>
                    <div className={classes.tooltipBlock}>
                      <Label text={t('Carryover type')} />
                      <span className={classes.required}>*</span>
                      <Tooltip
                        title={
                          <>
                            {t('Carryover type:')}
                            <ul>
                              <li>
                              {t('Yes, allow - Unused balance may be carried over to the next period. Please enter the amount in the next field, what is the maximum limit for carryover.')}
                              </li>
                              <li>
                              {t('No, do not allow - Unused balance will not be carried over to the next period.')}
                              </li>
                            </ul>
                          </>
                        }
                      />
                    </div>
                    <Select
                      handleInputChange={handleChange}
                      name='allowance_carryover_type'
                      value={values.allowance_carryover_type}
                      options={allowance_carryover_type_arr.map((item) => { return {...item}})}
                    />
                  </div>
                  <div className={classes.formControl}>
                    <div className={classes.labelBlock}>
                      <Label text={t('Carryover amount')} htmlFor='allowance_carryover_amount' />
                      <span className={classes.required}>*</span>
                    </div>
                    <Input
                      placeholder={t('Enter maximum amount')}
                      value={values.allowance_carryover_amount ?? ''}
                      name='allowance_carryover_amount'
                      fullWidth
                      onChange={handleChange}
                      disabled={!values.allowance_carryover_type || values.allowance_carryover_type === 'no'}
                    />
                  </div>
                </div>

                <hr className={classes.hr} />
              </>
            ) : null
          }
          {
            (values.unit === 'hours' && (values.allowance_type === 'earned')) ? (
              <>
                <div className={classes.policyForm_row}>
                  <div className={classes.formControlSwhitchLine}>
                    <Switch
                      onChange={(checked) => handleChange({ target: { name: 'prorotate_based_on_em_status', value: checked } })}
                      offColor='#808F94'
                      onColor='#0085FF'
                      uncheckedIcon={false}
                      checkedIcon={false}
                      checked={values.prorotate_based_on_em_status || false}
                      height={21}
                      width={40}
                    />
                    <div className={classes.tooltipBlock}>
                      <Label text={t('Prorate based on the employement status')} />
                      <Tooltip
                        title={
                          <>
                            {t('Prorate based on the employement status:')}<br />
                            {t("Adjust the allowance proportionally based on the employee's employment status. The employment status is represented as a value between 0.01 and 1.5, where 1.0 corresponds to a full-time workload (e.g., 40 hours per week). Employees with lower or higher status values will have their allowance adjusted accordingly.")}
                          </>
                        }
                      />
                    </div>
                  </div>
                </div>

                <hr className={classes.hr} />
              </>
            ) : null
          }
          {
            (values.allowance_type === 'earned' || values.allowance_type === 'annual_grant') ? (
              <>
                <div className={classes.policyForm_row}>
                  <div className={classes.formControlSwhitchLine}>
                    <Switch
                      onChange={(checked) => handleChange({ target: { name: 'use_carryover_expiration_period', value: checked } })}
                      offColor='#808F94'
                      onColor='#0085FF'
                      uncheckedIcon={false}
                      checkedIcon={false}
                      checked={values.use_carryover_expiration_period || false}
                      height={21}
                      width={40}
                    />
                    <div className={classes.tooltipBlock}>
                      <Label text={t('Use carryover expiration period')} />
                      <Tooltip
                        title={
                          <>
                            {t('Use carryover expiration period:')}<br />
                            {t('Enable this option to set an expiration period for carried-over balances. Select the desired period from the dropdown to define how long unused time off remains valid before expiring.')}
                          </>
                        }
                      />
                    </div>
                  </div>
                </div>

                {
                  values.use_carryover_expiration_period ? (
                    <div className={classes.policyForm_row}>
                      <div className={classes.selectBlock}>
                        <div className={classes.tooltipBlock}>
                          <Label text={t('Choose the period')} />
                          <span className={classes.required}>*</span>
                        </div>
                        <Select
                          handleInputChange={handleChange}
                          name='allowance_carryover_expiration_period'
                          value={values.allowance_carryover_expiration_period}
                          options={allowance_carryover_expiration_period_arr.map((item) => { return {...item}})}
                        />
                      </div>
                      <div></div>
                    </div>
                  ) : null
                }

                <hr className={classes.hr} />
              </>
            ) : null
          }
          {
            (values.allowance_type === 'earned' || values.allowance_type === 'annual_grant') ? (
              <>
                <div className={classes.policyForm_row}>
                  <div className={classes.formControlSwhitchLine}>
                    <Switch
                      onChange={(checked) => handleChange({ target: { name: 'use_maximum_balance_capacity', value: checked } })}
                      offColor='#808F94'
                      onColor='#0085FF'
                      uncheckedIcon={false}
                      checkedIcon={false}
                      checked={values.use_maximum_balance_capacity || false}
                      height={21}
                      width={40}
                    />
                    <div className={classes.tooltipBlock}>
                      <Label text={t('Use maximum balance capacity')} />
                      <Tooltip
                        title={
                          <>
                            {t('Use maximum balance capacity:')}<br />
                            {t('Enable this option to set a maximum limit on the total balance an employee can accumulate under this policy. If the balance reaches this limit, no additional time off will be accrued until some is used.')}
                          </>
                        }
                      />
                    </div>
                  </div>
                </div>

                {
                  values.use_maximum_balance_capacity ? (
                    <div className={classes.policyForm_row}>
                      <div className={classes.formControl}>
                        <div className={classes.labelBlock}>
                          <Label text={t('Maximum balance')} htmlFor='maximum_balance' />
                          <span className={classes.required}>*</span>
                        </div>
                        <Input
                          placeholder={t('Enter maximum balance')}
                          value={values.maximum_balance}
                          name='maximum_balance'
                          fullWidth
                          onChange={handleChange}
                        />
                      </div>
                      <div></div>
                    </div>
                  ) : null
                }

                <hr className={classes.hr} />
              </>
            ) : null
          }
          {
            (values.allowance_type === 'earned' || values.allowance_type === 'annual_grant') ? (
              <>
                <div className={classes.policyForm_row}>
                  <div className={classes.formControlSwhitchLine}>
                    <Switch
                      onChange={(checked) => handleChange({ target: { name: 'allow_negative_balance', value: checked } })}
                      offColor='#808F94'
                      onColor='#0085FF'
                      uncheckedIcon={false}
                      checkedIcon={false}
                      checked={values.allow_negative_balance || false}
                      height={21}
                      width={40}
                    />
                    <div className={classes.tooltipBlock}>
                      <Label text={t('Allow negative balance')} />
                      <Tooltip
                        title={
                          <>
                            {t('Maximum negative balance:')}<br />
                            {t('Enable this option to allow employees to have a negative balance in their policy. This means employees can take time off even if they have no remaining balance, but the excess will be deducted from future accruals.')}
                          </>
                        }
                      />
                    </div>
                  </div>
                </div>

                {
                  values.allow_negative_balance ? (
                    <div className={classes.policyForm_row}>
                      <div className={classes.formControl}>
                        <div className={classes.labelBlock}>
                          <Label text={t('Maximum negative balance')} htmlFor='maximum_negative_balance' />
                          <span className={classes.required}>*</span>
                        </div>
                        <Input
                          placeholder={t('Enter negative balance')}
                          value={values.maximum_negative_balance}
                          name='maximum_negative_balance'
                          fullWidth
                          type='number'
                          onChange={handleChange}
                        />
                      </div>
                      <div></div>
                    </div>
                  ) : null
                }

                <hr className={classes.hr} />
              </>
            ) : null
          }
          {
            (values.allowance_type === 'earned' || values.allowance_type === 'annual_grant') ? (
              <>
                <div className={classes.policyForm_row}>
                  <div className={classes.formControlSwhitchLine}>
                    <Switch
                      onChange={(checked) => handleChange({ target: { name: 'add_extra_amount_based_on_years_of_service', value: checked } })}
                      offColor='#808F94'
                      onColor='#0085FF'
                      uncheckedIcon={false}
                      checkedIcon={false}
                      checked={values.add_extra_amount_based_on_years_of_service || false}
                      height={21}
                      width={40}
                    />
                    <div className={classes.tooltipBlock}>
                      <Label text={t('Add extra amount based on years of service')} />
                      <Tooltip
                        title={
                          <>
                            {t('Numbers of years at work:')}<br />
                            {t("An additional amount or benefit granted to an employee based on the number of years they have worked at the company. This could include bonuses, allowances, or other forms of compensation that increase with the employee's tenure.")}
                          </>
                        }
                      />
                    </div>
                  </div>
                </div>

                {
                  values.add_extra_amount_based_on_years_of_service ? (
                    <>
                      {
                        values.extra_amounts && values.extra_amounts.map((item, index) => (
                          <div key={index} className={classes.policyForm_row}>
                            <div key={index} className={classNames(classes.policyForm_row, classes.policyForm_rowLast)}>
                              <div className={classes.formControl}>
                                <div className={classes.labelBlock}>
                                  <Label text={t('Number of years at work')} htmlFor='years' />
                                  <span className={classes.required}>*</span>
                                </div>
                                <Input
                                  placeholder={t('Enter years of work')}
                                  value={item.years}
                                  name='years'
                                  fullWidth
                                  type='number'
                                  onChange={(e) => handleExtraAmountChange(index, e.target.name, e.target.value)}
                                />
                              </div>
                              <button className={classes.removeBtn} onClick={() => handleRemoveExtraAmount(index)}>
                                <DeleteIcon fill='#fd0d1b' className={classes.iconButtonRow} />
                              </button>
                            </div>
                            <div key={index} className={classes.policyForm_row}>
                              <div className={classes.formControl}>
                                <div className={classes.labelBlock}>
                                  <Label text={t('Extra amount')} htmlFor='amount' />
                                  <span className={classes.required}>*</span>
                                </div>
                                <Input
                                  placeholder={t('Enter extra amount')}
                                  value={item.amount}
                                  name='amount'
                                  fullWidth
                                  type='number'
                                  onChange={(e) => handleExtraAmountChange(index, e.target.name, e.target.value)}
                                  disabled={!item.years}
                                />
                              </div>
                              <span className={classes.formCalcValue}>
                                {item.years && item.amount && Math.round(item.years * item.amount * 100) / 100}
                              </span>
                            </div>
                          </div>
                        ))
                      }

                      <div className={classes.policyForm_row}>
                        <button
                          type='button'
                          className={classes.addBtn}
                          onClick={addExtraAmount}
                        >+</button>
                      </div>
                    </>
                  ) : null
                }
            
                <hr className={classes.hr} />
              </>
            ) : null
          }
          {
            (values.allowance_type === 'earned' || values.allowance_type === 'unlimited' || values.allowance_type === 'annual_grant') ? (
              <>
                <div className={classes.policyForm_row}>
                  <div className={classes.formControlSwhitchLine}>
                    <Switch
                      onChange={(checked) => handleChange({ target: { name: 'mark_in_time_sheet_excel', value: checked } })}
                      offColor='#808F94'
                      onColor='#0085FF'
                      uncheckedIcon={false}
                      checkedIcon={false}
                      checked={values.mark_in_time_sheet_excel || false}
                      height={21}
                      width={40}
                    />
                    <div className={classes.tooltipBlock}>
                      <Label text={t('Mark in Time Sheet Excel')} />
                      <Tooltip
                        title={
                          <>
                            {t('Mark in Time Sheet Excel:')}<br />
                            {t('This value will be shown on those days in the Time Sheet module when it was taken. Also exported to the Excel file or to any other format which your organization is using and was set up initially. ')}
                          </>
                        }
                      />
                    </div>
                  </div>
                </div>

                {
                  values.mark_in_time_sheet_excel ? (
                    <div className={classes.policyForm_row}>
                      <div className={classes.formControl}>
                        <div className={classes.labelBlock}>
                          <Label text={t('Value in Time Sheet Excel')} htmlFor='value_in_time_sheet_excel' />
                          <span className={classes.required}>*</span>
                        </div>
                        <Input
                          placeholder={t('Enter value')}
                          value={values.value_in_time_sheet_excel}
                          name='value_in_time_sheet_excel'
                          fullWidth
                          onChange={handleChange}
                        />
                      </div>
                      <div></div>
                    </div>
                  ) : null
                }

                <hr className={classes.hr} />
              </>
            ) : null
          }
          {
            (values.allowance_type === 'earned' || values.allowance_type === 'unlimited' || values.allowance_type === 'annual_grant') ? (
              <>
                <div className={classes.policyForm_row}>
                  <div className={classes.formControlSwhitchLine}>
                    <Switch
                      onChange={(checked) => handleChange({ target: { name: 'mark_in_schedule_and_time_sheet', value: checked } })}
                      offColor='#808F94'
                      onColor='#0085FF'
                      uncheckedIcon={false}
                      checkedIcon={false}
                      checked={values.mark_in_schedule_and_time_sheet || false}
                      height={21}
                      width={40}
                    />
                    <div className={classes.tooltipBlock}>
                      <Label text={t('Mark in Schedule and Time Sheet module')} />
                      <Tooltip
                        title={
                          <>
                            {t('Mark in Shedule and Time Sheet module:')}<br />
                            {t('Mark with symbol on those days in the schedule and with colour option for better and fast identification of what policy is used by the employee. The same logic is for the Time Sheet module, in order to show the symbol and colour for better and faster identification of used policy inside the Time Sheet module.')}
                          </>
                        }
                      />
                    </div>
                  </div>
                </div>

                {
                  values.mark_in_schedule_and_time_sheet ? (
                    <div className={classes.policyForm_row}>
                      <div className={classes.formControl}>
                        <div className={classes.labelBlock}>
                          <Label text={t('Choose the symbol')} htmlFor='symbol' />
                          <span className={classes.required}>*</span>
                        </div>
                        <div className={classes.symbolBlock}>
                          <button className={classes.simpleBtn} onClick={() => { handleChange({ target: { name: 'symbol', value: '1' } }) }}><TimeOffSymbol1 className={classNames(classes.symbol, { [classes.active]: values.symbol === '1'})} /></button>
                          <button className={classes.simpleBtn} onClick={() => { handleChange({ target: { name: 'symbol', value: '2' } }) }}><TimeOffSymbol2 className={classNames(classes.symbol, { [classes.active]: values.symbol === '2'})} /></button>
                          <button className={classes.simpleBtn} onClick={() => { handleChange({ target: { name: 'symbol', value: '3' } }) }}><TimeOffSymbol3 className={classNames(classes.symbol, { [classes.active]: values.symbol === '3'})} /></button>
                          <button className={classes.simpleBtn} onClick={() => { handleChange({ target: { name: 'symbol', value: '4' } }) }}><TimeOffSymbol4 className={classNames(classes.symbol, { [classes.active]: values.symbol === '4'})} /></button>
                          <button className={classes.simpleBtn} onClick={() => { handleChange({ target: { name: 'symbol', value: '5' } }) }}><TimeOffSymbol5 className={classNames(classes.symbol, { [classes.active]: values.symbol === '5'})} /></button>
                          <button className={classes.simpleBtn} onClick={() => { handleChange({ target: { name: 'symbol', value: '6' } }) }}><TimeOffSymbol6 className={classNames(classes.symbol, { [classes.active]: values.symbol === '6'})} /></button>
                          <button className={classes.simpleBtn} onClick={() => { handleChange({ target: { name: 'symbol', value: '7' } }) }}><TimeOffSymbol7 className={classNames(classes.symbol, { [classes.active]: values.symbol === '7'})} /></button>
                          <button className={classes.simpleBtn} onClick={() => { handleChange({ target: { name: 'symbol', value: '8' } }) }}><TimeOffSymbol8 className={classNames(classes.symbol, { [classes.active]: values.symbol === '8'})} /></button>
                          <button className={classes.simpleBtn} onClick={() => { handleChange({ target: { name: 'symbol', value: '9' } }) }}><TimeOffSymbol9 className={classNames(classes.symbol, { [classes.active]: values.symbol === '9'})} /></button>
                        </div>
                      </div>
                      <div className={classes.formControl}>
                        <div className={classes.labelBlock}>
                          <Label text={t('Choose the colour')} htmlFor='symbol' />
                          <span className={classes.required}>*</span>
                        </div>
                        <div className={classes.colorBlock}>
                          <InputColor
                            value={values.color}
                            handleInputChange={(color) => handleChange({ target: { name: 'color', value: color } })}
                            placeholder={t('Choose the colour')}
                          />
                        </div>
                      </div>
                    </div>
                  ) : null
                }

                <hr className={classes.hr} />
              </>
            ) : null
          }
        </div>
      </>
    </Content>
  );
});

export default PolicySettings;
