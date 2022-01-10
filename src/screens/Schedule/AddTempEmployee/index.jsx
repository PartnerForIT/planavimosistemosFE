import React, {useCallback, useMemo, useRef, useState} from 'react';
import { useTranslation } from 'react-i18next';
import {useDispatch, useSelector} from 'react-redux';

import Button from '../../../components/Core/Button/Button';

import classes from './addTempEmployee.module.scss';
import SearchIcon from "../../../components/Icons/SearchIcon";
import Input from "../../../components/Core/Input/Input";
import CheckboxGroupWrapper from "../../../components/Core/CheckboxGroup/CheckboxGroupWrapper";
import useGroupingEmployees from "../../../hooks/useGroupingEmployees";
import {employeesSelector} from "../../../store/settings/selectors";
import {addTempemployee, addTempEmployee} from "../../../store/schedule/actions";
import ChangeWorkingTime from "../EventContent/ChangeWorkingTime";
import moment from "moment";

export default ({
  photo,
  jobTypeName,
  employeeName,
                    companyId,
                    tempShiftID,
                    tempJobTypeID
}) => {
  const { t } = useTranslation();
  const [searchValue, setSearchValue] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const { users: employees } = useSelector(employeesSelector);
    // let fromDateRef = new Date();
    // fromDateRef.format('YYYY-MM-DD')

    const dispatch = useDispatch();
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
     dispatch(addTempemployee({
              companyId: companyId,
              data: {
                  employee_id: selectedEmployee.id,
                  job_type_id: 7,
                  start: `2022-01-10 14:30:00`,
                  end: '2022-01-10 19:00:00'
              },
              shiftId: tempShiftID
          }
      )
     )
  };
  const filteredEmployees = useMemo(() => {
    const stringMatch = (str = '') => str.toLowerCase().includes(searchValue.toLowerCase());

    if (searchValue.trim()) {
      return employees.filter((e) => stringMatch(`${e.name} ${e.surname}`)
          || stringMatch(e.groups[0]?.name)
          || stringMatch(e.subgroups[0]?.name)
          || stringMatch(e.subgroups[0]?.parent_group?.name));
    }

    return employees;
  }, [searchValue, employees]);
  const allSortedEmployees = useGroupingEmployees(filteredEmployees, employToCheck);
  return (
    <div className={classes.changeEmployee}>
      <div className={classes.changeEmployee__title}>
        {t('Add Employee')}
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
        placeholder='Search by employees'
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
        {t('Change Employee')}
      </Button>
    </div>
  );
};
