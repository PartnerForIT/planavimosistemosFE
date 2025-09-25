import moment from 'moment'
import { fade } from '@material-ui/core/styles/colorManipulator'

const DEFAULT_COLOR = '#1685FD'

export const generateResourcesFromEmployees = (employees) => {
  const topLevel = [];
  const groups = new Map();

  // Build group/subgroup/employee tree
  for (const emp of employees) {
    const { group_id, subgroup_id } = emp;
    if (!group_id) {
      topLevel.push({
        // ...emp,
        id: emp.id,
        group_id: emp.group_id,
        subgroup_id: emp.subgroup_id,
        photo: emp.photo,
        place_id: Number(emp.place_id),
        role: emp.role,
        isGroup: false,
        isSubGroup: false,
        isEmployee: true,
        checked: false,
        title: `${emp.name} ${emp.surname}`,
      })
      continue;
    }
    if (!groups.has(group_id)) {
      groups.set(group_id, { id: group_id, isGroup: true, isSubGroup: false, isEmployee: false, title: emp.groups, children: [] });
    }
    const group = groups.get(group_id);
    if (!subgroup_id) {
      group.children.push({
        // ...emp,
        id: emp.id,
        group_id: emp.group_id,
        subgroup_id: emp.subgroup_id,
        photo: emp.photo,
        place_id: Number(emp.place_id),
        role: emp.role,
        isGroup: false,
        isSubGroup: false,
        isEmployee: true,
        checked: false,
        title: `${emp.name} ${emp.surname}`,
      })
    } else {
      let subgroup = group.children.find(c => c.id === subgroup_id && c.isSubGroup);
      if (!subgroup) {
        subgroup = { id: subgroup_id, isGroup: false, isSubGroup: true, isEmployee: false, title: emp.subgroups, children: [] };
        group.children.push(subgroup);
      }
      subgroup.children.push({
        // ...emp,
        id: emp.id,
        group_id: emp.group_id,
        subgroup_id: emp.subgroup_id,
        photo: emp.photo,
        place_id: Number(emp.place_id),
        role: emp.role,
        isGroup: false,
        isSubGroup: false,
        isEmployee: true,
        checked: false,
        title: `${emp.name} ${emp.surname}`,
      })
    }
  }

  // Sort children: employees first, then subgroups
  function sortChildren(children) {
    for (const child of children) {
      if (child.children) sortChildren(child.children);
    }
    children.sort((a, b) => {
      if (a.isEmployee && !b.isEmployee) return -1;
      if (!a.isEmployee && b.isEmployee) return 1;
      return 0;
    });
  }

  // Attach parent references for meta assignment
  function attachParents(items, parent = null) {
    for (const item of items) {
      item.__parent = parent;
      if (item.children) attachParents(item.children, item);
    }
  }

  // Assign meta fields recursively
  let currentOrder = 1;
  function assignMeta(items, level = 0) {
    for (let i = 0; i < items.length; ++i) {
      const item = items[i];
      item.order = currentOrder++;
      item.level = level;
      item.isLast = i === items.length - 1;

      if (item.isEmployee) {
        // isLastSubgroup: last employee among siblings
        const employeeSiblings = items.filter(c => c.isEmployee);
        item.isLastSubgroup = employeeSiblings.length > 0 && employeeSiblings[employeeSiblings.length - 1].id === item.id;

        // isInLastSubgroupOfGroup: employee belongs to last subgroup in its group
        if (item.__parent && item.__parent.isSubGroup && item.__parent.__parent && item.__parent.__parent.isGroup) {
          const group = item.__parent.__parent;
          const subgroups = group.children.filter(c => c.isSubGroup);
          const lastSubgroup = subgroups.length > 0 ? subgroups[subgroups.length - 1] : null;
          item.isInLastSubgroupOfGroup = lastSubgroup && lastSubgroup.id === item.__parent.id;
        } else {
          item.isInLastSubgroupOfGroup = false;
        }
      } else {
        item.isLastSubgroup = false;
        item.isInLastSubgroupOfGroup = false;
      }
      if (item.children) assignMeta(item.children, level + 1);
    }
  }

  const groupedArray = Array.from(groups.values());
  for (const group of groupedArray) sortChildren(group.children);
  attachParents([...topLevel, ...groupedArray]);
  assignMeta([...groupedArray, ...topLevel], 0);

  function cleanup(items) {
    for (const item of items) {
      delete item.__parent;
      if (item.children) cleanup(item.children);
    }
  }
  cleanup([...topLevel, ...groupedArray]);
  
  return [ ...groupedArray, ...topLevel];
}

export const rangesOverlap = (start1, end1, start2, end2) => {
  if (end1.isBefore(start1)) [start1, end1] = [end1, start1]
  if (end2.isBefore(start2)) [start2, end2] = [end2, start2]
  return start1.isBefore(end2) && start2.isBefore(end1)
}

export const getEventsForDay = (events, date) => {
  const start = moment(date).startOf('day')
  const end = moment(date).endOf('day')
  const eventsMap = events.reduce((acc, event) => {
    const eventStart = moment(event.start)
    const eventEnd = moment(event.end)
    const isEventInDay = rangesOverlap(start, end, eventStart, eventEnd)
    if (isEventInDay) {
      acc[event.employee_id] = true
    }
    return acc
  }, {})
  return eventsMap
}

export const getCheckedElements = (items) => {
  const result = []

  for (const item of items) {
    if ("isEmployee" in item && item.isEmployee) {
      if (item.checked) {
        result.push(item);
      }
    } else if ("children" in item) {
      const checkedChildren = getCheckedElements(item.children);

      if (checkedChildren.length > 0) {
        result.push({
          ...item,
          children: checkedChildren
        });
      }
    }
  }

  return result
}

export const getEmployeesWithEvents = (items, eventsMap) => {
  const result = []

  for (const item of items) {
    if ("isEmployee" in item && item.isEmployee) {
      if (eventsMap[item.id]) {
        result.push(item);
      }
    } else if ("children" in item) {
      const checkedChildren = getEmployeesWithEvents(item.children, eventsMap);

      if (checkedChildren.length > 0) {
        result.push({
          ...item,
          children: checkedChildren
        });
      }
    }
  }

  return result
}

export const getEmployeesWithPlaces = (items, places) => {
  const result = []

  const placesMap = places.reduce((acc, place) => ({
    ...acc,
    [place.id]: place,
  }), {})

  for (const item of items) {
    if ("isEmployee" in item && item.isEmployee) {
      if (placesMap[item.place_id]) {
        result.push(item);
      }
    } else if ("children" in item) {
      const checkedChildren = getEmployeesWithPlaces(item.children, places);

      if (checkedChildren.length > 0) {
        result.push({
          ...item,
          children: checkedChildren
        });
      }
    }
  }

  return result
}

export const getCheckedEmployeeIds = (items) => {
  const ids = []
  const traverse = (arr) => {
    for (const item of arr) {
      if (item.isEmployee && item.checked) {
        ids.push(item.id)
      } else if (item.children) {
        traverse(item.children)
      }
    }
  }
  traverse(items)
  return ids
}

export const getCheckedEmployees = (items) => {
  const checked = getCheckedElements(items)
  if (checked.length === 0) {
    return items
  }
  return checked
}

export const getEmployeesFromResources = (resources) => {
  let employees = []
  for (const item of resources) {
    if ("isEmployee" in item && item.isEmployee) {
      employees.push(item)
    } else if ("children" in item) {
      employees = employees.concat(getEmployeesFromResources(item.children))
    }
  }
  return employees
}

export const getRandomHexColor = () => {
  const randomColor = Math.floor(Math.random() * 16777215).toString(16)
  return `#${randomColor.padStart(6, '0')}`;
}

export const generateWorkEvents = (data) => {
  return data.filter(e => Boolean(e.employee_id) && !e.empty_manual).map(event => {
    return {
      id: event.id,
      start: moment(event.start).toDate(),
      end: moment(event.end).toDate(),
      from: event.start,
      to: event.end,
      backgroundColor: fade(DEFAULT_COLOR, 0.5),
      borderColor: DEFAULT_COLOR,
      resourceId: event.employee_id.toString(),
      // classNames: [styles.event],
    }
  })
}

export const generateTimeOffEvents = (data, policies, classNames) => {
  const policiesMap = policies.reduce((acc, policy) => {
    return {
      ...acc,
      [policy.id]: policy,
    }
  }, {})
  const arr = data.map(item => {
    const policy = policiesMap[item.policy_id] || {}
    return {
      id: item.id,
      start: moment(item.from).startOf('day').toDate(),
      end: moment(item.to).endOf('day').toDate(),
      from: item.from,
      to: item.to,
      resourceId: item.employee_id.toString(),
      policy: policy,
      policy_id: item.policy_id,
      employee_id: item.employee_id,
      backgroundColor: fade(policy.color || DEFAULT_COLOR, 0.5),
      borderColor: policy.color || DEFAULT_COLOR,
      title: policy.name || 'Time Off',
      classNames: classNames,
      status: item.status,
      note: item.note,
    }
  })
  return arr
}

export const generateAvailabilityEvents = (currentDate, employees, events, classNames) => {
  const currentMonth = moment(currentDate).startOf('month')
  
  const employeesMap = employees.reduce((acc, emp) => {
    return {...acc, [emp.id]: emp}
  }, {})

  let maxEmployeesOnLeave = 0
  new Array(currentMonth.daysInMonth()).fill().forEach((_, i) => {
    const start = currentMonth.clone().add(i, 'days').startOf('day')
    const end = currentMonth.clone().add(i, 'days').endOf('day')
    
    const unavailableEmployees = events.reduce((acc, event) => {
      const eventStart = moment(event.start)
      const eventEnd = moment(event.end)
      const isEventInDay = rangesOverlap(start, end, eventStart, eventEnd)
      if (isEventInDay && employeesMap[event.employee_id]) {
        acc += 1
      }
      return acc
    }, 0)

    if (unavailableEmployees > maxEmployeesOnLeave) {
      maxEmployeesOnLeave = unavailableEmployees
    }
  })

  const arr = new Array(currentMonth.daysInMonth()).fill().map((_, i) => {
    const start = currentMonth.clone().add(i, 'days').startOf('day')
    const end = currentMonth.clone().add(i, 'days').endOf('day')

    const res = events.reduce((acc, event) => {
      const eventStart = moment(event.start)
      const eventEnd = moment(event.end)
      const isEventInDay = rangesOverlap(start, end, eventStart, eventEnd)
      if (isEventInDay && employeesMap[event.employee_id]) {        
        acc.count += 1
        const existingPolicy = acc.policies[event.policy.id]
        if (!existingPolicy) {
          acc.policies[event.policy.id] = {
            color: event.policy.color || DEFAULT_COLOR,
            onLeave: 1,
            name: event.policy.name || 'Time Off',
            id: event.policy.id,
            symbol: event.policy.symbol,
            employees: [{...employeesMap[event.employee_id], color: getRandomHexColor(), event: event}]
          }
        } else {
          acc.policies[event.policy.id].onLeave += 1
          acc.policies[event.policy.id].employees.push({...employeesMap[event.employee_id], color: getRandomHexColor(), event: event})
        }
      }
      return acc
    }, {count: 0, policies: {}})
    
    const unavailableEmployees = res.count
    return {
      resourceId: 'availability',
      id: `availability-${i}`,
      start: start.toDate(),
      end: end.toDate(),
      backgroundColor: 'transparent',
      borderColor: 'transparent',
      type: 'availability',
      classNames: classNames,
      metadata: {
        unavailableEmployees: unavailableEmployees,
        totalEmployees: maxEmployeesOnLeave,
        percentage: maxEmployeesOnLeave > 0 ? Math.round((unavailableEmployees / maxEmployeesOnLeave) * 100) : 0,
        chartData: {
          date: start.format('YYYY-MM-DD'),
          onLeave: unavailableEmployees,
          segments: Object.values(res.policies).map(item => {
            return {
              id: item.id,
              name: item.name,
              value: item.onLeave,
              symbol: item.symbol,
              seg: {
                  type: item.name,
                  count: item.onLeave,
                  employees: item.employees,
              },
              fill: item.color,
            }
          })
        }
      }
    }
  })
  return arr
}