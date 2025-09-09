import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import FullCalendar from '@fullcalendar/react'
import interactionPlugin from '@fullcalendar/interaction'
import momentPlugin from '@fullcalendar/moment'
import resourceTimelinePlugin from '@fullcalendar/resource-timeline'
import resourceDayGridPlugin from '@fullcalendar/resource-daygrid'

import './styles.scss'

import { getCompanyEmployeesAll } from 'api'

function groupEmployees(employees) {
  const topLevel = [];
  const groups = {};

  employees.forEach(emp => {
    const { group_id, subgroup_id } = emp;

    if (!group_id) {
      topLevel.push({ ...emp, isGroup: false, isSubGroup: false, isEmployee: true });
      return;
    }

    if (!groups[group_id]) {
      groups[group_id] = { id: group_id, isGroup: true, isSubGroup: false, isEmployee: false, children: [] };
    }

    const group = groups[group_id];

    if (!subgroup_id) {
      group.children.push({ ...emp, isGroup: false, isSubGroup: false, isEmployee: true });
    } else {
      let subgroup = group.children.find(c => c.id === subgroup_id && c.isSubGroup);
      if (!subgroup) {
        subgroup = { id: subgroup_id, isGroup: false, isSubGroup: true, isEmployee: false, children: [] };
        group.children.push(subgroup);
      }
      subgroup.children.push({ ...emp, isGroup: false, isSubGroup: false, isEmployee: true });
    }
  });

  // Sort children: employees first, then groups/subgroups
  function sortChildren(children) {
    children.forEach(child => {
      if (child.children) {
        sortChildren(child.children);
      }
    });
    children.sort((a, b) => {
      if (a.isEmployee && !b.isEmployee) return -1;
      if (!a.isEmployee && b.isEmployee) return 1;
      return 0;
    });
  }

  // Recursive function to assign meta
  let currentOrder = 1;
  function assignMeta(items, level = 0, parent = null) {
    items.forEach((item, index) => {
      item.order = currentOrder++;
      item.level = level;
      item.isLast = index === items.length - 1;

      if (item.isEmployee) {
        // isLastSubgroup: last employee among siblings
        const employeeSiblings = items.filter(c => c.isEmployee);
        item.isLastSubgroup =
          employeeSiblings.length > 0 &&
          employeeSiblings[employeeSiblings.length - 1].id === item.id;

        // isInLastSubgroupOfGroup: employee belongs to last subgroup in its group
        if (parent && parent.isSubGroup && parentParentIsGroup(parent)) {
          const group = parentParent(parent);
          const lastSubgroup = [...group.children].filter(c => c.isSubGroup).pop();
          item.isInLastSubgroupOfGroup = lastSubgroup && lastSubgroup.id === parent.id;
        } else {
          item.isInLastSubgroupOfGroup = false;
        }
      } else {
        item.isLastSubgroup = false;
        item.isInLastSubgroupOfGroup = false;
      }

      if (item.children) {
        assignMeta(item.children, level + 1, item);
      }
    });
  }

  // helpers to find parent group
  function parentParentIsGroup(subgroup) {
    return subgroup && subgroup.__parent && subgroup.__parent.isGroup;
  }
  function parentParent(subgroup) {
    return subgroup.__parent;
  }

  // Attach __parent references for traversal
  function attachParents(items, parent = null) {
    items.forEach(item => {
      item.__parent = parent;
      if (item.children) attachParents(item.children, item);
    });
  }

  const groupedArray = Object.values(groups);
  groupedArray.forEach(group => sortChildren(group.children));
  attachParents([...topLevel, ...groupedArray]);
  assignMeta([...groupedArray, ...topLevel], 0);

  // Cleanup temporary __parent references
  function cleanup(items) {
    items.forEach(item => {
      delete item.__parent;
      if (item.children) cleanup(item.children);
    });
  }
  cleanup([...topLevel, ...groupedArray]);

  return [...topLevel, ...groupedArray]
}

const CALENDAR_VIEWS_CONFIG = {
  day: {
    type: 'resourceTimelineDay',
    title: 'ddd MMM, DD, YYYY',
    slotLabelFormat: 'HH:mm',
    slotDuration: '1:00',
    snapDuration: '00:15',
  },
  week: {
    type: 'resourceTimelineWeek',
    slotDuration: '24:00',
    snapDuration: '6:00',
  },
  month: {
    type: 'resourceTimeline',
    // slotDuration: '12:00',
  }
}

const resourceLabelClassNames = ({ resource }) => {
  const { extendedProps: props } = resource;
  const classes = []
  if (props.isInLastSubgroupOfGroup) {
    classes.push('fc-datagrid-cell-last');
  }
  if (props.level === 2) {
    classes.push('fc-datagrid-cell-employee');
  }
  return classes
}

const TimeOffCalendar = () => {
  const { id: companyId } = useParams()

  const [resources, setResources] = useState([])

  console.log(resources)
  
  useEffect(() => {
    getCompanyEmployeesAll(companyId).then(res => {
      const grouped = groupEmployees(res.users || [])
     setResources(grouped)
    })
  }, [companyId])

  return (
    <div style={{height: '100%', display: 'flex', flexDirection: 'column'}}>
      <div className="calendar-wrapper">
        <FullCalendar
          // ref={calendarRef}
          resourceOrder="order"
          initialView={'month'}
          firstDay={1}
          schedulerLicenseKey='CC-Attribution-NonCommercial-NoDerivatives'
          plugins={[resourceTimelinePlugin, resourceDayGridPlugin, interactionPlugin, momentPlugin]}
          headerToolbar={false}
          aspectRatio={1}
          height="100%"
          resourceAreaWidth="20%"
          eventStartEditable={false}
          // // eventMinWidth={10}
          // // dayMinWidth={10}
          // slotMinWidth={10}
          // eventDurationEditable={timeline === TIMELINE.DAY}
          views={{
            ...CALENDAR_VIEWS_CONFIG,
            day: {
              ...CALENDAR_VIEWS_CONFIG.day,
              // slotMinTime: scheduleSettings.working_at_night ? scheduleSettings.time_view_stats : '00:00:00',
              // slotMaxTime: scheduleSettings.working_at_night ? `${+scheduleSettings.time_view_stats.split(':')[0] + 24}:00:00` : '24:00:00', 
            },
            week: {
              ...CALENDAR_VIEWS_CONFIG.week,
              // slotLabelFormat: renderWeekHeader,
            },
            month: {
              ...CALENDAR_VIEWS_CONFIG.month,
              // slotLabelContent: renderMonthHeader,
              // slotLabelClassNames: ({date: monthDate, view}) => {
              //   const isNextMonth = moment(monthDate).isAfter(moment(currentStartDate).endOf('month'))
              //   const date = moment(monthDate)
              //   const holiday = schedule.holidays[date.date()]
              //   const isWeekend = date.day() === 6 || date.day() === 0
              //   return isNextMonth ? ['statistic-slot'] : holiday ? [isWeekend ? 'header-holiday-slot-weekend' : 'header-holiday-slot'] : []
              // },
              // visibleRange: () => {
              //   const visibleRange = {
              //     start: moment(currentStartDate).clone().startOf('month').toDate(),
              //     end: moment(currentStartDate).clone().endOf('month').add(permissions.cost && permissions.schedule_costs ? 2 : 1, 'days').toDate(),
              //   }
              //   return visibleRange
              // },
            },
          }}
          
          resources={resources}
          events={[]}
          // eventContent={renderEventContent}
          // eventClassNames={handleEventClassNames}
          // slotLaneClassNames={handeSlotLaneClassNames}
          // slotLaneContent={renderSlotLaneContent}
          // resourceAreaHeaderClassNames={() => ['resource-area-header']}
          // resourceAreaHeaderContent={renderResourceAreaHeaderContent}
          // resourceLaneContent={renderResourceLaneContent}
          resourceLabelClassNames={resourceLabelClassNames}
          // resourceLabelContent={renderResourceLabelContent}
          // locale={localStorage.getItem('i18nextLng') || 'en'}
          // eventResize={handleEventChange}
          // eventAllow={eventListener}
          // eventResizeStart={handleEventChangeStart}
          // eventResizeStop={handleEventChangeStop}
          // viewDidMount={handleViewDidMount}
        />
      </div>
    </div>
  )
}

export default TimeOffCalendar
