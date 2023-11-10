/* eslint-disable camelcase */
import React from 'react';

import Tooltip from '../../Core/Tooltip';
import Label from '../../Core/InputLabel';
import Checkbox from '../../Core/Checkbox/Checkbox2';

export default ({
  t,
  style,
  handleInputChange,
  timeSheetData,
  AdditionalRates,
}) => (

  <div className={style.timeSheetBlock}>
    <div className={style.timeSheet__label}>
      <Label text={`${t('Select hours types to show in Time Sheet')}`} />
      <Tooltip title={t('Selecting or deselecting the value will control the data you would like to see in the Time Sheet for all users who are using this module. If deselected - such data row will be excluded from the module.')} />
    </div>

    <div className={style.generalBlock}>
      <Checkbox
        onChange={handleInputChange}
        checked={timeSheetData.total_hours}
        label={t('Total Hours')}
        name='total_hours'
      />
    </div>

    <div className={style.generalBlock}>
      <Checkbox
        onChange={handleInputChange}
        checked={timeSheetData.worked_hours}
        label={t('Worked Hours')}
        name='worked_hours'
      />
    </div>

    <div className={style.generalBlock}>
      <Checkbox
        onChange={handleInputChange}
        checked={timeSheetData.break_hours}
        label={t('Break Hours')}
        name='break_hours'
      />
    </div>
    {
      (AdditionalRates.night_time) && (
        <div className={style.generalBlock}>
          <Checkbox
            onChange={handleInputChange}
            checked={timeSheetData.night_hours}
            label={t('Night Work Hours')}
            name='night_hours'
          />
        </div>
      )
    }
    {
      (AdditionalRates.holiday) && (
        <div className={style.generalBlock}>
          <Checkbox
            onChange={handleInputChange}
            checked={timeSheetData.holiday_hours}
            label={t('Work on Bank Holiday Hours')}
            name='holiday_hours'
          />
        </div>
      )
    }

    <div className={style.generalBlock}>
      <Checkbox
        onChange={handleInputChange}
        checked={timeSheetData.overtime_hours}
        label={t('Overtime Hours')}
        name='overtime_hours'
      />
    </div>

    <Label text={`${t('Select which calculation to show in Time Sheet')}`} />

    <div className={style.generalBlock}>
      <Checkbox
        onChange={handleInputChange}
        checked={timeSheetData.show_costs}
        label={t('Show Costs')}
        name='show_costs'
      />
    </div>

    <Label text={`${t('Select day types to show for Time Sheet')}`} />

    <div className={style.generalBlock}>
      <Checkbox
        onChange={handleInputChange}
        checked={timeSheetData.working_days}
        label={t('Working Days')}
        name='working_days'
      />
    </div>

  </div>
);
