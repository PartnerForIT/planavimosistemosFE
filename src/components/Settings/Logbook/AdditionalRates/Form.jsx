import React from 'react';
import Switch from 'react-switch';
import { withStyles } from '@material-ui/core/styles';
import Radio from '@material-ui/core/Radio';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Tooltip from '../../../Core/Tooltip';
import Label from '../../../Core/InputLabel';
import Input from '../../../Core/Input/Input';
import SimpleSelect from '../../../Core/SimpleSelect';
import { timeArr } from '../../../Helpers/time';

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
  AdditionalRatesData,
  permissions,
}) {
  return (
    <form className={style.additionalRatesBlock}>
      {
        (permissions.rates && permissions.night_rates) && (
          <>
            <div>
              <div className={style.generalBlock3}>
                <Label text={t('Night time rates')} />
                <Switch
                  onChange={() => handleChangeCalculation('night_time')}
                  offColor='#808F94'
                  onColor='#FFBF23'
                  uncheckedIcon={false}
                  checkedIcon={false}
                  name='night_time'
                  checked={!!AdditionalRatesData.night_time}
                  height={21}
                  width={40}
                />
                <div className={style.tooltipBlock}>
                  <Tooltip title={
                    t('Night time rates')
                  }
                  />
                </div>
              </div>
              <div className={(!AdditionalRatesData.night_time) ? style.disabledBlock : ''}>
                <div className={style.generalBlock7}>
                  <Label text={`${t('Night rates from/to')} :`} />
                  <div className={style.fromToInput}>
                    <SimpleSelect
                      handleInputChange={handleInputChange}
                      name='night_time_time_start'
                      value={AdditionalRatesData.night_time_time_start}
                      options={timeArr}
                      withoutSearch
                    />
                    -
                    <SimpleSelect
                      handleInputChange={handleInputChange}
                      name='night_time_time_end'
                      value={AdditionalRatesData.night_time_time_end}
                      options={timeArr}
                      withoutSearch
                    />
                  </div>
                </div>

                <Label text={`${t('Rates during the work at night time increases the default rate')} :`} />

                <div className={style.radioBlock}>
                  <div className={style.radioBlockItem}>
                    <FormControlLabel
                      value='1'
                      control={(
                        <BlueRadio
                          checked={AdditionalRatesData.night_time_type*1 === 1}
                          onChange={handleInputChange}
                          value='1'
                          name='night_time_type'
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
                      name='night_time_rate'
                      disabled={AdditionalRatesData.night_time_type*1 !== 1}
                      value={AdditionalRatesData.night_time_type*1 === 1 ? AdditionalRatesData.night_time_rate : ''}
                      onChange={handleInputChange}
                    />
                    <span className={style.value}>%</span>
                  </div>
                  <div className={style.radioBlockItem}>

                    <FormControlLabel
                      value='2'
                      control={(
                        <BlueRadio
                          checked={AdditionalRatesData.night_time_type*1 === 2}
                          onChange={handleInputChange}
                          value='2'
                          name='night_time_type'
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
                      name='night_time_rate'
                      disabled={AdditionalRatesData.night_time_type*1 !== 2}
                      value={AdditionalRatesData.night_time_type*1 === 2 ? AdditionalRatesData.night_time_rate : ''}
                      onChange={handleInputChange}
                    />
                    <span className={style.value}>X</span>
                  </div>
                  <div className={style.radioBlockItem}>
                    <FormControlLabel
                      value='3'
                      control={(
                        <BlueRadio
                          checked={AdditionalRatesData.night_time_type*1 === 3}
                          onChange={handleInputChange}
                          value='3'
                          name='night_time_type'
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
                      name='night_time_rate'
                      disabled={AdditionalRatesData.night_time_type*1 !== 3}
                      value={AdditionalRatesData.night_time_type*1 === 3 ? AdditionalRatesData.night_time_rate : ''}
                      onChange={handleInputChange}
                    />
                    <span className={style.value}>$</span>
                  </div>
                </div>
              </div>
            </div>
            <div className={style.formLine} />
          </>
        )
      }
      {
        (permissions.rates && permissions.holiday_rates) && (
          <>
            <div>
              <div className={style.generalBlock3}>
                <Label text={t('Work on Holiday time rates')} />
                <Switch
                  onChange={() => handleChangeCalculation('holiday')}
                  offColor='#808F94'
                  onColor='#FFBF23'
                  uncheckedIcon={false}
                  checkedIcon={false}
                  name='holiday'
                  checked={!!AdditionalRatesData.holiday}
                  height={21}
                  width={40}
                />
                <div className={style.tooltipBlock}>
                  <Tooltip title={
                    t('Work on Holiday time rates')
                  }
                  />
                </div>
              </div>
              <div className={(!AdditionalRatesData.holiday) ? style.disabledBlock : ''}>
                <div className={style.generalBlock3}>
                  <Label text={t('Take Company Holidays as National Holidays')} />
                  <Switch
                    onChange={() => handleChangeCalculation('holiday_company')}
                    offColor='#808F94'
                    onColor='#FFBF23'
                    uncheckedIcon={false}
                    checkedIcon={false}
                    name='holiday_company'
                    checked={!!AdditionalRatesData.holiday_company}
                    height={21}
                    width={40}
                  />
                </div>

                <div className={style.generalBlock3}>
                  <Label text={t('Ignore night time during the Holidays')} />
                  <Switch
                    onChange={() => handleChangeCalculation('ignore_holiday_night_time')}
                    offColor='#808F94'
                    onColor='#FFBF23'
                    uncheckedIcon={false}
                    checkedIcon={false}
                    name='ignore_holiday_night_time'
                    checked={!!AdditionalRatesData.ignore_holiday_night_time}
                    height={21}
                    width={40}
                  />
                </div>

                <Label text={`${t('Rates during the work at holiday time increases the default rate')} :`} />

                <div className={style.radioBlock}>
                  <div className={style.radioBlockItem}>
                    <FormControlLabel
                      value='1'
                      control={(
                        <BlueRadio
                          checked={AdditionalRatesData.holiday_type*1 === 1}
                          onChange={handleInputChange}
                          value='1'
                          name='holiday_type'
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
                      name='holiday_rate'
                      disabled={AdditionalRatesData.holiday_type*1 !== 1}
                      value={AdditionalRatesData.holiday_type*1 === 1 ? AdditionalRatesData.holiday_rate : ''}
                      onChange={handleInputChange}
                    />
                    <span className={style.value}>%</span>
                  </div>
                  <div className={style.radioBlockItem}>

                    <FormControlLabel
                      value='2'
                      control={(
                        <BlueRadio
                          checked={AdditionalRatesData.holiday_type*1 === 2}
                          onChange={handleInputChange}
                          value='2'
                          name='holiday_type'
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
                      name='holiday_rate'
                      disabled={AdditionalRatesData.holiday_type*1 !== 2}
                      value={AdditionalRatesData.holiday_type*1 === 2 ? AdditionalRatesData.holiday_rate : ''}
                      onChange={handleInputChange}
                    />
                    <span className={style.value}>X</span>
                  </div>
                  <div className={style.radioBlockItem}>
                    <FormControlLabel
                      value='3'
                      control={(
                        <BlueRadio
                          checked={AdditionalRatesData.holiday_type*1 === 3}
                          onChange={handleInputChange}
                          value='3'
                          name='holiday_type'
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
                      name='holiday_rate'
                      disabled={AdditionalRatesData.holiday_type*1 !== 3}
                      value={AdditionalRatesData.holiday_type*1 === 3 ? AdditionalRatesData.holiday_rate : ''}
                      onChange={handleInputChange}
                    />
                    <span className={style.value}>$</span>
                  </div>
                </div>
              </div>
            </div>
            <div className={style.formLine} />
          </>
        )
      }
      {
        (permissions.rates && permissions.night_rates && permissions.holiday_rates) && (
          <>
            <div>
            
              <div className={(!AdditionalRatesData.holiday || !AdditionalRatesData.night_time || !!AdditionalRatesData.ignore_holiday_night_time) ? style.disabledBlock : ''}>
                <Label text={`${t('Rates during the work at holiday and night time increases the default rate')} :`} />

                <div className={style.radioBlock}>
                  <div className={style.radioBlockItem}>
                    <FormControlLabel
                      value='1'
                      control={(
                        <BlueRadio
                          checked={AdditionalRatesData.holiday_night_type*1 === 1}
                          onChange={handleInputChange}
                          value='1'
                          name='holiday_night_type'
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
                      name='holiday_night_rate'
                      disabled={AdditionalRatesData.holiday_night_type*1 !== 1}
                      value={AdditionalRatesData.holiday_night_type*1 === 1 ? AdditionalRatesData.holiday_night_rate : ''}
                      onChange={handleInputChange}
                    />
                    <span className={style.value}>%</span>
                  </div>
                  <div className={style.radioBlockItem}>

                    <FormControlLabel
                      value='2'
                      control={(
                        <BlueRadio
                          checked={AdditionalRatesData.holiday_night_type*1 === 2}
                          onChange={handleInputChange}
                          value='2'
                          name='holiday_night_type'
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
                      name='holiday_night_rate'
                      disabled={AdditionalRatesData.holiday_night_type*1 !== 2}
                      value={AdditionalRatesData.holiday_night_type*1 === 2 ? AdditionalRatesData.holiday_night_rate : ''}
                      onChange={handleInputChange}
                    />
                    <span className={style.value}>X</span>
                  </div>
                  <div className={style.radioBlockItem}>
                    <FormControlLabel
                      value='3'
                      control={(
                        <BlueRadio
                          checked={AdditionalRatesData.holiday_night_type*1 === 3}
                          onChange={handleInputChange}
                          value='3'
                          name='holiday_night_type'
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
                      name='holiday_night_rate'
                      disabled={AdditionalRatesData.holiday_night_type*1 !== 3}
                      value={AdditionalRatesData.holiday_night_type*1 === 3 ? AdditionalRatesData.holiday_night_rate : ''}
                      onChange={handleInputChange}
                    />
                    <span className={style.value}>$</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )
      }
    </form>
  );
}
