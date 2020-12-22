/* eslint-disable camelcase,no-confusing-arrow */
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import _ from 'lodash';
import Content from './Content';
import SearchIcon from '../../../../Icons/SearchIcon';
import CheckboxGroupWrapper from '../../../../Core/CheckboxGroup/CheckboxGroupWrapper';
import Input from '../../../../Core/Input/Input';
import classes from '../Roles.module.scss';

function Users({
  employees = [],
  groups = [],
}) {
  const { t } = useTranslation();
  const [filteredEmployees, setFilteredEmployees] = useState([]);

  const handleInputChange = (term, items, setter) => {
    const filterData = () => {
      const arrayCopy = [...items];
      return arrayCopy.filter((item) => item.label.toLowerCase()
        .includes(term.toLowerCase()));
    };
    setter(filterData);
  };

  const employToCheck = ({
    id,
    name,
    surname,
  }) => ({
    id,
    label: `${name} ${surname}`,
  });
  const findGroupName = useCallback((groupId, sub = 0) => {
    if (sub <= 1) {
      return groups?.find(({ id }) => id === groupId)?.name;
    }
    return groups
      ?.map((item) => item?.subgroups
        .find((it) => it.id === groupId))
      .filter((i) => !!i)[0]?.name;
  }, [groups]);

  const employeesWithoutGroups = employees.filter((empl) => !empl.groups.length)
    .map((i) => employToCheck(i));
  const employeesWithSubgroups = employees.filter((empl) => !!empl.subgroups.length);
  const employeesWithGroups = employees.filter((empl) => empl.groups.length && !empl.subgroups.length);

  const mapEmployeesGroups = (employeeArray) => {
    // eslint-disable-next-line no-underscore-dangle
    const _temp = {};

    employeeArray.forEach((item) => {
      const {
        // eslint-disable-next-line no-shadow
        groups,
        subgroups,
      } = item;

      const groupId = groups[0]?.id ?? '';
      const subGroupId = subgroups[0]?.id ?? '';
      const groupname = groups[0]?.name ?? '';
      const subGroupName = subgroups[0]?.name ?? '';
      const type = 'group';
      // eslint-disable-next-line no-nested-ternary
      _temp[groupId] = _temp[groupId]
        // eslint-disable-next-line no-nested-ternary
        ? _temp[groupId][subGroupId]
          ? {
            ..._temp[groupId],
            label: groupname,
            type,
            [subGroupId]: {
              label: subGroupName,
              type,
              items: [..._temp[groupId][subGroupId].items, employToCheck(item)],
            },
          }
          : subGroupId ? {
            [subGroupId]: {
              label: subGroupName,
              type,
              items: [employToCheck(item)],
            },
          } : {
            items: [employToCheck(item)],
            label: groupname,
            type,
          }
        : subGroupId ? {
          label: groupname,
          type,
          [subGroupId]: {
            label: subGroupName,
            type,
            items: [employToCheck(item)],
          },
        } : {
          items: [employToCheck(item)],
          label: groupname,
          type,
        };
    });
    return _temp;
  };

  const emplWithSubs = mapEmployeesGroups(employeesWithSubgroups);
  const emplWithgroups = mapEmployeesGroups(employeesWithGroups);

  function customizer(objValue, srcValue) {
    if (_.isArray(objValue)) {
      return objValue.concat(srcValue);
    }
  }

  const merged = _.mergeWith(emplWithgroups, emplWithSubs, customizer);
  const mappedMerged = Object.keys(merged).map((key) => {
    const item = merged[key];

    const mapObjToNamedGroup = (obj) => Object.keys(obj).map((k) => ({
      id: k.toString(),
      ...obj[k],
    }))[0];

    if (item.type && Array.isArray(item.items)) {
      const {
        type, label, items, ...rest
      } = item;

      return {
        id: key.toString(), type, label, items: [...items, mapObjToNamedGroup(rest)],
      };
    }
    if (item.type && !Array.isArray(item.items)) {
      const {
        type, label, ...rest
      } = item;

      return {
        id: key.toString(), type, label, items: [mapObjToNamedGroup(rest)],
      };
    }

    return employToCheck(item);
  });

  const allSortedEmployees = mappedMerged.concat(employeesWithoutGroups);
  console.log(allSortedEmployees);
  return (
    <Content tooltip='Tooltip' title='Users within this role'>
      <>
        <div className={classes.sidebarTitle}>Employees</div>
        <Input
          icon={<SearchIcon />}
          placeholder='Search by employees'
          onChange={(e) => handleInputChange(e.target.value, employees, setFilteredEmployees)}
          fullWidth
        />
        <div className={classes.checkboxGroupWrapper}>
          <CheckboxGroupWrapper
            height={300}
            items={allSortedEmployees ?? []}
          />
        </div>
      </>
    </Content>
  );
}

export default Users;
