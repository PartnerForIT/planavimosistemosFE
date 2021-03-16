import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import classNames from 'classnames';

import classes from './Events.module.scss';
import Users from './EventDetails/Users';
import EventRule from './EventDetails/EventRule';
import EventAction from './EventDetails/EventAction';
import Progress from '../../Core/Progress';
import { companyModules } from '../../../store/company/selectors';

function EventDetails({
  activeEvent,
  eventsTypes,
  loading,
  employees,
  groups,
  roleEmployeesEdit = () => ({}),
  rolesPermissionsEdit = () => ({}),
  disable,
  setDisable,
}) {
  const [ready, setReady] = useState(false);
  const modules = useSelector(companyModules);

  useEffect(() => {
    if (ready) {
      setReady(false);
    }
  }, [ready, rolesPermissionsEdit]);

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
    // setActivePermissions((prevState) => {
    //   if (prevState.some((i) => i === id)) {
    //     return prevState.filter((i) => i !== id);
    //   }
    //   return [...prevState, id];
    // });
    // setReady(true);
  };

  return (
    <div className={detailsClasses}>
      {
        loading
        && (
        <div className={classes.loader}>
          <Progress />
        </div>
        )
      }
      <Users
        employees={employees}
        groups={groups}
        activeEvent={activeEvent}
        roleEmployeesEdit={roleEmployeesEdit}
      />
      <EventRule
        eventsTypes={eventsTypes}
      />
      <EventAction
        onChangeHandler={onChangeHandler}
      />
      <div />
    </div>
  );
}

export default EventDetails;
