import { useCallback, useMemo } from 'react';

export default (empList, employToCheck) => {
  const employeesWithoutGroups = useMemo(() => empList
    .filter((empl) => !empl.groups.length && !empl.subgroups.length)
    .map((i) => employToCheck(i)), [empList, employToCheck]);
  const employeesWithGroupsSubGroups = useMemo(() => empList
    .filter((empl) => empl.groups.length || empl.subgroups.length), [empList]);


  const mapEmployeesGroups = useCallback((employeeArray) => {
    // eslint-disable-next-line no-underscore-dangle
    const _temp2 = {};
    employeeArray.forEach((item) => {
      const {
        // eslint-disable-next-line no-shadow
        groups,
        subgroups,
        group_id,
        subgroup_id,
      } = item;
      const groupId = group_id ? ('group_' + group_id) : 'group_all';
      const subGroupId = subgroup_id ? ('subgroup_' + subgroup_id) : 'subgroup_all';

      if( _temp2[groupId] === undefined) {
        _temp2[groupId] = {
          type:'group',
          label: groups
        }
      }

      if(_temp2[groupId][subGroupId] === undefined) {
        _temp2[groupId][subGroupId] = {
          type: 'group',
          label: subgroups,
          items: []
        }
      }

      _temp2[groupId][subGroupId].items.push(employToCheck(item));

      return item;
    });

    return _temp2 ;
  }, [employToCheck]);

  const merged = useMemo(() => mapEmployeesGroups(employeesWithGroupsSubGroups),
    [employeesWithGroupsSubGroups, mapEmployeesGroups]);

  const mappedMerged = useMemo(() => Object.keys(merged)
    .map((key) => {
      const item = merged[key];
      const mapObjToNamedGroup = (obj) => Object.keys(obj)
        .map((k) => ({
          id: k.toString(),
          ...obj[k],
        }));
      if (item.type && Array.isArray(item.items)) {
        const {
          type, label, items, ...rest
        } = item;
          const newItem = mapObjToNamedGroup(rest);
        return {
          id: `gr_${key.toString()}`, type, label, items: newItem ? [...items, ...mapObjToNamedGroup(rest)] : items,
        };
      }
      if (item.type && !Array.isArray(item.items)) {
        const { type, label, ...rest } = item;

        //fix when not existed subgroup
        if (item['subgroup_all']) {
          return {
            id: `sg_${key.toString()}`, type, label, items: [...mapObjToNamedGroup(item['subgroup_all'].items)],
          };
        }

        return {
          id: `sg_${key.toString()}`, type, label, items: [...mapObjToNamedGroup(rest)],
        };
      }

      return employToCheck(item);
    }), [employToCheck, merged]);

  const allSortedEmployees = useMemo(() => mappedMerged.concat(employeesWithoutGroups),
    [employeesWithoutGroups, mappedMerged]);
    return allSortedEmployees;
};
