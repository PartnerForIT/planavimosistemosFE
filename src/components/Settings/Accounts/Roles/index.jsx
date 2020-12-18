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
  createRole, deleteRole, getAccountGroups, getRoleDetails, getRoles, loadEmployeesAll, loadPermissions, updateRole,
} from '../../../../store/settings/actions';
import AddRole from '../../../Core/Dialog/AddRole';

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

  const [activeRole, setActiveRole] = useState({});
  const [newRoleOpen, setNewRoleOpen] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [roleName, setRoleName] = useState('');

  const loadRoleDetails = () => {
    dispatch(getRoleDetails(id, activeRole.id));
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

  const removeRole = (roleId) => {
    dispatch(deleteRole(id, roleId));
  };

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
                <>
                  <RolesBlock
                    roles={roles}
                    activeRole={activeRole}
                    setActiveRole={setActiveRole}
                    createNewRole={() => setNewRoleOpen(true)}
                    remove={removeRole}
                    updateRole={patchRole}
                    loading={loading}
                    loadRoleDetails={loadRoleDetails}
                    setEditVisible={setEditVisible}
                    availableDetails={availableDetails}
                    employees={employees}
                    groups={groups}
                  />
                </>
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
            roleName={roleName || activeRole.name}
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
