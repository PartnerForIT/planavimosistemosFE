import React from 'react';
import { useTranslation } from 'react-i18next';
import Label from '../../../Core/InputLabel';
import Tooltip from '../../../Core/Tooltip';
import SimpleSelect from '../../../Core/SimpleSelect';
import { timeArr } from '../../../Helpers/time';
import Checkbox from '../../../Core/Checkbox/Checkbox2';

export default function WorkingTime({
  styles, days,
  handleChangeDays, startTime, handleChangeStartTime,
  readOnly,
}) {
  const { t } = useTranslation();
  return (
    <div className={styles.workigTime}>
      <div className={styles.startWeek}>
        <div className={styles.labelBlock}>
          <Label text={t('Working Time')} />
          <Tooltip title={t('Working Time')} />
        </div>
        {Object.keys(days).map((item, index) => (
          <div key={item + index.toString()} className={styles.workigTime__inner}>
            <Checkbox
              onChange={handleChangeDays}
              checked={days[item]}
              label={t(`${item}`)}
              name={item}
              disabled={readOnly}
            />
            <SimpleSelect
              handleInputChange={handleChangeStartTime}
              name={`start${index + 1}`}
              fullWidth
              value={startTime[`start${index + 1}`]}
              options={timeArr}
              readOnly={readOnly || !days[item]}
              withoutSearch
            />
            <div className={styles.workigTime__to}>To</div>
            <SimpleSelect
              handleInputChange={handleChangeStartTime}
              name={`finish${index + 1}`}
              fullWidth
              value={startTime[`finish${index + 1}`]}
              options={timeArr}
              readOnly={readOnly || !days[item]}
              withoutSearch
            />
          </div>
        ))}
        <div className={styles.formLine} />
      </div>
    </div>
  );
}
