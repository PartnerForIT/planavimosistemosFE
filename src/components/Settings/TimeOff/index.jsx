import React, { useEffect, useState } from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
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
  isLoadingSelector, isShowSnackbar, permissionsSelector, policiesLoading, policiesSelector, policyEmployeeSelector, timeOffsSelector, requestBehalfSelector, snackbarText, snackbarType,
} from '../../../store/settings/selectors';
import { userSelector } from '../../../store/auth/selectors';
import TimeOffIcon from '../../Icons/TimeOff';
import TimeOffBlock from './TimeOffDetails/TimeOffBlock';
import style from './timeoff.module.scss';
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
  updatePolicyActivity,
  removePolicyActivity,
  duplicatePolicy,
  getPolicies,
  getPolicyEmployee,
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
  const policyEmployee = useSelector(policyEmployeeSelector);
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
  const [currentPage, setCurrentPage] = useState('main');
  const [loadedPageData, setLoadedPageData] = useState(false);

  useEffect(() => {
    dispatch(getTimeOffs(id));
    dispatch(loadEmployeesAll(id, {time_off: true}));
    dispatch(getAccountGroups(id));
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const pageParam = params.get('page');
    if (pageParam) {
      switch (pageParam) {
        case 'activity':
          setCurrentPage('employeeActivity');
          break;
        case 'employee-management-policy':
          setCurrentPage('employeeManagementPolicy');
          break;
        case 'employee-management':
          setCurrentPage('employeeManagement');
          break;
        case 'data-management':
          setCurrentPage('userDataManagement');
          break;
        default:
          setCurrentPage('main');
          break;
      }
    } else {
      setCurrentPage('main');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [history.location.search]);

  const initializePageFromUrl = () => {
    const params = new URLSearchParams(window.location.search);
    const page = params.get('page');
    const employeeId = params.get('employee');
    const policyId = params.get('policy');
    const timeOffId = params.get('time_off');

    const foundEmployee = employees.find(e => e.id.toString() === employeeId);
    const foundPolicy = policies.find(p => p.id.toString() === policyId);
    const foundTimeOff = time_offs.find(t => t.id.toString() === timeOffId);

    switch (page) {
      case 'activity':
        if (foundEmployee && foundPolicy && foundTimeOff) {
          setActiveTimeOff(foundTimeOff);
          setActivePolicy(foundPolicy);
          setActiveDataManagement(foundPolicy);
          setActiveEmployee(foundEmployee);
          setLoadedPageData(true);
        }
        break;

      case 'employee-management':
        if (foundPolicy && foundTimeOff && foundEmployee) {
          setActiveTimeOff(foundTimeOff);
          setActivePolicy(foundPolicy);
          setActiveEmployee(foundEmployee);
          setActiveDataManagement(foundPolicy);
          dispatch(getRequestBehalf(id, foundTimeOff.id, foundPolicy.id, employeeId));
          setLoadedPageData(true);
        }
        break;

      case 'data-management':
        if (foundPolicy && foundTimeOff) {
          setActiveTimeOff(foundTimeOff);
          setActivePolicy(foundPolicy);
          setActiveDataManagement(foundPolicy);
          setLoadedPageData(true);
        }
        break;

      case 'employee-management-policy':
        if (foundPolicy && foundTimeOff && foundEmployee) {
          setActiveTimeOff(foundTimeOff);
          setActivePolicy(foundPolicy);
          setActiveDataManagement(foundPolicy);
          setActiveEmployee(foundEmployee);
          dispatch(getRequestBehalf(id, foundTimeOff.id, foundPolicy.id, employeeId));
          setLoadedPageData(true);
        }
        break;

      default:
        setLoadedPageData(true);
        break;
    }
  };

  useEffect(() => {
    if (
      (currentPage !== 'main') &&
      employees.length &&
      policies.length &&
      time_offs.length &&
      !loadedPageData
    ) {
      initializePageFromUrl();
    }
    // eslint-disable-next-line
  }, [currentPage, employees, policies, time_offs]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const page = params.get('page');
    const timeOffId = params.get('time_off');
    const policyId = params.get('policy');
    const employeeId = params.get('employee');

    if (
      (page === 'activity' || page === 'employee-management-policy' || page === 'data-management' || page === 'employee-management') &&
      timeOffId &&
      time_offs.length &&
      !policies.some(p => p.time_off_id === parseInt(timeOffId))
    ) {
      dispatch(getPolicies(id, timeOffId));
    }

    if (
      (page === 'activity' || page === 'employee-management-policy' || page === 'employee-management') &&
      timeOffId &&
      time_offs.length &&
      policyId &&
      policies.length &&
      (!policyEmployee.id || policyEmployee.policy_id !== parseInt(policyId))
    ) {
      dispatch(getPolicyEmployee(id, timeOffId, policyId, employeeId));
    }

    // eslint-disable-next-line
  }, [time_offs, policies]);


  useEffect(() => {
    if (!allPermissions?.length) {
      dispatch(loadPermissions(id));
    }

    // eslint-disable-next-line
  }, [dispatch, id, allPermissions?.length]);

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
    const policy = policies.find(({ id }) => id === activePolicy.id);
    if (policy) {
      setActiveDataManagement(policy);
      history.push(`/${id}/settings/time-off?page=data-management&time_off=${policy.time_off_id}&policy=${policy.id}`);
    }
  }

  const onSetActiveTimeOff = (timeOff) => {
    setActiveTimeOff(timeOff);
    setActivePolicy(null);
    setActiveDataManagement(null);
    setActiveEmployee(null);
    dispatch(getPolicies(id, timeOff.id));
  };

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
    history.push(`/${id}/settings/time-off?page=employee-management-policy&time_off=${activeTimeOff.id}&policy=${activePolicy.id}&employee=${employeeId}`);
    setCurrentPage('employeeManagementPolicy');
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
    setCurrentPage('employeeActivity');
    const time_off = time_offs.find(({id}) => id === timeOffId);
    const policy = policies.find(({id}) => id === policyId);
    const employee = employees.find(({id}) => id === employeeId);
    if (!time_off || !policy || !employee) return;
    setActiveTimeOff(time_off);
    setActiveEmployee(employee);
    setActivePolicy(policy);

    dispatch(getPolicyEmployee(id, timeOffId, policyId, employeeId));
  };

  const onCloseUserDataManagement = () => {
    setCurrentPage('main');
    setActiveDataManagement(null);
    history.push(`/${id}/settings/time-off`);
  };

  const onCloseEmployeeManagementPolicy = () => {
    setCurrentPage('userDataManagement');
    setActiveEmployee(null);
    history.push(`/${id}/settings/time-off?page=data-management&time_off=${activePolicy.time_off_id}&policy=${activePolicy.id}`);
  };

  const onCloseEmployeeActivity = () => {
    setCurrentPage('employeeManagementPolicy');
    history.push(`/${id}/settings/time-off?page=employee-management-policy&time_off=${activeTimeOff.id}&policy=${activePolicy.id}&employee=${activeEmployee.id}`);
    dispatch(getRequestBehalf(id, activeTimeOff.id, activePolicy.id ? activePolicy.id : activeDataManagement.id, activeEmployee.id));
  };

  const onRemoveActivity = (activity) => {
    dispatch(removePolicyActivity(id, activity.time_off_id, activity.policy_id, activity.employee_id, activity.id));
  };

  const onEditActivity = (activity, data) => {
    dispatch(updatePolicyActivity(id, activity.time_off_id, activity.policy_id, activity.employee_id, activity.id, data));
  };
  
  return (
    <MaynLayout>
      <Dashboard>
        {
           currentPage === 'main' ? (
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
                        setActiveTimeOff={onSetActiveTimeOff}
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

        {
          currentPage !== 'main' && (
            !loading && loadedPageData ? (
            <>
              {
                currentPage === 'employeeActivity' ? (
                  <EmployeeActivity
                    handleClose={onCloseEmployeeActivity}
                    employee={activeEmployee}
                    activeTimeOff={activeTimeOff}
                    activePolicy={activePolicy}
                    activities={policyEmployee?.activities || []}
                    onRemoveActivity={onRemoveActivity}
                    onEditActivity={onEditActivity}
                  />
                ) : null
              }
              {
                 currentPage === 'employeeManagementPolicy' ? (
                    <EmployeeManagementPolicy
                      goEmployeeActivity={onOpenEmployeeActivity}
                      onUnassingPolicyEmployees={onUnassingPolicyEmployees}
                      handleClose={onCloseEmployeeManagementPolicy}
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
                 currentPage === 'employeeManagement' ? (
                    <EmployeeManagement
                      goEmployeeActivity={onOpenEmployeeActivity}
                      onUnassingPolicyEmployees={onUnassingPolicyEmployees}
                      handleClose={() => { setActiveEmployee(null); history.push(`/${id}/settings/accounts/accounts-list`); }}
                      employee={activeEmployee}
                      requestBehalf={requestBehalf}
                      policies={policies}
                      onRequestBehalf={onRequestBehalf}
                      onChangeRequestStatus={onChangeRequestStatus}
                      activeTimeOff={activeTimeOff}
                    />
                ) : null
              }
              {
                currentPage === 'userDataManagement' ? (
                    <UserDataManagement
                      handleClose={onCloseUserDataManagement}
                      activeTimeOff={time_offs.find(({id}) => id === activeDataManagement.time_off_id)}
                      activePolicy={policies.find(({id}) => id === activeDataManagement.id)}
                      employeesList={policies.find(({id}) => id === activeDataManagement.id)?.employees}
                      policies={policies}
                      handleEditPolicyEmployees={handleEditPolicyEmployees}
                      onRequestBehalf={onRequestBehalf}
                      onAdjustBalance={onAdjustBalance}
                      onAdjustTimeUsed={onAdjustTimeUsed}
                      handleOpenEmployee={onOpenEmployee}
                    />
                  ) : null  
              }
            </>
          ) :  <>
              <TitleBlock
                title={t('Time Off')}
              >
                <TimeOffIcon viewBox='0 0 26 26' fill='rgba(226,235,244,0.85)' />
              </TitleBlock>
              <PageLayout>
                <div className={style.progressWrapper}>
                  <Progress />
                </div>
              </PageLayout>
            </>
          )
        }
      
      </Dashboard>
    </MaynLayout>
  );
};
