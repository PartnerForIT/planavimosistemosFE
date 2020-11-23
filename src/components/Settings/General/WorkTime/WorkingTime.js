import React from 'react';
import { useTranslation } from 'react-i18next';
import Label from '../../../Core/InputLabel';
import Tooltip from '../../../Core/Tooltip';
import SimpleSelect from '../../../Core/SimpleSelect';
import timeArr from '../../../Helpers/time';
import Checkbox from '../../../Core/Checkbox/Checkbox2.jsx';
import Button from '../../../Core/Button/Button';

export default function WorkingTime({ styles, days,
  SaveTime, handleChangeDays, startTime, handleChangeStartTime, saveTime }) {
  const { t } = useTranslation();
  return (
    <div className={styles.workigTime}>
      <div className={styles.startWeek}>
        <div className={styles.labelBlock}>
          <Label text={t('Working Time')} />
          <Tooltip title={'Working Time'} />
        </div>
        {Object.keys(days).map((item, index) =>
          <div key={item + index} className={styles.workigTime__inner}>
            <Checkbox
              onChange={handleChangeDays}
              checked={days[item]}
              label={t(`${item}`)}
              name={item}
            />
            <SimpleSelect
              handleInputChange={handleChangeStartTime}
              name={`start${index + 1}`}
              fullWidth
              value={startTime[`start${index + 1}`]}
              options={timeArr}
            />
            <div className={styles.workigTime__to}>To</div>
            <SimpleSelect
              handleInputChange={handleChangeStartTime}
              name={`finish${index + 1}`}
              fullWidth
              value={startTime[`finish${index + 1}`]}
              options={timeArr}
            />
          </div>
        )}
        <Button inverse onClick={() => saveTime()} >
          {t('Save')}
        </Button>
        <div className={styles.formLine}></div>
      </div>
    </div>
  )
}

