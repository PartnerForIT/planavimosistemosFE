/* eslint-disable camelcase,no-confusing-arrow */
import React, {
  useCallback, useEffect, useMemo, useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';

import Content from './Content';
import SearchIcon from '../../../Icons/SearchIcon';
import CheckboxGroupWrapper from '../../../Core/CheckboxGroup/CheckboxGroupWrapper';
import Input from '../../../Core/Input/Input';
import classes from '../timeoff.module.scss';
import useGroupingEmployees from '../../../../hooks/useGroupingEmployees';

const Users = React.memo(({
  employees = [],
  //groups = [],
  activePolicy,
  handleEditPolicy,
}) => {
  const { t } = useTranslation();
  const employToCheck = useCallback(({
    id = 0,
    name,
    surname,
  }) => ({
    id,
    label: `${name} ${surname}`,
    checked: activePolicy?.employees.some(({ employee_id }) => employee_id === id),
  }), [activePolicy.employees]);

  const [search, setSearch] = useState('');
  const stringMatch = useCallback((str1 = '') => str1.toLowerCase().includes(search.toLowerCase()), [search]);
  const [sorted, setSorted] = useState(false);
  const [empList, setEmpList] = useState(employees);

  const checkboxGroupWrapperClasses = classNames(
    classes.checkboxGroupWrapper,
    'styledDropdown',
  );

  useEffect(() => {
    if (search.trim()) {
      setSorted(true);
    } else {
      setSorted(false);
    }
  }, [search, setSorted]);

  useEffect(() => {
    if (search.trim() && employees) {
      const filtered = employees.filter((e) => stringMatch(`${e.name} ${e.surname}`)
        || stringMatch(e.groups[0]?.name)
        || stringMatch(e.subgroups[0]?.name)
        || stringMatch(e.subgroups[0]?.parent_group?.name));
      setEmpList([...filtered]);
    } else {
      setEmpList([...employees]);
    }
  }, [employees, search, stringMatch]);

  const checkedByDefault = useMemo(() => activePolicy?.employees
    .map((worker) => {
      const { employee } = worker;
      if (employee) {
        return employToCheck(employee);
      } return null;
    }).filter((item) => !!item) ?? [],
  [activePolicy.employees, employToCheck]);

  const [checkedItems, setCheckedItems] = useState(checkedByDefault);
  const [ready, setReady] = useState(false);

  const allSortedEmployees = useGroupingEmployees(empList, employToCheck);
  const allEmployees = useGroupingEmployees([...employees], employToCheck);

  useEffect(() => {
    if (ready) {
      const users = checkedItems.map(({ id }) => id)
        .filter((item) => typeof item !== 'string');
      setReady(false);
      //console.log(users, checkedItems, allEmployees);

      const sortedEmployeeIds = new Set(allSortedEmployees.map(employee => employee.id));

      // Filter allEmployees to get those that are checked and not in allSortedEmployees
      const filteredEmployees = allEmployees.filter(employee => 
        employee.checked && !sortedEmployeeIds.has(employee.id)
      ).map(({ id }) => id);

      handleEditPolicy([...filteredEmployees, ...users]);
    }
  }, [checkedItems, ready, handleEditPolicy, allEmployees, allSortedEmployees]);

  const handleInputChange = (term) => {
    setSearch(term);
  };

  return (
    <Content tooltip='Tooltip' title={t('Users within this policy')}>
      <>
        <div className={classes.sidebarTitle}>{t('Employees')}</div>
        <Input
          icon={<SearchIcon />}
          placeholder={t('Search by employees')}
          onChange={(e) => handleInputChange(e.target.value)}
          fullWidth
          value={search}
        />
        <div className={checkboxGroupWrapperClasses}>
          <CheckboxGroupWrapper
            height={342}
            maxHeight={342}
            wrapperMarginBottom={0}
            items={allSortedEmployees ?? []}
            onChange={(checked) => {
              setCheckedItems(checked);
              setReady(true);
            }}
            sorted={sorted}
            defaultChecked={checkedByDefault}
          />
        </div>
      </>
    </Content>
  );
});

export default Users;
