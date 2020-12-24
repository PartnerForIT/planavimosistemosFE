import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import classnames from 'classnames';
import classes from '../Roles.module.scss';
import AddRolesIcon from '../../../../Icons/AddRolesIcon';
import RemoveRoleIcon from '../../../../Icons/RemoveRoleIcon';
import RemoveRole from '../../../../Core/Dialog/RemoveRole';
import StyledCheckbox from '../../../../Core/Checkbox/Checkbox';
import RoleDetails from '../RoleDetails';
import EditIcon from '../../../../Icons/EditIcon';

const defaultRoleAccess = {
  // Access by Module
  moduleAccess: {

    logbook: {
      enabled: true,
      options: {
        edit_settings: 'Can edit Logbook settings',
        edit_logs: 'Can edit entry logs',
        delete_logs: 'Can delete entry logs',
        earnings: 'Can see earnings',
        requests: 'Get approval requests',
        requests_in_place: 'Get approval requests in assigned place',
      },
    },
    reports: {
      enabled: true,
      options: {
        generate: 'Can generate reports',
        assigned_place: 'Reports only for assigned place',
      },
    },
    events: {
      enabled: true,
      options: {
        receive_app: 'Receive notifications',
        receive_email: 'events ~> receive_email',
        create: 'Can create Events',
      },
    },
  },

  // Organization access
  organisation: {

    groups: {
      enabled: true,

      options: {
        create: 'Can create Groups',
      },
    },
    roles: {
      enabled: true,

      options: {
        create: 'Can create Roles',
      },

    },
    categories: {
      enabled: true,

      options: {
        create: 'Can create Categories',
      },

    },
    data: {
      enabled: true,

      options: {
        delete: 'Can delete entry data',
      },

    },
    accounts: {
      enabled: true,

      options: {
        create: 'Can create New accounts',
        delete: 'accounts ~> delete',
      },

    },
    activity_log: {
      enabled: true,

      options: {
        view: 'Can see Activity Log',
      },

    },
    pto: {
      enabled: true,

      options: {
        edit_settings: 'Can edit General Settings',
        edit_entries: 'pto ~> edit_entries',
        requests: 'pto ~> requests',
      },
    },
  },
};

// Organization access

// Use Managers Mobile View
// Can see & edit Accounts List
// Can delete Accounts list
// Can edit Logbook settings

function RolesBlock({
  roles = [],
  activeRole = {},
  setActiveRole = () => ({}),
  createNewRole = () => ({}),
  remove = () => ({}),
  updateRole = () => ({}),
  loading = false,
  loadRoleDetails = () => ({}),
  setEditVisible = () => ({}),
  availableDetails = [],
  employees = [],
  groups = [],
  filterEmployees = () => ({}),
  roleEmployeesEdit = () => ({}),
  rolesPermissionsEdit = () => ({}),
  permissions,
  permissionsIds,
}) {
  const { t } = useTranslation();
  const [removeVisible, setRemoveVisible] = useState(false);
  const [roleAccess, setRoleAccess] = useState(defaultRoleAccess);

  const onKeyDown = (e, func) => {
    if (e.key === 'Enter' || e.key === ' ') {
      func();
    }
  };

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
                        (!!role.default || activeRole.id === role.id)
                        && (
                          <div className={classes.card_check}>
                            <StyledCheckbox
                              id={role.id}
                              label={t('Make default')}
                              checked={!!role.default}
                              onChange={(id, checked) => updateRole(id, { checked })}
                            />
                          </div>
                        )
                      }

                      <div className={classes.card_actions}>
                        {/* edit button */}
                        <button
                          className={classes.card_edit}
                          aria-label='edit role button'
                          onClick={() => setEditVisible(true)}
                        >
                          <EditIcon aria-hidden />
                        </button>
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
                          roles={roles}
                          activeRole={activeRole}
                          loading={loading}
                          loadRoleDetails={loadRoleDetails}
                          availableDetails={availableDetails}
                          roleAccess={roleAccess}
                          employees={employees}
                          groups={groups}
                          setRoleAccess={setRoleAccess}
                          filterEmployees={filterEmployees}
                          roleEmployeesEdit={roleEmployeesEdit}
                          rolesPermissionsEdit={rolesPermissionsEdit}
                          permissions={permissions}
                          permissionsIds={permissionsIds}
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
