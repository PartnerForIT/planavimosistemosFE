import React, { useEffect, useMemo, useState } from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import _ from 'lodash';
import MaynLayout from '../../../Core/MainLayout';
import Dashboard from '../../../Core/Dashboard';
import TitleBlock from '../../../Core/TitleBlock';
import PageLayout from '../../../Core/PageLayout';
import Progress from '../../../Core/Progress';
import {
  AccountGroupsSelector, employeesSelector,
  isLoadingSelector, isShowSnackbar, permissionsSelector, rolesLoading, rolesSelector, snackbarText, snackbarType,
} from '../../../../store/settings/selectors';
import { userSelector } from '../../../../store/auth/selectors';
import RolesIcon from '../../../Icons/RolesIcon';
import RolesBlock from './RoleDetails/RolesBlock';
import {
  createRole,
  deleteRole,
  getAccountGroups,
  getRoles,
  loadEmployeesAll,
  loadPermissions,
  updateRole,
} from '../../../../store/settings/actions';
import AddEditItem from '../../../Core/Dialog/AddEditItem';
import usePermissions from '../../../Core/usePermissions';

const useStyles = makeStyles(() => ({
  error: {
    background: '#de4343',
    color: '#fff',
  },
  success: {
    background: '#3bc39e',
    color: '#fff',
  },
}));

const initialRoleAccess = {
  // Access by Module
  moduleAccess: {
    logbook: {
      enabled: false,
      options: {
        edit_settings: 'Can edit Events settings',
        edit_logs: 'Can edit entry logs',
        delete_logs: 'Can delete entry logs',
        earnings: 'Can see earnings (APP)',
        profit: 'Can see earnings and profit',
        costs: 'Can see costs',
        requests: 'Get approval requests',
        requests_in_place: 'Get approval requests in assigned place',
      },
    },
    reports: {
      enabled: false,
      options: {
        costs: 'Can see costs',
        earnings: 'Can see earnings',
        profit: 'Can see profit',
        generate: 'Can generate reports',
        assigned_place: 'Reports only for assigned place',
      },
    },
    events: {
      enabled: false,
      options: {
        receive_app: 'Receive notifications',
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
    events: {
      enabled: true,

      options: {
        create: 'Can create Events',
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
        delete: 'Can delete Accounts list',
        see_and_edit: 'Can see & edit Accounts List',
      },

    },
    activity_log: {
      enabled: true,

      options: {
        view: 'Can see Activity Log',
      },

    },
    company: {
      enabled: true,

      options: {
        edit_settings: 'Can edit General Settings',
      },
    },
    manager: {
      enabled: true,

      options: {
        mobile: 'Use Managers Mobile View',
      },
    },
    kiosk: {
      enabled: true,

      options: {
        create: 'Can create Kiosks & PIN',
      },
    },
  },
};

const permissionsConfig = [
  {
    name: 'reports',
    module: 'reports',
  },
  {
    name: 'events',
    module: 'events',
  },
  {
    name: 'logbook',
    module: 'logbook',
  },
  {
    name: 'use_approval_flow',
    module: 'use_approval_flow',
  },
  {
    name: 'cost_earning',
    module: 'cost_earning',
  },
  {
    name: 'profitability',
    module: 'profitability',
  },
  {
    name: 'activity_log',
    module: 'activity_log',
  },
];
function Roles() {
  const { id } = useParams();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const classes = useStyles();
  const permissions = usePermissions(permissionsConfig);

  const isLoading = useSelector(isLoadingSelector);
  const isSnackbar = useSelector(isShowSnackbar);
  const typeSnackbar = useSelector(snackbarType);
  const textSnackbar = useSelector(snackbarText);
  const user = useSelector(userSelector);
  const roles = useSelector(rolesSelector);
  const loading = useSelector(rolesLoading);
  const allPermissions = useSelector(permissionsSelector);
  const { users: employees } = useSelector(employeesSelector);
  const groups = useSelector(AccountGroupsSelector);
  const [activeRole, setActiveRole] = useState({});
  const [newRoleOpen, setNewRoleOpen] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [defaultRoleAccess, setDefaultRoleAccess] = useState({});

  const permissionsIds = useMemo(() => {
    // eslint-disable-next-line no-underscore-dangle
    const _temp = {};

    allPermissions.forEach((perm) => {
      // eslint-disable-next-line no-shadow
      const { name, action, id } = perm;

      // eslint-disable-next-line no-nested-ternary
      _temp[name] = _temp[name]
        ? _temp[name][action]
          ? { ..._temp[name], [action]: id }
          : {
            ..._temp[name],
            [action]: id,
          }
        : { [action]: id };
    });

    return _temp;
  }, [allPermissions]);

  const roleEmployeesEdit = (data) => {
    dispatch(updateRole(id, activeRole.id, { users: data.length ? data.toString() : '' }));
  };

  const removeRolesPermissions = (data = []) => {
    // eslint-disable-next-line no-shadow
    dispatch(updateRole(id, activeRole.id, { permissions: data.map((id) => ({ id, access: 0 })) }));
  };

  const rolesPermissionsEdit = (data) => {
    // eslint-disable-next-line no-shadow
    const oldRolePermissions = roles.find(({ id }) => id === activeRole.id)
      ?.account_roles_permissions
      // eslint-disable-next-line no-shadow
      ?.map(({ permission_id: id, access }) => ({ id, access }));

    const newPermissions = data.length ? data.map((item) => ({
      id: item, access: 1,
    })) : [];

    // console.log(_.unionWith(oldRolePermissions, newPermissions, _.isEqual));
    // eslint-disable-next-line no-nested-ternary,no-shadow
    const oldFiltered = oldRolePermissions.map(({ id, access }) => (newPermissions.some((i) => id === i.id)
      ? access
        ? ({ id, access })
        : ({ id, access: newPermissions.find((item) => item.id).access })
      : ({ id, access: 0 })
    ));

    // eslint-disable-next-line no-shadow
    const nextPermissions = _.unionWith(newPermissions, oldFiltered, _.isEqual);

    dispatch(updateRole(id, activeRole.id, {
      permissions: nextPermissions,
    }));
  };

  const availableDetails = useMemo(() => {
    if (!_.isEmpty(activeRole) && allPermissions.length) {
      // eslint-disable-next-line no-shadow
      return allPermissions.filter((perm) => activeRole.account_roles_permissions.some(({ id }) => id === perm.id));
    }
    return [];
  }, [activeRole, allPermissions]);

  useEffect(() => {
    dispatch(getRoles(id));
    dispatch(loadEmployeesAll(id));
    dispatch(getAccountGroups(id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!allPermissions.length) {
      dispatch(loadPermissions(id));
    }
  }, [dispatch, id, allPermissions.length]);

  useEffect(() => {
    setDefaultRoleAccess(() => {
      const { moduleAccess } = initialRoleAccess;

      const nextModuleAccess = Object.keys(moduleAccess).reduce((acc, key) => {
        acc[key] = {
          ...moduleAccess[key],
          enabled: true,
        };
        return acc;
      }, {});
      const nextOrganisation = {
        ...initialRoleAccess.organisation,
      };

      /* permissions */
      if (!permissions.logbook) {
        delete nextModuleAccess.logbook;
      } else {
        if (!permissions.use_approval_flow) {
          delete nextModuleAccess.logbook.options.requests;
          delete nextModuleAccess.logbook.options.requests_in_place;
        }

        if (!permissions.cost_earning) {
          delete nextModuleAccess.logbook.options.costs;
          delete nextModuleAccess.logbook.options.earnings;
        }

        if (!permissions.profitability) {
          delete nextModuleAccess.logbook.options.profit;
        }
      }
      if (!permissions.reports) {
        delete nextModuleAccess.reports;
      } else {
        if (!permissions.cost_earning) {
          delete nextModuleAccess.reports.options.costs;
        }
        if (!permissions.profitability) {
          delete nextModuleAccess.reports.options.earnings;
          delete nextModuleAccess.reports.options.profit;
        }
      }
      if (!permissions.events) {
        delete nextModuleAccess.events;
      }
      if (!permissions.activity_log) {
        delete nextOrganisation.activity_log;
      }

      return {
        organisation: nextOrganisation,
        moduleAccess: nextModuleAccess,
      };
    });
  }, [permissions]);

  useEffect(() => {
    if (roles.length && !_.isEmpty(activeRole)) {
      // eslint-disable-next-line no-shadow
      const role = roles.find(({ id }) => id === activeRole.id);
      setActiveRole(role);
    }
  }, [activeRole, roles, roles.length]);

  const createNewRole = (roleName) => {
    if (roleName.trim()) {
      dispatch(createRole(id, roleName.trim()));
      setNewRoleOpen(false);
    }
  };

  const changeRoleName = (roleName) => {
    if (roleName.trim()) {
      dispatch(updateRole(id, activeRole.id, { name: roleName.trim() }));
      setEditVisible(false);
    }
  };

  const patchRole = (roleId, data) => {
    const {
      name,
      checked,
    } = data;
    if (checked) {
      dispatch(updateRole(id, roleId, { default: checked ? 1 : 0 }));
    }
    if (name) {
      dispatch(updateRole(id, roleId, { name }));
    }
  };

  const removeRole = (roleId) => {
    dispatch(deleteRole(id, roleId));
  };

  return (
    <MaynLayout>
      <Dashboard>
        <TitleBlock
          title={t('Roles')}
        >
          <RolesIcon />
        </TitleBlock>
        <PageLayout>
          {
            isLoading ? <Progress />
              : (
                <RolesBlock
                  roles={roles}
                  activeRole={activeRole}
                  setActiveRole={setActiveRole}
                  createNewRole={() => setNewRoleOpen(true)}
                  remove={removeRole}
                  updateRole={patchRole}
                  loading={loading}
                  setEditVisible={setEditVisible}
                  availableDetails={availableDetails}
                  employees={employees}
                  groups={groups}
                  roleEmployeesEdit={roleEmployeesEdit}
                  rolesPermissionsEdit={rolesPermissionsEdit}
                  permissionsIds={permissionsIds}
                  removeRolesPermissions={removeRolesPermissions}
                  defaultRoleAccess={defaultRoleAccess}
                  permissions={permissions}
                  user={user}
                />
              )
          }
          <Snackbar
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            ContentProps={{
              classes: {
                root: typeSnackbar === 'error' ? classes.error : classes.success,
              },
            }}
            severity='error'
            open={isSnackbar}
            message={textSnackbar}
            key='rigth'
          />
          <AddEditItem
            open={editVisible}
            handleClose={() => {
              setEditVisible(false);
            }}
            initialValue={activeRole?.name}
            title={t('Edit role name')}
            buttonTitle={t('Change name')}
            label={t('Role name')}
            placeholder={t('Enter role name')}
            onSubmit={changeRoleName}
          />
          <AddEditItem
            open={newRoleOpen}
            handleClose={() => {
              setNewRoleOpen(false);
            }}
            title={t('Create a new role')}
            onSubmit={createNewRole}
            buttonTitle={t('Create Role')}
            label={t('Role name')}
            placeholder={t('Enter role name')}
          />
        </PageLayout>
      </Dashboard>
    </MaynLayout>
  );
}

export default Roles;
