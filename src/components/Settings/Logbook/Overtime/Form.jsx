import React from 'react';
import Tooltip from '../../../Core/Tooltip';
import Input from '../../../Core/Input/Input';
import Select from '../../../Core/SimpleSelect';
import Checkbox from '../../../Core/Checkbox/Checkbox2.jsx';
import Label from '../../../Core/InputLabel';
import Switch from "react-switch";

const daylyWork = [
  { code: '8', name: 'Over 8 hours' },
  { code: '10', name: 'Over 10 hours' },
  { code: '12', name: 'Over 12 hours' },
];
const weeklyWork = [
  { code: '38', name: 'Over 38 hours' },
  { code: '44', name: 'Over 44 hours' },
  { code: '46', name: 'Over 36 hours' },
  { code: '48', name: 'Over 48 hours' },
  { code: '50', name: 'Over 50 hours' },
];

const saturdayWork = [
  { code: 'overtime', name: 'All hours as Overtime' },
  { code: 'doubletime', name: 'All hours as Doubletime' },
];


export default function Form({ t, style,
  handleInputChange, handleChangeCalculation, overtimeData, submit }) {
  return (
    <div className={style.logbookBlock}>
      <div className={style.generalBlock3}>
        <Label text={t('Overtime calculation')} />
        <Switch
          onChange={handleChangeCalculation}
          offColor={'#808F94'}
          onColor={'#0085FF'}
          uncheckedIcon={false}
          checkedIcon={false}
          name={'approve_flow'}
          checked={overtimeData.status}
          height={21}
          width={40}
        />
        <div className={style.tooltipBlock}>
          <Tooltip title={t('Overtime calculation On/Off. If OFF, everything is slightly grey and can’t be turned on or edited.')} />
        </div>
      </div>
      <div className={!overtimeData.status ? style.disabledBlock : ''}>
        <div className={style.generalBlock2}>
          <Checkbox
            onChange={handleInputChange}
            checked={overtimeData.daily_overtime_enable}
            label={t('Daily work')}
            name={'daily_overtime_enable'}
          />
        </div>
        <div className={style.generalBlock5}>
          <Select
            handleInputChange={handleInputChange}
            name={'daily_overtime'}
            value={overtimeData.daily_overtime}
            options={daylyWork}
          />
        </div>
        <div className={style.generalBlock2}>
          <Checkbox
            onChange={handleInputChange}
            checked={overtimeData.weekly_overtime_enable}
            label={t('Weekly work')}
            name={'weekly_overtime_enable'}
          />
        </div>
        <div className={style.generalBlock5}>
          <Select
            handleInputChange={handleInputChange}
            name={'weekly_overtime'}
            value={overtimeData.weekly_overtime}
            options={weeklyWork}
          />
        </div>
        <div className={style.generalBlock2}>
          <Checkbox
            onChange={handleInputChange}
            checked={overtimeData.saturday_overtime_enable}
            label={t('Saturday work')}
            name={'saturday_overtime_enable'}
          />
        </div>
        <div className={style.generalBlock5}>
          <Select
            handleInputChange={handleInputChange}
            name={'saturday_overtime'}
            value={overtimeData.saturday_overtime}
            options={saturdayWork}
          />
        </div>
        <div className={style.generalBlock2}>
          <Checkbox
            onChange={handleInputChange}
            checked={overtimeData.sunday_overtime_enable}
            label={t('Sunday work')}
            name={'sunday_overtime_enable'}
          />
        </div>
        <div className={style.generalBlock5}>
          <Select
            handleInputChange={handleInputChange}
            name={'saturday_overtime'}
            value={overtimeData.saturday_overtime}
            options={saturdayWork}
          />
        </div>
      </div >
    </div >
  )
}