import React from 'react';
import { useTranslation } from 'react-i18next';
import Label from '../../../Core/InputLabel';
import Tooltip from '../../../Core/Tooltip';
import SimpleSelect from '../../../Core/SimpleSelect';

export default function StartWork({
  styles, days, inputValues, handleInputChange,
  readOnly,
}) {
  const { t } = useTranslation();
  return (
    <div className={styles.startWeek_block}>
      <div className={styles.startWeek}>
        <div className={styles.startWeek__inner}>
          <div className={styles.labelBlock}>
            <Label text={t('Week Start')} />
            <Tooltip title='Day of the beginning of the week' />
          </div>
          <SimpleSelect
            handleInputChange={handleInputChange}
            name='week_start'
            fullWidth
            value={inputValues.week_start}
            options={days}
            readOnly={readOnly}
          />
        </div>
        <div className={styles.startWeek__inner}>
          {/* <div className={styles.labelBlock}>
            <Label text={t('Day view starts')} />
            <Tooltip title={'Day view starts'} />
          </div>
          <SimpleSelect
            handleInputChange={handleInputChange}
            name="week_start_time"
            fullWidth
            value={inputValues.week_start_time}
            options={timeArr}
          /> */}
        </div>
      </div>
      <div className={styles.formLine} />
    </div>

  );
}
