import React from 'react';
import Switch from 'react-switch';
//import { withStyles } from '@material-ui/core/styles';
//import Radio from '@material-ui/core/Radio';
//import FormControlLabel from '@material-ui/core/FormControlLabel';
import Tooltip from '../../../Core/Tooltip';
import Label from '../../../Core/InputLabel';
import Input from '../../../Core/Input/Input';
import Button from '../../../Core/Button/Button';
//import SimpleSelect from '../../../Core/SimpleSelect';
//import { timeArr } from '../../../Helpers/time';


export default function Form({
  t,
  style,
  handleInputChange,
  //handleChangeCalculation,
  AutoDeleteData,
  onSubmit,
  readOnly
  //permissions,
}) {
  return (
    <form className={style.autoDeleteBlock}>
      <div>
        <div className={style.generalBlock}>
          <Switch
            onChange={() => handleInputChange({ target: { name: 'data_delete', value: !AutoDeleteData.data_delete, type: 'checkbox' } })}
            offColor='#808F94'
            onColor='#FFBF23'
            uncheckedIcon={false}
            checkedIcon={false}
            name='data_delete'
            checked={!!AutoDeleteData.data_delete}
            height={21}
            width={40}
          />
          <Label text={t('Activate Auto Data Delete after amount of days')} />

          <div className={style.inputDays}>
            <Input
              value={AutoDeleteData.data_delete_days}
              name='data_delete_days'
              type='number'
              min='1'
              onChange={handleInputChange}
            />
          </div>
          
          <div className={style.tooltipBlock}>
            <Tooltip title={
              <>
                {t("Auto data deletion helps manage private data, such as geolocation coordinates, face photos from clock-in/clock-out, and images taken when employees finish work or leave the workplace. This feature ensures the automatic removal of such data based on your organization's settings and the days terms which have been set in this rule")}
                <br /><br />
                {t("After applying this rule, the system starts checking every night what needs to be deleted.")}
              </>
            }
            />
          </div>
        </div>
        <div className={style.formLine} />
        <Button onClick={onSubmit} disabled={readOnly} >{t('Apply')}</Button>
      </div>
    </form>
  );
}
