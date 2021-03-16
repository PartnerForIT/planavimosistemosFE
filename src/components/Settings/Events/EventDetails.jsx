import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import classNames from 'classnames';

import classes from './Events.module.scss';
import Users from './EventDetails/Users';
import EventRule from './EventDetails/EventRule';
import EventAction from './EventDetails/EventAction';
import { EVENT_TYPE } from '../../../const';
import Progress from '../../Core/Progress';
import { companyModules } from '../../../store/company/selectors';

function EventDetails({
  activeEvent,
  eventsTypes,
  loading,
  employees,
  groups,
  disable,
  setDisable,
  onUpdateEvent,
}) {
  const [ready, setReady] = useState(false);
  const [values, setValues] = useState(() => {
    let time;
    if (activeEvent.event_type_id === EVENT_TYPE.MISSING_CLOCK_OUT
        || activeEvent.event_type_id === EVENT_TYPE.MISSING_CLOCK_IN) {
      time = activeEvent.time / 60 / 60;
    } else {
      time = activeEvent.time / 60;
    }
    return {
      ...activeEvent,
      time: time || 0,
    };
  });
  const modules = useSelector(companyModules);

  useEffect(() => {
    if (ready) {
      setReady(false);
    }
  }, [ready]);

  useEffect(() => {
    if (disable.length) {
      setDisable([]);
    }
  }, [disable, disable.length, setDisable]);

  const detailsClasses = classNames(
    classes.details,
    {
      [classes.details_withModules]: !!(modules.reports || modules.events || modules.logbook),
    },
  );

  const onChangeHandler = (id) => {
    setValues((prevState) => {
      onUpdateEvent({
        [id]: Number(!prevState[id]),
      });
      return {
        ...prevState,
        [id]: !prevState[id],
      };
    });
  };
  const handleChangeValue = (nextValues) => {
    setValues((prevState) => {
      onUpdateEvent(nextValues);
      return {
        ...prevState,
        ...nextValues,
      };
    });
  };
  const handleEmployeesEdit = (data) => {
    onUpdateEvent({
      employees: data.length ? data.toString() : '',
    });
  };

  return (
    <div className={detailsClasses}>
      {
        loading && (
          <div className={classes.loader}>
            <Progress />
          </div>
        )
      }
      <Users
        employees={employees}
        groups={groups}
        activeEvent={activeEvent}
        roleEmployeesEdit={handleEmployeesEdit}
      />
      <EventRule
        eventsTypes={eventsTypes}
        handleChangeCheckbox={onChangeHandler}
        handleChangeValue={handleChangeValue}
        values={values}
      />
      <EventAction
        values={values}
        onChangeHandler={onChangeHandler}
      />
      <div />
    </div>
  );
}

export default EventDetails;
