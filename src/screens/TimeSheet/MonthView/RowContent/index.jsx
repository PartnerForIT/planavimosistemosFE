import React, { useEffect } from 'react';
import ReactTooltip from 'react-tooltip';
import CurrencySign from '../../../../components/shared/CurrencySign';
import moment from 'moment';
import { useTranslation } from 'react-i18next';

import Cell from '../Cell';
import classes from './RowContent.module.scss';

const typeNames = {
  working_days: 'Days worked',
  total_hours: 'Total Hours',
  worked_hours: 'Work Hours',
  break_hours: 'Break Hours',
  night_hours: 'Night Work Hours',
  holiday_hours: 'Bank Holiday Hours',
  overtime_hours: 'Overtime Hours',
  show_costs: 'Cost',
};

const RowContent = ({
  sheet,
  field,
  resource,
  daysOfMonth,
  pastDay,
}) => {
  const { t } = useTranslation();
  
  useEffect(() => {
    ReactTooltip.rebuild();
  });

  const foundItem = (day) => {
    const found = sheet.find((item) => resource.id === item.employeeId && item.day*1 === day*1 && resource.place_id === item.place_id);
    if (found && found[field]) {
      if (field === 'show_costs') {
        return <><CurrencySign />{parseFloat(found[field]).toFixed(2)}</>;
      } else {
        return field !== 'working_days' ? timeConvert(found[field]) : found[field];
      }
    }

    return '';
  }

  const foundTime = (day) => {
    const found = sheet.find((item) => resource.id === item.employeeId && item.day*1 === day*1 && resource.place_id === item.place_id);
    if (found && found[field]) {
      return found[field]*1;
    }

    return 0;
  }

  const foundCost = (day) => {
    const found = sheet.find((item) => resource.id === item.employeeId && item.day*1 === day*1 && resource.place_id === item.place_id);
    if (found && found[field+'_cost']) {
      return found[field+'_cost']*1;
    } else if (found && found[field] && field === 'show_costs') {
      return found[field]*1;
    }

    return 0;
  }

  const timeConvert = (num) => {
    const hours = (num / 60);
    const rhours = Math.floor(hours);
    const minutes = (hours - rhours) * 60;
    const rminutes = Math.round(minutes);
    return rhours+":"+String(rminutes).padStart(2, '0');
  }

  let time = 0;
  let cost = 0;

  const check = (item) => {
    if (item.statistic && item.id === "totalTime" && field !== 'show_costs'){
      return time > 0 ? (field !== 'working_days' ? timeConvert(time) : time) : '';
    }
    if (item.statistic && item.id === "totalCost"){
      return cost > 0 ? <><CurrencySign />{parseFloat(cost).toFixed(2)}</> : '';
    }

    if (item.statistic && item.id === "plannedTime" && field === 'total_hours'){
      const found = sheet.find((item) => resource.id === item.employeeId && resource.place_id === item.place_id);
      if (found && found.planned_time) {
        return found.planned_time;
      }
    }

    if (item.statistic && item.id === "targetTime" && field === 'total_hours'){
      const found = sheet.find((item) => resource.id === item.employeeId && resource.place_id === item.place_id);
      if (found && found.target_time) {
        return found.target_time;
      }
    }

    return ''
  }

  const parsedTitle = (item) => {
    return item.statistic ? check(item) : foundItem(item.title)
  }

  const tooltipInner = (itemCheck, field) => {
    if (!itemCheck.statistic && field === 'total_hours') {
      const find = sheet.find((item) => resource.id === item.employeeId && item.day*1 === itemCheck.id*1 && resource.place_id === item.place_id);
      if (find) {
        return "From <strong>" + moment(find.start).format('HH:mm') + "</strong> To <strong>" + moment(find.end).format('HH:mm') + "</strong>";
      }

      return find && find[field] ? timeConvert(find[field]) : '';
    }

    return '';
  }
  
  return (
    <>
      <div className={classes.rowContent}>
        <Cell
          key={0}
          title={t(typeNames[field])}
          article={true}
        />
        {
          daysOfMonth.map((item, index) => {
            if(index < item.id ){
              time+=foundTime(item.title)
              cost+=foundCost(item.title)
            }
            return (
             <Cell
                key={item.id}
                cellId={item.id}
                title={parsedTitle(item)}
                statistic={item.statistic}
                weekend={item.weekend}
                tooltip={tooltipInner(item, field)}
                past={!item.statistic && pastDay >= item.id}
                holiday={item.holiday}
            />)
            }
          )
        }
      </div>
    </>
  );
};

export default RowContent
