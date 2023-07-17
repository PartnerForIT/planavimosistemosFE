/* eslint-disable camelcase */
import React from 'react';

import Tooltip from '../../Core/Tooltip';
import Label from '../../Core/InputLabel';
import Checkbox from '../../Core/Checkbox/Checkbox2';
import Switch from 'react-switch';
import Input from '../../Core/Input/Input';
import SimpleSelect from '../../Core/SimpleSelect';
import Button from '../../Core/Button/Button';
import moment from 'moment';

import { timeHoursArr } from '../../Helpers/time';

export default ({
  t,
  style,
  handleInputChange,
  handleSystemChange,
  integrationsData,
  iiko_import_date,
  setIikoImportDate,
  importIikoData
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
          <div className={style.separator} />
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

    <div className={style.formLine} />

    <div className={style.labelBlock}>
      <Switch
        onChange={(value) => { handleSystemChange(value, 'excel') }}
        offColor='#808F94'
        onColor='#0085FF'
        uncheckedIcon={false}
        checkedIcon={false}
        name='excel'
        checked={!!integrationsData.excel}
        height={21}
        width={40}
      />
      <div className={style.label}>{t('Use time sheet Excel export (total hours per employee)')}</div>
      <Tooltip title='Use time sheet Excel export (total hours per employee)' />
    </div>

    { integrationsData.excel && (

      <>

      <div className={style.separator} />

      <div className={style.rivile}>
        <div>
          
          <Label text={`${t('Select day type to use for Time Sheet')}`} />

          <div className={style.generalBlock}>
            <Checkbox
              onChange={handleInputChange}
              checked={integrationsData.excel_rest_weekdays}
              label={t('Rest Days on weekdays')}
              name='excel_rest_weekdays'
            />
          </div>

          <div className={style.generalBlock}>
            <Checkbox
              onChange={handleInputChange}
              checked={integrationsData.excel_rest_weekends}
              label={t('Rest Days on weekends')}
              name='excel_rest_weekends'
            />
          </div>

          <div className={style.generalBlock}>
            <Checkbox
              onChange={handleInputChange}
              checked={integrationsData.excel_work_hours}
              label={t('Work Hours')}
              name='excel_work_hours'
            />
          </div>

          <div className={style.generalBlock}>
            <Checkbox
              onChange={handleInputChange}
              checked={integrationsData.excel_break_hours}
              label={t('Break Hours')}
              name='excel_break_hours'
            />
          </div>

          <div className={style.generalBlock}>
            <Checkbox
              onChange={handleInputChange}
              checked={integrationsData.excel_night_work_hours}
              label={t('Night Work Hours')}
              name='excel_night_work_hours'
            />
          </div>

          <div className={style.generalBlock}>
            <Checkbox
              onChange={handleInputChange}
              checked={integrationsData.excel_holiday_hours}
              label={t('Bank Holiday Hours')}
              name='excel_holiday_hours'
            />
          </div>

          <div className={style.generalBlock}>
            <Checkbox
              onChange={handleInputChange}
              checked={integrationsData.excel_overtime_hours}
              label={t('Overtime Hours')}
              name='excel_overtime_hours'
            />
          </div>

          <div className={style.generalBlock}>
            <Checkbox
              onChange={handleInputChange}
              checked={integrationsData.excel_cost}
              label={t('Cost')}
              name='excel_cost'
            />
          </div>
        </div>
        <div>

          <Label text={`${t('Day type marking for Excel')}`} />
          <div className={style.separator} />
          <div className={style.generalBloc2k}>
            <Input
              value={integrationsData.excel_rest_weekdays_code}
              min='1'
              max='2'
              width={40}
              name='excel_rest_weekdays_code'
              onChange={handleInputChange}
            />
          </div>

          <div className={style.generalBlock2}>
            <Input
              value={integrationsData.excel_rest_weekends_code}
              min='1'
              max='2'
              width={40}
              name='excel_rest_weekends_code'
              onChange={handleInputChange}
            />
          </div>
        </div>
      </div>
      </>
      )}

    <div className={style.formLine} />

    <div className={style.labelBlock}>
      <Switch
        onChange={(value) => { handleSystemChange(value, 'iiko') }}
        offColor='#808F94'
        onColor='#0085FF'
        uncheckedIcon={false}
        checkedIcon={false}
        name='iiko'
        checked={!!integrationsData.iiko}
        height={21}
        width={40}
      />
      <div className={style.label}>{t('Use "iiko" POS system for clock in instead of Kiosk')}</div>
      <Tooltip title='Use "iiko" POS system for clock in instead of Kiosk' />
    </div>

    { integrationsData.iiko && (

      <>

      <div className={style.separator} />

      <div className={style.iiko}>
         
        <Label text={`${t('Account custom server link')}`} />
        <div className={style.generalBloc2k}>
          <Input
            value={integrationsData.iiko_link}
            width={400}
            name='iiko_link'
            onChange={handleInputChange}
          />
        </div>

        <div className={style.separator} />

        <Label text={`${t('API login')}`} />
        <div className={style.generalBloc2k}>
          <Input
            value={integrationsData.iiko_login}
            width={400}
            name='iiko_login'
            onChange={handleInputChange}
          />
        </div>

        <div className={style.separator} />

        <Label text={`${t('API key')}`} />
        <div className={style.generalBloc2k}>
          <Input
            value={integrationsData.iiko_key}
            width={400}
            name='iiko_key'
            onChange={handleInputChange}
          />
        </div>

        <div className={style.separator} />

        <div className={style.selectBlock}>
          <div className={style.labelBlock}>
            <Label text={`${t('Choose the connection time')}:`} />
            <Tooltip title='Choose the connection time' />
          </div>
          <SimpleSelect
            handleInputChange={handleInputChange}
            name='iiko_time'
            value={integrationsData.iiko_time}
            options={timeHoursArr}
            withoutSearch
          />
        </div>

        <div className={style.separator} />

        { integrationsData.iiko_last_check && (
        <div className={style.lastCheck}>{'Last successful import: '+moment(integrationsData.iiko_last_check).format('Y MM DD / HH:mm ')+' / '+integrationsData.iiko_imported_count+' employees work times were imported'}</div>
        )}

        <div className={style.separator} />

        <div className={style.generalBloc2k}>
          <div className={style.labelBlock}>
            <Label text={`${t('Manual import')}`} />
          </div>
          <div className={style.manualImport}>
            <Input
              width={200}
              type='date'
              value={iiko_import_date}
              placeholder={t('Select date')}
              onChange={(e) => setIikoImportDate(e.target.value)}
            />
            <Button
              size='normal'
              onClick={() => importIikoData()}
              disabled={!iiko_import_date}
            >
              {t('Manual import')}
            </Button>
          </div>
        </div>
      </div>
      </>
    )}


    <div className={style.formLine} />
  </div>
);
