import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
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
import {
  kiosksUsersLoadingSelector,
  kiosksUsersSelector,
  pinCodeGenerateLoadingSelector,
  pinCodeSelector,
} from '../../../../store/kiosks/selectors';
import {
  getKiosksUsers,
  patchUpdateStatus,
  patchUpdatePinCode,
  patchUpdatePinCodes,
  getPinCodeGenerate,
} from '../../../../store/kiosks/actions';
import styles from './KioskUsers.module.scss';

const columnsWidthArray = {
  is_kiosk: 150,
  pin_code: 100,
  name: 140,
  place: 150,
  skills: 200,
  role: 150,
  email: 200,
  groups: 150,
  subgroup: 150,
};

export default () => {
  const { t } = useTranslation();
  const { id: companyId } = useParams();
  const dispatch = useDispatch();
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
  const kiosksUsers = useSelector(kiosksUsersSelector);
  const kiosksUsersLoading = useSelector(kiosksUsersLoadingSelector);
  const pinCode = useSelector(pinCodeSelector);
  const pinCodeGenerateLoading = useSelector(pinCodeGenerateLoadingSelector);

  const [selectedItemId, setSelectedItemId] = useState('');
  const [viewPinVisible, setViewPinVisible] = useState(false);
  const [generatePinVisible, setGeneratePinVisible] = useState(false);
  const [all, setAll] = useState(false);
  const [checkedItems, setCheckedItems] = useState([]);
  const [columnsFiltered, setColumnsFiltered] = useState([]);
  const [dropdownValue, setDropdownValue] = useState(null);

  const columns = useMemo(() => {
    const nextColumns = [
      {
        label: 'Kiosk user',
        field: 'is_kiosk',
        checked: true,
        cellRenderer: ({ is_kiosk: isKiosk }) => (
          <span className={`${styles.isKiosk} ${isKiosk ? styles.isKiosk_true : styles.isKiosk_false}`}>
            {isKiosk ? 'Yes' : 'No'}
          </span>
        ),
      },
      {
        label: 'PIN',
        field: 'pin_code',
        checked: true,
        cellRenderer: ({ id, is_kiosk: isKiosk }) => (
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
      { label: 'Employee', field: 'name', checked: true },
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
      return kiosksUsers.employees.find((item) => item.id === selectedItemId) || {};
    }

    return {};
  }, [kiosksUsers, selectedItemId]);
  const employees = useMemo(() => {
    
    if (kiosksUsers?.employees) {
      let employeesArray = Array.isArray(kiosksUsers.employees) ? kiosksUsers.employees : [kiosksUsers.employees];
      if (Array.isArray(kiosksUsers.employees)) {
          employeesArray = kiosksUsers.employees;
      } else if (typeof kiosksUsers.employees === 'object') {
          employeesArray = Object.values(kiosksUsers.employees);
      }
      return employeesArray.map((item) => {
        const {
          name,
          surname,
          status,
          place,
          groups,
          skills,
          subgroups,
          permissions,
          ...employee
        } = item;

        return {
          ...employee,
          groups: groups?.[0]?.name ?? subgroups?.[0]?.parent_group?.name ?? '',
          subgroup: subgroups?.[0]?.name ?? '',
          skills: skills?.[0]?.name ?? '',
          place: place?.[0]?.name ?? '',
          role: permissions?.[0]?.account_roles?.name ?? '',
          name: `${name} ${surname}`,
        };
      }) ?? [];
    }

    return [];
  }, [kiosksUsers]);

  const handleSort = useCallback((field, asc) => {
    const sortNumFunction = (a, b) => (asc ? (a[field] - b[field]) : (b[field] - a[field]));
    const sortFunction = (a, b) => {
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
  }, [employees]);
  const handleChangeDropdown = (e) => {
    setDropdownValue(e.target.value);
    setCheckedItems([]);
  };
  const selectionHandler = (itemId, value) => {
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
      setCheckedItems([
        ...checkedItems.slice(0, index),
        ...checkedItems.slice(index + 1),
      ]);
    }
  };
  const selectAllHandler = (formData = []) => {
    const value = formData.length;
    setCheckedItems(formData.map(({ id }) => id));
    employees.forEach((item) => {
      // eslint-disable-next-line no-param-reassign
      item.checked = !!value;
    });
  };
  const handleChangeUserKiosk = (status) => {
    dispatch(patchUpdateStatus(companyId, {
      employee_ids: `[${checkedItems.map((item) => `${item}`)}]`,
      status,
    }));
    setCheckedItems([]);
  };
  const handleNewPinCodes = (id) => {
    setSelectedItemId(id);
    setGeneratePinVisible(true);
  };
  const handleSetNewPinCode = (values) => {
    dispatch(patchUpdatePinCode(companyId, selectedItemId, {
      pin_code: values.pinCode,
    }));
    setViewPinVisible(false);
    setSelectedItemId('');
  };
  const handleGenerateNewPin = () => {
    dispatch(getPinCodeGenerate(companyId));
  };
  const handleGenerateNewPins = () => {
    dispatch(patchUpdatePinCodes(companyId, {
      employee_ids: `[${checkedItems.map((item) => `${item}`)}]`,
    }));
    setCheckedItems([]);
    setSelectedItemId('');
    setGeneratePinVisible(false);
  };

  useEffect(() => {
    dispatch(getKiosksUsers(companyId, dropdownValue));
  }, [dispatch, companyId, dropdownValue]);

  return (
    <MainLayout>
      <Dashboard withoutScroll>
        <TitleBlock
          title={t('Kiosk users')}
          info={{
            [t('Users')]: kiosksUsers?.stats?.total,
            [t('Yes')]: kiosksUsers?.stats?.yes,
            [t('No')]: kiosksUsers?.stats?.no,
          }}
          tooltip={t('Kiosk users')}
        >
          <Kiosk2Icon />
        </TitleBlock>
        <PageLayout>
          <Filter
            handleChangeUser={handleChangeDropdown}
            dropdownValue={dropdownValue}
            changeUserKiosk={handleChangeUserKiosk}
            checkedItems={checkedItems ?? []}
            clearCheckbox={() => ({})}
            stats={{
              total: kiosksUsers?.stats?.total,
              yes: kiosksUsers?.stats?.yes,
              no: kiosksUsers?.stats?.no,
            }}
            onNewPinCodes={handleNewPinCodes}
          />
          <DataTable
            data={employees}
            columns={columns || []}
            columnsWidth={columnsWidthArray}
            onColumnsChange={setColumnsFiltered}
            onSelect={selectionHandler}
            selectAllItems={selectAllHandler}
            sortable
            selectable
            onSort={handleSort}
            handlePagination={Function.prototype}
            // selectedItem=''
            verticalOffset='329px'
            // withoutFilterColumns
            accountList
            all={all}
            setAll={setAll}
            selectAll
            loading={kiosksUsersLoading}
          />
          <EditPinCode
            open={viewPinVisible}
            handleClose={() => setViewPinVisible(false)}
            currentPinCode={selectedItem.pin_code}
            title={`${selectedItem.name} PIN`}
            loading={pinCodeGenerateLoading}
            generatedPinCode={pinCode}
            generatePinCode={handleGenerateNewPin}
            onSubmit={handleSetNewPinCode}
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
