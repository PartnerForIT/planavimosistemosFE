import React from 'react';
import { useTranslation } from 'react-i18next';
import Label from '../../../Core/InputLabel';
import Tooltip from '../../../Core/Tooltip';
import SimpleSelect from '../../../Core/SimpleSelect';
import timeArr from '../../../Helpers/time';
import Checkbox from '../../../Core/Checkbox/Checkbox2.jsx';

export default function WorkingTime({ styles, days, inputValues, handleInputChange, handleChangeDays }) {
  const { t } = useTranslation();
  return (
    <div className={styles.workigTime}>
      <div className={styles.startWeek}>

        <div className={styles.labelBlock}>
          <Label text={t('Working Time')} />
          <Tooltip title={'Working Time'} />
        </div>
        <div className={styles.workigTime__inner}>
          <Checkbox
            onChange={handleChangeDays}
            checked={days.monday}
            label={t('Monday')}
            name='monday'
          />
          <SimpleSelect
            handleInputChange={handleInputChange}
            name="monday_start"
            fullWidth
            value={inputValues.week_start_time}
            options={timeArr}
          />
          <div className={styles.workigTime__to}>To</div>
          <SimpleSelect
            handleInputChange={handleInputChange}
            name="monday_finish"
            fullWidth
            value={inputValues.week_start_time}
            options={timeArr}
          />
        </div>

        <div className={styles.workigTime__inner}>
          <Checkbox
            onChange={handleChangeDays}
            checked={days.monday}
            label={t('Tuesday')}
            name='tuesday'
          />
          <SimpleSelect
            handleInputChange={handleInputChange}
            name="tuesday_start"
            fullWidth
            value={inputValues.week_start_time}
            options={timeArr}
          />
          <div className={styles.workigTime__to}>To</div>
          <SimpleSelect
            handleInputChange={handleInputChange}
            name="tuesday_finish"
            fullWidth
            value={inputValues.week_start_time}
            options={timeArr}
          />
        </div>



        <div className={styles.formLine}></div>
      </div>
    </div>
  )
}

