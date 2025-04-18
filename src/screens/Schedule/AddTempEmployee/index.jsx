import React, {useCallback, useMemo, useState} from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector} from 'react-redux';
import classNames from 'classnames';

import Button from '../../../components/Core/Button/Button';

import classes from './addTempEmployee.module.scss';
import SearchIcon from "../../../components/Icons/SearchIcon";
import Input from "../../../components/Core/Input/Input";
import CheckboxGroupWrapper from "../../../components/Core/CheckboxGroup/CheckboxGroupWrapper";
import useGroupingEmployees from "../../../hooks/useGroupingEmployees";
import {employeesSelector} from "../../../store/settings/selectors";
import Cross from "../../../components/Icons/Cross";

export default ({
                    setmodalAddTempEmployee,
                    addTempEmployeeDispatch,
                    unavailableEmployees
}) => {
  const { t } = useTranslation();
  const [searchValue, setSearchValue] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const { users: employees } = useSelector(employeesSelector);
  const styles = {
      cursor: 'pointer',
      position: 'absolute',
      right: '15px',
      top: '10px',
      color: '#d9dfe3'
  }
    // let fromDateRef = new Date();
    // fromDateRef.format('YYYY-MM-DD')

    const employToCheck = useCallback(({
    id,
    name,
    surname,
  }) => ({
    id,
    label: `${name} ${surname}`,
    checked: false,
  }), []);
    const style = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems:'center'
    };
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

    const closeModalAddTempEmployee = () => {
        setmodalAddTempEmployee(false)
    }
  const handleOnApplyEmployee = () => {
      addTempEmployeeDispatch(selectedEmployee.id)
      closeModalAddTempEmployee()
      // dispatch(getSchedule({
      //     companyId,
      //     timeline,
      //     fromDate: moment(new Date()).format('YYYY-MM-DD'),
      //     firstLoading: true,
      // }));
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
    // eslint-disable-next-line
  }, [searchValue, employees]);
  const allSortedEmployees = useGroupingEmployees(filteredEmployees, employToCheck);
  return (
    <div className={classNames(classes.changeEmployee, 'styledDropdown')}>
        <div style={style}>
            <div className={classes.changeEmployee__title2}>
                {t('Add Employee')}
            </div>
        <div onClick={closeModalAddTempEmployee} className={'close-modal-add-temp-employee'} style={styles}><Cross/></div>
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
        {t('Change Employee')}
      </Button>
    </div>
  );
};
