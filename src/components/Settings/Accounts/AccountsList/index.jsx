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
  getAccountGroups, loadEmployeesAll, loadEmployeesEdit, loadPlace, loadSkills, patchEmployee,
} from '../../../../store/settings/actions';
import CreateAccount from '../../../Core/Dialog/CreateAccount';
import EditAccount from '../../../Core/Dialog/EditAccount';

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

const columns = [

  { label: 'Status', field: 'status', checked: true },
  { label: 'Employee', field: 'name', checked: true },
  { label: 'Role', field: 'speciality_id', checked: true },
  { label: 'Email', field: 'email', checked: true },
  { label: 'Skill', field: 'skills', checked: true },
  { label: 'Group', field: 'groups', checked: true },
  { label: 'Sub-group', field: 'subgroup', checked: true },
  { label: 'Assigned Place', field: 'place', checked: true },
  { label: 'Cost/h/$', field: 'cost', checked: true },
  { label: 'Charge/h/$', field: 'charge', checked: true },
  { label: 'Charge/h/$', field: 'charge', checked: true },
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

// status
// 1 active
// 2 terminated
// 0 suspend

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

  const updateEmployee = (data) => {
    dispatch(patchEmployee(id, selected.id, data));
    setEditVisible(false);
  };

  const userStats = useMemo(() => {
    const { total, ...rest } = stats;
    return {
      accounts: total,
      ...rest,
    };
  }, [stats]);

  useEffect(() => {
    dispatch(loadEmployeesAll(id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (selected.id) {
      setEditVisible(true);
    }
    dispatch(loadEmployeesEdit(id, selected.id));
    dispatch(loadSkills(id));
    dispatch(getAccountGroups(id));
    dispatch(loadPlace(id));
  }, [dispatch, id, selected.id]);

  const handleChangeUsers = (e) => {
    const { value } = e.target;
    setUsersOptions(parseInt(value, 10));
  };

  const employees = useMemo(() => employeesAll.map((empl) => {
    const {
      // eslint-disable-next-line camelcase
      name, surname, status, created_at, updated_at, ...rest
    } = empl;
    return {
      ...rest,
      // eslint-disable-next-line camelcase
      created_at: created_at ? moment(created_at).format('lll') : '',
      // eslint-disable-next-line camelcase
      updated_at: updated_at ? moment(updated_at).format('lll') : '',
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
                    changeUserStatus={() => ({})}
                    checkedItems={checkedItems ?? []}
                    clearCheckbox={() => ({})}
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
                    editRow={() => {
                      dispatch(loadEmployeesEdit(id, 111));
                      setEditVisible(true);
                    }}
                    removeRow={() => ({})}
                    // onSort={sortHandler}
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
        </PageLayout>
      </Dashboard>
    </MaynLayout>
  );
}
