/* eslint-disable camelcase,no-confusing-arrow */
import React, {
  useCallback, useEffect, useMemo, useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import Content from './Content';
import SearchIcon from '../../../Icons/SearchIcon';
import CheckboxGroupWrapper from '../../../Core/CheckboxGroup/CheckboxGroupWrapper';
import Input from '../../../Core/Input/Input';
import useGroupingEmployees from '../../../../hooks/useGroupingEmployees';
import classes from '../Events.module.scss';

const Users = React.memo(({
  employees = [],
  activeEvent,
  roleEmployeesEdit,
}) => {
  const { t } = useTranslation();
  const employToCheck = useCallback(({
    id,
    name,
    surname,
  }) => ({
    id,
    label: `${name} ${surname}`,
    checked: activeEvent?.assign_employees.some(({ id: employee_id }) => employee_id === id),
  }), [activeEvent.assign_employees]);

  const [search, setSearch] = useState('');
  const stringMatch = useCallback((str1 = '') => str1.toLowerCase().includes(search.toLowerCase()), [search]);
  const [sorted, setSorted] = useState(false);
  const [empList, setEmpList] = useState(employees);

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
        || stringMatch(e.groups[0]?.name)
        || stringMatch(e.subgroups[0]?.name)
        || stringMatch(e.subgroups[0]?.parent_group?.name));
      setEmpList([...filtered]);
    } else {
      setEmpList([...employees]);
    }
  }, [employees, search, stringMatch]);

  const checkedByDefault = useMemo(() => activeEvent?.assign_employees
    .map((worker) => {
      const { employee } = worker;
      if (employee) {
        return employToCheck(employee);
      } return null;
    }).filter((item) => !!item) ?? [],
  [activeEvent.assign_employees, employToCheck]);

  const [checkedItems, setCheckedItems] = useState(checkedByDefault);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (ready) {
      const users = checkedItems.map(({ id }) => id)
        .filter((item) => typeof item !== 'string');
      setReady(false);
      roleEmployeesEdit(users);
    }
  }, [checkedItems, ready, roleEmployeesEdit]);

  const allSortedEmployees = useGroupingEmployees(empList, employToCheck);

  const handleInputChange = (term) => {
    setSearch(term);
  };

  return (
    <Content tooltip='Tooltip' title={t('Users within this event')}>
      <Input
        icon={<SearchIcon />}
        placeholder={t('Search by employees')}
        onChange={(e) => handleInputChange(e.target.value)}
        fullWidth
        value={search}
      />
      <div className={classes.checkboxGroupWrapper}>
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
    </Content>
  );
});

export default Users;
