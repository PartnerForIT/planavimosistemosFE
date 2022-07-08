import React from 'react';
import { useTranslation } from 'react-i18next';
import classnames from 'classnames';

import HolidayCompanyIcon from '../../Icons/HolidayCompanyIcon';
import HolidayGovernmentIcon from '../../Icons/HolidayGovernmentIcon';
import classes from './HolidayIcon.module.scss';

const HolidayIcon = ({
  holidays,
  month,
  inline,
}) => {
  const { t } = useTranslation();

  const holidayTip = () => {
    const texts = holidays.map(a => (a.company_work_time_id ? t('Company holiday') : t('Government holiday'))+' - '+a.name);
    return texts.join('<br>');
  };

  return (
    (!holidays || !holidays[0] || !holidays[0].date) ? (
        <></>
    ) : (
      <div
        className={classnames(classes.holiday_icon, month ? classes.month : '', inline ? classes.inline : '')}
        data-tip={holidayTip()}
        data-for='holiday'
        data-html={true}
      >
      {
        (!holidays || !holidays[0] || !holidays[0].company_work_time_id) ? (
          <HolidayGovernmentIcon />
        ) : (
          <HolidayCompanyIcon />
        )
      }
      </div>
    )
  );
};
export default HolidayIcon;
