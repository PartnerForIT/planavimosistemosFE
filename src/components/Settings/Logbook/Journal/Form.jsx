/* eslint-disable camelcase */
import classnames from 'classnames';
import React from 'react';
import Switch from 'react-switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import { withStyles } from '@material-ui/core/styles';

import Tooltip from '../../../Core/Tooltip';
import Input from '../../../Core/Input/Input';
import Label from '../../../Core/InputLabel';
import Checkbox from '../../../Core/Checkbox/Checkbox2';
import Select from '../../../Core/SimpleSelect';
import CurrencySign from "../../../shared/CurrencySign";

const breakArr = [
  { code: '4', name: 'if workday exceeds 4:30 hours' },
  { code: '6', name: 'if workday exceeds 6 hours' },
  { code: '8', name: 'if workday exceeds 8 hours' },
  { code: '9', name: 'if workday exceeds 9 hours' },
  { code: '14', name: 'if workday exceeds 14 hours' },
];

const durationArr = [
  { code: '30', name: '30 minutes break' },
  { code: '45', name: '45 minutes break' },
  { code: '60', name: '60 minutes break' },
  { code: '90', name: '90 minutes break' },
];

const BlueRadio = withStyles({
  root: {
    color: '#ccc',
    '&$checked': {
      color: '#0085FF',
    },
  },
  checked: {},
})((props) => <Radio color='default' {...props} />);

export default ({
  t,
  style,
  handleInputChange,
  journalData,
  handleChangeApproveFlow,
  handleChangeAutomaticApprove,
  handleChangeAutomaticBreak,
  permissions,
  readOnly,
}) => (

  <div className={style.logbookBlock}>
    <Label text={`${t('General Journal Settings')} :`} />

    {
      permissions.cost && (
        <div className={style.generalBlock}>
          <div className={style.labelText}>{t('Cost, Hourly rate')}</div>
          <Input
            value={journalData.hourly_cost}
            min='1'
            width={40}
            name='hourly_cost'
            onChange={handleInputChange}
            readOnly={readOnly}
          />
          <div className={style.labelText2}><CurrencySign/></div>
          <Tooltip
            title='Cost hourly rate, entry field, and currency symbol based on general settings currency settings'
          />
        </div>
      )
    }

    {
      permissions.profitability && (
        <div className={style.generalBlock}>
          <div className={style.labelText}>{t(`Charge, Hourly rate`)}</div>
          <Input
            value={journalData.hourly_charge}
            min='1'
            width={40}
            name='hourly_charge'
            onChange={handleInputChange}
            readOnly={readOnly}
          />
          <div className={style.labelText2}><CurrencySign/></div>
          <Tooltip
            title='Charge hourly rate, entry field, and currency symbol based on general settings currency settings'
          />
        </div>
      )
    }

    {/* <div className={style.generalBlock2}> */}
    {/*  <Checkbox */}
    {/*    onChange={handleInputChange} */}
    {/*    checked={journalData.show_earned_salary} */}
    {/*    label={t('Show earned salary for employees')} */}
    {/*    name='show_earned_salary' */}
    {/*  /> */}
    {/*  <div className={style.tooltipBlock}> */}
    {/*    <Tooltip */}
    {/*      title='The show earned salary for employees checkbox, */}
    {/*        enables all users to see how much do they earn, this enables view in Mobile and WEB.' */}
    {/*    /> */}
    {/*  </div> */}
    {/* </div> */}
    {
      permissions.comments_photo && (
        <>
          <div className={style.generalBlock2}>
            <Checkbox
              onChange={handleInputChange}
              checked={journalData.end_day_comment}
              label={t('On each work end, comment is required.')}
              name='end_day_comment'
              disabled={readOnly}
            />
            <div className={style.tooltipBlock}>
              <Tooltip
                title={t('On each work end, comment is required.')}
              />
            </div>
          </div>
          <div className={classnames(style.generalBlock2, style.subCheckbox)}>
            <Checkbox
              disabled={readOnly || !journalData.end_day_comment}
              onChange={handleInputChange}
              checked={journalData.end_day_photo}
              label={t('On each work end, photo is required.')}
              name='end_day_photo'
            />
            <div className={style.tooltipBlock}>
              <Tooltip
                title={t('On each work end, photo is required.')}
              />
            </div>
          </div>
        </>
      )
    }

    <div className={style.generalBlock2}>
      <Checkbox
        onChange={handleInputChange}
        checked={journalData.merge_entriesy}
        label={t('Merge daily entries to one')}
        name='merge_entries'
        disabled={readOnly}
      />
      <div className={style.tooltipBlock}>
        <Tooltip
          title={t('Merge daily entries to one')}
        />
      </div>
    </div>

    {/* <div className={style.generalBlock2}> */}
    {/*  <Checkbox */}
    {/*    onChange={handleInputChange} */}
    {/*    checked={journalData.profitability} */}
    {/*    label={t('Calculate and show profitability')} */}
    {/*    name='profitability' */}
    {/*  /> */}
    {/*  <div className={style.tooltipBlock}> */}
    {/*    <Tooltip */}
    {/*      title={t('Calculate and show profitability - this checkbox is related with showing how much do the ' */}
    {/*        + 'organization earn per each spent hour of his employee.')} */}
    {/*    /> */}
    {/*  </div> */}
    {/* </div> */}

    {
      permissions.use_approval_flow && (
        <>
          <div className={style.formLine} />
          <div className={style.generalBlock3}>
            <Label text={t('Use approve flow')} />
            <Switch
              onChange={handleChangeApproveFlow}
              offColor='#808F94'
              onColor='#0085FF'
              uncheckedIcon={false}
              checkedIcon={false}
              name='approve_flow'
              checked={journalData.approve_flow}
              height={21}
              width={40}
              disabled={readOnly}
            />
            <div className={style.tooltipBlock}>
              <Tooltip
                title='Use approve flow on/off - enable the verification flow of the logbook entries,
                      managers can approve or suspend each logbook entry which comes from the employees.)'
              />
            </div>
          </div>
          <div className={style.formLine} />

          <div className={!journalData.approve_flow ? style.disabledBlock : ''}>
            <div className={style.generalBlock3}>
              <Label text={t('Use automatic approval')} />
              <Switch
                onChange={handleChangeAutomaticApprove}
                offColor='#808F94'
                onColor='#0085FF'
                uncheckedIcon={false}
                checkedIcon={false}
                name='approve_flow'
                disabled={readOnly || !journalData.approve_flow}
                checked={journalData.automatic_approval}
                height={21}
                width={40}
              />
              <div className={style.tooltipBlock}>
                <Tooltip
                  title='Use automatic approve flow, this possibility to turn on/off is
                possible only then approve flow is turned on. Automatically approve
                all entries based on the settings at the end of each day, each
                week, each month. (a week is based by general settings week starts)'
                />
              </div>
            </div>
            <div className={(readOnly || !journalData.automatic_approval) ? style.disabledBlock : ''}>
              <Label text={`${t('Entries approved automatically at the end of')} :`} />
              <div className={style.generalBlock4}>
                <FormControlLabel
                  value='approved_at'
                  control={(
                    <BlueRadio
                      checked={journalData.approved_at === 'day'}
                      onChange={handleInputChange}
                      value='day'
                      name='approved_at'
                      label='Each day'
                      inputProps={{ 'aria-label': 'Each day' }}
                    />
                  )}
                  label='Each day'
                />

                <FormControlLabel
                  value='approved_at'
                  control={(
                    <BlueRadio
                      checked={journalData.approved_at === 'week'}
                      onChange={handleInputChange}
                      value='week'
                      name='approved_at'
                      label='Each day'
                      inputProps={{ 'aria-label': 'Each week' }}
                    />
                  )}
                  label='Each week'
                />

                <FormControlLabel
                  value='approved_at'
                  control={(
                    <BlueRadio
                      checked={journalData.approved_at === 'month'}
                      onChange={handleInputChange}
                      value='month'
                      name='approved_at'
                      inputProps={{ 'aria-label': 'Each month' }}
                    />
                  )}
                  label='Each month'
                />
              </div>
            </div>
            <div className={style.formLine} />
          </div>
        </>
      )
    }
    <div className={style.generalBlock3}>
      <Label text={t('Automatic lunch break')} />
      <Switch
        onChange={handleChangeAutomaticBreak}
        offColor='#808F94'
        onColor='#0085FF'
        uncheckedIcon={false}
        checkedIcon={false}
        name='approve_flow'
        checked={journalData.automatic_break}
        height={21}
        disabled={readOnly}
        width={40}
      />
      <div className={style.tooltipBlock}>
        <Tooltip title={t('Automatic lunch break (Turn on/off) ')} />
      </div>
    </div>
    <div className={!journalData.automatic_break ? style.disabledBlock : ''}>
      <div className={style.selectBlock}>
        <Label text={t('Insert break automatically')} />
        <Select
          handleInputChange={handleInputChange}
          name='workday_exceed'
          value={journalData.workday_exceed}
          options={breakArr}
          readOnly={readOnly}
        />
      </div>
      <div className={style.selectBlock}>
        <Label text={t('Duration time')} />
        <Select
          handleInputChange={handleInputChange}
          name='break_duration'
          value={journalData.break_duration}
          options={durationArr}
          readOnly={readOnly}
        />
      </div>
    </div>
  </div>
);
