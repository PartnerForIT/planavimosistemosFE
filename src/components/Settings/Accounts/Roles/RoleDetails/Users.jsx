/* eslint-disable camelcase */
import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import Content from './Content';

function Users({
  employees = [],
  groups = [],
}) {
  const { t } = useTranslation();
  const employToCheck = ({
    id,
    name,
    surname,
  }) => ({
    id,
    label: `${name} ${surname}`,
  });
  const findGroupName = useCallback((groupId) => groups?.find(({ id }) => id === groupId)?.name, [groups]);
  const findSubGroupName = useCallback((subGroupId, parentGroupId) => groups?.find((grp) => grp.group_id === parentGroupId)
    ?.subgroups
    ?.find((sbgrp) => sbgrp.id === subGroupId)?.name, [groups]);

  console.log(employees);
  const groupsToCheck = ({ id }) => ({
    id,
    label: findGroupName(id),
    type: 'groups',
  });

  const groupsWithEmployees = useMemo(() => employees?.map((employee) => {
    const {
      id,
      name,
      surname,
      groups: grps,
    } = employee;
    const r = {};

    employees.forEach((empl) => {
      const { groups: grops } = empl;

      if (grops) {
        const {
          group_id,
          sub_groups,
        } = grops;
        // eslint-disable-next-line no-shadow
        const groupName = findGroupName(group_id);
        if (sub_groups) {
          // eslint-disable-next-line no-nested-ternary
          r[groupName] = r[groupName]
            ? r[groupName][sub_groups.name]
              ? [...r[groupName][sub_groups.name], employToCheck(empl)]
              : { ...r[groupName], [sub_groups.name]: [employToCheck(empl)] }
            : [sub_groups.name] = [employToCheck(empl)];
        } else {
          r[groupName] = !r[groupName] ? { without: [employToCheck(empl)] } : {
            ...r[groupName],
            without: [employToCheck(empl)],
          };
        }
      }
    });

    let groupName;

    console.log(r);
    if (grps && grps.group_id) {
      // eslint-disable-next-line no-shadow
      groupName = groups?.find(({ id }) => id === grps.group_id)?.name;
      if (grps.sub_groups) {
        // id, parent_group_id
      }
    }
    return {
      id,
      name,
      surname,
      groupName,
    };
  }) ?? [], [employees, findGroupName, groups]);
  console.log(employees);
  return (
    <Content tooltip='Tooltip' title='Users within this role'>
      <pre>
        {/* {JSON.stringify(employees, null, 2)} */}
        {JSON.stringify(employees, null, 2)}
      </pre>
    </Content>
  );
}

export default Users;
