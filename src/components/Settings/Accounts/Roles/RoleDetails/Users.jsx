/* eslint-disable camelcase,no-confusing-arrow */
import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import _ from 'lodash';
import Content from './Content';
import SearchIcon from '../../../../Icons/SearchIcon';
import CheckboxGroupWrapper from '../../../../Core/CheckboxGroup/CheckboxGroupWrapper';
import Input from '../../../../Core/Input/Input';
import classes from '../Roles.module.scss';
import Button from '../../../../Core/Button/Button';

const Users = React.memo(({
  employees = [],
  filterEmployees = () => ({}),
}) => {
  const { t } = useTranslation();

  const [search, setSearch] = useState('');
  const [checkedItems, setCheckedItems] = useState([]);

  const employToCheck = ({
    id,
    name,
    surname,
    checked,
  }) => ({
    id,
    label: `${name} ${surname}`,
    checked,
  });

  const employeesWithoutGroups = employees.filter((empl) => !empl.groups.length && !empl.subgroups.length)
    .map((i) => employToCheck(i));
  const employeesWithGroupsSubGroups = employees.filter((empl) => empl.groups.length || empl.subgroups.length);

  const mapEmployeesGroups = useCallback((employeeArray) => {
    // eslint-disable-next-line no-underscore-dangle
    const _temp = {};

    employeeArray.forEach((item) => {
      const {
        // eslint-disable-next-line no-shadow
        groups,
        subgroups,
      } = item;

      const groupId = groups[0]?.id ?? subgroups[0]?.parent_group_id ?? '';
      const subGroupId = subgroups[0]?.id ?? '';
      const groupname = groups[0]?.name ?? subgroups[0]?.parent_group?.name ?? '';
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
  }, []);

  const merged = mapEmployeesGroups(employeesWithGroupsSubGroups);

  const mappedMerged = useMemo(() => Object.keys(merged).map((key) => {
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
        id: `gr_${key.toString()}`, type, label, items: [...items, mapObjToNamedGroup(rest)],
      };
    }
    if (item.type && !Array.isArray(item.items)) {
      const {
        type, label, ...rest
      } = item;
      return {
        id: `sg_${key.toString()}`, type, label, items: [mapObjToNamedGroup(rest)],
      };
    }

    return employToCheck(item);
  }), [merged]);

  const allSortedEmployees = useMemo(() => mappedMerged.concat(employeesWithoutGroups),
    [employeesWithoutGroups, mappedMerged]);

  const handleInputChange = (term) => {
    setSearch(term);
  };

  return (
    <Content tooltip='Tooltip' title='Users within this role'>
      <>
        <div className={classes.sidebarTitle}>Employees</div>
        <Input
          icon={<SearchIcon />}
          placeholder='Search by employees'
          onChange={(e) => handleInputChange(e.target.value)}
          fullWidth
          value={search}
        />
        <div className={classes.checkboxGroupWrapper}>
          <CheckboxGroupWrapper
            height={300}
            items={allSortedEmployees ?? []}
            onChange={(checked) => setCheckedItems(checked)}
          />
        </div>
        <Button fillWidth onClick={() => filterEmployees(search)} disabled={!search.trim()}>{t('Filter')}</Button>
      </>
    </Content>
  );
});

export default Users;
