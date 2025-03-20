import React, { useEffect, useState } from 'react';
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
  isLoadingSelector, isShowSnackbar, permissionsSelector, policiesLoading, policiesSelector, timeOffsSelector, snackbarText, snackbarType,
} from '../../../store/settings/selectors';
import { userSelector } from '../../../store/auth/selectors';
import TimeOffIcon from '../../Icons/TimeOff';
import TimeOffBlock from './TimeOffDetails/TimeOffBlock';
import {
  createTimeOff,
  deleteTimeOff,
  updateTimeOff,
  getTimeOffs,
  createPolicy,
  deletePolicy,
  updatePolicy,
  getPolicies,
  getAccountGroups,
  loadEmployeesAll,
  loadPermissions,
  updateRole,
} from '../../../store/settings/actions';
import AddEditTimeOff from '../../Core/Dialog/AddEditTimeOff';
import AddEditPolicy from '../../Core/Dialog/AddEditPolicy';
import usePermissions from '../../Core/usePermissions';

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
  const time_offs = useSelector(timeOffsSelector);
  const policies = useSelector(policiesSelector);
  const loading = useSelector(policiesLoading);
  const allPermissions = useSelector(permissionsSelector);
  const { users: employees } = useSelector(employeesSelector);
  const groups = useSelector(AccountGroupsSelector);
  const [activeTimeOff, setActiveTimeOff] = useState({});
  const [newTimeOffOpen, setNewTimeOffOpen] = useState(false);
  const [newPolicyOpen, setNewPolicyOpen] = useState(false);
  const [editVisible, setEditVisible] = useState(false);

  const removeRolesPermissions = (data = []) => {
    // eslint-disable-next-line no-shadow
    dispatch(updateRole(id, activeTimeOff.id, { permissions: data.map((id) => ({ id, access: 0 })) }));
  };

  useEffect(() => {
    dispatch(getTimeOffs(id));
    dispatch(loadEmployeesAll(id));
    dispatch(getAccountGroups(id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!allPermissions?.length) {
      dispatch(loadPermissions(id));
    }

    // eslint-disable-next-line
  }, [dispatch, id, allPermissions?.length]);

  useEffect(() => {
    if (time_offs?.length && !_.isEmpty(activeTimeOff)) {
      // eslint-disable-next-line no-shadow
      const time_off = time_offs.find(({id}) => id === activeTimeOff.id);
      setActiveTimeOff(time_off);

      dispatch(getPolicies(id, activeTimeOff.id));
    }
  }, [activeTimeOff, time_offs]);

  const createNewTimeOff = (data) => {
    dispatch(createTimeOff(id, data));
    setNewTimeOffOpen(false);
  };

  const changeTimeOff = (data) => {
    dispatch(updateTimeOff(id, activeTimeOff.id, data));
    setEditVisible(false);
  };

  const removeTimeOff = (timeOffId) => {
    dispatch(deleteTimeOff(id, timeOffId));
  };

  const createNewPolicy = (data) => {
    dispatch(createPolicy(id, activeTimeOff.id, data));
    setNewPolicyOpen(false);
  }

  return (
    <MaynLayout>
      <Dashboard>
        <TitleBlock
          title={t('Time Off')}
        >
          <TimeOffIcon viewBox='0 0 26 26' fill='rgba(226,235,244,0.85)' />
        </TitleBlock>
        <PageLayout>
          {
            isLoading ? <Progress />
              : (
                <TimeOffBlock
                  time_offs={time_offs}
                  activeTimeOff={activeTimeOff}
                  setActiveTimeOff={setActiveTimeOff}
                  createNewTimeOff={() => setNewTimeOffOpen(true)}
                  createNewPolicy={() => setNewPolicyOpen(true)}
                  remove={removeTimeOff}
                  loading={loading}
                  policies={policies}
                  setEditVisible={setEditVisible}
                  removeRolesPermissions={removeRolesPermissions}
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
          <AddEditTimeOff
            open={editVisible}
            handleClose={() => {
              setEditVisible(false);
            }}
            initialValue={activeTimeOff ? activeTimeOff : {}}
            title={`${t('Edit')} ${activeTimeOff ? activeTimeOff.name : ''} ${t('Policy Type')}`}
            buttonTitle={t('Save Changes')}
            onSubmit={changeTimeOff}
          />
          <AddEditTimeOff
            open={newTimeOffOpen}
            handleClose={() => {
              setNewTimeOffOpen(false);
            }}
            title={t('Create New Policy Type')}
            onSubmit={createNewTimeOff}
            buttonTitle={t('Submit')}
          />
          <AddEditPolicy
            open={newPolicyOpen}
            handleClose={() => {
              setNewPolicyOpen(false);
            }}
            initialValue={{type: activeTimeOff?.name}}
            title={t('Create New Policy')}
            onSubmit={createNewPolicy}
            buttonTitle={t('Submit')}
          />
        </PageLayout>
      </Dashboard>
    </MaynLayout>
  );
};
