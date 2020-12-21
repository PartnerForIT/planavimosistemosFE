/* eslint-disable camelcase */
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
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

      // eslint-disable-next-line no-nested-ternary
      _temp[groupId] = _temp[groupId]
        // eslint-disable-next-line no-nested-ternary
        ? _temp[groupId][subGroupId]
          ? {
            ..._temp[groupId],
            [subGroupId]: [..._temp[groupId][subGroupId], item],
          }
          : subGroupId ? { [subGroupId]: [item] } : [item] // FIXME ??
        : subGroupId ? { [subGroupId]: [item] } : [item];
    });
    return _temp;
  };

  const emplWithSubs = mapEmployeesGroups(employeesWithSubgroups);
  const emplWithgroups = mapEmployeesGroups(employeesWithGroups);

  const groupObj = { ...emplWithSubs, ...emplWithgroups };

  const mapObj = (obj = {}) => Object.keys(obj)
    .map((key) => {
      const temp = obj[key];
      let subgroup = 0;
      if (typeof temp === 'object' && !Array.isArray(temp)) {
        subgroup += 1;
        return {
          id: key.toString(),
          type: 'group',
          label: findGroupName(parseInt(key, 10), subgroup),
          items: [
            ...mapObj(temp),
          ],
        };
      }

      if (Array.isArray(temp)) {
        subgroup += 1;
        return {
          id: key.toString(),
          label: findGroupName(parseInt(key, 10), subgroup),
          items: [
            ...temp.map((item) => employToCheck(item)),
          ],
        };
      }
      return employToCheck(temp);
    });
  console.log(mapObj(groupObj));

  const h = [...employeesWithoutGroups];

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
            items={[{
              id: '2',
              label: 'ober 1',
              type: 'group',
              items: [{
                id: 1,
                label: 'label',
              }, {
                id: 2,
                label: 'hippy',
              },
              {
                type: 'group',
                label: 'nacatomy plaza',
                items: [{
                  id: 3,
                  label: 'hippy',
                }],
              }],
            }]}
          />
        </div>
      </>
    </Content>
  );
}

export default Users;
