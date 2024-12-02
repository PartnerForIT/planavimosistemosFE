import React from 'react';
import Switch from 'react-switch';
//import { withStyles } from '@material-ui/core/styles';
//import Radio from '@material-ui/core/Radio';
//import FormControlLabel from '@material-ui/core/FormControlLabel';
import Tooltip from '../../../Core/Tooltip';
import Label from '../../../Core/InputLabel';
//import Input from '../../../Core/Input/Input';
//import SimpleSelect from '../../../Core/SimpleSelect';
//import { timeArr } from '../../../Helpers/time';


export default function Form({
  t,
  style,
  //handleInputChange,
  handleChangeCalculation,
  ClockData,
  //permissions,
  modules,
}) {
  return (
    <form className={style.clockBlock}>
      <div>
        <Label text={`${t('Clock in Mobile APP')} :`} />
        <div className={style.generalBlock6}>
          <Switch
            onChange={() => handleChangeCalculation('mobile_break_time')}
            offColor='#808F94'
            onColor='#0085FF'
            uncheckedIcon={false}
            checkedIcon={false}
            name='mobile_break_time'
            checked={!!ClockData.mobile_break_time}
            height={21}
            width={40}
          />
          <Label text={t('Enable Break Time in Mobile APP session')} />
          <div className={style.tooltipBlock}>
            <Tooltip title={
              t('Enable Break Time in Mobile APP session')
            }
            />
          </div>
        </div>
        <div className={style.generalBlock6}>
          <Switch
            onChange={() => handleChangeCalculation('geolocation_restriction_clock_in')}
            offColor='#808F94'
            onColor='#0085FF'
            uncheckedIcon={false}
            checkedIcon={false}
            name='geolocation_restriction_clock_in'
            checked={!!ClockData.geolocation_restriction_clock_in}
            height={21}
            width={40}
          />
          <Label text={t('Use a Geolocation restriction for Clock In if the Place has a Geolocation set')} />
          <div className={style.tooltipBlock}>
            <Tooltip title={
              t('Use a Geolocation restriction for Clock In if the Place has a Geolocation set')
            }
            />
          </div>
        </div>
        <div className={style.generalBlock6}>
          <Switch
            onChange={() => handleChangeCalculation('geolocation_restriction_clock_out')}
            offColor='#808F94'
            onColor='#0085FF'
            uncheckedIcon={false}
            checkedIcon={false}
            name='geolocation_restriction_clock_out'
            checked={!!ClockData.geolocation_restriction_clock_out}
            height={21}
            width={40}
          />
          <Label text={t('Use a Geolocation restriction for Clock Out if the Place has a Geolocation set')} />
          <div className={style.tooltipBlock}>
            <Tooltip title={
              t('Use a Geolocation restriction for Clock Out if the Place has a Geolocation set')
            }
            />
          </div>
        </div>

        { modules.use_geolocation ? (
          <div className={style.generalBlock6}>
            <Switch
              onChange={() => handleChangeCalculation('geolocation_restriction_leave')}
              offColor='#808F94'
              onColor='#0085FF'
              uncheckedIcon={false}
              checkedIcon={false}
              name='geolocation_restriction_leave'
              checked={!!ClockData.geolocation_restriction_leave}
              height={21}
              width={40}
            />
            <Label text={t('Use Geolocation tracking to identify leaves in specific locations')} />
            <div className={style.tooltipBlock}>
              <Tooltip title={
                t('If this setting is turned on, the mobile app will check every 5 minutes to see if the employee/user is still within the geolocation radius of the registered place. If the location does not have a set geo zone, this rule is simply ignored.')
              }
              />
            </div>
          </div>
        ) : null
        }

        <div className={style.generalBlock6}>
          <Switch
            onChange={() => handleChangeCalculation('photo_clock_in')}
            offColor='#808F94'
            onColor='#0085FF'
            uncheckedIcon={false}
            checkedIcon={false}
            name='photo_clock_in'
            checked={!!ClockData.photo_clock_in}
            height={21}
            width={40}
          />
          <Label text={t('Enable request photo to be taken on Clock In')} />
        </div>
        <div className={style.generalBlock6}>
          <Switch
            onChange={() => handleChangeCalculation('photo_clock_out')}
            offColor='#808F94'
            onColor='#0085FF'
            uncheckedIcon={false}
            checkedIcon={false}
            name='photo_clock_out'
            checked={!!ClockData.photo_clock_out}
            height={21}
            width={40}
          />
          <Label text={t('Enable request photo to be taken on Clock Out')} />
        </div>

        <div className={style.generalBlock6}>
          <Switch
            onChange={() => handleChangeCalculation('auto_clock_out_place_working_time')}
            offColor='#808F94'
            onColor='#0085FF'
            uncheckedIcon={false}
            checkedIcon={false}
            name='auto_clock_out_place_working_time'
            checked={!!ClockData.auto_clock_out_place_working_time}
            height={21}
            width={40}
          />
          <Label text={t('Automatically Clock-Out at the end of the Place Working Time')} />
          <div className={style.tooltipBlock}>
            <Tooltip title={
              t('Automatically Clock-Out the working employees based on the work place they work either via mobile phone or via kiosk solution. It means they have started the work in the place which has assigned kiosk or the Clock-In was performed with regular mobile telephone. If such Place has for the exact day of the week has enabled a checkbox in the Categories/Places, then the time will be stopped at the exact time according the time set. Those days which do not have checked mark turned on, the work time will not be stopped.')
            }
            />
          </div>
        </div>
      </div>
    </form>
  );
}
