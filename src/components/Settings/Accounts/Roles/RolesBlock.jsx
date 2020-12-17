import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import classnames from 'classnames';
import classes from './Roles.module.scss';
import AddRolesIcon from '../../../Icons/AddRolesIcon';
import RemoveRoleIcon from '../../../Icons/RemoveRoleIcon';
import RemoveRole from '../../../Core/Dialog/RemoveRole';
import StyledCheckbox from '../../../Core/Checkbox/Checkbox';
import RoleDetails from './RoleDetails';
import EditIcon from '../../../Icons/EditIcon';

function RolesBlock({
  roles = [],
  activeRole,
  setActiveRole,
  createNewRole,
  remove,
  updateRole,
  loading,
  loadRoleDetails,
  setEditVisible = () => ({}),
}) {
  const { t } = useTranslation();
  const [removeVisible, setRemoveVisible] = useState(false);

  const onKeyDown = (e, func) => {
    if (e.key === 'Enter' || e.key === ' ') {
      func();
    }
  };

  return (
    <div className={classes.roles}>

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
              <div className={classes.card_check}>
                <StyledCheckbox
                  id={role.id}
                  label={t('Make default')}
                  checked={!!role.default ?? false}
                  onChange={(id, checked) => updateRole(id, { checked })}
                />
              </div>

              <div className={classes.card_actions}>
                <button
                  className={classes.card_edit}
                  aria-label='edit role button'
                  onClick={() => setEditVisible({
                    name: role.name,
                    id: role.id,
                  })}
                >
                  <EditIcon aria-hidden />
                </button>
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
            {
              activeRole?.id === role.id && (
                <RoleDetails activeRole={activeRole} loading={loading} loadRoleDetails={loadRoleDetails} />
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
    </div>
  );
}

export default RolesBlock;
