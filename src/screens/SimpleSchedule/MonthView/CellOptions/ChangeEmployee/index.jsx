import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import Button from '../../../../../components/Core/Button/Button';

import classes from './ChangeEmployee.module.scss';
import SearchIcon from "../../../../../components/Icons/SearchIcon";
import Input from "../../../../../components/Core/Input/Input";
import CheckboxGroupWrapper from "../../../../../components/Core/CheckboxGroup/CheckboxGroupWrapper";
import useGroupingEmployees from "../../../../../hooks/useGroupingEmployees";
import {employeesSelector} from "../../../../../store/settings/selectors";

export default ({
  photo,
  jobTypeName,
  employeeName,
  onChangeEmployee,
  unavailableEmployees
}) => {
  const { t } = useTranslation();
  const [searchValue, setSearchValue] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const { users: employees } = useSelector(employeesSelector);

  const employToCheck = useCallback(({
    id,
    name,
    surname,
  }) => ({
    id,
    label: `${name} ${surname}`,

    checked: false,
  }), []);

  const handleInputChange = (e) => {
    setSearchValue(e.target.value);
  };
  const handleEmployeesChange = (checked) => {
    if (checked.length) {
      setSelectedEmployee(checked[0]);
    } else {
      setSelectedEmployee(null);
    }
  };
  const handleOnApplyEmployee = () => {
    onChangeEmployee(selectedEmployee.id);
  };

  const filteredEmployees = useMemo(() => {
    const stringMatch = (str = '') => str.toLowerCase().includes(searchValue.toLowerCase());

    if (searchValue.trim()) {
      return employees.filter((e) => (stringMatch(`${e.name} ${e.surname}`)
          || stringMatch(e.groups[0]?.name)
          || stringMatch(e.subgroups[0]?.name)
          || stringMatch(e.subgroups[0]?.parent_group?.name))
          && !unavailableEmployees.includes(e.id));
    }

    return employees.filter(e => { return !unavailableEmployees.includes(e.id) });
  }, [searchValue, employees, unavailableEmployees]);
  const allSortedEmployees = useGroupingEmployees(filteredEmployees, employToCheck);

  return (
    <div className={classes.changeEmployee}>
      <div className={classes.changeEmployee__title}>
        {t('Duplicate to')}
      </div>
      <div className={classes.changeEmployee__userInfo}>
        {
          photo && (
            <img
              className={classes.changeEmployee__userInfo__avatar}
              alt='avatar'
              src={photo}
            />
          )
        }
        {`${employeeName} • ${jobTypeName}`}
      </div>
      <Input
        icon={<SearchIcon />}
        placeholder={t('Search by employees')}
        onChange={handleInputChange}
        value={searchValue}
        fullWidth
      />
      <CheckboxGroupWrapper
        height={250}
        maxHeight={250}
        wrapperMarginBottom={0}
        items={allSortedEmployees ?? []}
        choiceOfOnlyOne
        onChange={handleEmployeesChange}
        sorted={!!searchValue.trim()}
        // defaultChecked={checkedByDefault}
      />
      <Button onClick={handleOnApplyEmployee}>
        {t('Duplicate')}
      </Button>
    </div>
  );
};
