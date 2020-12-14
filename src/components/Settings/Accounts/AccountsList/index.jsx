import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import Snackbar from '@material-ui/core/Snackbar';
import moment from 'moment';
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
  AccountGroupsSelector, placesSelector,
} from '../../../../store/settings/selectors';
import Filter from './Filter';
import DataTable from '../../../Core/DataTableCustom/OLT';
import {
  getAccountGroups,
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
  { label: 'Role', field: 'speciality_id', checked: true },
  { label: 'Email', field: 'email', checked: true },
  { label: 'Skill', field: 'skills', checked: true },
  { label: 'Group', field: 'groups', checked: true },
  { label: 'Sub-group', field: 'subgroup', checked: true },
  { label: 'Assigned Place', field: 'place', checked: true },
  { label: <LabelWithCurrencySign text='Cost/h/' />, field: 'cost', checked: true },
  { label: <LabelWithCurrencySign text='Charge/h/' />, field: 'charge', checked: true },
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
  const { users: employeesAll, stats } = useSelector(employeesSelector);
  const empLoading = useSelector(employeesLoadingSelector);
  const employee = useSelector(employeeSelector);
  const skills = useSelector(categoriesSkillsSelector);
  const groups = useSelector(AccountGroupsSelector);
  const places = useSelector(placesSelector);

  const [usersOptions, setUsersOptions] = useState(3);
  const [columnsArray, setColumnsArray] = useState(columns);
  const [checkedItems, setCheckedItems] = useState([]);

  const [selected, setSelected] = useState({});
  const [newVisible, setNewVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);

  const [deleteVisible, setDeleteVisible] = useState(false);

  const [changeStatusOpen, setChangeStatusOpen] = useState(false);

  const updateEmployee = (data) => {
    dispatch(patchEmployee(id, editVisible, data));
    setEditVisible(false);
  };

  const userStats = useMemo(() => {
    const {
      total,
      ...rest
    } = stats;
    return {
      accounts: total,
      ...rest,
    };
  }, [stats]);

  useEffect(() => {
    dispatch(loadEmployeesAll(id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const editRowHandler = (employeeId) => {
    dispatch(loadEmployeesEdit(id, employeeId));
    dispatch(loadSkills(id));
    dispatch(getAccountGroups(id));
    dispatch(loadPlace(id));
    setEditVisible(employeeId);
  };

  const deleteEmployee = (employeeId) => {
    setDeleteVisible(employeeId);
  };

  const handleChangeUsers = (e) => {
    const { value } = e.target;
    setUsersOptions(parseInt(value, 10));
  };

  const handleChangingStatus = (status) => {
    dispatch(setEmployeesActions(id, checkedItems, status));
  };

  const employees = useMemo(() => employeesAll.map((empl) => {
    const {
      // eslint-disable-next-line camelcase,no-shadow
      name, surname, status, created_at, updated_at, place, groups,
      ...rest
    } = empl;
    return {
      ...rest,
      group: groups?.name ?? '',
      subgroup: groups?.sub_groups?.name ?? '',
      place: place[0]?.name ?? '',
      // eslint-disable-next-line camelcase
      created_at: created_at ? moment(created_at)
        .format('lll') : '',
      // eslint-disable-next-line camelcase
      updated_at: updated_at ? moment(updated_at)
        .format('lll') : '',
      name: `${name} ${surname}`,
      status: parseInt(status, 10),
    };
  }), [employeesAll]);

  const selectionHandler = (itemId, value) => {
    // eslint-disable-next-line array-callback-return
    employees.map((item) => {
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

  return (
    <MaynLayout>
      <Dashboard>
        <TitleBlock
          title={t('Account list')}
          info={userStats}
          TitleButtonNew={t('New account')}
          TitleButtonImport={t('Import Accounts')}
          tooltip={t('Accounts List')}
          handleButtonImport={() => ({})}
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
                    handleChangeOrganizations={handleChangeUsers}
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
                    onSort={() => ({})}
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

          />
          <EditAccount
            open={editVisible}
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
        </PageLayout>
      </Dashboard>
    </MaynLayout>
  );
}
