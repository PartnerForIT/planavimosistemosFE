import React, { useEffect, useState } from 'react';
import classes from './Roles.module.scss';
// import Progress from '../../../Core/Progress';
import Users from './RoleDetails/Users';
import AccessModule from './RoleDetails/AccessModule';
import OrganisationAccess from './RoleDetails/OrganisationAccess';

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
  filterEmployees,
  roleEmployeesEdit = () => ({}),
  rolesPermissionsEdit = () => ({}),
  permissions = [],
  permissionsIds,
}) {
  const [activePermissions, setActivePermissions] = useState(
    activeRole?.account_roles_permissions?.map(({ permission_id }) => permission_id) ?? [],
  );

  useEffect(() => {
    console.log(activePermissions);
  }, [activePermissions]);

  const onChangeHandler = (id) => {
    setActivePermissions((prevState) => {
      if (prevState.some((i) => i === id)) {
        return prevState.filter((i) => i !== id);
      }
      return [...prevState, id];
    });
  };

  return (
    <div className={classes.details}>
      {
        // loading && <Progress />
      }
      <Users
        employees={employees}
        groups={groups}
        filterEmployees={filterEmployees}
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
