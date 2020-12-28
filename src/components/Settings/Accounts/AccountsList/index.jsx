import React, {
  useState, useEffect, useMemo, useCallback,
} from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import Snackbar from '@material-ui/core/Snackbar';
import MaynLayout from '../../../Core/MainLayout';
import PageLayout from '../../../Core/PageLayout';
import TitleBlock from '../../../Core/TitleBlock';
import Dashboard from '../../../Core/Dashboard';
import AccountsIcon from '../../../Icons/2Peple';
import Progress from '../../../Core/Progress';
import {
  isLoadingSelector,
  isShowSnackbar,
  snackbarType,
  snackbarText,
  employeesSelector,
  employeesLoadingSelector,
  employeeSelector,
  categoriesSkillsSelector,
  AccountGroupsSelector, placesSelector, securityCompanySelector,
} from '../../../../store/settings/selectors';
import Filter from './Filter';
import DataTable from '../../../Core/DataTableCustom/OLT';
import {
  createEmployee,
  getAccountGroups, getSecurityCompany,
  loadEmployeesAll,
  loadEmployeesEdit,
  loadPlace,
  loadSkills,
  patchEmployee,
  removeEmployee,
  setEmployeesActions,
} from '../../../../store/settings/actions';
import CreateAccount from '../../../Core/Dialog/CreateAccount';
import EditAccount from '../../../Core/Dialog/EditAccount';
import CurrencySign from '../../../shared/CurrencySign';
import DeleteEmployee from '../../../Core/Dialog/DeleteEmployee';
import ChangeEmplStatus from '../../../Core/Dialog/ChangeEmplStatus';
import TimeFormat from '../../../shared/TimeFormat';
import ImportAccounts from '../../../Core/Dialog/ImportAccounts';

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

const LabelWithCurrencySign = ({ text }) => (
  <>
    {text}
    <CurrencySign />
  </>
);

const columns = [

  { label: 'Status', field: 'status', checked: true },
  { label: 'Employee', field: 'name', checked: true },
  { label: 'Role', field: 'role', checked: true },
  { label: 'Email', field: 'email', checked: true },
  { label: 'Skill', field: 'skills', checked: true },
  { label: 'Group', field: 'groups', checked: true },
  { label: 'Sub-group', field: 'subgroup', checked: true },
  { label: 'Assigned Place', field: 'place', checked: true },
  { label: <LabelWithCurrencySign text='Cost/h/' />, field: 'cost', checked: true },
  { label: <LabelWithCurrencySign text='Charge/h/' />, field: 'charge', checked: true },
  { label: 'Created on', field: 'created_at', checked: true },
  { label: 'Status change', field: 'updated_at', checked: true },
];

const columnsWidthArray = {
  status: 80,
  name: 200,
  created_at: 220,
  updated_at: 220,
  place: 100,
  skills: 200,
  role: 100,
};

export default function AccountsList() {
  const { id } = useParams();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const classes = useStyles();

  const isLoading = useSelector(isLoadingSelector);
  const isSnackbar = useSelector(isShowSnackbar);
  const typeSnackbar = useSelector(snackbarType);
  const textSnackbar = useSelector(snackbarText);
  const { users: employeesAll = [], stats = {} } = useSelector(employeesSelector);
  const empLoading = useSelector(employeesLoadingSelector);
  const employee = useSelector(employeeSelector);
  const skills = useSelector(categoriesSkillsSelector);
  const groups = useSelector(AccountGroupsSelector);
  const places = useSelector(placesSelector);
  const security = useSelector(securityCompanySelector);

  const [usersOptions, setUsersOptions] = useState(3);
  const [columnsArray, setColumnsArray] = useState(columns);
  const [checkedItems, setCheckedItems] = useState([]);
  const [importVisible, setImportVisible] = useState(true);

  const [selected, setSelected] = useState({});
  const [newVisible, setNewVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);

  const [deleteVisible, setDeleteVisible] = useState(false);

  const [changeStatusOpen, setChangeStatusOpen] = useState(false);

  const updateEmployee = (data) => {
    if (editVisible) {
      dispatch(patchEmployee(id, editVisible, data));
      setEditVisible(false);
    }
  };
  const createAccount = (userData) => dispatch(createEmployee(id, userData));

  const userStats = useMemo(() => {
    if (stats) {
      const {
        total,
        ...rest
      } = stats;
      return {
        accounts: total,
        ...rest,
      };
    }
    return {};
  }, [stats]);

  useEffect(() => {
    dispatch(loadEmployeesAll(id));
    dispatch(loadSkills(id));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const editRowHandler = (employeeId) => {
    dispatch(loadEmployeesEdit(id, employeeId));
    dispatch(loadSkills(id));
    dispatch(getAccountGroups(id));
    dispatch(loadPlace(id));
    setEditVisible(employeeId);
  };

  useEffect(() => {
    if (newVisible || editVisible) {
      dispatch(loadSkills(id));
      dispatch(getAccountGroups(id));
      dispatch(loadPlace(id));
      dispatch(getSecurityCompany(id));
    }
  }, [dispatch, editVisible, id, newVisible]);

  const deleteEmployee = (employeeId) => {
    setDeleteVisible(employeeId);
  };

  const handleChangeUsers = (e) => {
    const { value } = e.target;
    setUsersOptions(parseInt(value, 10));
    dispatch(loadEmployeesAll(id, parseInt(value, 10) !== 3 ? { status: value } : null));
  };

  const handleChangingStatus = (status) => {
    dispatch(setEmployeesActions(id, checkedItems, status));
    setCheckedItems([]);
  };

  const employees = useMemo(() => employeesAll.map((empl) => {
    const {
      // eslint-disable-next-line camelcase,no-shadow
      name, surname, status, created_at, updated_at, place, groups, skills, subgroups, permissions,
      ...rest
    } = empl;
    return {
      ...rest,
      groups: groups[0]?.name ?? subgroups[0]?.parent_group?.name ?? '',
      subgroup: subgroups[0]?.name ?? '',
      skills: skills[0]?.name ?? '',
      place: place[0]?.name ?? '',
      role: permissions[0]?.account_roles?.name ?? '',
      // eslint-disable-next-line camelcase
      created_at: created_at ? <TimeFormat date={created_at} /> : '',
      // eslint-disable-next-line camelcase
      updated_at: updated_at ? <TimeFormat date={updated_at} /> : '',
      name: `${name} ${surname}`,
      status: parseInt(status, 10),
    };
  }) ?? [], [employeesAll]);

  const selectionHandler = (itemId, value) => {
    // eslint-disable-next-line array-callback-return
    employees.forEach((item) => {
      if (item.id === itemId) {
        // eslint-disable-next-line no-param-reassign
        item.checked = !item.checked;
      }
    });
    if (value) {
      setCheckedItems([...checkedItems, itemId]);
    } else {
      const index = checkedItems.indexOf(itemId);
      checkedItems.splice(index, 1);
      setCheckedItems([...checkedItems]);
    }
  };

  // eslint-disable-next-line no-shadow
  const sorting = useCallback((employees, { field, asc }) => {
    const sortNumFunction = (a, b) => (asc ? (a[field] - b[field]) : (b[field] - a[field]));
    const sortFunction = (a, b) => {
      if (typeof a[field] === 'number' && typeof b[field] === 'number') {
        return sortNumFunction(a, b);
      }
      if (typeof a[field] === 'object' || typeof b[field] === 'object') {
        return sortNumFunction(a, b);
      }
      if (asc) {
        return a[field].toString()
          .localeCompare(b[field]);
      }
      return b[field].toString()
        .localeCompare(a[field]);
    };
    return employees.sort(sortFunction);
  }, []);

  return (
    <MaynLayout>
      <Dashboard>
        <TitleBlock
          title={t('Account list')}
          info={userStats}
          TitleButtonNew={t('New account')}
          TitleButtonImport={t('Import Accounts')}
          tooltip={t('Accounts List')}
          handleButtonImport={() => setImportVisible(true)}
          handleButtonNew={() => setNewVisible(true)}
        >
          <AccountsIcon />
        </TitleBlock>
        <PageLayout>
          {
            isLoading ? <Progress />
              : (
                <>
                  <Filter
                    handleChangeUser={handleChangeUsers}
                    users={usersOptions}
                    changeUserStatus={(status) => setChangeStatusOpen(status)}
                    checkedItems={checkedItems ?? []}
                    clearCheckbox={() => ({})}
                    stats={userStats}
                  />
                  <DataTable
                    data={employees ?? []}
                    columns={columnsArray ?? []}
                    columnsWidth={columnsWidthArray ?? {}}
                    onColumnsChange={setColumnsArray}
                    selectable
                    sortable
                    loading={empLoading}
                    onSelect={selectionHandler}
                    editRow={editRowHandler}
                    hoverActions
                    hoverable
                    removeRow={deleteEmployee}
                    onSort={(field, asc) => sorting(employees, { field, asc })}
                    // onSerach={searchHandler}
                    // lastPage={page.last_page}
                    // activePage={page.current_page}
                    // itemsCountPerPage={page.per_page}
                    // totalItemsCount={page.total}
                    // handlePagination={console.log}
                    selectedItem={selected}
                    // totalDuration={totalDuration}
                    setSelectedItem={setSelected}
                    verticalOffset='300px'
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
          <CreateAccount
            open={newVisible}
            handleClose={() => setNewVisible(false)}
            companyId={id}
            skills={skills}
            groups={groups}
            places={places}
            security={security}
            createAccount={createAccount}
          />
          <EditAccount
            open={!!editVisible}
            employee={employee}
            title={`${t('Edit')} ${employee.name ?? ''} ${employee.surname ?? ''} ${t('Account')}`}
            handleClose={() => setEditVisible(false)}
            handleOpen={(visible) => setEditVisible(visible)}
            companyId={id}
            loading={empLoading}
            skills={skills}
            groups={groups}
            places={places}
            onSubmit={updateEmployee}
          />
          <DeleteEmployee
            open={deleteVisible}
            handleClose={() => setDeleteVisible(false)}
            title={t('Delete Employee?')}
            employees={employees}
            remove={() => dispatch(removeEmployee(id, deleteVisible))}
          />
          <ChangeEmplStatus
            open={changeStatusOpen}
            handleClose={() => setChangeStatusOpen(false)}
            title={t('Change status?')}
            changeStatus={handleChangingStatus}
          />
          <ImportAccounts
            title={t('Import accounts')}
            open={importVisible}
            handleClose={() => setImportVisible(false)}
          />
        </PageLayout>
      </Dashboard>
    </MaynLayout>
  );
}
