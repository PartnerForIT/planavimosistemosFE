import { useCallback, useMemo } from 'react';

export default (empList, employToCheck) => {
  const employeesWithoutGroups = useMemo(() => empList
    .filter((empl) => !empl.groups.length && !empl.subgroups.length)
    .map((i) => employToCheck(i)), [empList, employToCheck]);
  const employeesWithGroupsSubGroups = useMemo(() => empList
    .filter((empl) => empl.groups.length || empl.subgroups.length), [empList]);
  const mapEmployeesGroups = useCallback((employeeArray) => {
    // eslint-disable-next-line no-underscore-dangle
    const _temp = {};
    employeeArray.forEach((item) => {
      const {
        // eslint-disable-next-line no-shadow
        groups,
        subgroups,
        group_id,
        subgroup_id,
      } = item;
      const groupId = group_id ?? subgroup_id ?? '';
      const subGroupId = subgroup_id ?? '';
      const groupname = groups ?? subgroups ?? '';
      const subGroupName = subgroups ?? '';
      const type = 'group';
        // eslint-disable-next-line no-nested-ternary
      _temp[groupId] = _temp[groupId]
        // eslint-disable-next-line no-nested-ternary
        ?  _temp[groupId]
          ? {
            ..._temp[groupId],
            label: groupname,
            type,
            [subGroupId]: {
              label: subGroupName,
              type,
              items:[employToCheck(item)],
            },
          }
          : subGroupId ? {
            [subGroupId]: {
              label: subGroupName,
              type,
              items: [employToCheck(item)],
            },
          } : {
            ..._temp[groupId],
            items: [
              ...(_temp[groupId].items || []),
              employToCheck(item),
            ],
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
      return item;
    });
    return { ..._temp };
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
