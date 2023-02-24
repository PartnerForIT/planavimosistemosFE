import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import classNames from 'classnames';

import { TIMES_PANEL } from '../../../const';
import Item from './Item';
import classes from './Background.module.scss';

export default ({
  startDay,
}) => {
  const { t } = useTranslation();
  const day = moment(startDay).startOf('isoWeek');
  const currentDay = moment();

  return (
    <div
      className={classes.background}
      id='schedule-background'
    >
      {
        TIMES_PANEL.map((item, index) => (
          <Item
            key={index+'-'+item.id}
            currentDay={item !== 'total' && day.clone().add(item - 1, 'days').isSame(currentDay, 'day')}
            dayGoneBy={day.clone().add(item, 'days').isBefore(currentDay)}
          />
        ))
      }
    </div>
  );
};
