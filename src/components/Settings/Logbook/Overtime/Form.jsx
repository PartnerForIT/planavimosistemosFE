import React from 'react';
import Switch from 'react-switch';
import { withStyles } from '@material-ui/core/styles';
import Radio from '@material-ui/core/Radio';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Tooltip from '../../../Core/Tooltip';
import Select from '../../../Core/SimpleSelect';
import Checkbox from '../../../Core/Checkbox/Checkbox2';
import Label from '../../../Core/InputLabel';
import Input from '../../../Core/Input/Input';

const daylyWork = [
  {
    code: '8',
    name: 'Over 8 hours',
  },
  {
    code: '9',
    name: 'Over 9 hours',
  },
  {
    code: '10',
    name: 'Over 10 hours',
  },
  {
    code: '12',
    name: 'Over 12 hours',
  },
  {
    code: '14',
    name: 'Over 14 hours',
  },
  {
    code: '16',
    name: 'Over 16 hours',
  },
  {
    code: '18',
    name: 'Over 18 hours',
  },
  {
    code: '20',
    name: 'Over 20 hours',
  },
];
const weeklyWork = [
  {
    code: '38',
    name: 'Over 38 hours',
  },
  {
    code: '44',
    name: 'Over 44 hours',
  },
  {
    code: '46',
    name: 'Over 36 hours',
  },
  {
    code: '48',
    name: 'Over 48 hours',
  },
  {
    code: '50',
    name: 'Over 50 hours',
  },
];

const saturdayWork = [
  {
    code: 'overtime',
    name: 'All hours as Overtime',
  },
  {
    code: 'doubletime',
    name: 'All hours as Doubletime',
  },
];

const BlueRadio = withStyles({
  root: {
    color: '#ccc',
    '&$checked': {
      color: '#FFBF23',
    },
  },
  checked: {},
})((props) => <Radio color='default' {...props} />);

export default function Form({
  t,
  style,
  handleInputChange,
  handleChangeCalculation,
  overtimeData,
  readOnly,
}) {
  return (
    <form className={style.logbookBlock}>
      <div className={style.generalBlock3}>
        <Label text={t('Overtime calculation')} />
        <Switch
          onChange={handleChangeCalculation}
          offColor='#808F94'
          onColor='#FFBF23'
          uncheckedIcon={false}
          checkedIcon={false}
          name='approve_flow'
          checked={!!overtimeData.status}
          height={21}
          width={40}
          disabled={readOnly}
        />
        <div className={style.tooltipBlock}>
          <Tooltip title={
            t('Overtime calculation On/Off. If OFF, everything is slightly grey and can’t be turned on or edited.')
          }
          />
        </div>
      </div>
      <div className={!overtimeData.status ? style.disabledBlock : ''}>
        <div className={style.generalBlock2}>
          <Checkbox
            onChange={handleInputChange}
            checked={!!overtimeData.daily_overtime_enable}
            label={t('Daily work')}
            name='daily_overtime_enable'
            disabled={readOnly}
          />
        </div>
        { !!overtimeData.daily_overtime_enable ?
          <div className={style.generalBlock2}>
            <Checkbox
              onChange={handleInputChange}
              checked={!!overtimeData.ignore_daily_overtime_enable}
              label={t('Ignore daily overtime for next clock in')}
              name='ignore_daily_overtime_enable'
              disabled={readOnly}
            />
          </div> : null
        }
        <div className={style.generalBlock5}>
          <Select
            handleInputChange={handleInputChange}
            name='daily_overtime'
            value={overtimeData.daily_overtime ?? daylyWork[0].code}
            options={daylyWork.map((item) => { return {...item, name: t(item.name)}})}
            readOnly={readOnly}
          />
        </div>
        <div className={style.generalBlock2}>
          <Checkbox
            onChange={handleInputChange}
            checked={!!overtimeData.weekly_overtime_enable}
            label={t('Weekly work')}
            name='weekly_overtime_enable'
            disabled={readOnly}
          />
        </div>
        <div className={style.generalBlock5}>
          <Select
            handleInputChange={handleInputChange}
            name='weekly_overtime'
            value={overtimeData.weekly_overtime ?? weeklyWork[0].code}
            options={weeklyWork.map((item) => { return {...item, name: t(item.name)}})}
            readOnly={readOnly}
          />
        </div>
        <div className={style.generalBlock2}>
          <Checkbox
            onChange={handleInputChange}
            checked={!!overtimeData.saturday_overtime_enable}
            label={t('Saturday work')}
            name='saturday_overtime_enable'
            disabled={readOnly}
          />
        </div>
        <div className={style.generalBlock5}>
          <Select
            handleInputChange={handleInputChange}
            name='saturday_overtime'
            value={overtimeData.saturday_overtime ?? saturdayWork[0].code}
            options={saturdayWork.map((item) => { return {...item, name: t(item.name)}})}
            readOnly={readOnly}
          />
        </div>
        <div className={style.generalBlock2}>
          <Checkbox
            onChange={handleInputChange}
            checked={!!overtimeData.sunday_overtime_enable}
            label={t('Sunday work')}
            name='sunday_overtime_enable'
            disabled={readOnly}
          />
        </div>
        <div className={style.generalBlock5}>
          <Select
            handleInputChange={handleInputChange}
            name='sunday_overtime'
            value={overtimeData.sunday_overtime ?? saturdayWork[0].code}
            options={saturdayWork.map((item) => { return {...item, name: t(item.name)}})}
            readOnly={readOnly}
          />
        </div>
      </div>
      <div className={(readOnly || !overtimeData.status) ? style.disabledBlock : ''}>
        <Label text={`${t('Overtime increased default rate')} :`} />

        <div className={style.radioBlock}>
          <div className={style.radioBlockItem}>
            <FormControlLabel
              value='1'
              control={(
                <BlueRadio
                  checked={overtimeData.overtime_type === '1'}
                  onChange={handleInputChange}
                  value='1'
                  name='overtime_type'
                  label={t('By percentage')}
                  inputProps={{ 'aria-label': t('By percentage') }}
                />
              )}
              label={t('By percentage')}
            />
            <Input
              width={60}
              type='number'
              min={0}
              step={0.1}
              name='overtime_rate'
              disabled={overtimeData.overtime_type !== '1'}
              value={overtimeData.overtime_type === '1' ? overtimeData.overtime_rate : ''}
              onChange={handleInputChange}
            />
            <span className={style.value}>%</span>
          </div>
          <div className={style.radioBlockItem}>

            <FormControlLabel
              value='2'
              control={(
                <BlueRadio
                  checked={overtimeData.overtime_type === '2'}
                  onChange={handleInputChange}
                  value='2'
                  name='overtime_type'
                  label={t('By multiplication')}
                  inputProps={{ 'aria-label': t('By multiplication') }}
                />
              )}
              label={t('By multiplication')}
            />
            <Input
              width={60}
              type='number'
              min={0}
              step={0.1}
              name='overtime_rate'
              disabled={overtimeData.overtime_type !== '2'}
              value={overtimeData.overtime_type === '2' ? overtimeData.overtime_rate : ''}
              onChange={handleInputChange}
            />
            <span className={style.value}>X</span>
          </div>
          <div className={style.radioBlockItem}>
            <FormControlLabel
              value='3'
              control={(
                <BlueRadio
                  checked={overtimeData.overtime_type === '3'}
                  onChange={handleInputChange}
                  value='3'
                  name='overtime_type'
                  label={t('Fixed hour rate')}
                  inputProps={{ 'aria-label': t('Fixed hour rate') }}
                />
              )}
              label={t('Fixed hour rate')}
            />
            <Input
              width={60}
              type='number'
              min={0}
              step={0.1}
              name='overtime_rate'
              disabled={overtimeData.overtime_type !== '3'}
              value={overtimeData.overtime_type === '3' ? overtimeData.overtime_rate : ''}
              onChange={handleInputChange}
            />
            <span className={style.value}>$</span>
          </div>
        </div>
      </div>
    </form>
  );
}
