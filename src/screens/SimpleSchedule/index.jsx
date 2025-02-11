import React, {
  useState,
  useCallback,
  useEffect,
  useRef,
  useMemo,
} from 'react';
import FullCalendar from '@fullcalendar/react';
import interactionPlugin from '@fullcalendar/interaction';
import momentPlugin from '@fullcalendar/moment';
import resourceTimelinePlugin from '@fullcalendar/resource-timeline';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import cloneDeep from 'lodash';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Tooltip from 'react-tooltip';
import ReactTooltip from 'react-tooltip';
import { getSettingWorkTime } from '../../store/settings/actions';

import MainLayout from '../../components/Core/MainLayout';
import CustomSelect from '../../components/Core/Select/Select';
import Button from '../../components/Core/Button/Button';
import ChangeLog from '../../components/Core/Dialog/ChangeLog';
import ButtonGroupToggle from '../../components/Core/ButtonGroupToggle';
import ToolsButton from '../../components/Core/ToolsButton/ToolsButton';
import Progress from '../../components/Core/Progress';
import usePermissions from '../../components/Core/usePermissions';
import { TIMELINE, COLORS_JOB_TYPE } from '../../const';
import { resourcesMock } from '../../const/mock';
import { getSkills } from '../../store/skills/actions';
import { getEmployees } from '../../store/employees/actions';
import useGroupingEmployees from '../../hooks/useGroupingEmployees';

import {
  patchMarker
} from '../../store/schedule/actions';

import {
  getEditSchedule,
  deleteSchedule,
  getSchedule,
  postSchedule,
  postDuplicateSchedule,
  addScheduleEmployees,
  removeScheduleEmployees,
  publishSchedule,
  notifySchedule,
} from '../../store/simpleSchedule/actions';

import {
  loadEmployeesAll,
  getSchedule as getscheduleSetting,
  postSchedule as postScheduleSetting,
  loadIntegrations,
} from '../../store/settings/actions';
import { simpleScheduleSelector, markersSelector, isLoadingSelector } from '../../store/simpleSchedule/selectors';
import { employeesSelector, settingWorkTime } from '../../store/settings/selectors';

import EventContent from './EventContent';
import MonthView from './MonthView';
import ResourceAreaHeader from './ResourceAreaHeader';
import ResourceItem from './ResourceItem';
import Background from './Background';
import Footer from './Footer';
import CopyTool from './CopyTool';
import './Schedule.scss';
import {
  AdditionalRatesDataSelector,
  scheduleSelector as scheduleSettingSelector,
} from '../../store/settings/selectors';
import { getShiftTypes } from '../../store/shiftsTypes/actions';
import { skillsSelector } from '../../store/skills/selectors';
import HolidayIcon from 'components/Core/HolidayIcon/HolidayIcon';
import DialogNewSimpleSchedule from 'components/Core/Dialog/NewSimpleSchedule';

const permissionsConfig = [
  {
    name: 'cost',
    module: 'cost_earning',
  },
  {
    name: 'schedule_costs',
    module: 'schedule_shift',
    permission: 'schedule_costs',
  },
  {
    name: 'night_rates',
    module: 'night_rates',
  },
  {
    name: 'schedule_create_and_edit',
    permission: 'schedule_create_and_edit',
  },
];

export default () => {
  const { t } = useTranslation();
  const [timeline, setTimeline] = useState(TIMELINE.MONTH);
  const [toolsActive, setToolsActive] = useState({ marking: false, start_finish: false, remove_timelines: false});
  const [filter, setFilter] = useState({ employers: [], place: [], shiftType: [], skill: []});
  const calendarRef = useRef();
  const fromDateRef = useRef(new Date());
  const resizeObserverRef = useRef();
  const { id: companyId } = useParams();
  const dispatch = useDispatch();
  //const employees = useSelector(employeesSelector);
  const { users: employees } = useSelector(employeesSelector);
  const schedule = useSelector(simpleScheduleSelector);
  const markers = useSelector(markersSelector);
  const allSkills = useSelector(skillsSelector);
  const isLoading = useSelector(isLoadingSelector);
  const [filterData, setFilterData] = useState({});
  const permissions = usePermissions(permissionsConfig);
  const scheduleSettings=useSelector(scheduleSettingSelector);
  const copyToolRef = useRef();
  const [copyTool,setCopyTool] = useState(false)
  const [copyToolTime,setCopyToolTime] = useState({})
  const workTime = useSelector(settingWorkTime);
  const AdditionalRates = useSelector(AdditionalRatesDataSelector);
  const [openCreateShift, setOpenCreateShift] = useState(false);
  const [editShiftData, setEditShiftData] = useState(null);
  const [changeLogModal, setChangeLogModal] = useState(false);

  const published = useMemo(() => {
    if (schedule?.published) {
      return true
    }
    return false
  }, [schedule]);

  const count_changes = useMemo(() => {
    if (schedule?.count_changes) {
      return schedule.count_changes
    }
    return 0
  }, [schedule]);

  const resources = useMemo(() => {
    let currentColor = 0;
    let colorType = 'bright';
    const updateChildren = (children, lastSubgroup = false) => {
      if (children) {
        currentColor += 1;
        if (currentColor >= COLORS_JOB_TYPE[colorType].length) {
          currentColor = 0;
        }
        let eventBorderColor = '#2775D0';//COLORS_JOB_TYPE[colorType][currentColor - 1];
        let eventBackgroundColor = '#2775D0';//COLORS_JOB_TYPE[colorType][currentColor - 1];
        let lineColor = false;

        if (scheduleSettings.remove_timelines && timeline === TIMELINE.WEEK) {
          lineColor = eventBackgroundColor;
          eventBorderColor = 'transparent';
          eventBackgroundColor = 'transparent';
        }

        return Object.values(children).map((item, index) => {
          const nextItem = {
            ...item,
            eventBackgroundColor,
            eventBorderColor,
            lineColor: lineColor,
            lastSubgroup,
            eventDurationEditable: true,
            children: updateChildren(item.children, (index === Object.values(children).length - 1)),
          };

          return nextItem;
        });
      }
      return [];
    };

    if (schedule?.resources) {
      return updateChildren(schedule.resources);
    }

    // schedule.resources
    return schedule?.resources;
    // eslint-disable-next-line
  }, [filterData, schedule?.resources, scheduleSettings]);

  const events = useMemo(() => {
    let result = [];
    if (isLoading) return result;        
  
    if (schedule?.events) {
      if (timeline === TIMELINE.WEEK) {
        result = schedule.events.map((e) => {
          const sameDay = schedule.events.filter((ev) => ev.employee_id === e.employee_id && ev.day_number === e.day_number)
          return {
            ...e,
            realStart: e.start,
            realEnd: e.end,
            group: sameDay.length > 1 ? sameDay : false,
            start: moment(e.start).startOf('day').format('YYYY-MM-DD HH:mm:ss'),
            end: moment(e.start).endOf('day').format('YYYY-MM-DD HH:mm:ss'),
          }}).filter((e) => {
            return (e.group && e.group[0].id === e.id) || !e.group;
          });
      } else if (timeline === TIMELINE.DAY) {
        result = schedule.events.map((e) => {
          const sameDay = schedule.events.filter((ev) => ev.employee_id === e.employee_id && ev.day_number === e.day_number)
          return {
            ...e,
            realStart: e.start,
            realEnd: e.end,
            group: sameDay.length > 1 ? sameDay : false,
            start: sameDay.length > 1 ? sameDay.reduce((a, b) => moment(a.start).isBefore(moment(b.start)) ? a : b).start : e.start,
            end: sameDay.length > 1 ? sameDay.reduce((a, b) => moment(a.end).isAfter(moment(b.end)) ? a : b).end : e.end,
          }}).filter((e) => {
            return (e.group && e.group[0].id === e.id) || !e.group;
          }).filter((e) => {
            if (!e.employee_id && !moment(e.start).isSame(moment(fromDateRef.current), 'day')) {
              return false;
            }
            return true;
          });
        // result = schedule.events.filter((e) => {
        //   if (!e.employee_id && !moment(e.start).isSame(moment(fromDateRef.current), 'day')) {
        //     return false;
        //   }
        //   return true;
        // });
      } else {
        result = schedule.events.map((e) => {
          const sameDay = schedule.events.filter((ev) => ev.employee_id === e.employee_id && ev.day_number === e.day_number)
          return {
            ...e,
            group: sameDay.length > 1 ? sameDay : false,
          }})
      }
    }


    let employee_ids = [];

    const getChildren = (item) => {
      if (item.children) {
        item.children.forEach((child) => {
          if (!child.group && !child.subgroup) {    
            employee_ids.push(child.id);
          }
          getChildren(child);
        });
      }
    }

    (resources || []).forEach((item) => {
      if (!item.group && !item.subgroup) {
        employee_ids.push(item.id);
      }
      getChildren(item);
    });

    // Calculate days based on the timeline
    let days = [];
    if (timeline === TIMELINE.MONTH) {
        const daysInMonth = moment(fromDateRef.current).daysInMonth(); // Total days in the selected month
        days = Array.from({ length: daysInMonth }, (_, i) => i + 1); // [1, 2, ..., 28/29/30/31]
    } else if (timeline === TIMELINE.WEEK) {
        days = Array.from({ length: 7 }, (_, i) => moment(fromDateRef.current).startOf('isoWeek').add(i, 'days').date());
    } else if (timeline === TIMELINE.DAY) {
        days = [moment(fromDateRef.current).date()]; // Single day view
    }

    // Generate empty events
    employee_ids.forEach((employee_id) => {
        days.forEach((day_number) => {
            //continue if it's past day
            if (moment(fromDateRef.current).date(day_number).isBefore(moment().startOf('day'))) return;

            const hasEvent = result.some(
                (e) => e.employee_id === employee_id && e.day_number === day_number
            );
            if (!hasEvent) {
                result.push({
                    resourceId: employee_id,
                    employee_id,
                    day_number,
                    day: day_number,
                    empty_event: true,
                    start: moment(fromDateRef.current).date(day_number).startOf('day').format('YYYY-MM-DD HH:mm:ss'),
                    end: moment(fromDateRef.current).date(day_number).endOf('day').format('YYYY-MM-DD HH:mm:ss'),
                });
            }
        });
    });

    return result;
    // eslint-disable-next-line
  }, [filterData, schedule?.events, isLoading]);

  const unEmployees = useMemo(() => {
    let result = [];

    const getChildren = (item) => {
      if (item.children) {
        item.children.forEach((child) => {
          result.push(child.id);
          getChildren(child);
        });
      }
    }

    (resources || []).forEach((item) => {
      result.push(item.id);
      getChildren(item);
    });

    return result;
  }, [resources]);

  const employToCheck = useCallback(({
    id,
    name,
    surname,
  }) => ({
    id,
    label: `${name} ${surname}`,
    // checked: checkedEmployees.some(({ id: employeeId }) => employeeId === id),
  }), []);
  const allSortedEmployees = useGroupingEmployees(employees, employToCheck);

  const filteringResource = (data) => {
    if (schedule?.resources) {
      handleGetSchedule({ fromDate: fromDateRef.current });
      const copyObject = cloneDeep(schedule.resources).__wrapped__;
      const a = copyObject.filter((i) => {
        if (i.children) {
          i.children=i.children.filter((j) => {
            let checkShift = false;
            let checkEmployeeShift = data.employers.length ? false : true;

            if (j.children) {
              j.children = j.children.filter((k) => {
                let checkPlace = false;
                let checkEmployeePlace = data.employers.length ? false : true;
                data.place.map((placeEL) => {
                  if (placeEL.id === k.job_type_id) {
                    checkPlace = true;
                  }

                  return placeEL;
                });
                if (k.children) {
                  k.children = k.children.filter((it) => {
                    let checkEmployer = false;
                    data.employers.map((employer) => {
                      if (employer.id === it.employeeId) {
                        checkEmployer = true;
                        checkEmployeePlace = true;
                        checkEmployeeShift = true;
                      }

                      return employer;
                    });
                    if (!data.employers.length) { checkEmployeeShift = true; checkEmployeePlace = true; return true; }
                    return checkEmployer;
                  });
                }

                if (checkEmployeePlace && !data.place.length) { checkEmployeeShift = true; return true; }
                return checkEmployeePlace && checkPlace;
              });
            }
            if (checkEmployeeShift && !data.shiftType.length) { return true; }
            return checkEmployeeShift && checkShift;
          });
        
          return i.children.length;
        } else {
          return 0
        }
      });
      if (data.employers.length || data.place.length || data.shiftType.length) {
        setFilterData(a);
      }
      else{
        setFilterData({});
      }
    }
  };

  const handleCloseCreateShift = () => {
    setOpenCreateShift(false);
    setEditShiftData(null);
  };

  const handleCreateShift = (data) => {
    dispatch(postSchedule({
      companyId,
      id: editShiftData?.id,
      data: {
        ...data,
        employees: data.employees.map(({id}) => id),
        start_work: data.duration.start,
        end_work: data.duration.end,
        date: data.date.format('YYYY-MM-DD'),
      }
    })).then(() => {
      handleGetSchedule({ fromDate: fromDateRef.current });
    })
    handleCloseCreateShift();
  }

  const handleGetSchedule = ({ nextTimeline = timeline, fromDate = fromDateRef.current }) => {
    let nextFromDate = moment(fromDate);
    if (nextTimeline === TIMELINE.WEEK) {
      nextFromDate = nextFromDate.startOf('isoWeek');
    }

    dispatch(getSchedule({
      companyId,
      shiftTypeArr: filter?.shiftType.map(({id}) => id),
      employeesArr: filter?.employers.map(({id}) => id),
      placesArr: filter?.place.map(({id}) => id),
      skills: filter?.skill.map(({id}) => id),
      timeline: nextTimeline,
      fromDate: nextFromDate.format('YYYY-MM-DD'),
    }));
  };

  const handleChangeMonth = (data) => {
    fromDateRef.current = data.fromDate;
    handleGetSchedule({ fromDate: fromDateRef.current });
  }

  const handleMarker = (employeeId, date) => {
    dispatch(patchMarker({
      companyId,

      data: {
        employeeId,
        date: date.format('YYYY-MM-DD'),
      },
    }));
  };

  const onSkillSelectFilter = (skill) => {
    const arrChecked = skill?.filter((i) => i.checked);
    setFilter((prevState) => ({
      ...prevState,
      skill: arrChecked,
    }));
  };

  const onEmployeesSelectFilter = (emp) => {
    const arrChecked = emp?.filter((i) => i.checked);
    setFilter((prevState) => ({

      ...prevState,
      employers: arrChecked,
    }));
  };
  useEffect(() => {
    filteringResource(filter);
    // eslint-disable-next-line
  }, [filter]);
  useEffect(() => {
    
  }, [markers]);
  useEffect(() => {
    if (scheduleSettings.start_finish || scheduleSettings.remove_timelines) {
      setToolsActive({ ...toolsActive, start_finish: scheduleSettings.start_finish, remove_timelines: scheduleSettings.remove_timelines })
    }
    // eslint-disable-next-line
  }, [scheduleSettings]);
  const handleChangeTimeline = (value, date) => {
    setTimeline(value);
    
    const calendarApi = calendarRef.current?.getApi();
    let send = { nextTimeline: value };

    if (!calendarApi?.view?.getCurrentData()?.currentDate || date)
    {
      send.fromDate = date ? date.format('YYYY-MM-DD') : moment(new Date()).format('YYYY-MM-DD');
      fromDateRef.current = date ? date : moment(new Date());
    }

    handleGetSchedule(send);

    if (date) {
      //UGLY fix todo in feature
      setTimeout(() => {
        const calendarApi = calendarRef.current?.getApi();
        if (calendarApi) {
          calendarApi.changeView(TIMELINE.DAY, date.format('YYYY-MM-DD'));
        }
      }, 100);
    }
  };
  const handleCreateNewShift = () => {
    setEditShiftData(null);
    setOpenCreateShift(true);
  };
  
  const handleResourceLabelClassNames = ({ resource }) => {
    const { extendedProps: props } = resource;
    const classes = [];
    
    if (props.group) {
      classes.push('fc-datagrid-cell-group');
    }

    if (props.subgroup) {
      classes.push('fc-datagrid-cell-subgroup');
    }

    if (props.employee_id) {
      classes.push('fc-datagrid-cell-employee');
    }

    if (props.lastSubgroup) {
      classes.push('fc-datagrid-cell-last-subgroup');
    }

    if (props.button) {
      classes.push('fc-datagrid-cell-button');
    }

    return classes;
  };
  const getBodyForGetSchedule = () => {
    let nextFromDate = moment(fromDateRef.current);
    if (timeline === TIMELINE.WEEK) {
      nextFromDate = nextFromDate.startOf('isoWeek');
    }

    return {
      companyId,
      timeline,
      fromDate: nextFromDate.format('YYYY-MM-DD'),
      shiftTypeArr: filter?.shiftType.map(({id}) => id),
      employeesArr: filter?.employers.map(({id}) => id),
      placesArr: filter?.place.map(({id}) => id),
    };
  };
  const handleDuplicateEmployee = (id, employeeId, date) => {
    dispatch(postDuplicateSchedule({
      companyId,
      id: (id+'').split('-')[0],
      employeeId,
      date: date ? date.format('YYYY-MM-DD') : fromDateRef.current.format('YYYY-MM-DD'),
    })).then(() => {
      handleGetSchedule({ fromDate: fromDateRef.current });
    });
  };
  const handleDeleteWorkingTime = (id, day) => {
    if (!day) return;
    const confirm = window.confirm('Are you sure you want to delete this schedule?');
    if (confirm) {
      const splited_id = (id+'').split('-');
      dispatch(deleteSchedule({
        companyId,
        id: splited_id[0],
        day: splited_id[1] ? day.format('YYYY-MM-DD') : null,
      })).then(() => {
        handleGetSchedule({ fromDate: fromDateRef.current });
      });
    }
  };
  const handleEditWorkingTime = (id, day) => {
    const splited_id = (id+'').split('-');
    dispatch(getEditSchedule({
      companyId,
      id: splited_id[0],
      day: splited_id[1] && day ? day.format('YYYY-MM-DD') : null,
    })).then((data) => {
      if (data?.id) {
        data.only_day = splited_id[1] ? day : null;
        setEditShiftData(data)
        setOpenCreateShift(true);
      }
    });
  };
  const handleAddEmployees = (employees) => {
    dispatch(addScheduleEmployees({
      companyId,
      data: {employees},
    })).then(() => {
      handleGetSchedule({ fromDate: fromDateRef.current });
    });
  };
  const handleDeleteEmployees = (data) => {
    let post_data = {};
    if (data.group) {
      post_data = {group_id: data.id};
    } else if (data.subgroup) {
      post_data = {sub_group_id: data.id};
    } else {
      post_data = {employee_id: data.id};
    }

    dispatch(removeScheduleEmployees({
      companyId,
      data: {employees: post_data},
    })).then(() => {
      handleGetSchedule({ fromDate: fromDateRef.current });
    });
  }
  const handleEditReccuring = (id) => {
    dispatch(getEditSchedule({
      companyId,
      id: (id+'').split('-')[0],
    })).then((data) => {
      setEditShiftData(data)
      setOpenCreateShift(true);
    });
  }
  const handleDeleteReccuring = (id) => {
    const confirm = window.confirm('Are you sure you want to delete this recurring schedule?');
    if (confirm) {
      dispatch(deleteSchedule({
        companyId,
        id: (id+'').split('-')[0],
      })).then(() => {
        handleGetSchedule({ fromDate: fromDateRef.current });
      });
    }
  }
  const handlePublishSchedule = () => {
    dispatch(publishSchedule({
      companyId,
      data: {date: moment(fromDateRef.current).format('YYYY-MM-DD') },
    })).then(() => {
      handleGetSchedule({ fromDate: fromDateRef.current });
    });
  }
  const handleNotifyChanges = () => {
    dispatch(notifySchedule({
      companyId,
      data: {date: moment(fromDateRef.current).format('YYYY-MM-DD') },
    })).then(() => {
      handleGetSchedule({ fromDate: fromDateRef.current });
    });
  }

  const handleCopyTool = (time) => {
    setCopyToolTime(time)
    setCopyTool(!copyTool);
  }
  const handleAddHistory = (data) => {
    copyToolRef.current.addHistory(data);
  }
  const handleChangeTool = (event) => {
    const { name, checked } = event.target;
    setToolsActive({ ...toolsActive, [name]: checked })

    if (name === 'start_finish' || name ==='remove_timelines') {
      dispatch(postScheduleSetting(companyId, { ...toolsActive, [name]: checked }));
      setTimeout(() => {
        dispatch(getscheduleSetting(companyId));
      }, 1000);
    }
  }
  const handleOpenChangeLog = () => {
    setChangeLogModal(true);
  }
  const handleOpenAddSchedule = ({day, employee_id}) => {
    setEditShiftData({employee_id, date: moment(fromDateRef.current).date(day)})
    setOpenCreateShift(true);
  };
  const renderEventContent = ({ event, timeText, view }) => {

    const resourceInfo = event.getResources()[0];

    //let placeId;
    let withMenu = false
    let endDay;
    let dayNumber;
    let isCompleted;
    let publicId;
    
    dayNumber = event._def.extendedProps.day_number || event.extendedProps.day_number
    isCompleted = event?._def?.extendedProps?.is_completed
    publicId = event?._def?.publicId

    const selectedEvent  = events.find(e => 
      e.resourceId+'' === resourceInfo.id+'' &&
      dayNumber === e.day_number &&
      (timeline === TIMELINE.DAY && publicId && e.id ? publicId+'' === e.id+'' : true)
    );
    
    if (selectedEvent) {
      withMenu = selectedEvent?.employee_id ? true : false;
    }
    
    let start = (timeline === TIMELINE.WEEK && selectedEvent?.realStart) ? selectedEvent?.realStart : event.start;
    let end = (timeline === TIMELINE.WEEK && selectedEvent?.realEnd) ? selectedEvent?.realEnd : event.end;

    if (start && end && workTime?.work_time?.work_days?.days) {
      // eslint-disable-next-line
      const time = workTime.work_time.work_days.days.find(i => i.day == moment(start).isoWeekday());
      if (time?.start) {
        const [h, m] = time.start.split(':');
        start = moment(start).set({h: h*1, m: m*1});
      } else {
        start = moment(start).set({h: 8});
      }
      
      if (time?.finish) {
        const [h, m] = time.finish.split(':');
        end = moment(end).set({h: h*1, m: m*1});
      } else {
        end = moment(end).set({h: 17});
      }
    }

    return (
      <EventContent
        id={event.id}
        employeeId={selectedEvent?.employee_id || null}
        title={selectedEvent?.title || null}
        schedule_title={selectedEvent?.schedule_title || null}
        reccuring={selectedEvent?.reccuring || null}
        employeeName={selectedEvent?.employee_name || null}
        description={selectedEvent?.description || null}
        group={selectedEvent?.group || null}
        empty={selectedEvent?.empty_event || null}
        timeText={timeText}
        start={start}
        end={end}
        resourceId={resourceInfo.id}
        copy_event={event.extendedProps.copy_event}
        cost={event.extendedProps.cost}
        night_minutes={event.extendedProps.night_minutes}
        break_minutes={event.extendedProps.break_minutes}
        work_minutes={event.extendedProps.work_minutes}
        minutes={event.extendedProps.minutes}
        costPermission={permissions.cost && permissions.schedule_costs}
        nightPermission={permissions.night_rates && AdditionalRates.night_time}
        editPermission={permissions.schedule_create_and_edit}
        viewType={view.type}
        photo={resourceInfo.extendedProps.photo}
        withMenu={withMenu && !copyTool}
        jobTypeName={selectedEvent?.job_type_name}
        skillName={resourceInfo?.extendedProps?.skill_name}
        openAddSchedule={() => { handleOpenAddSchedule(selectedEvent) }}
        onDuplicateEmployee={handleDuplicateEmployee}
        onDeleteWorkingTime={handleDeleteWorkingTime}
        onEditWorkingTime={handleEditWorkingTime}
        handleAddHistory={handleAddHistory}
        copyTool={copyTool}
        endDay={endDay}
        isCompleted={isCompleted}
        lineColor={resourceInfo?.extendedProps?.lineColor}
        removeTimelines={scheduleSettings.remove_timelines && timeline === TIMELINE.WEEK}
        onEditReccuring={handleEditReccuring}
        onDeleteReccuring={handleDeleteReccuring}
      />
    );
  };
  const handleEventClassNames = (info) => {
    let classes = [];
    if (info.event.extendedProps.empty_event) {
      classes.push('is-empty-manual')
    }
    if (copyTool || info.event.extendedProps.copy_event) {
      classes.push('disable-drag')
    }

    return classes;
  };

  const renderResourceLabelContent = ({ fieldValue, resource }) => {
    const {
      //count,
      photo,
      employeeId,
      employeesCount,
      button,
      //hours_demand,
      skill_name,
    } = resource.extendedProps;
    const realCount = employeesCount;

    return (
      <ResourceItem
        title={button ? t('Add Employees') : (`${fieldValue} ${realCount ? `(${realCount})` : ''}`)}
        photo={photo}
        skill={skill_name}
        employeeId={employeeId}
        onAddEmployees={button ? handleAddEmployees : false}
        unavailableEmployees={unEmployees}
        handleDeleteEmployees={() => handleDeleteEmployees({...resource.extendedProps, id: resource.id})}
        t={t}
      />
    );
  };
  const renderResourceAreaHeaderContent = ({ view }) => {
    
    const handleClickPrev = () => {
      view.calendar.prev();
      fromDateRef.current = view.getCurrentData().currentDate;
      handleGetSchedule({ fromDate: fromDateRef.current });
    };
    const handleClickNext = () => {
      view.calendar.next();
      fromDateRef.current = view.getCurrentData().currentDate;
      handleGetSchedule({ fromDate: fromDateRef.current });
    };

    const inputDate = moment(view.getCurrentData().currentDate);
    const startOfWeek = inputDate.clone().startOf('isoWeek');
    const endOfWeek = inputDate.clone().endOf('isoWeek');

    const holiday = (view.type === 'day' && schedule?.holidays) ? schedule?.holidays[view.getCurrentData().currentDate.getDate()] : false;
    const title = (view.type === 'day') ? `${t(inputDate.format('dddd'))}, ${t(inputDate.format('MMMM'))}${inputDate.format(' D, YYYY')}` : `${t(startOfWeek.format('MMM'))} ${startOfWeek.format('D')} – ${endOfWeek.format('D, YYYY')}`;

    return (
      <ResourceAreaHeader
        title={title}
        holiday={holiday}
        onClickPrev={handleClickPrev}
        onClickNext={handleClickNext}
      />
    );
  };
  const handleClickDay = (date) => {
    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi) {
      setTimeline(TIMELINE.DAY);
      calendarApi.changeView(TIMELINE.DAY, date.format('YYYY-MM-DD'));
      fromDateRef.current = date;
      handleGetSchedule({ nextTimeline: TIMELINE.DAY, fromDate: date });
    }
  };
  const renderWeekHeader = (info) => {
    const date = moment(info.date);
    const holiday = (schedule?.holidays) ? schedule?.holidays[date.date()] : false;

    return (
      <div
        onClick={() => { handleClickDay(date) }}
      >
        <span className='schedule-enter-day'>{t('Enter')}</span>
        {t(date.format('ddd'))+date.format(', DD')}
        <HolidayIcon
          holidays={holiday}
          month={true}
        />
      </div>
    );
  };

  const updateWidthCell = (rows) => {
    const scheduleFooter = document.getElementById('schedule-footer');
    const scheduleBackground = document.getElementById('schedule-background');

    if (scheduleFooter?.getAttribute('data-timeline') === TIMELINE.WEEK) {
      Array.from(rows).forEach((itemJ, index) => {
        const { width } = itemJ.getBoundingClientRect();
        if (scheduleFooter.children[index + 1]) {
          scheduleFooter.children[index + 1].style.width = `${width}px`;
        }
        if (scheduleBackground.children[index + 1]) {
          scheduleBackground.children[index + 1].style.width = `${width}px`;
        }
      });
    }
  };
  const handleViewDidMount = (view) => {
    const container = document.getElementsByClassName('fc-timeline-slots');
    resizeObserverRef.current = new ResizeObserver((item) => {
      const rows = item[0].target.children[0].children[1].children[0].children;
      updateWidthCell(rows);
    }).observe(container[0], { box: 'border-box' });

    if (!permissions.schedule_create_and_edit && !published) {
      const calendarEl = view.el.closest('.fc');
      const eventArea = calendarEl.querySelector('.fc-timeline-body');
      let parentParent = null;
      if (eventArea) {
        parentParent = eventArea.parentElement?.parentElement;
      }
      
      // Remove any previous "No events" message
      const existingOverlay = calendarEl.querySelector('.no-events-overlay');
      if (existingOverlay) existingOverlay.remove();

      if (events.length === 0 && parentParent) {
        // Create overlay container
        const overlay = document.createElement("div");
        overlay.classList.add("no-events-overlay");
  
        // Create NotPublished element (you can replace this with your own React component if needed)
        const notPublished = document.createElement("div");
        notPublished.classList.add("not-published-icon");
  
        // Create title
        const title = document.createElement("p");
        title.classList.add("empty-title");
        title.innerText = t("WAITING FOR PUBLISHING");
  
        // Create descriptions
        const desc1 = document.createElement("p");
        desc1.classList.add("empty-description");
        desc1.innerText = t("This month is not yet published, your managers are still planning and scheduling work for this month.");
  
        const desc2 = document.createElement("p");
        desc2.classList.add("empty-description");
        desc2.innerText = t("You will be notified in the Grownu mobile app when this month will be published.");
  
        // Append all elements inside overlay
        overlay.appendChild(notPublished); // Append the NotPublished element
        overlay.appendChild(title);
        overlay.appendChild(desc1);
        overlay.appendChild(desc2);
  
        // Insert overlay inside parentParent
        parentParent.appendChild(overlay);
      }
    }
  };

  const handeSlotLaneClassNames = (info) => {
    const date = moment(info.date);
    const holiday = (schedule?.holidays) ? schedule?.holidays[date.date()] : false;
    const h = (holiday && holiday[0] && holiday[0]?.date) ? holiday[0] : {};
    let result = '';

    if (timeline === TIMELINE.WEEK && h.date) {
      result += 'cell_holiday ';
      if (h.company_work_time_id) {
        result += 'cell_holiday_company';
      } else if ((h.date && !h.company_work_time_id)) {
        result += 'cell_holiday_government';
      }
    }

    return result;
  };

  const handeResourceLaneClassNames = (info) => {
    let result = toolsActive['marking'] ? 'marker_activated' : '';
    return result;
  }

  const handleSetupMarkersWidth = ({resource, el}) => {
    //need to find better way for setup markers width
    setupMarkersWidthitem(resources, markers);
  }

  const setupMarkersWidthitem = (item, markers) => {
    item.map((child, index) => {
      if (child?.children && child?.children.length) {
        return setupMarkersWidthitem(child?.children, markers);
      }

      return markers.map((marked, i) => {
        let left = false;
        let width = false;
        if (marked.date) {
          const marks = document.querySelectorAll('.marked[data-mark^="'+moment(marked.date).format('yyyy-MM-DD')+'"]');
          const date_header = document.querySelectorAll('.fc-timeline-slot-label[data-date^="'+moment(marked.date).format('yyyy-MM-DD')+'"]');


          if (date_header && marks) {
            date_header.forEach((e, i) => {
              left = left === false ? e.offsetLeft : left;
              width = width === false ? e.offsetWidth : e.offsetWidth + e.offsetLeft;
            });

            if (left !== false && width !== false) {
              marks.forEach((mark, i) => {
                mark.style.left = left+1+'px';
                mark.style.width = width+'px';
              });
            }
          }
          
        }

        return null;
      });
    })
  };

  const renderResourceLaneContent = ({resource}) => {
    let current_markers = [];
    if (markers) {
      current_markers = markers.filter(m => m.employee_id*1 === resource.extendedProps.employeeId*1 );
    }

    return (
      (resources) && renderSlotResourceItem(resources, current_markers, resource.extendedProps.employeeId)
    );
  };

  const renderSlotResourceItem = (item, markers, employeeId) => {
    return (
      <>
        { item.map((child, index) => {
            let contains = [];
            if (!toolsActive['marking']) {
              contains = markers.map((marked, i) => {
                let left = false;
                let width = false;
                if (marked.date) {
                  const date_header = document.querySelectorAll('.fc-timeline-slot-label[data-date^="'+moment(marked.date).format('yyyy-MM-DD')+'"]');
                  if (date_header) {
                    date_header.forEach((e, i) => {
                      left = left === false ? e.offsetLeft : left;
                      width = width === false ? e.offsetWidth : e.offsetWidth + e.offsetLeft;
                    });
                  }
                }

                // hide mark when day have event
                const exist_event = schedule?.events ? schedule?.events.find(e => ((moment(e.start).isSame(moment(marked.date), 'date') || moment(e.end).isSame(moment(marked.date), 'date')) && e.employee_id*1 === employeeId*1)) : false;
                
                return ( 
                  <React.Fragment key={child.id+'__'+index+'_'+i}>
                    { (marked) ?
                      (!exist_event ? <div data-for='user_marker' data-tip={marked.comment} className="fc-markers-item marked" key={child.id+'_'+index} style={{ width: width, left: left+1 }} data-mark={moment(marked.date).format('yyyy-MM-DD')}></div> : null) :  
                      ((child?.children) ? renderSlotResourceItem(child?.children, markers, employeeId) : null)
                    }
                  </React.Fragment>
                )
              });
            }

            if (toolsActive['marking'] && employeeId) {
              const calendarApi = calendarRef.current?.getApi();
              
              if (calendarApi?.view?.currentEnd && calendarApi?.view?.currentStart) {

                let currDate = moment(calendarApi?.view?.currentStart).subtract(1, 'days').startOf('day');
                let lastDate = moment(calendarApi?.view?.currentEnd).startOf('day');
                
                while(currDate.isSameOrBefore(lastDate)) {
                  currDate.add(1, 'days');

                  let left = false;
                  let width = false;
                  const date_header = document.querySelectorAll('.fc-timeline-slot-label[data-date^="'+currDate.format('yyyy-MM-DD')+'"]');
                  if (date_header) {
                    date_header.forEach((e, i) => {
                      left = left === false ? e.offsetLeft : left;
                      width = width === false ? e.offsetWidth : e.offsetWidth + e.offsetLeft;
                    });
                  }

                  const same = markers.find(m => moment(m.date).isSame(currDate, 'date'));
                  const markDate = currDate.clone();

                  contains.push(<div data-for='user_marker' data-tip={same ? same.comment : ''} className={"fc-markers-item marker_active"+ (same ? ' marked' : '')} key={child.id+'m_00_'+employeeId+'_'+currDate.format('yyyy-MM-DD')} style={{ width: width, left: left+1 }} onClick={() => { handleMarker(employeeId, markDate) }}></div>)
                }
              }
            }

            return contains
          })
        }
      </>
    );
  };

  useEffect(() => {
    dispatch(getEmployees(companyId));
    dispatch(getSkills(companyId));
    dispatch(getSettingWorkTime(companyId));

    dispatch(getSchedule({
      companyId,

      timeline,
      fromDate: moment(new Date()).format('YYYY-MM-DD'),
      firstLoading: true,
    }));
    dispatch(getscheduleSetting(companyId));
    dispatch(loadEmployeesAll(companyId, {page: 'simple_schedule'}));
    dispatch(getShiftTypes(companyId));
    dispatch(loadIntegrations(companyId));

    return () => {
      // eslint-disable-next-line no-unused-expressions
      resizeObserverRef.current?.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    switch (timeline) {

      case TIMELINE.DAY:
      case TIMELINE.WEEK: {
        const calendarApi = calendarRef.current?.getApi();

        if (calendarApi) {
          calendarApi.changeView(timeline);
        }

        if (timeline === TIMELINE.WEEK) {
          setTimeout(() => {
            const container = document.getElementsByClassName('fc-timeline-slots');
            const rows = container?.[0]?.firstChild?.children?.[1]?.children?.[0]?.children;
            updateWidthCell(rows);
          });
        }

        break;
      }
      default: break;
    }
  }, [timeline]);

  const workAtNightMode = () => {
    if (scheduleSettings.working_at_night) {
      return `${+scheduleSettings.time_view_stats.split(':')[0] + 24}:00:00`;
    }
    return '24:00:00';
  };
  
  return (
    <MainLayout>
      <div className='simple-schedule-screen'>
        <div className='simple-schedule-screen__header'>
          <CustomSelect
            placeholder={t('All skills')}
            buttonLabel={t('Filter')}
            items={allSkills}
            onChange={onSkillSelectFilter}
            width='auto'
            withSearch={true}
          />
          <CustomSelect
            placeholder={t('All employees')}
            buttonLabel={t('Filter')}
            items={allSortedEmployees ?? []}
            onChange={onEmployeesSelectFilter}
            width='auto'
            withSearch={true}
          />
          { 
            <ButtonGroupToggle
              buttons={[
                {
                  label: t('Day'),
                  id: TIMELINE.DAY,
                },
                {
                  label: t('Week'),
                  id: TIMELINE.WEEK,
                },
                {
                  label: t('Month'),
                  id: TIMELINE.MONTH,
                },
              ]}
              onChange={handleChangeTimeline}
              value={timeline}
            />
          }

          { !copyTool && (
            <ToolsButton
              withLog
              handleInputChange={handleChangeTool}
              handleOpenChangeLog={handleOpenChangeLog}
              values={toolsActive}
            />
          )}

          
          <div className='simple-schedule-screen__buttons'>
            {
              timeline === TIMELINE.MONTH && schedule && permissions.schedule_create_and_edit ? (
                ! published && !schedule?.events?.length ? (
                  <Button
                    className={'simple-schedule-screen__nochanges'}
                    disabled
                  >
                    {t('No Entries')}
                  </Button>
                ) : (
                  ! published && schedule?.events?.length ? (
                    <Button
                      className={'simple-schedule-screen__publish'}
                      onClick={handlePublishSchedule}
                    >
                      {t('Publish')}
                    </Button>
                  ) : (
                    published && !count_changes ? (
                      <Button
                        className={'simple-schedule-screen__published'}
                        disabled
                      >
                        {t('Published')}
                      </Button>
                    ) : (
                      published && count_changes ? (
                        <Button
                          className={'simple-schedule-screen__notify'}
                          onClick={handleNotifyChanges}
                        >
                          {t('Notify Changes')} ({count_changes})
                        </Button>
                      ) : null
                    )
                  )
                )

              ) : null
            }

            { !copyTool && permissions.schedule_create_and_edit && (
              <Button onClick={handleCreateNewShift}>
                {t('Create Task')}
              </Button> )
            }
          </div>
        </div>
        {
          (!schedule) ? (
            // <Progress />
              <></>
          ) : (
            <>
              {
                timeline === TIMELINE.MONTH ? (
                  <MonthView
                    published={published}
                    resources={resources ? Object.values(resources) : resourcesMock}
                    events={events}
                    holidays={schedule?.holidays}
                    markers={markers}
                    markerActive={toolsActive['marking']}
                    handleMarker={handleMarker}
                    onChangeMonth={handleChangeMonth}
                    timesPanel={schedule.timesPanel}
                    withCost={permissions.cost && permissions.schedule_costs}
                    permissions={permissions}
                    scheduleSettings={scheduleSettings}
                    copyTool={copyTool}
                    workTime={workTime}
                    handleDuplicateEmployee={handleDuplicateEmployee}
                    handleDeleteWorkingTime={handleDeleteWorkingTime}
                    handleCopyTool={handleCopyTool}
                    handleAddHistory={handleAddHistory}
                    handleChangeTimeline={handleChangeTimeline}
                    handleEditWorkingTime={handleEditWorkingTime}
                    handleAddEmployees={permissions.schedule_create_and_edit ? handleAddEmployees : false}
                    handleDeleteEmployees={handleDeleteEmployees}
                    openAddSchedule={handleOpenAddSchedule}
                    onEditReccuring={handleEditReccuring}
                    onDeleteReccuring={handleDeleteReccuring}
                  />
                ) : (
                  <>
                    <FullCalendar
                      firstDay={1}
                      ref={calendarRef}
                      plugins={[resourceTimelinePlugin, interactionPlugin, momentPlugin]}
                      initialView={timeline}
                      views={{
                        day: {
                          type: 'resourceTimelineDay',
                          title: 'ddd MMM, DD, YYYY',
                          slotLabelFormat: 'HH:mm',
                          slotDuration: '1:00',
                          snapDuration: '00:30',
                        },
                        week: {
                          type: 'resourceTimelineWeek',
                          // duration: {
                          //   days: 7,
                          // },
                          slotLabelFormat: renderWeekHeader,
                          slotDuration: '24:00',
                          snapDuration: '6:00',
                        },
                      }}
                      slotMinTime={timeline === TIMELINE.WEEK ? '00:00:00' : (scheduleSettings.working_at_night ? scheduleSettings.time_view_stats : '00:00:00')}
                      slotMaxTime={timeline === TIMELINE.WEEK ? '24:00:00' : workAtNightMode()}
                      resourceOrder='sort'
                      headerToolbar={false}
                      aspectRatio={1}
                      height='100%'
                      //agendaEventMinHeight={90}
                      schedulerLicenseKey='CC-Attribution-NonCommercial-NoDerivatives'
                      resources={[...resources, ...(permissions.schedule_create_and_edit ? [{ button: true }] : [])]}
                      events={!permissions.schedule_create_and_edit && !published ? events : []}
                      eventStartEditable={false}
                      eventResizableFromStart={false}
                      eventDurationEditable={false}
                      eventContent={renderEventContent}
                      eventClassNames={handleEventClassNames}
                      resourceAreaHeaderContent={renderResourceAreaHeaderContent}
                      viewDidMount={handleViewDidMount}
                      resourceLabelClassNames={handleResourceLabelClassNames}
                      resourceLabelContent={renderResourceLabelContent}
                      slotLaneClassNames={handeSlotLaneClassNames}
                      resourceLaneDidMount={handleSetupMarkersWidth}
                      resourceLaneContent={renderResourceLaneContent}
                      resourceLaneClassNames={handeResourceLaneClassNames}
                      locale={localStorage.getItem('i18nextLng') || 'en'}
                      // nowIndicator
                    />
                    <ReactTooltip
                      id='holiday'
                      className='schedule-screen__tooltip'
                      effect='solid'
                    />
                    <ReactTooltip
                      id='user_marker'
                      className='schedule-screen__tooltip schedule-screen__tooltip__marker'
                      effect='solid'
                    />
                    <ReactTooltip
                      id='demand_hours'
                      className='schedule-screen__tooltip schedule-screen__tooltip__demand'
                      effect='solid'
                    />
                    {
                      timeline === TIMELINE.WEEK && (
                        <Background
                          startDay={fromDateRef.current}
                        />
                      )
                    }
                    <Footer
                      timeline={timeline}
                      data={schedule.timesPanel}
                      withCost={permissions.cost && permissions.schedule_costs}
                    />
                  </>
                )
              }
            </>
          )
        }
        <DialogNewSimpleSchedule
          open={openCreateShift}
          title={editShiftData ? (editShiftData.reccuring ? t('Edit Recurring Task') : t('Edit Task')) : t('Create New Schedule')}
          handleClose={handleCloseCreateShift}
          handleSubmit={handleCreateShift}
          editData={editShiftData}
          availableEmployees={unEmployees}
        />
        <Tooltip
          id='time'
          className='schedule-screen__tooltip'
          effect='solid'
        />
        <Tooltip
          id='time_active'
          className='schedule-screen__tooltip schedule-screen__tooltip__active'
          effect='solid'
        />
        <Tooltip
          id='time_past'
          className='schedule-screen__tooltip schedule-screen__tooltip__past'
          effect='solid'
        />
        <Tooltip
          id='time_empty'
          className='schedule-screen__tooltip schedule-screen__tooltip__empty'
          effect='solid'
        />
        {
          (isLoading) && (
            <div className='schedule-screen__overlay-loading'>
              <Progress/>
            </div>
          )
        }
        {
          (copyTool) && (
            <CopyTool
              ref={copyToolRef}
              start={copyToolTime.start || null}
              end={copyToolTime.end || null}
              onClose={handleCopyTool}
              getBodyForGetSchedule={getBodyForGetSchedule}
            />
          )
        }
        { changeLogModal && (
          <ChangeLog
            date={fromDateRef.current}
            open={changeLogModal}
            onClose={() => setChangeLogModal(false)}
          />
        )}
        <div/>
      </div>
    </MainLayout>
  );
};
