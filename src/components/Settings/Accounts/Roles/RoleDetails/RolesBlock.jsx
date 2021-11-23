import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import classes from '../Roles.module.scss';
import RemoveRole from '../../../../Core/Dialog/RemoveRole';
import RoleDetails from '../RoleDetails';
import CardItem from '../../../../Core/CardItem/CardItem';
import CardItemAdd from '../../../../Core/CardItemAdd/CardItemAdd';

function RolesBlock({
  roles = [],
  activeRole = {},
  setActiveRole = Function.prototype,
  createNewRole = Function.prototype,
  remove = Function.prototype,
  changeDefaultRole = Function.prototype,
  loading = false,
  setEditVisible = Function.prototype,
  availableDetails = [],
  employees = [],
  groups = [],
  roleEmployeesEdit = Function.prototype,
  rolesPermissionsEdit,
  permissionsIds,
  defaultRoleAccess = {},
  permissions,
  user,
}) {
  const { t } = useTranslation();
  const [removeVisible, setRemoveVisible] = useState(false);
  const [disable, setDisable] = useState([]);

  const isSuperAdmin = user?.user?.role_id === 1;
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
        <CardItemAdd
          itemName='role'
          onClick={createNewRole}
        />
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
                onChangeDefault={changeDefaultRole}
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
                    roleAccess={defaultRoleAccess}
                    employees={employees}
                    groups={groups}
                    roleEmployeesEdit={roleEmployeesEdit}
                    rolesPermissionsEdit={rolesPermissionsEdit}
                    permissionsIds={permissionsIds}
                    permissions={permissions}
                    disable={disable}
                    setDisable={setDisable}
                    readOnly={!role.can_delete && !isCompanyAdmin && !isSuperAdmin}
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
