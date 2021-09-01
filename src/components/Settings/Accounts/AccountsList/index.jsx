import React, {
  useState, useEffect, useMemo, useCallback,
} from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import Snackbar from '@material-ui/core/Snackbar';
import moment from 'moment';
import _ from 'lodash';

import MaynLayout from '../../../Core/MainLayout';
import PageLayout from '../../../Core/PageLayout';
import TitleBlock from '../../../Core/TitleBlock';
import Dashboard from '../../../Core/Dashboard';
import AccountsIcon from '../../../Icons/2Peple';
import Progress from '../../../Core/Progress';
import {
  isLoadingSelector,
  employeeLoadingSelector,
  isShowSnackbar,
  snackbarType,
  snackbarText,
  employeesSelector,
  employeesLoadingSelector,
  employeeSelector,
  categoriesSkillsSelector,
  AccountGroupsSelector, placesSelector, securityCompanySelector, importedEmployees, importLoadingSelector,
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
  sendImportedEmployeesSuccess,
  setEmployeesActions,
} from '../../../../store/settings/actions';
import CreateAccount from '../../../Core/Dialog/CreateAccount';
import EditAccount from '../../../Core/Dialog/EditAccount';
import CurrencySign from '../../../shared/CurrencySign';
import DeleteEmployee from '../../../Core/Dialog/DeleteEmployee';
import ChangeEmplStatus from '../../../Core/Dialog/ChangeEmplStatus';
import ImportAccounts from '../../../Core/Dialog/ImportAccounts';
import usePermissions from '../../../Core/usePermissions';
import useCompanyInfo from '../../../../hooks/useCompanyInfo';

import styles from './accounts.module.scss';

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

const NameWithAvatar = (row) => (
  <div className={styles.cellNameWithAvatar}>
    {
      row.photo && (
        <img
          alt=''
          className={styles.cellNameWithAvatar__image}
          src={row.photo}
        />
      )
    }
    {row.name}
  </div>
);

const columns = [
  { label: 'Status', field: 'status', checked: true },
  {
    label: 'Employee',
    field: 'name',
    checked: true,
    cellRenderer: NameWithAvatar,
  },
  { label: 'Email', field: 'email', checked: true },
  { label: 'Role', field: 'role', checked: true },
  { label: 'Skill', field: 'skills', checked: true },
  { label: 'Group', field: 'groups', checked: true },
  { label: 'Sub-group', field: 'subgroup', checked: true },
  { label: 'Assigned Place', field: 'place', checked: true },
  // { label: <LabelWithCurrencySign text='Earning/h/' />, field: 'salary', checked: true },
  {
    label: <LabelWithCurrencySign text='Cost/h/' />,
    field: 'cost',
    cellRenderer: ({ profitability }) => profitability.cost,
    checked: true,
  },
  {
    label: <LabelWithCurrencySign text='Charge/h/' />,
    field: 'sallary',
    cellRenderer: ({ profitability }) => profitability.sallary,
    checked: true,
  },
  { label: 'Created on', field: 'created_at', checked: true },
  { label: 'Status change', field: 'updated_at', checked: true },
];

const columnsWidthArray = {
  status: 120,
  name: 170,
  created_at: 220,
  updated_at: 220,
  place: 150,
  skills: 200,
  role: 150,
  email: 200,
  groups: 150,
  subgroup: 150,
};

const permissionsConfig = [
  {
    name: 'accounts_create',
    permission: 'accounts_create',
  },
  {
    name: 'accounts_delete',
    permission: 'accounts_delete',
  },
  {
    name: 'create_groups',
    module: 'create_groups',
  },
  {
    name: 'places',
    module: 'create_places',
  },
  {
    name: 'cost',
    module: 'cost_earning',
  },
  {
    name: 'profit',
    module: 'profitability',
  },
];
export default function AccountsList() {
  const { id } = useParams();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const classes = useStyles();

  const isLoading = useSelector(isLoadingSelector);
  const isSnackbar = useSelector(isShowSnackbar);
  const typeSnackbar = useSelector(snackbarType);
  const textSnackbar = useSelector(snackbarText);
  const { users: Allemployees = [], stats = {} } = useSelector(employeesSelector);
  const empLoading = useSelector(employeesLoadingSelector);
  const employee = useSelector(employeeSelector);
  const employeeLoading = useSelector(employeeLoadingSelector);
  const skills = useSelector(categoriesSkillsSelector);
  const groups = useSelector(AccountGroupsSelector);
  const places = useSelector(placesSelector);
  const security = useSelector(securityCompanySelector);
  const imported = useSelector(importedEmployees);
  const importLoading = useSelector(importLoadingSelector);
  const [usersOptions, setUsersOptions] = useState(3);
  const [columnsArray, setColumnsArray] = useState([]);
  const [checkedItems, setCheckedItems] = useState([]);
  const [importVisible, setImportVisible] = useState(false);

  const [selected, setSelected] = useState({});
  const [newVisible, setNewVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);

  const [deleteVisible, setDeleteVisible] = useState(null);

  const [changeStatusOpen, setChangeStatusOpen] = useState(false);
  const [employeesAll, setEmployeesAll] = useState([]);
  const [all, setAll] = useState(false);

  const permissions = usePermissions(permissionsConfig);
  const { dateFormat } = useCompanyInfo();

  const updateEmployee = (data) => {
    if (editVisible) {
      dispatch(patchEmployee(id, editVisible, data));
      setEditVisible(false);
    }
  };
  const createAccount = (userData) => {
    dispatch(createEmployee(id, userData));
  };

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

  useEffect(() => {
    if (Array.isArray(Allemployees)) {
      setEmployeesAll([...Allemployees]);
    }
  }, [Allemployees]);

  const editRowHandler = (employeeId) => {
    dispatch(loadEmployeesEdit(id, employeeId));
    setEditVisible(employeeId);
  };

  const clearImported = () => dispatch(sendImportedEmployeesSuccess());

  useEffect(() => {
    if (newVisible || editVisible) {
      // dispatch(loadSkills(id));
      dispatch(getAccountGroups(id));
      dispatch(loadPlace(id));
      dispatch(getSecurityCompany(id));
    }
  }, [dispatch, editVisible, id, newVisible]);

  useEffect(() => {
    let allColumnsArray = columns;

    allColumnsArray = allColumnsArray.filter((column) => {
      if (!permissions.places && column.field === 'place') {
        return false;
      }
      if (!permissions.create_groups && (column.field === 'groups' || column.field === 'subgroup')) {
        return false;
      }
      if (!permissions.cost && column.field === 'cost') {
        return false;
      }
      if (!permissions.profit && (column.field === 'charge' || column.field === 'sallary')) {
        return false;
      }
      return true;
    });

    setColumnsArray(allColumnsArray);
  }, [permissions]);

  const deleteEmployee = (employeeId) => {
    setDeleteVisible([employeeId]);
  };
  const handleRemoveEmployees = () => {
    dispatch(setEmployeesActions(
      id,
      deleteVisible,
      'delete',
    ));
    setDeleteVisible(null);
    setCheckedItems([]);
  };

  const handleChangeUsers = (e) => {
    const { value } = e.target;
    setUsersOptions(parseInt(value, 10));
    setCheckedItems([]);
    dispatch(loadEmployeesAll(id, parseInt(value, 10) !== 3 ? { status: value } : null));
  };

  const handleChangingStatus = (status) => {
    dispatch(setEmployeesActions(id, checkedItems.length ? checkedItems : [selected.id], status));
    setCheckedItems([]);
  };
  const handleChangeStatus = (status) => {
    if (status === 'delete') {
      setDeleteVisible(checkedItems.length ? checkedItems : [selected.id]);
    } else {
      setChangeStatusOpen(status);
    }
  };

  const employees = useMemo(() => employeesAll.map((empl) => {
    const {
      // eslint-disable-next-line camelcase,no-shadow
      name, surname, status, groups, skills, subgroups, permissions,
      created_at: createdAt,
      updated_at: updatedAt,
      place,
      ...rest
    } = empl;
    return {
      ...rest,
      groups: groups?.[0]?.name ?? subgroups?.[0]?.parent_group?.name ?? '',
      subgroup: subgroups?.[0]?.name ?? '',
      skills: skills?.[0]?.name ?? '',
      place: place?.[0]?.name ?? '',
      role: permissions?.[0]?.account_roles?.name ?? '',
      created_at: createdAt ? moment(createdAt).format(dateFormat) : '',
      updated_at: updatedAt ? moment(updatedAt).format(dateFormat) : '',
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
      if (field === 'cost' || field === 'sallary') {
        return sortNumFunction(a.profitability, b.profitability);
      }
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

  const selectAllHandler = (data = []) => {
    const value = data.length;
    // eslint-disable-next-line no-shadow
    const checkedItems = data.map(({ id }) => id);
    setCheckedItems(checkedItems);
    setEmployeesAll(employeesAll.map(({ checked, ...rest }) => ({ ...rest, checked: !!value })));
  };

  useEffect(() => {
    if (employees.length && checkedItems.length === employees.length) {
      setAll(true);
    } else {
      setAll(false);
    }
  }, [checkedItems.length, employees.length]);

  return (
    <MaynLayout>
      <Dashboard withoutScroll>
        <TitleBlock
          title={t('Account list')}
          info={userStats}
          TitleButtonNew={permissions.accounts_create ? t('New account') : ''}
          TitleButtonImport={permissions.accounts_create ? t('Import Accounts') : ''}
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
                    changeUserStatus={handleChangeStatus}
                    checkedItems={checkedItems ?? []}
                    clearCheckbox={() => ({})}
                    stats={userStats}
                    selectedItem={selected}
                    withDeleteButton={permissions.accounts_delete}
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
                    removeRow={permissions.accounts_delete ? deleteEmployee : undefined}
                    onSort={(field, asc) => sorting(employees, { field, asc })}
                    selectedItem={selected}
                    setSelectedItem={setSelected}
                    verticalOffset='329px'
                    selectAllItems={selectAllHandler}
                    all={all}
                    setAll={setAll}
                    accountList
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
            firstUser={!employees.length}
          />
          <EditAccount
            open={!!editVisible}
            employee={employee}
            title={`
              ${t('Edit')}
              ${!employeeLoading ? `${employee.name ?? ''} ${employee.surname ?? ''}` : ''}
              ${t('Account')}
            `}
            handleClose={() => setEditVisible(false)}
            handleOpen={setEditVisible}
            companyId={id}
            loading={employeeLoading}
            skills={skills}
            groups={groups}
            places={places}
            onSubmit={updateEmployee}
          />
          <DeleteEmployee
            open={deleteVisible}
            handleClose={() => setDeleteVisible(false)}
            title={deleteVisible?.length > 1 ? t('Delete Employees?') : t('Delete Employee?')}
            employees={employees}
            remove={handleRemoveEmployees}
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
            handleClose={() => {
              if (importLoading) {
                return;
              }

              setImportVisible(false);
              if (!_.isEmpty(imported)) {
                setCheckedItems([]);
                dispatch(loadSkills(id));
                dispatch(getAccountGroups(id));
                dispatch(loadPlace(id));
              }
            }}
            imported={imported}
            clearImported={clearImported}
            employees={employees}
            loading={importLoading}
          />
        </PageLayout>
      </Dashboard>
    </MaynLayout>
  );
}
