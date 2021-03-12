import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import { useSelector } from 'react-redux';
import classNames from 'classnames';

import classes from './Roles.module.scss';
import Users from './RoleDetails/Users';
import EventRule from './RoleDetails/EventRule';
import EventAction from './RoleDetails/EventAction';
import Progress from '../../Core/Progress';
import { companyModules } from '../../../store/company/selectors';

function RoleDetails({
  activeRole,
  loading,
  employees,
  groups,
  roleEmployeesEdit = () => ({}),
  rolesPermissionsEdit = () => ({}),
  disable,
  setDisable,
}) {
  const [activePermissions, setActivePermissions] = useState(
    activeRole?.account_roles_permissions
    // eslint-disable-next-line camelcase
      ?.map(({ permission_id, access }) => (access ? permission_id : null))
      .filter((item) => !!item) ?? [],
  );
  const [ready, setReady] = useState(false);
  const modules = useSelector(companyModules);

  useEffect(() => {
    if (ready) {
      setReady(false);
      rolesPermissionsEdit(activePermissions);
    }
  }, [activePermissions, ready, rolesPermissionsEdit]);

  useEffect(() => {
    if (disable.length) {
      setActivePermissions((prevState) => _.difference(prevState, disable));
      setDisable([]);
    }
  }, [activePermissions, disable, disable.length, setDisable]);

  const detailsClasses = classNames(
    classes.details,
    {
      [classes.details_withModules]: !!(modules.reports || modules.events || modules.logbook),
    },
  );

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
        activeRole={activeRole}
        roleEmployeesEdit={roleEmployeesEdit}
      />
      <EventRule />
      <EventAction />
      <div />
    </div>
  );
}

export default RoleDetails;
