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
  isLoadingSelector, isShowSnackbar,
  snackbarType, snackbarText, employeesSelector,
} from '../../../../store/settings/selectors';
import Filter from './Filter';
import DataTable from '../../../Core/DataTableCustom/OLT';
import { loadEmployees } from '../../../../store/settings/actions';

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
  { label: 'Email', field: 'contact_person_email', checked: true },
  { label: 'Skill', field: 'skill', checked: false },
  { label: 'Group', field: 'group', checked: false },
  { label: 'Sub-group', field: 'subgroup', checked: false },
  { label: 'Assigned Place', field: 'assigned_place', checked: false },
  // { 'id': 111, }
  // "user_id": 11,
  // "name": "NIck",
  // "surname": "New",
  // "company_id": "23",
  // "personal_number": "24",
  // "phone": "0877845647",
  // "speciality_id": null,
  // "status": "1",
  // "first_login": 0,
  // "external_id": null,
  // "cost": 22,
  // "charge": null,
  // "last_login": null,
  // "photo": null,
  // "created_at": null,
  // "updated_at": null,
  // "deleted_at": null
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
  const employeesAll = useSelector(employeesSelector);

  const [usersOptions, setUsersOptions] = useState(3);

  const [selected, setSelected] = useState([]);

  const handleSelect = (row) => {
    setSelected((prevState) => {
      if (!prevState.find((rw) => rw.id === row.id)) {
        return [...prevState, row];
      }
      return prevState.filter((rw) => rw.id !== row.id);
    });
  };

  useEffect(() => {
    dispatch(loadEmployees(id));
  }, [dispatch, id]);

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

  return (
    <MaynLayout>
      <Dashboard>
        <TitleBlock
          title={t('Account list')}
          info={
            // TODO: change
            {
              accounts: 100,
              active: 60,
              suspended: 40,
            }
          }
          infoReverse
          TitleButtonNew={t('New account')}
          TitleButtonImport={t('Import Accounts')}
          tooltip={t('Accounts List')}
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
                    checkedItems={[]}
                    clearCheckbox={() => ({})}
                  />
                  <DataTable
                    data={employees ?? []}
                    columns={columns ?? []}
                    columnsWidth={{}}
                    // onColumnsChange={setColumnsArray}
                    selectable
                    sortable
                    loading={isLoading}
                    // onSelect={selectionHandler}
                    // onSort={sortHandler}
                    // onSerach={searchHandler}
                    // lastPage={page.last_page}
                    // activePage={page.current_page}
                    // itemsCountPerPage={page.per_page}
                    // totalItemsCount={page.total}
                    // handlePagination={console.log}
                    selectedItem={selected}
                    // totalDuration={totalDuration}
                    setSelectedItem={handleSelect}
                    multiselect
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
        </PageLayout>
      </Dashboard>
    </MaynLayout>
  );
}
