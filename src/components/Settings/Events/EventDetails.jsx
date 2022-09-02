import React, { useEffect, useState } from 'react';
import classNames from 'classnames';

import classes from './Events.module.scss';
import Users from './EventDetails/Users';
import EventRule from './EventDetails/EventRule';
import EventAction from './EventDetails/EventAction';
import { EVENT_TYPE } from '../../../const';
import Progress from '../../Core/Progress';

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
    const initialValues = {
      ...activeEvent,
      reminder_time: true,
      reminder_settings: false,
    };

    if (activeEvent.event_type_id === EVENT_TYPE.REMINDER_TO_CLOCK_IN
        || activeEvent.event_type_id === EVENT_TYPE.REMINDER_TO_CLOCK_OUT) {
      if (activeEvent.type === 0) {
        initialValues.reminder_time = true;
        initialValues.reminder_settings = false;
      } else if (activeEvent.type === 1) {
        initialValues.reminder_time = false;
        initialValues.reminder_settings = true;
      }
    }

    return initialValues;
  });

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
  );

  const handleChangeCheckbox = (id) => {
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
  const handleChangeRadioButton = (id) => {
    switch (id) {
      case 'reminder_time': {
        setValues((prevState) => {
          onUpdateEvent({ type: prevState.reminder_settings ? 1 : 0  });
          return {
            ...prevState,
            reminder_time: !prevState.reminder_time,
            reminder_settings: false,
          };
        });
        break;
      }
      case 'reminder_settings': {
        setValues((prevState) => {
          onUpdateEvent({ type: prevState.reminder_settings ? 0 : 1 });
          return {
            ...prevState,
            reminder_settings: !prevState.reminder_settings,
            reminder_time: false,
          };
        });
        break;
      }
      default: break;
    }
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
      employees: JSON.stringify(data),
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
        handleChangeCheckbox={handleChangeCheckbox}
        handleChangeValue={handleChangeValue}
        handleChangeRadioButton={handleChangeRadioButton}
        values={values}
      />
      <EventAction
        values={values}
        handleChangeCheckbox={handleChangeCheckbox}
        handleChangeValue={handleChangeValue}
      />
      <div />
    </div>
  );
}

export default EventDetails;
