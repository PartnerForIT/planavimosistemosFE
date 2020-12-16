import React from 'react';
import { useTranslation } from 'react-i18next';
import classnames from 'classnames';
import classes from './Roles.module.scss';
import AddRolesIcon from '../../../Icons/AddRolesIcon';
import RemoveRoleIcon from '../../../Icons/RemoveRoleIcon';

function RolesBlock({
  roles = [],
  activeRole,
  setActiveRole,
  createNewRole,
}) {
  const { t } = useTranslation();

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
              <button
                className={classes.card_icon}
                aria-label='remove role button'
              >
                <RemoveRoleIcon aria-hidden />
              </button>
            </div>
          </React.Fragment>
        ))
      }
    </div>
  );
}

export default RolesBlock;
