import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import _ from 'lodash';

import classes from '../Roles.module.scss';
import RemoveRole from '../../../Core/Dialog/RemoveRole';
import CardItemAdd from '../../../Core/CardItemAdd/CardItemAdd';
import CardItem from '../../../Core/CardItem/CardItem';
import RoleDetails from '../RoleDetails';
import usePermissions from '../../../Core/usePermissions';

const permissionsConfig = [
  {
    name: 'events_create',
    permission: 'events_create',
  },
];
function RolesBlock({
  roles = [],
  activeRole = {},
  setActiveRole = () => ({}),
  createNewRole = () => ({}),
  remove = () => ({}),
  loading = false,
  setEditVisible = () => ({}),
  availableDetails = [],
  employees = [],
  groups = [],
  roleEmployeesEdit = () => ({}),
  rolesPermissionsEdit = () => ({}),
  permissions: allPermissions,
  permissionsIds,
  removeRolesPermissions,
  defaultRoleAccess = {},
}) {
  const { t } = useTranslation();
  const [removeVisible, setRemoveVisible] = useState(false);
  const [roleAccess, setRoleAccess] = useState(defaultRoleAccess);
  const [disableReady, setDisableReady] = useState(false);
  const [disable, setDisable] = useState([]);
  const permissions = usePermissions(permissionsConfig);

  useEffect(() => {
    const { moduleAccess } = roleAccess;
    if (moduleAccess && permissionsIds) {
      const disabled = Object.keys(moduleAccess)?.map((key) => {
      // eslint-disable-next-line no-underscore-dangle
        const _inner = moduleAccess[key];
        if (!_inner.enabled) {
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

  return (
    <div className={classes.roles}>
      <>
        {/* create new */}
        {
          permissions.events_create && (
            <CardItemAdd
              itemName='event'
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
                      isDefault={role.default}
                      name={role.name}
                      userCount={role.account_user_roles?.length}
                      selected={role.id === activeRole.id}
                      canDelete={!!role.can_delete}
                      itemName='event'
                      ariaLabel='event'
                      descriptionCount='users assigned to this event'
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
                          permissions={allPermissions}
                          permissionsIds={permissionsIds}
                          setDisableReady={setDisableReady}
                          disable={disable}
                          setDisable={setDisable}
                          roleAdmin={role.name === 'Administrator'}
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
