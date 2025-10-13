import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import TitleBlock from '../../Core/TitleBlock';
import PageLayout from '../../Core/PageLayout';
import TimeOffIcon from '../../Icons/TimeOff';
import TitleBackIcon from '../../Icons/TitleBackIcon';
import DataTable from '../../Core/DataTableCustom/OLT';
import usePermissions from '../../Core/usePermissions';
import useCompanyInfo from '../../../hooks/useCompanyInfo';
import Filter from './TimeOffDetails/Filter';
import RequestBehalf from '../../Core/Dialog/RequestBehalf';
import AdjustBalance from '../../Core/Dialog/AdjustBalance';
import AdjustTimeUsed from '../../Core/Dialog/AdjustTimeUsed';

import classes from './timeoff.module.scss';
import moment from 'moment';
import {Tooltip as ReactTooltip} from 'react-tooltip';

const permissionsConfig = [
  {
    name: 'create_groups',
    module: 'create_groups',
  },
];

const NameWithAvatar = (row) => (
  <div className={classes.cellNameWithAvatar}>
    {
      row.photo && (
        <img
          alt=''
          className={classes.cellNameWithAvatar__image}
          src={row.photo}
        />
      )
    }
    {row.name}
  </div>
);

const ApproverWithAvatar1 = (row) => (
  <div className={classes.cellNameWithAvatar}>
    {
      row.approver_1_photo && (
        <img
          alt=''
          className={classes.cellNameWithAvatar__image}
          src={row.approver_1_photo}
        />
      )
    }
    {row.approver_1}
  </div>
);

const ApproverWithAvatar2 = (row) => (
  <div className={classes.cellNameWithAvatar}>
    {
      row.approver_2_photo && (
        <img
          alt=''
          className={classes.cellNameWithAvatar__image}
          src={row.approver_2_photo}
        />
      )
    }
    {row.approver_2}
  </div>
);

const columns = [
  { label: 'Employee', field: 'name', checked: true, cellRenderer: NameWithAvatar },
  { label: 'Employment status', field: 'em_status', checked: true },
  { label: 'Email', field: 'email', checked: true },
  { label: 'Role', field: 'role', checked: true },
  { label: 'Skill', field: 'skills', checked: true },
  { label: 'Group', field: 'groups', checked: true },
  { label: 'Sub-Group', field: 'subgroup', checked: true },
  { label: 'Balance', field: 'balance', checked: true },
  { label: 'Amount accrued this cycle', field: 'accrued_amount_this_cycle', checked: true },
  { label: 'Taken this cycle', field: 'taken_this_cycle', checked: true },
  { label: 'Booked before cycle', field: 'booked_before_cycle', checked: true },
  { label: 'Cycle type', field: 'cycle_type_text', checked: true },
  { label: 'Current cycle start', field: 'current_cycle_start', checked: true },
  { label: 'Current cycle end', field: 'current_cycle_end', checked: true },
  { label: 'Annual allowance', field: 'annual_allowance_text', checked: true },
  { label: 'Employment effective date', field: 'employment_effective_date_text', checked: true },
  { label: 'First approver', field: 'approver_1', checked: true, cellRenderer: ApproverWithAvatar1 },
  { label: 'Second approver', field: 'approver_2', checked: true, cellRenderer: ApproverWithAvatar2 },
  
];

const columnsWidthArray = {
  name: 250,
  em_status: 150,
  email: 300,
  role: 150,
  skills: 150,
  groups: 150,
  subgroup: 150,
  balance: 150,
  accrued_amount_this_cycle: 150,
  taken_this_cycle: 150,
  booked_before_cycle: 150,
  cycle_type_text: 150,
  current_cycle_start: 150,
  current_cycle_end: 150,
  annual_allowance_text: 150,
  employment_effective_date_text: 150,
  approver_1: 150,
  approver_2: 150,
};

function UserDataManagement({
  handleClose,
  activeTimeOff,
  activePolicy,
  employeesList,
  policies,
  handleEditPolicyEmployees,
  onRequestBehalf,
  onAdjustBalance,
  onAdjustTimeUsed,
  handleOpenEmployee,
}) {
  const { t } = useTranslation();
  const permissions = usePermissions(permissionsConfig);
  const [checkedItems, setCheckedItems] = useState([]);
  const [columnsArray, setColumnsArray] = useState([]);
  const [colSearch, setColSearch] = useState({});
  const [search, setSearch] = useState('');
  const [employeesAll, setEmployeesAll] = useState([]);
  const [all, setAll] = useState(false);
  const [selected, setSelected] = useState({});
  const [requestBehalfOpen, setRequestBehalfOpen] = useState(false);
  const [adjustBalanceOpen, setAdjustBalanceOpen] = useState(false);
  const [adjustTimeUsedOpen, setAdjustTimeUsedOpen] = useState(false);

  const { getDateFormat } = useCompanyInfo()
  const dateFormat = getDateFormat({
    'YY.MM.DD': 'YYYY, MMM DD',
    'DD.MM.YY': 'DD MMM, YYYY',
    'MM.DD.YY': 'MMM DD, YYYY',
  });

  useEffect(() => {
    if (Array.isArray(employeesList)) {
      setEmployeesAll([...employeesList]);
    }
    setCheckedItems([]);
  }, [employeesList]);

  const employees = useMemo(() => {
    return employeesAll
      .filter(empl => {
        // Filter out any employees that don't match the search criteria
        let searchValue = search.toLowerCase();
        let globalSearch = true;
        if (searchValue) {
          globalSearch = false;
          for (let key in empl) {
            let emplValue = empl[key];
            if (emplValue !== undefined && emplValue !== null) {
              if (key === 'created_at' || key === 'updated_at') {
                // Special handling for date fields
                emplValue = moment(emplValue).format(`${dateFormat} HH:mm`).toLowerCase();
              } else if (key === 'active_timer') {
                emplValue = (emplValue?.id ? t('Yes') : t('No')).toString().toLowerCase();
              } else {
                // Convert emplValue to string for other fields
                emplValue = emplValue.toString().toLowerCase();
              }
              
              if (emplValue.indexOf(searchValue) !== -1) {
                globalSearch = true;
                break;
              }
            }
          }
        }

        if (globalSearch) {
          for (let key in colSearch) {
            if (colSearch[key]) { // Check if there's a search term for this key
              let emplValue = empl[key];
              let searchValue = colSearch[key].toLowerCase();
        
              if (emplValue !== undefined && emplValue !== null) { // Check if the employee has a value for this key
                if (key === 'created_at' || key === 'updated_at') {
                  // Special handling for date fields
                  emplValue = moment(emplValue).format(`${dateFormat} HH:mm`).toLowerCase();
                } else if (key === 'active_timer') {
                  emplValue = (emplValue?.id ? t('Yes') : t('No')).toString().toLowerCase();
                } else {
                  // Convert emplValue to string for other fields
                  emplValue = emplValue.toString().toLowerCase();
                }
        
                if (emplValue.indexOf(searchValue) === -1) {
                  return false; // This employee does not match the search term
                }
              } else {
                return false; // Missing value for a key that has a search term
              }
            }
          }
        }
        return globalSearch; // Include this employee
      })
      .map(empl => {
        const {
          name, surname,
          ...rest
        } = empl;
  
        return {
          ...rest,
          name: `${name} ${surname}`,
        };
      });
      // eslint-disable-next-line
  }, [employeesAll, colSearch, dateFormat, search]);

  console.log('settings selected', selected);

  useEffect(() => {
    if (employees.length && checkedItems.length === employees.length) {
      setAll(true);
    } else {
      setAll(false);
    }
  }, [checkedItems.length, employees.length]);

  useEffect(() => {
    let allColumnsArray = columns;
    allColumnsArray = allColumnsArray.filter((column) => {

      if (!permissions.create_groups && (column.field === 'groups' || column.field === 'subgroup')) {
        return false;
      }

      if (activePolicy.allowance_type === 'unlimited' && (column.field === 'accrued_amount_this_cycle')) {
        return false;
      }

      return true;
    });

    setColumnsArray(allColumnsArray);
  }, [permissions]);

  const onColumnSearch = (column, value) => {
    setColSearch({ ...colSearch, [column]: value });
  }

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

  const selectAllHandler = (data = []) => {
    const value = data.length;
    // eslint-disable-next-line no-shadow
    const checkedItems = data.map(({ id }) => id);
    setCheckedItems(checkedItems);
    setEmployeesAll(employeesAll.map(({ checked, ...rest }) => ({ ...rest, checked: !!value })));
  };

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

  const selectedEmployees = useMemo(() => {
    if (checkedItems.length) {
      return employees.filter((item) => checkedItems.includes(item.id));
    }
    return employees.filter((item) => selected.id === item.id);
  }, [checkedItems, employees, selected]);

  const handleUnassign = () => {
    const ids = selectedEmployees.map(({ id }) => id);
    const notSelectedIds = employees.filter((item) => !ids.includes(item.id)).map(({ id }) => id);
    setSelected({});

    handleEditPolicyEmployees(notSelectedIds);
    setCheckedItems([]);
  }
  

  return (
    <div style={{overflow: 'hidden', height: '100%'}}>
      <TitleBlock
        info={{
          [t('users assigned')]: employeesList.length,
        }}
        title={`${activeTimeOff.name} / ${activePolicy.name}`}
        TitleButtonImport={t('Bulk update')}
        handleButtonImport={() => { console.log('go'); }}
      >
        <TimeOffIcon viewBox='0 0 26 26' fill='rgba(226,235,244,0.85)' />
        <div
          className={classes.titleBackButton}
          onClick={handleClose}
          data-tooltip-html={t('Back')} data-tooltip-id='back_button'
        >
          <div>
            <TitleBackIcon />
          </div>
        </div>
      </TitleBlock>
      <PageLayout>
        <Filter
          changeUserStatus={() => ({})}
          checkedItems={checkedItems ?? []}
          handleUnassign={handleUnassign}
          handleRequestBehalf={() => setRequestBehalfOpen(true)}
          handleAdjustBalance={() => setAdjustBalanceOpen(true)}
          handleAdjustTimeUsed={() => setAdjustTimeUsedOpen(true)}
          selectedItem={selected}
          setSearch={setSearch}
          search={search}
        />
        <DataTable
          data={employees ?? []}
          columns={columnsArray ?? []}
          columnsWidth={columnsWidthArray ?? {}}
          onColumnsChange={setColumnsArray}
          selectable
          sortable
          loading={false}
          onSelect={selectionHandler}
          hoverActions
          hoverable
          onSort={(field, asc) => sorting(employees, { field, asc })}
          selectedItem={selected}
          setSelectedItem={setSelected}
          verticalOffset='270px'
          selectAllItems={selectAllHandler}
          all={all}
          setAll={setAll}
          accountList
          colSearch={colSearch}
          onSearch={onColumnSearch}
          openButton={handleOpenEmployee}
        />
      </PageLayout>
      <RequestBehalf
        open={requestBehalfOpen}
        handleClose={() => {
          setRequestBehalfOpen(false);
        }}
        title={t('Request on behalf')}
        onSubmit={(data) => {
          setRequestBehalfOpen(false);
          onRequestBehalf(data);
        }}
        buttonTitle={t('Submit')}
        employees={selectedEmployees}
        policies={policies}
        initialValue={{policy_id: activePolicy.id}}
        activeTimeOff={activeTimeOff}
      />
      <AdjustBalance
        open={adjustBalanceOpen}
        handleClose={() => {
          setAdjustBalanceOpen(false);
        }}
        title={t('Adjust balance')}
        onSubmit={(data) => {
          setAdjustBalanceOpen(false);
          onAdjustBalance(data);
        }}
        buttonTitle={t('Submit')}
        employees={selectedEmployees}
        policies={policies}
        initialValue={{policy_id: activePolicy.id}}
      />
      <AdjustTimeUsed
        open={adjustTimeUsedOpen}
        handleClose={() => {
          setAdjustTimeUsedOpen(false);
        }}
        title={t('Adjust time used')}
        onSubmit={(data) => {
          setAdjustTimeUsedOpen(false);
          onAdjustTimeUsed(data);
        }}
        buttonTitle={t('Submit')}
        employees={selectedEmployees}
        policies={policies}
        initialValue={{policy_id: activePolicy.id}}
      />
      <ReactTooltip
        id='back_button'
        effect='solid'
        className={classes.tooltip_back}
      />
    </div>
  );
}

export default UserDataManagement;
