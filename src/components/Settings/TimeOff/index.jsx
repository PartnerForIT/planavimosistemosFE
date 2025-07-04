import React, { useEffect, useState } from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import _ from 'lodash';
import MaynLayout from '../../Core/MainLayout';
import Dashboard from '../../Core/Dashboard';
import TitleBlock from '../../Core/TitleBlock';
import PageLayout from '../../Core/PageLayout';
import Progress from '../../Core/Progress';
import UserDataManagement from './UserDataManagement';
import EmployeeManagement from './EmployeeManagement';
import EmployeeManagementPolicy from './EmployeeManagementPolicy';
import EmployeeActivity from './EmployeeActivity';
import {
  AccountGroupsSelector, employeesSelector,
  isLoadingSelector, isShowSnackbar, permissionsSelector, policiesLoading, policiesSelector, timeOffsSelector, requestBehalfSelector, snackbarText, snackbarType,
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
  updatePolicySettings,
  updatePolicyEmployees,
  unasignPolicyEmployees,
  createRequestBehalf,
  updateRequestBehalf,
  changeRequestBehalfStatus,
  createAdjustBalance,
  createAdjustTimeUsed,
  duplicatePolicy,
  getPolicies,
  getRequestBehalf,
  getAccountGroups,
  loadEmployeesAll,
  loadPermissions,
} from '../../../store/settings/actions';
import AddEditTimeOff from '../../Core/Dialog/AddEditTimeOff';
import AddEditPolicy from '../../Core/Dialog/AddEditPolicy';
import DuplicatePolicy from '../../Core/Dialog/DuplicatePolicy';

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

// const permissionsConfig = [
//   {
//     name: 'reports',
//     module: 'reports',
//   },
// ];
export default () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const classes = useStyles();
  const history = useHistory();
  //const permissions = usePermissions(permissionsConfig);

  const isLoading = useSelector(isLoadingSelector);
  const isSnackbar = useSelector(isShowSnackbar);
  const typeSnackbar = useSelector(snackbarType);
  const textSnackbar = t(useSelector(snackbarText));
  const user = useSelector(userSelector);
  const time_offs = useSelector(timeOffsSelector);
  const policies = useSelector(policiesSelector);
  const requestBehalf = useSelector(requestBehalfSelector);
  const loading = useSelector(policiesLoading);
  const allPermissions = useSelector(permissionsSelector);
  const { users: employees } = useSelector(employeesSelector);
  const groups = useSelector(AccountGroupsSelector);
  const [activeTimeOff, setActiveTimeOff] = useState({});
  const [newTimeOffOpen, setNewTimeOffOpen] = useState(false);
  const [newPolicyOpen, setNewPolicyOpen] = useState(false);
  const [duplicatePolicyOpen, setDuplicatePolicyOpen] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [activePolicy, setActivePolicy] = useState(null);
  const [activeDataManagement, setActiveDataManagement] = useState(null);
  const [activeEmployee, setActiveEmployee] = useState(null);
  const [activeEmployeeActivity, setActiveEmployeeActivity] = useState(null);

  useEffect(() => {
    dispatch(getTimeOffs(id));
    dispatch(loadEmployeesAll(id));
    dispatch(getAccountGroups(id));
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //check in url if here ?employee= parameter is present then set activeEmployee
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const employeeParam = params.get('employee');
    const pageParam = params.get('page');
    if (pageParam !== 'activity') {
      if (employeeParam && employees?.length) {
        const employee = employees.find(({ id }) => id.toString() === employeeParam.toString());
        if (employee) {
          dispatch(getPolicies(id, 'all', employee.id));
          setActiveEmployee(employee);
          dispatch(getRequestBehalf(id, 'all', 'all', employee.id));
        }
      }
    }
    // eslint-disable-next-line 
  }, [employees]);

  //check in url if here ?employee= parameter is present then set activeEmployee
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const employeeParam = params.get('employee');
    const pageParam = params.get('page');
    const policyParam = params.get('policy');
    const timeOffParam = params.get('time_off');
    if (pageParam === 'activity' && !activeEmployeeActivity) {
      if (employeeParam && policyParam && timeOffParam) {
        const employee = employees.find(({ id }) => id.toString() === employeeParam.toString());
        const policy = policies.find(({ id }) => id.toString() === policyParam.toString());
        const time_off = time_offs.find(({ id }) => id.toString() === timeOffParam.toString());
        if (time_off) {
          setActiveTimeOff(time_off);
        }
        if (employee && policy && time_off) {
          setActiveEmployee(employee);
          setActivePolicy(policy);
          setActiveEmployeeActivity(true);
        }
      }
    }
    // eslint-disable-next-line 
  }, [employees, policies, time_offs]);


  useEffect(() => {
    if (!allPermissions?.length) {
      dispatch(loadPermissions(id));
    }

    // eslint-disable-next-line
  }, [dispatch, id, allPermissions?.length]);

  useEffect(() => {
    if (time_offs?.length && !_.isEmpty(activeTimeOff)) {
      // eslint-disable-next-line no-shadow
      //const time_off = time_offs.find(({id}) => id === activeTimeOff.id);
      //setActiveTimeOff(time_off);
      if (activePolicy && activePolicy.time_off_id !== activeTimeOff.id) {
        setActivePolicy(null);
      }

      dispatch(getPolicies(id, activeTimeOff.id));
    }
    // eslint-disable-next-line
  }, [activeTimeOff]);

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

  const editPolicy = (data) => {
    dispatch(updatePolicy(id, activeTimeOff.id, activePolicy.id, data));
    setNewPolicyOpen(false);
  };

  const removePolicy = (policyId) => {
    dispatch(deletePolicy(id, policyId, activeTimeOff.id));
  };

  const onEditPolicy = (policyId) => {
    setActivePolicy(policies.find(({id}) => id === policyId));
    setNewPolicyOpen(true);
  };

  const handleDuplicatePolicy = (policyId) => {
    setActivePolicy(policies.find(({id}) => id === policyId));
    setDuplicatePolicyOpen(true);
  };

  const onDuplicatePolicy = (data) => {
    dispatch(duplicatePolicy(id, activeTimeOff.id, activePolicy.id, data));
    setActivePolicy(null);
    setDuplicatePolicyOpen(false);
  };

  const handleEditPolicy = (data) => {
    dispatch(updatePolicySettings(id, activeTimeOff.id, activePolicy.id, data));
  }

  const handleEditPolicyEmployees = (data) => {
    dispatch(updatePolicyEmployees(id, activeTimeOff.id, activePolicy.id, {employees: data}));
  }
  
  const handleUsersDataManagement = () => {
    setActiveDataManagement(activePolicy);
  }

  const onRequestBehalf = (data, requestBehalfId) => {
    const selectedPolicy = policies.find(({id}) => id === data.policy_id);
    if (selectedPolicy) {
      if (requestBehalfId) {
        dispatch(updateRequestBehalf(id, selectedPolicy.time_off_id, data.policy_id, data, requestBehalfId));
      } else {
        dispatch(createRequestBehalf(id, selectedPolicy.time_off_id, data.policy_id, data));
      }
    }
  }

  const onAdjustBalance = (data) => {
    dispatch(createAdjustBalance(id, activeTimeOff.id, activePolicy.id ? activePolicy.id : activeDataManagement.id, data));
  }

  const onAdjustTimeUsed = (data) => {
    dispatch(createAdjustTimeUsed(id, activeTimeOff.id, activePolicy.id ? activePolicy.id : activeDataManagement.id, data));
  }

  const onOpenEmployee = (employeeId) => {
    setActiveEmployee(employees.find(({id}) => id === employeeId));
    dispatch(getRequestBehalf(id, activeTimeOff.id, activePolicy.id ? activePolicy.id : activeDataManagement.id, employeeId));
  }

  const onChangeRequestStatus = (requestBehalfId, status) => {
    dispatch(changeRequestBehalfStatus(id, activeTimeOff.id, activePolicy.id ? activePolicy.id : activeDataManagement.id, requestBehalfId, {status: status, employees: [activeEmployee.id]}));
  }

  const onUnassingPolicyEmployees = (employeeId, policyId) => {
    const timeOffId = activeTimeOff?.id ? activeTimeOff.id : policies.find(({id}) => id === policyId)?.time_off_id;
    dispatch(unasignPolicyEmployees(id, timeOffId, policyId, {employees: [employeeId]}));
  };

  const onOpenEmployeeActivity = (timeOffId, policyId, employeeId) => {
    history.push(`/${id}/settings/time-off?page=activity&policy=${policyId}&time_off=${timeOffId}&employee=${employeeId}`);
    const time_off = time_offs.find(({id}) => id === timeOffId);
    const policy = policies.find(({id}) => id === policyId);
    const employee = employees.find(({id}) => id === employeeId);
    if (!time_off || !policy || !employee) return;
    setActiveTimeOff(time_off);
    setActiveEmployee(employee);
    setActivePolicy(policy);
    setActiveEmployeeActivity(true);
  };

  return (
    <MaynLayout>
      <Dashboard>
        {
          activeEmployeeActivity && activeTimeOff && activePolicy && activeEmployee && !loading ? (
            <EmployeeActivity
              handleClose={() => {
                setActiveEmployeeActivity(false);
                setActiveDataManagement(activePolicy);
                history.push(`/${id}/settings/time-off`);
              }}
              employee={activeEmployee}
              activeTimeOff={activeTimeOff}
              activePolicy={activePolicy}
            />
          ) : null
        }
        {
          !activeEmployeeActivity && activeDataManagement && activeEmployee && !loading ? (
              <EmployeeManagementPolicy
                goEmployeeActivity={onOpenEmployeeActivity}
                onUnassingPolicyEmployees={onUnassingPolicyEmployees}
                handleClose={() => setActiveEmployee(null)}
                activeTimeOff={time_offs.find(({id}) => id === activeDataManagement.time_off_id)}
                activePolicy={policies.find(({id}) => id === activeDataManagement.id)}
                employee={activeEmployee}
                requestBehalf={requestBehalf}
                policies={policies}
                onRequestBehalf={onRequestBehalf}
                onChangeRequestStatus={onChangeRequestStatus}
              />
          ) : null
        }
        {
          !activeEmployeeActivity && !activeDataManagement && activeEmployee && !loading ? (
              <EmployeeManagement
                goEmployeeActivity={onOpenEmployeeActivity}
                onUnassingPolicyEmployees={onUnassingPolicyEmployees}
                handleClose={() => { setActiveEmployee(null); history.push(`/${id}/settings/accounts/accounts-list`); }}
                employee={activeEmployee}
                requestBehalf={requestBehalf}
                policies={policies}
                onRequestBehalf={onRequestBehalf}
                onChangeRequestStatus={onChangeRequestStatus}
              />
          ) : null
        }
        {
          !activeEmployeeActivity && activeDataManagement && !activeEmployee && !loading ? (
              <UserDataManagement
                handleClose={() => setActiveDataManagement(null)}
                activeTimeOff={time_offs.find(({id}) => id === activeDataManagement.time_off_id)}
                activePolicy={policies.find(({id}) => id === activeDataManagement.id)}
                employeesList={policies.find(({id}) => id === activeDataManagement.id)?.employees}
                handleEditPolicyEmployees={handleEditPolicyEmployees}
                onRequestBehalf={onRequestBehalf}
                onAdjustBalance={onAdjustBalance}
                onAdjustTimeUsed={onAdjustTimeUsed}
                handleOpenEmployee={onOpenEmployee}
              />
            ) : null
        }
        {
          !activeEmployeeActivity && !activeDataManagement && !activeEmployee ? (
            <>
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
                        activeTimeOff={time_offs.find(({id}) => id === activeTimeOff.id)}
                        activePolicy={policies.find(({id}) => id === activePolicy?.id)}
                        setActiveTimeOff={setActiveTimeOff}
                        createNewTimeOff={() => setNewTimeOffOpen(true)}
                        setActivePolicy={setActivePolicy}
                        createNewPolicy={() => { setActivePolicy(false); setNewPolicyOpen(true)} }
                        remove={removeTimeOff}
                        loading={loading}
                        policies={policies}
                        setEditVisible={setEditVisible}
                        user={user}
                        onEditPolicy={onEditPolicy}
                        onDeletePolicy={removePolicy}
                        onDuplicatePolicy={handleDuplicatePolicy}
                        handleEditPolicy={handleEditPolicy}
                        handleEditPolicyEmployees={handleEditPolicyEmployees}
                        handleUsersDataManagement={handleUsersDataManagement}
                        employees={employees}
                        groups={groups}
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
                  initialValue={{ ...(activePolicy || {}), type: activeTimeOff?.name }}
                  title={activePolicy ? `${t('Edit')} ${activePolicy.name} ${t('Policy')}` : t('Create New Policy')}
                  onSubmit={activePolicy ? editPolicy : createNewPolicy}
                  buttonTitle={activePolicy ? t('Save Changes') : t('Submit')}
                />
                <DuplicatePolicy
                  open={duplicatePolicyOpen}
                  handleClose={() => {
                    setDuplicatePolicyOpen(false);
                  }}
                  title={`${t('Duplicate')} ${activePolicy?.name} ${t('Policy')}`}
                  onSubmit={onDuplicatePolicy}
                  buttonTitle={t('Duplicate')}
                />
              </PageLayout>
          </>
        ) : null
      }
      
      </Dashboard>
    </MaynLayout>
  );
};
