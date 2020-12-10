import React, { useState, useEffect, useMemo } from 'react';
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
  AccountGroupsSelector, placesSelector,
} from '../../../../store/settings/selectors';
import Filter from './Filter';
import DataTable from '../../../Core/DataTableCustom/OLT';
import {
  getAccountGroups, loadEmployeesAll, loadEmployeesEdit, loadPlace, loadSkills,
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
  { label: 'Actions', field: 'actions', checked: true },
  { label: 'Skill', field: 'skills', checked: false },
  { label: 'Group', field: 'groups', checked: false },
  { label: 'Sub-group', field: 'subgroup', checked: false },
  { label: 'Assigned Place', field: 'assigned_place', checked: false },
  { label: 'ID', field: 'id', checked: true },
  { label: 'Phone', field: 'phone', checked: true },
  { label: 'Personal number', field: 'personal_number', checked: true },
];

const columnsWidthArray = {
  status: 100,
  name: 200,
  deleted_at: 200,
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
  const [editVisible, setEditVisible] = useState(true);

  useEffect(() => {
    dispatch(loadEmployeesAll(id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // TODO: on account edit
    dispatch(loadEmployeesEdit(id, 111));
    dispatch(loadSkills(id));
    dispatch(getAccountGroups(id));
    dispatch(loadPlace(id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChangeUsers = (e) => {
    const { value } = e.target;
    setUsersOptions(parseInt(value, 10));
  };

  const employees = useMemo(() => employeesAll.map((empl) => {
    const { name, surname, ...rest } = empl;
    return {
      ...rest,
      name: `${name} ${surname}`,
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
          info={stats}
          infoReverse
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
            title={`${t('Edit')} ${employee.name} ${employee.surname} ${t('Account')}`}
            handleClose={() => setEditVisible(false)}
            handleOpen={(visible) => setEditVisible(visible)}
            companyId={id}
            loading={empLoading}
            skills={skills}
            groups={groups}
            places={places}
          />
        </PageLayout>
      </Dashboard>
    </MaynLayout>
  );
}
