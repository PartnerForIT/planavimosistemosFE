import React from 'react';
import { useTranslation } from 'react-i18next';

import Button from '../../../../components/Core/Button/Button';
import RefreshArrows from '../../../../components/Icons/RefreshArrows';

import styles from '../EventContent.module.scss';

export default ({
  reccuring
}) => {
  const { t } = useTranslation();
  

  return (
    <div className={styles.eventContent__userReccuring}>
      <div className={styles.eventContent__userReccuring_head}>
        <div className={styles.eventContent__userReccuring_icon}>
          <RefreshArrows />
        </div>
        {t('Reccuring schedule')}
        <Button inverseblack={false} size='little'>
          { reccuring.type_id*1 === 0 && t('Daily') }
          { reccuring.type_id*1 === 1 && t('Weekly') }
          { reccuring.type_id*1 === 2 && t('Monthly') }
        </Button>
      </div>

      <div className={styles.eventContent__userReccuring_body}>
        { reccuring.type_id*1 === 0 && (
          <div>
            { reccuring?.reccuring_settings?.repeat_type*1 === 1 && (
              <div className={styles.eventContent__userReccuring_body_section}>
                { t('Repeat every day(s)') }
                <div className={styles.eventContent__userReccuring_body_buttons}>
                  {
                    ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
                      <Button key={index+1} inverseblack={!reccuring?.reccuring_settings?.day_of_week?.includes(index+1)} size='littler'>
                        {t(day)}
                      </Button>
                    ))
                  }
                </div>
              </div>
              )
            }
              
            { reccuring?.reccuring_settings?.repeat_type*1 === 2 &&
              <div className={styles.eventContent__userReccuring_body_section}>
                {t('Repeat every')} <b>{reccuring?.reccuring_settings?.repeat_every}</b> {t('day(s)')}
              </div>
            }
          </div>
          )
        }

        { reccuring.type_id*1 === 1 &&
          <div>
            <div className={styles.eventContent__userReccuring_body_section}>
              {t('Repeat every')} <b>{reccuring?.reccuring_settings?.repeat_every}</b> {t('week(s)')}
            </div>
            <div className={styles.eventContent__userReccuring_body_section}>
              {t('On the day of the week')}
              <div className={styles.eventContent__userReccuring_body_buttons}>
                {
                  ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
                    <Button key={index+1} inverseblack={!reccuring?.reccuring_settings?.day_of_week?.includes(index+1)} size='littler'>
                      {t(day)}
                    </Button>
                  ))
                }
              </div>
            </div>
          </div>
        }

        { reccuring.type_id*1 === 2 &&
          <div>
            <div className={styles.eventContent__userReccuring_body_section}>
              {t('Repeat every')}
              <div className={styles.eventContent__userReccuring_body_buttons}>
                {
                  ['Jan', 'Feb', 'Mar', 'May', 'Apr', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((day, index) => (
                    <Button key={index} inverseblack={!reccuring?.reccuring_settings?.repeat_every?.includes(index+1)} size='little'>
                      {t(day)}
                    </Button>
                  ))
                }
              </div>
            </div>

            { reccuring.reccuring_settings.repeat_type*1 === 1 &&
              <div className={styles.eventContent__userReccuring_body_section}>
                {t('On the date')}
                <div className={styles.eventContent__userReccuring_body_buttons}>
                  {
                    Array.from({length: 31}, (_, i) => i+1).map((day, index) => (
                      <Button key={index+1} inverseblack={!reccuring?.reccuring_settings?.start?.includes(index+1)} size='littler'>
                        {day}
                      </Button>
                    ))
                  }
                </div>
              </div>  
            }

            { reccuring.reccuring_settings.repeat_type*1 === 2 &&
              <>
                <div className={styles.eventContent__userReccuring_body_section}>
                  {t('On the week')}
                  <div className={styles.eventContent__userReccuring_body_buttons}>
                    {
                      ['First', 'Second', 'Third', 'Fourth', 'Fifth'].map((day, index) => (
                        <Button key={index+1} inverseblack={!reccuring?.reccuring_settings?.start?.includes(index+1)} size='littler'>
                          {t(day)}
                        </Button>
                      ))
                    }
                  </div>
                </div>
                <div className={styles.eventContent__userReccuring_body_section}>
                  {t('On the day of the week')}
                  <div className={styles.eventContent__userReccuring_body_buttons}>
                    {
                      ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
                        <Button key={index+1} inverseblack={!reccuring?.reccuring_settings?.day_of_week?.includes(index+1)} size='littler'>
                          {t(day)}
                        </Button>
                      ))
                    }
                  </div>
                </div>
              </>
            }
          </div>
        }
      </div>
    </div>
  );
};
