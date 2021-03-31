import React, { useEffect, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import _ from 'lodash';

import classes from '../Roles.module.scss';
import RemoveRole from '../../../../Core/Dialog/RemoveRole';
import RoleDetails from '../RoleDetails';
import CardItem from '../../../../Core/CardItem/CardItem';
import CardItemAdd from '../../../../Core/CardItemAdd/CardItemAdd';

function RolesBlock({
  roles = [],
  activeRole = {},
  setActiveRole = () => ({}),
  createNewRole = () => ({}),
  remove = () => ({}),
  updateRole = () => ({}),
  loading = false,
  setEditVisible = () => ({}),
  availableDetails = [],
  employees = [],
  groups = [],
  roleEmployeesEdit = () => ({}),
  rolesPermissionsEdit = () => ({}),
  permissionsIds,
  removeRolesPermissions,
  defaultRoleAccess = {},
  permissions,
  user,
}) {
  const { t } = useTranslation();
  const [removeVisible, setRemoveVisible] = useState(false);
  const [roleAccess, setRoleAccess] = useState(defaultRoleAccess);
  const [disableReady, setDisableReady] = useState(false);
  const [disable, setDisable] = useState([]);

  useEffect(() => {
    const { moduleAccess } = roleAccess;
    if (moduleAccess && permissionsIds) {
      const disabled = Object.keys(moduleAccess)?.map((key) => {
      // eslint-disable-next-line no-underscore-dangle
        const _inner = moduleAccess[key];
        if (_inner.enabled) {
          return Object.keys(_inner.options)?.map((opt) => permissionsIds?.[key]?.[opt]);
        }
        return null;
      }).filter((item) => !!item);
      if (disableReady) {
        const dis = _.flatten(disabled);
        setDisable(dis);
        setDisableReady(false);
        removeRolesPermissions(dis);
      }
    }
  }, [disableReady, permissionsIds, removeRolesPermissions, removeVisible, roleAccess]);

  const isCompanyAdmin = useMemo(() => {
    if (roles?.length) {
      return roles[0].account_user_roles.some((item) => item.employee?.user_id === user.user.id);
    }

    return false;
  }, [user, roles]);

  return (
    <div className={classes.roles}>
      <>
        {/* create new */}
        {
          permissions.roles_create && (
            <CardItemAdd
              itemName='role'
              onClick={createNewRole}
            />
          )
        }
        {/* roles board */}
        {
                roles.map((role) => (
                  <React.Fragment key={role.id + role.name}>
                    <CardItem
                      id={role.id}
                      item={role}
                      onClick={setActiveRole}
                      onClickEdit={setEditVisible}
                      onClickRemove={setRemoveVisible}
                      onChangeCheckbox={updateRole}
                      isDefault={role.default}
                      name={role.name}
                      userCount={role.account_user_roles?.length}
                      selected={role.id === activeRole.id}
                      canDelete={!!role.can_delete}
                      itemName='role'
                      ariaLabel='user role'
                      descriptionCount='users have this role'
                    />
                    {/* Role details */}
                    {
                      activeRole?.id === role.id && (
                        <RoleDetails
                          activeRole={activeRole}
                          loading={loading}
                          availableDetails={availableDetails}
                          roleAccess={roleAccess}
                          employees={employees}
                          groups={groups}
                          setRoleAccess={setRoleAccess}
                          roleEmployeesEdit={roleEmployeesEdit}
                          rolesPermissionsEdit={rolesPermissionsEdit}
                          permissionsIds={permissionsIds}
                          permissions={permissions}
                          setDisableReady={setDisableReady}
                          disable={disable}
                          setDisable={setDisable}
                          readOnly={!role.can_delete && !isCompanyAdmin}
                        />
                      )
                    }
                  </React.Fragment>
                ))
              }
        <RemoveRole
          open={!!removeVisible}
          handleClose={() => setRemoveVisible(false)}
          title={t('Delete role')}
          name={removeVisible.name}
          buttonTitle={t('Delete')}
          remove={() => remove(removeVisible.id)}
        />
      </>
    </div>
  );
}

export default RolesBlock;
