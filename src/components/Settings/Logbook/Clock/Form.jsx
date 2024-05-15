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
      </div>
    </form>
  );
}
