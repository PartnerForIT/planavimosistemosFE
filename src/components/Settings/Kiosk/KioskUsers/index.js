import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import Snackbar from '@material-ui/core/Snackbar';
import { makeStyles } from '@material-ui/core/styles';

import MainLayout from '../../../Core/MainLayout';
import PageLayout from '../../../Core/PageLayout';
import TitleBlock from '../../../Core/TitleBlock';
import Dashboard from '../../../Core/Dashboard';
import GenerateNewPin from '../../../Core/Dialog/GenerateNewPin';
import EditPinCode from '../../../Core/Dialog/EditPinCode';
import DataTable from '../../../Core/DataTableCustom/OLT';
import Kiosk2Icon from '../../../Icons/Kiosk2';
import Filter from './Filter';
import { isShowSnackbar, snackbarText, snackbarType } from '../../../../store/settings/selectors';
import styles from './KioskUsers.module.scss';

const data2 = [
  {
    id: 1,
    employee: 'name',
    role: 'place',
    skills: 'admin',
    groups: 'groups',
    subgroup: 'subgroup',
    place: 'place',
    pin: '2341',
    isKiosk: true,
  },
  {
    id: 2,
    employee: 'name 3',
    role: 'place 3',
    skills: 'admin 3',
    groups: 'password 3',
    subgroup: 'subgroup',
    place: 'place',
    pinCode: '2341',
    isKiosk: false,
  },
];
const columnsWidthArray = {
  isKiosk: 150,
  pin: 100,
  employee: 140,
  place: 150,
  skills: 200,
  role: 150,
  email: 200,
  groups: 150,
  subgroup: 150,
};
const data = [...data2,...data2,...data2,...data2,...data2,...data2,...data2,...data2,...data2]
export default () => {
  const { t } = useTranslation();
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
  const classes = useStyles();

  const isSnackbar = useSelector(isShowSnackbar);
  const typeSnackbar = useSelector(snackbarType);
  const textSnackbar = useSelector(snackbarText);

  const [selectedItemId, setSelectedItemId] = useState('');
  const [viewPinVisible, setViewPinVisible] = useState(false);
  const [generatePinVisible, setGeneratePinVisible] = useState(false);
  const [all, setAll] = useState(false);
  const [checkedItems, setCheckedItems] = useState([]);
  const [columnsFiltered, setColumnsFiltered] = useState([]);
  const [usersOptions, setUsersOptions] = useState(3);
  const [employeesAll, setEmployeesAll] = useState([]);

  const columns = useMemo(() => {
    const nextColumns = [
      {
        label: 'Kiosk user',
        field: 'isKiosk',
        checked: true,
        cellRenderer: ({ isKiosk }) => (
          <span className={`${styles.isKiosk} ${isKiosk ? styles.isKiosk_true : styles.isKiosk_false}`}>
            {isKiosk ? 'Yes' : 'No'}
          </span>
        ),
      },
      {
        label: 'PIN',
        field: 'pin',
        checked: true,
        cellRenderer: ({ id, isKiosk }) => (
          <button
            disabled={!isKiosk}
            className={styles.viewPin}
            onClick={() => {
              setSelectedItemId(id);
              setViewPinVisible(true);
            }}
          >
            View
          </button>
        ),
      },
      { label: 'Employee', field: 'employee', checked: true },
      { label: 'Role', field: 'role', checked: true },
      { label: 'Skill', field: 'skills', checked: true },
      { label: 'Group', field: 'groups', checked: true },
      { label: 'Sub-group', field: 'subgroup', checked: true },
      { label: 'Assigned Place', field: 'place', checked: true },
    ];
    if (columnsFiltered.length) {
      return nextColumns.map((item) => ({
        ...item,
        checked: columnsFiltered.find((itemJ) => itemJ.field === item.field)?.checked,
      }));
    }
    return nextColumns;
  }, [columnsFiltered]);
  const selectedItem = useMemo(() => {
    if (selectedItemId) {
      return data.find((item) => item.id === selectedItemId) || {};
    }

    return {};
  }, [selectedItemId]);

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
        return a[field].toString().localeCompare(b[field]);
      }
      return b[field].toString().localeCompare(a[field]);
    };
    return employees.sort(sortFunction);
  }, []);
  const handleChangeUsers = (e) => {
    const { value } = e.target;
    setUsersOptions(parseInt(value, 10));
    setCheckedItems([]);
    // dispatch(loadEmployeesAll(id, parseInt(value, 10) !== 3 ? { status: value } : null));
  };
  const selectionHandler = (itemId, value) => {
    // eslint-disable-next-line array-callback-return
    employeesAll.forEach((item) => {
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
  const selectAllHandler = (data = []) => {
    const value = data.length;
    // eslint-disable-next-line no-shadow
    const checkedItems = data.map(({ id }) => id);
    setCheckedItems(checkedItems);
    setEmployeesAll(employeesAll.map(({ checked, ...rest }) => ({ ...rest, checked: !!value })));
  };
  const handleChangeUserKiosk = () => {

  };
  const onNewPin = (id) => {
    setSelectedItemId(id);
    setGeneratePinVisible(true);
  };
  const handleGenerateNewPins = () => {

  };

  useEffect(() => {
    if (data) {
      setEmployeesAll(data);
    }
  }, [data]);

  return (
    <MainLayout>
      <Dashboard withoutScroll>
        <TitleBlock
          title={t('Kiosk users')}
          info={{
            Users: 6,
            Yes: 1,
            No: 5,
          }}
          tooltip={t('Kiosk users')}
        >
          <Kiosk2Icon />
        </TitleBlock>
        <PageLayout>
          <Filter
            handleChangeUser={handleChangeUsers}
            users={usersOptions}
            changeUserKiosk={handleChangeUserKiosk}
            checkedItems={checkedItems ?? []}
            clearCheckbox={() => ({})}
            stats={{}}
            onNewPin={onNewPin}
          />
          <DataTable
            data={employeesAll}
            columns={columns || []}
            columnsWidth={columnsWidthArray}
            onColumnsChange={setColumnsFiltered}
            onSelect={selectionHandler}
            selectAllItems={selectAllHandler}
            sortable
            selectable
            onSort={(field, asc) => sorting(data, { field, asc })}
            handlePagination={console.log}
            // selectedItem=''
            verticalOffset='329px'
            // withoutFilterColumns
            accountList
            all={all}
            setAll={setAll}
            selectAll
            // loading={loading}
          />
          <EditPinCode
            open={viewPinVisible}
            handleClose={() => setViewPinVisible(false)}
            currentPinCode={selectedItem.pinCode}
            title={`${selectedItem.employee} PIN`}
          />
          <GenerateNewPin
            handleClose={() => setGeneratePinVisible(false)}
            open={generatePinVisible}
            onClick={() => {}}
            count={checkedItems.length}
            onGenerateNewPins={handleGenerateNewPins}
          />
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
    </MainLayout>
  );
};
