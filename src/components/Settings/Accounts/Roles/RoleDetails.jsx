import React from 'react';
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
}) {
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
        availableDetails={availableDetails}
        roleAccess={roleAccess}
        categoriesNames={categoriesNames}
        setRoleAccess={setRoleAccess}
      />
      <OrganisationAccess
        availableDetails={availableDetails}
        roleAccess={roleAccess}
        categoriesNames={categoriesNames}
        setRoleAccess={setRoleAccess}
      />
      <div />
    </div>
  );
}

export default RoleDetails;
