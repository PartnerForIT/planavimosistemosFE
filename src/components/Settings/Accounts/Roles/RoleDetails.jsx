import React, { useCallback, useEffect, useState } from 'react';
import _ from 'lodash';
import classes from './Roles.module.scss';
import Users from './RoleDetails/Users';
import AccessModule from './RoleDetails/AccessModule';
import OrganisationAccess from './RoleDetails/OrganisationAccess';
import Progress from '../../../Core/Progress';

const categoriesNames = {
  logbook: 'Logbook',
  reports: 'Reports',
  events: 'Events',
  groups: 'Groups',
  roles: 'Roles',
  categories: 'Categories',
  data: 'Data',
  accounts: 'Accounts',
  activity_log: 'Activity',
  pto: 'PTO',
};

function RoleDetails({
  activeRole,
  loading,
  availableDetails,
  roleAccess,
  employees,
  groups,
  setRoleAccess,
  roleEmployeesEdit = () => ({}),
  rolesPermissionsEdit = () => ({}),
  permissions = [],
  permissionsIds,
  disable,
  setDisable,
  setDisableReady,
}) {
  const [activePermissions, setActivePermissions] = useState(
    activeRole?.account_roles_permissions
    // eslint-disable-next-line camelcase
      ?.map(({ permission_id, access }) => (access ? permission_id : null))
      .filter((item) => !!item) ?? [],
  );
  const [ready, setReady] = useState(false);

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

  const onChangeHandler = (id) => {
    setActivePermissions((prevState) => {
      if (prevState.some((i) => i === id)) {
        return prevState.filter((i) => i !== id);
      }
      return [...prevState, id];
    });
    setReady(true);
  };

  return (
    <div className={classes.details}>
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

      <AccessModule
        activeRole={activeRole}
        availableDetails={availableDetails}
        roleAccess={roleAccess}
        categoriesNames={categoriesNames}
        setRoleAccess={setRoleAccess}
        rolesPermissionsEdit={rolesPermissionsEdit}
        activePermissions={activePermissions}
        permissions={permissions}
        permissionsIds={permissionsIds}
        onChangeHandler={onChangeHandler}
        setDisableReady={setDisableReady}
      />
      <OrganisationAccess
        activeRole={activeRole}
        availableDetails={availableDetails}
        roleAccess={roleAccess}
        categoriesNames={categoriesNames}
        setRoleAccess={setRoleAccess}
        rolesPermissionsEdit={rolesPermissionsEdit}
        activePermissions={activePermissions}
        permissions={permissions}
        permissionsIds={permissionsIds}
        onChangeHandler={onChangeHandler}
      />
      <div />
    </div>
  );
}

export default RoleDetails;
