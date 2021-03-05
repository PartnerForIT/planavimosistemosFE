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
import AddRole from '../../../Core/Dialog/AddRole';
import { companyModules, companyModulesLoading } from '../../../../store/company/selectors';
import { userSelector } from '../../../../store/auth/selectors';

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
        edit_settings: 'Can edit Logbook settings',
        edit_logs: 'Can edit entry logs',
        delete_logs: 'Can delete entry logs',
        earnings: 'Can see earnings (APP)',
        profit: 'Can see earnings and profit', // FIXME: rename on backend changes
        costs: 'Can see costs', // FIXME: rename on backend changes
        requests: 'Get approval requests',
        requests_in_place: 'Get approval requests in assigned place',
      },
    },
    reports: {
      enabled: false,
      options: {
        costs: 'Can see costs', // FIXME: rename on backend changes
        earnings: 'Can see earnings', // FIXME: rename on backend changes
        profit: 'Can see profit', // FIXME: rename on backend changes
        generate: 'Can generate reports',
        assigned_place: 'Reports only for assigned place',
      },
    },
    events: {
      enabled: false,
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
        edit_entries: 'pto ~> edit_entries',
        requests: 'pto ~> requests',
      },
    },
    company: {
      enabled: true,

      options: {
        edit_settings: 'Can edit General Settings',
      },
    },
  },
};

// Organization access

// Use Managers Mobile View
// Can see & edit Accounts List
// Can delete Accounts list
// Can edit Logbook settings

function Roles() {
  const { id } = useParams();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const classes = useStyles();

  const isLoading = useSelector(isLoadingSelector);
  const isSnackbar = useSelector(isShowSnackbar);
  const typeSnackbar = useSelector(snackbarType);
  const textSnackbar = useSelector(snackbarText);
  const roles = useSelector(rolesSelector);
  const loading = useSelector(rolesLoading);
  const permissions = useSelector(permissionsSelector);
  const { users: employees } = useSelector(employeesSelector);
  const groups = useSelector(AccountGroupsSelector);
  const modules = useSelector(companyModules);
  const modulesLoading = useSelector(companyModulesLoading);
  const { role_id: SuperAdmin } = useSelector(userSelector);
  const [activeRole, setActiveRole] = useState({});
  const [newRoleOpen, setNewRoleOpen] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [roleName, setRoleName] = useState('');
  const [defaultRoleAccess, setDefaultRoleAccess] = useState({});

  const permissionsIds = useMemo(() => {
    // eslint-disable-next-line no-underscore-dangle
    const _temp = {};

    permissions.forEach((perm) => {
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
  }, [permissions]);

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
    const permissions = _.unionWith(newPermissions, oldFiltered, _.isEqual);

    dispatch(updateRole(id, activeRole.id, {
      permissions,
    }));
  };

  const availableDetails = useMemo(() => {
    if (!_.isEmpty(activeRole) && permissions.length) {
      // eslint-disable-next-line no-shadow
      return permissions.filter((perm) => activeRole.account_roles_permissions.some(({ id }) => id === perm.id));
    }
    return [];
  }, [activeRole, permissions]);

  useEffect(() => {
    dispatch(getRoles(id));
    dispatch(loadEmployeesAll(id));
    dispatch(getAccountGroups(id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!permissions.length) {
      dispatch(loadPermissions(id));
    }
  }, [dispatch, id, permissions.length]);

  useEffect(() => {
    setDefaultRoleAccess(() => {
      const temp = {};
      const { moduleAccess } = initialRoleAccess;
      // const { cost_earning: costEarning, profitability } = modules;

      // if (!_.isEmpty(modules)) {
      //   if (costEarning && !profitability) {
      //     delete moduleAccess.logbook.options.profit;
      //
      //     delete moduleAccess.reports.options.earnings;
      //     delete moduleAccess.reports.options.profit;
      //   }
      //
      //   if (!costEarning && !profitability) {
      //     delete moduleAccess.logbook.options.earnings;
      //     delete moduleAccess.logbook.options.profit;
      //     delete moduleAccess.logbook.options.costs;
      //
      //     delete moduleAccess.reports.options.costs;
      //     delete moduleAccess.reports.options.earnings;
      //     delete moduleAccess.reports.options.profit;
      //   }
      // }
      Object.keys({ ...moduleAccess }).map((key) => {
        temp[key] = {
          ...moduleAccess[key],
          enabled: true,
          // enabled: SuperAdmin === 1 ? true : !!modules[key],
        };
        return key;
      });
      return {
        ...initialRoleAccess, moduleAccess: temp,
      };
    });
  }, [SuperAdmin, modules, modulesLoading]);

  const removeRole = (roleId) => {
    dispatch(deleteRole(id, roleId));
  };

  useEffect(() => {
    if (roles.length && !_.isEmpty(activeRole)) {
      // eslint-disable-next-line no-shadow
      const role = roles.find(({ id }) => id === activeRole.id);
      setActiveRole(role);
    }
  }, [activeRole, roles, roles.length]);

  const createNewRole = () => {
    if (roleName.trim()) {
      dispatch(createRole(id, roleName.trim()));
      setNewRoleOpen(false);
      setRoleName('');
    }
  };

  const changeRoleName = () => {
    if (roleName.trim()) {
      dispatch(updateRole(id, activeRole.id, { name: roleName.trim() }));
      setEditVisible(false);
      setRoleName('');
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
                  permissions={permissions}
                  permissionsIds={permissionsIds}
                  removeRolesPermissions={removeRolesPermissions}
                  defaultRoleAccess={defaultRoleAccess}
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
          <AddRole
            open={editVisible}
            handleClose={() => {
              setEditVisible(false);
              setRoleName('');
            }}
            roleName={roleName || activeRole?.name}
            setRoleName={setRoleName}
            title={t('Edit role name')}
            buttonTitle={t('Change name')}
            onsubmit={changeRoleName}
          />

          <AddRole
            open={newRoleOpen}
            handleClose={() => {
              setNewRoleOpen(false);
              setRoleName('');
            }}
            title={t('Create a new role')}
            roleName={roleName}
            setRoleName={setRoleName}
            onsubmit={createNewRole}
            buttonTitle={t('Create Role')}
          />
        </PageLayout>
      </Dashboard>
    </MaynLayout>
  );
}

export default Roles;
