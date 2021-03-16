import React, { useEffect, useMemo, useState } from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import _ from 'lodash';
import MaynLayout from '../../Core/MainLayout';
import Dashboard from '../../Core/Dashboard';
import TitleBlock from '../../Core/TitleBlock';
import PageLayout from '../../Core/PageLayout';
import Progress from '../../Core/Progress';
import {
  AccountGroupsSelector, employeesSelector,
  eventsLoadingSelector, isShowSnackbar, permissionsSelector, rolesLoading, rolesSelector, snackbarText, snackbarType,
  eventsSelector, eventsTypesSelector,
} from '../../../store/settings/selectors';
import RolesIcon from '../../Icons/RolesIcon';
import RolesBlock from './EventDetails/RolesBlock';
import {
  // createRole,
  deleteRole,
  getAccountGroups,
  getRoles,
  loadEmployeesAll,
  loadPermissions,
  updateRole,
  postEvent,
  getEvents,
  patchEvent,
} from '../../../store/settings/actions';
import AddEditItem from '../../Core/Dialog/AddEditItem';

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

function Events() {
  const { id: companyId } = useParams();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const classes = useStyles();

  const isLoading = useSelector(eventsLoadingSelector);
  const isSnackbar = useSelector(isShowSnackbar);
  const typeSnackbar = useSelector(snackbarType);
  const textSnackbar = useSelector(snackbarText);
  const events = useSelector(eventsSelector);
  const eventsTypes = useSelector(eventsTypesSelector);
  const roles = useSelector(rolesSelector);
  const loading = useSelector(rolesLoading);
  const permissions = useSelector(permissionsSelector);
  const { users: employees } = useSelector(employeesSelector);
  const groups = useSelector(AccountGroupsSelector);
  const [activeEvent, setActiveEvent] = useState({});
  const [newEventOpen, setNewEventOpen] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [defaultRoleAccess] = useState({});
  // console.log('activeRole', activeRole);

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
    dispatch(updateRole(companyId, activeEvent.id, { users: data.length ? data.toString() : '' }));
  };

  const removeRolesPermissions = (data = []) => {
    // eslint-disable-next-line no-shadow
    dispatch(updateRole(companyId, activeEvent.id, { permissions: data.map((id) => ({ id, access: 0 })) }));
  };

  const rolesPermissionsEdit = (data) => {
    // eslint-disable-next-line no-shadow
    const oldRolePermissions = roles.find(({ id }) => id === activeEvent.id)
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

    dispatch(updateRole(companyId, activeEvent.id, {
      permissions,
    }));
  };

  useEffect(() => {
    dispatch(getRoles(companyId));
    dispatch(loadEmployeesAll(companyId));
    dispatch(getAccountGroups(companyId));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    dispatch(getEvents(companyId));
  }, [companyId]);

  useEffect(() => {
    if (!permissions.length) {
      dispatch(loadPermissions(companyId));
    }
  }, [dispatch, companyId, permissions.length]);

  const removeRole = (roleId) => {
    dispatch(deleteRole(companyId, roleId));
  };

  const changeEventName = (eventName) => {
    if (eventName.trim()) {
      dispatch(patchEvent(companyId, activeEvent.id, { name: eventName.trim() }));
      setEditVisible(false);
    }
  };

  const patchRole = (roleId, data) => {
    const {
      name,
      checked,
    } = data;
    if (checked) {
      dispatch(updateRole(companyId, roleId, { default: checked ? 1 : 0 }));
    }
    if (name) {
      dispatch(updateRole(companyId, roleId, { name }));
    }
  };

  const createNewEvent = (eventName) => {
    if (eventName.trim()) {
      dispatch(postEvent(companyId, { name: eventName.trim() }));
      setNewEventOpen(false);
    }
  };

  return (
    <MaynLayout>
      <Dashboard>
        <TitleBlock
          title={t('Events')}
        >
          <RolesIcon />
        </TitleBlock>
        <PageLayout>
          {
            isLoading ? <Progress />
              : (
                <RolesBlock
                  events={events}
                  eventsTypes={eventsTypes}
                  activeEvent={activeEvent}
                  setActiveRole={setActiveEvent}
                  createNewRole={() => setNewEventOpen(true)}
                  remove={removeRole}
                  updateRole={patchRole}
                  loading={loading}
                  setEditVisible={setEditVisible}
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
            key='right'
          />
          <AddEditItem
            open={editVisible}
            initialValue={activeEvent?.name}
            handleClose={() => {
              setEditVisible(false);
            }}
            title={t('Edit event name')}
            buttonTitle={t('Change name')}
            label={t('Event name')}
            placeholder={t('Enter event name')}
            onSubmit={changeEventName}
          />
          <AddEditItem
            open={newEventOpen}
            handleClose={() => {
              setNewEventOpen(false);
            }}
            title={t('Create a new event')}
            onSubmit={createNewEvent}
            buttonTitle={t('Create event')}
            label={t('Event name')}
            placeholder={t('Enter event name')}
          />
        </PageLayout>
      </Dashboard>
    </MaynLayout>
  );
}

export default Events;
