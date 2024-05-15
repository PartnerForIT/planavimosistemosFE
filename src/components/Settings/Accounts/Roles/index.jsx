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
  JournalDataSelector,
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
  loadLogbookJournal,
} from '../../../../store/settings/actions';
import AddEditItem from '../../../Core/Dialog/AddEditItem';
import usePermissions from '../../../Core/usePermissions';
import { companyModules } from '../../../../store/company/selectors';

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

const permissionsConfig = [
  {
    name: 'reports',
    module: 'reports',
  },
  {
    name: 'schedule_shift',
    module: 'schedule_shift',
  },
  {
    name: 'schedule_simple',
    module: 'schedule_simple',
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
  {
    name: 'time_sheet',
    module: 'time_sheet',
  },
  {
    name: 'integrations',
    module: 'integrations',
  },
  {
    name: 'comments_photo',
    module: 'comments_photo',
  },
];
export default () => {
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
  const journal = useSelector(JournalDataSelector);
  const { users: employees } = useSelector(employeesSelector);
  const groups = useSelector(AccountGroupsSelector);
  const [activeRole, setActiveRole] = useState({});
  const [newRoleOpen, setNewRoleOpen] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [defaultRoleAccess, setDefaultRoleAccess] = useState({});
  const modules = useSelector(companyModules);

  const initialRoleAccess = {
    // Access by Module
    moduleAccess: {
      ...(modules.logbook && {
        logbook: {
          options: {
            edit_settings: 'Can edit Logbook settings',
            add_logs: 'Can create new entries',
            edit_logs: 'Can edit entry logs',
            ...(modules.comments_photo && { edit_comments: 'Can edit entry comments' }),
            delete_logs: 'Can delete entry logs',
            ...(modules.cost_earning && { earnings: 'Can see earnings (APP)' }),
            ...(modules.profitability && { profit: 'Can see earnings and profit' }),
            ...(modules.cost_earning && { costs: 'Can see costs' }),
            requests: 'Get approval requests',
            requests_in_place: 'Get approval requests in assigned place',
          },
        },
      }),
      ...(modules.time_sheet && {
        time_sheet: {
          options: {
            ...(modules.cost_earning && { costs: 'Can see costs' }),
            place: 'Time Sheets only for assigned place',
          },
        },
      }),
      ...(modules.integrations && {
        integrations: {
          options: {
            
          },
        },
      }),
      ...(modules.reports && {
        reports: {
          options: {
            ...(modules.cost_earning && { costs: 'Can see costs' }),
            ...(modules.profitability && { earnings: 'Can see earnings' }),
            ...(modules.profitability && { profit: 'Can see profit' }),
            generate: 'Can generate reports',
            assigned_place: 'Reports only for assigned place',
          },
        },
      }),
      ...(modules.events && {
        events: {
          options: {
            receive_app: 'Receive notifications',
          },
        },
      }),
      ...(modules.schedule_shift && {
        schedule: {
          options: {
            edit: 'Can create & edit schedules',
            view: 'Can see Schedule',
            assigned_place: 'Only assigned place view',
            see_all_employees: 'Can see all employees',
            costs: 'Can see Costs',
          },
        },
      }),
    },
  
    // Organization access
    organisation: {
      groups: {
        options: {
          ...(modules.create_groups && { create: 'Can create Groups' }),
        },
      },
      roles: {
        options: {
          create: 'Can create Roles',
        },
      },
      categories: {
        options: {
          create: 'Can create Categories',
        },
      },
      events: {
        options: {
          ...(modules.events && { create: 'Can create Events' }),
        },
      },
      data: {
        options: {
          delete: 'Can delete entry data',
        },
      },
      accounts: {
        options: {
          create: 'Can create New accounts',
          delete: 'Can delete Accounts list',
          see_and_edit: 'Can see & edit Accounts List',
        },
      },
      activity_log: {
        options: {
          view: 'Can see Activity Log',
        },
      },
      company: {
        options: {
          edit_settings: 'Can edit General Settings',
        },
      },
      manager: {
        options: {
          ...(modules.use_manager_mobile && { mobile: 'Use Managers Mobile View' }),
        },
      },
      app: {
        options: {
          manager: 'Managers view WEB'
        }
      },
      kiosk: {
        options: {
          ...(modules.kiosk && { create: 'Can create Kiosks & PIN' }),
        },
      },
      schedule: {
        options: {
          ...(modules.schedule_shift && { create_and_edit: 'Can edit Schedule settings' }),
        },
      },
      time_sheet: {
        options: {
          ...(modules.time_sheet && { edit_settings: 'Can edit Time Sheet settings' }),
        },
      },
      integrations: {
        options: {
          ...(modules.integrations && { edit_settings: 'Can edit Integration settings' }),
        },
      },
    },
  };

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
    dispatch(updateRole(id, activeRole.id, { users: data?.length ? data.toString() : '' }));
  };

  const removeRolesPermissions = (data = []) => {
    // eslint-disable-next-line no-shadow
    dispatch(updateRole(id, activeRole.id, { permissions: data.map((id) => ({ id, access: 0 })) }));
  };

  const rolesPermissionsEdit = (data) => {
    // eslint-disable-next-line no-shadow
    const oldRolePermissions = roles.find(({ id }) => id === activeRole.id)
      ?.accountRolesPermissions
      // eslint-disable-next-line no-shadow
      ?.map(({ permission_id: id, access }) => ({ id, access }));
    const newPermissions = data?.length ? data.map((item) => ({
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
    if (!_.isEmpty(activeRole) && allPermissions?.length) {
      // eslint-disable-next-line no-shadow
      return allPermissions.filter((perm) => activeRole.accountRolesPermissions.some(({ id }) => id === perm.id));
    }
    return [];
  }, [activeRole, allPermissions]);

  useEffect(() => {
    dispatch(getRoles(id));
    dispatch(loadEmployeesAll(id));
    dispatch(getAccountGroups(id));
    dispatch(loadLogbookJournal(id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!allPermissions?.length) {
      dispatch(loadPermissions(id));
    }

    // eslint-disable-next-line
  }, [dispatch, id, allPermissions?.length]);

  useEffect(() => {
    setDefaultRoleAccess(() => {
      const { moduleAccess, organisation } = initialRoleAccess;

      const nextModuleAccess = Object.keys(moduleAccess).reduce((acc, key) => {
        acc[key] = {
          options: {
            ...moduleAccess[key].options,
          },
          enabled: true,
        };
        return acc;
      }, {});
      const nextOrganisation = Object.keys(organisation).reduce((acc, key) => {
        acc[key] = {
          ...organisation[key],
          enabled: true,
        };
        return acc;
      }, {});

      /* permissions */
      if (!permissions.logbook) {
        delete nextModuleAccess.logbook;
      } else {
        if (!permissions.use_approval_flow || !journal.approve_flow) {
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
      if (!permissions.schedule_shift) {
        // delete nextModuleAccess.events;

        if (!permissions.schedule_simple) {
          delete nextModuleAccess.schedule;
          delete nextOrganisation.schedule;
        } else {
          delete nextModuleAccess.schedule.options.assigned_place;
        }
      }
      if (!permissions.activity_log) {
        delete nextOrganisation.activity_log;
      }

      return {
        organisation: nextOrganisation,
        moduleAccess: nextModuleAccess,
      };
    });

    // eslint-disable-next-line
  }, [permissions, journal]);

    useEffect(() => {
      if (roles?.length && !_.isEmpty(activeRole)) {
        // eslint-disable-next-line no-shadow
        const role = roles.find(({id}) => id === activeRole.id);
        setActiveRole(role);
      }
    }, [activeRole, roles]);

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

  const changeDefaultRole = (roleId, checked) => {
    dispatch(updateRole(id, roleId, { default: checked ? 1 : 0 }));
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
                  changeDefaultRole={changeDefaultRole}
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
};
