import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import _ from 'lodash';
import classnames from 'classnames';
import classes from '../Roles.module.scss';
import AddRolesIcon from '../../../../Icons/AddRolesIcon';
import RemoveRoleIcon from '../../../../Icons/RemoveRoleIcon';
import RemoveRole from '../../../../Core/Dialog/RemoveRole';
import StyledCheckbox from '../../../../Core/Checkbox/Checkbox';
import RoleDetails from '../RoleDetails';
// import EditIcon from '../../../../Icons/EditIcon';
import { onKeyDown } from '../../../../Helpers';

function RolesBlock({
  roles = [],
  activeRole = {},
  setActiveRole = () => ({}),
  createNewRole = () => ({}),
  remove = () => ({}),
  updateRole = () => ({}),
  loading = false,
  // setEditVisible = () => ({}),
  availableDetails = [],
  employees = [],
  groups = [],
  roleEmployeesEdit = () => ({}),
  rolesPermissionsEdit = () => ({}),
  permissions,
  permissionsIds,
  removeRolesPermissions,
  defaultRoleAccess = {},
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
        <div
          className={classnames(classes.card, classes.default)}
          onClick={createNewRole}
          onKeyDown={(e) => onKeyDown(e, createNewRole)}
          role='option'
          aria-selected='true'
          aria-label='create new role'
          tabIndex={0}
        >
          <p className={classes.card_title}>New role</p>
          <small>{t('Create a new role')}</small>
          <span
            className={classes.card_icon}
          >
            <AddRolesIcon aria-hidden />
          </span>
        </div>
        {/* roles board */}
        {
                roles.map((role) => (
                  <React.Fragment key={role.id + role.name}>
                    <div
                      className={classnames(classes.card, role.id === activeRole.id ? classes.active : '')}
                      onClick={() => setActiveRole(role)}
                      onKeyDown={() => setActiveRole(role)}
                      role='option'
                      aria-label='user role'
                      aria-selected='true'
                      tabIndex={0}
                    >
                      <p className={classes.card_title}>{role.name}</p>
                      <small>{`${role.account_user_roles?.length} ${t('users have this role')}`}</small>
                      {
                        // (!!role.default || activeRole.id === role.id)
                        // && (
                        //   <div className={classes.card_check}>
                        //     <StyledCheckbox
                        //       id={role.id}
                        //       label={t('Make default')}
                        //       checked={!!role.default}
                        //       onChange={(id, checked) => updateRole(id, { checked })}
                        //     />
                        //   </div>
                        // )
                      }
                      <div className={classes.card_check}>
                        <StyledCheckbox
                          id={role.id}
                          label={t('Make default')}
                          checked={!!role.default}
                          onChange={(id, checked) => updateRole(id, { checked })}
                        />
                      </div>

                      <div className={classes.card_actions}>
                        {/* edit button */}
                        {
                          /*
                            <button
                              className={classes.card_edit}
                              aria-label='edit role button'
                              onClick={() => setEditVisible(true)}
                            >
                              <EditIcon aria-hidden />
                            </button>
                           */
                        }
                        {/* delete button */}
                        {
                          !!role.can_delete
                          && (
                            <button
                              className={classes.card_remove}
                              aria-label='remove role button'
                              onClick={() => setRemoveVisible({
                                name: role.name,
                                id: role.id,
                              })}
                            >
                              <RemoveRoleIcon aria-hidden />
                            </button>
                          )
                        }
                      </div>
                    </div>
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
                          permissions={permissions}
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
