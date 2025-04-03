/* eslint-disable camelcase,no-confusing-arrow */
import React, {
  useCallback, useEffect, useState,
} from 'react';
import { useTranslation } from 'react-i18next';

import Content from './Content';
import Input from '../../../Core/Input/Input';
import Label from '../../../Core/InputLabel';
import Textarea from '../../../Core/Textarea/Textarea';
import classes from '../timeoff.module.scss';
import Switch from 'react-switch';
import Select from '../../../Core/SimpleSelect';
import Tooltip from '../../../Core/Tooltip';

const initialValues = {
  name: '',
  type: '',
  description: '',
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

const PolicySettings = React.memo(({
  activePolicy,
  onEditPolicy,
}) => {
  const { t } = useTranslation();
  const [values, setValues] = useState(initialValues);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  useEffect(() => {
    if (activePolicy) {
      setValues(activePolicy);
    } else {
      setValues(initialValues);
    }
  }, [activePolicy]);
    

  //use_approve_flow
  //set_default
  //private


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
                value={values.description}
                className={classes.textarea}
                name='description'
                fullWidth
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
                onChange={() => handleChange({ target: { name: 'use_approve_flow', value: !values.use_approve_flow } })}
                offColor='#808F94'
                onColor='#0085FF'
                uncheckedIcon={false}
                checkedIcon={false}
                name='use_approve_flow'
                checked={values.use_approve_flow}
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
                onChange={() => handleChange({ target: { name: 'set_default', value: !values.set_default } })}
                offColor='#808F94'
                onColor='#0085FF'
                uncheckedIcon={false}
                checkedIcon={false}
                name='set_default'
                checked={values.set_default}
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
                onChange={() => handleChange({ target: { name: 'private', value: !values.private } })}
                offColor='#808F94'
                onColor='#0085FF'
                uncheckedIcon={false}
                checkedIcon={false}
                name='private'
                checked={values.private}
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
            values.allowance_type === 'earned' && (
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
                    />
                  </div>
                </div>
              </>
            )
          }
        </div>
      </>
    </Content>
  );
});

export default PolicySettings;
