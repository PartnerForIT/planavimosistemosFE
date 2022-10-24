/* eslint-disable camelcase */
import React from 'react';

import Tooltip from '../../Core/Tooltip';
import Label from '../../Core/InputLabel';
import Checkbox from '../../Core/Checkbox/Checkbox2';
import Switch from 'react-switch';
import Input from '../../Core/Input/Input';

export default ({
  t,
  style,
  handleInputChange,
  handleSystemChange,
  integrationsData,
}) => (

  <div className={style.integrationsBlock}>

    <div className={style.labelBlock}>
      <Switch
        onChange={(value) => { handleSystemChange(value, 'rivile') }}
        offColor='#808F94'
        onColor='#0085FF'
        uncheckedIcon={false}
        checkedIcon={false}
        name='rivile'
        checked={!!integrationsData.rivile}
        height={21}
        width={40}
      />
      <div className={style.label}>{t('User Rivilé .EIP time sheet export')}</div>
      <Tooltip title='User Rivilé .EIP time sheet export' />
    </div>

    { integrationsData.rivile && (

      <>
      <div className={style.formLine} />

      <div className={style.separator} />

      <div className={style.rivile}>
        <div>
          <Label text={`${t('Select hours to use for Rivilé')}`} />

          <div className={style.generalBlock}>
            <Checkbox
              onChange={handleInputChange}
              checked={integrationsData.rivile_worked_hours}
              label={t('Worked Hours')}
              name='rivile_worked_hours'
            />
          </div>

          <div className={style.generalBlock}>
            <Checkbox
              onChange={handleInputChange}
              checked={integrationsData.rivile_break_hours}
              label={t('Break Hours')}
              name='rivile_break_hours'
            />
          </div>

          <div className={style.generalBlock}>
            <Checkbox
              onChange={handleInputChange}
              checked={integrationsData.rivile_night_hours}
              label={t('Night Work Hours')}
              name='rivile_night_hours'
            />
          </div>

          <div className={style.generalBlock}>
            <Checkbox
              onChange={handleInputChange}
              checked={integrationsData.rivile_holiday_hours}
              label={t('Work on Bank Holiday Hours')}
              name='rivile_holiday_hours'
            />
          </div>

          <div className={style.generalBlock}>
            <Checkbox
              onChange={handleInputChange}
              checked={integrationsData.rivile_overtime_hours}
              label={t('Overtime Hours')}
              name='rivile_overtime_hours'
            />
          </div>

          <div className={style.separator} />
          <Label text={`${t('Select day type to use for Time Sheet')}`} />

          <div className={style.generalBlock}>
            <Checkbox
              onChange={handleInputChange}
              checked={integrationsData.rivile_working_days}
              label={t('Working days')}
              name='rivile_working_days'
            />
          </div>

          <div className={style.generalBlock}>
            <Checkbox
              onChange={handleInputChange}
              checked={integrationsData.rivile_rest_days}
              label={t('Rest days')}
              name='rivile_rest_days'
            />
          </div>

          <div className={style.separator} />
          <Label text={`${t('Fraction number')}`} />

          <div className={style.generalBlock2}>
            <Input
              value={integrationsData.rivile_fraction_number}
              min='1'
              width={100}
              name='rivile_fraction_number'
              onChange={handleInputChange}
            />
          </div>

          <div className={style.separator} />

          <div className={style.generalBlock3}>
            <Label text={t('Use Object/Set ID')} />
            <Switch
              onChange={(value) => { handleSystemChange(value, 'rivile_use_object') }}
              offColor='#808F94'
              onColor='#0085FF'
              uncheckedIcon={false}
              checkedIcon={false}
              checked={integrationsData.rivile_use_object}
              height={21}
              width={40}
            />
          </div>

          <div className={style.generalBlock3}>
            <Label text={t('Use Unit from Places')} />
            <Switch
              onChange={(value) => { handleSystemChange(value, 'rivile_use_places_unit') }}
              offColor='#808F94'
              onColor='#0085FF'
              uncheckedIcon={false}
              checkedIcon={false}
              checked={integrationsData.rivile_use_places_unit}
              height={21}
              width={40}
            />
          </div>
        </div>
        <div>
          <Label text={`${t('Hour code in Rivilé (12 symbols)')}`} />
          <div className={style.generalBlock2}>
            <Input
              value={integrationsData.rivile_worked_hours_code}
              min='12'
              max='12'
              width={130}
              name='rivile_worked_hours_code'
              onChange={handleInputChange}
            />
          </div>

          <div className={style.generalBlock2}>
            <Input
              value={integrationsData.rivile_break_hours_code}
              min='12'
              max='12'
              width={130}
              name='rivile_break_hours_code'
              onChange={handleInputChange}
            />
          </div>
          
          <div className={style.generalBlock2}>
            <Input
              value={integrationsData.rivile_night_hours_code}
              min='12'
              max='12'
              width={130}
              name='rivile_night_break_code'
              onChange={handleInputChange}
            />
          </div>

          <div className={style.generalBlock2}>
            <Input
              value={integrationsData.rivile_holiday_hours_code}
              min='12'
              max='12'
              width={130}
              name='rivile_holiday_hours_code'
              onChange={handleInputChange}
            />
          </div>

          <div className={style.generalBlock2}>
            <Input
              value={integrationsData.rivile_overtime_hours_code}
              min='12'
              max='12'
              width={130}
              name='rivile_overtime_hours_code'
              onChange={handleInputChange}
            />
          </div>

          <div className={style.separator} />
          <Label text={`${t('Day type marking in Rivilé')}`} />

          <div className={style.generalBloc2k}>
            <Input
              value={integrationsData.rivile_working_days_code}
              min='12'
              max='12'
              width={40}
              name='rivile_working_days_code'
              onChange={handleInputChange}
            />
          </div>

          <div className={style.generalBlock2}>
            <Input
              value={integrationsData.rivile_rest_days_code}
              min='12'
              max='12'
              width={40}
              name='rivile_rest_days_code'
              onChange={handleInputChange}
            />
          </div>
        </div>
      </div>
      </>
    )}
  </div>
);
