import React, { useContext, useEffect, useState } from 'react';
import _ from 'lodash';
import { useSelector } from 'react-redux';
import classNames from 'classnames';

import classes from './Roles.module.scss';
import Users from './RoleDetails/Users';
import AccessModule from './RoleDetails/AccessModule';
import OrganisationAccess from './RoleDetails/OrganisationAccess';
import Progress from '../../../Core/Progress';
import { companyModules } from '../../../../store/company/selectors';
import { AdminContext } from '../../../Core/MainLayout';

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
  roleAdmin,
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
  const modules = useSelector(companyModules);
  const isSuperAdmin = useContext(AdminContext);

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
      {
        (isSuperAdmin || !!(modules.reports || modules.events || modules.logbook)) && (
          <AccessModule
            activeRole={activeRole}
            availableDetails={availableDetails}
            roleAccess={roleAccess}
            readOnly={roleAdmin}
            categoriesNames={categoriesNames}
            setRoleAccess={setRoleAccess}
            rolesPermissionsEdit={rolesPermissionsEdit}
            activePermissions={activePermissions}
            permissions={permissions}
            permissionsIds={permissionsIds}
            onChangeHandler={onChangeHandler}
            setDisableReady={setDisableReady}
            modules={modules}
            isSuperAdmin={isSuperAdmin}
          />
        )
      }
      <OrganisationAccess
        activeRole={activeRole}
        availableDetails={availableDetails}
        roleAccess={roleAccess}
        readOnly={roleAdmin}
        categoriesNames={categoriesNames}
        setRoleAccess={setRoleAccess}
        rolesPermissionsEdit={rolesPermissionsEdit}
        activePermissions={activePermissions}
        permissions={permissions}
        permissionsIds={permissionsIds}
        onChangeHandler={onChangeHandler}
        modules={modules}
        isSuperAdmin={isSuperAdmin}
      />
      <div />
    </div>
  );
}

export default RoleDetails;
