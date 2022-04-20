import React, {
  useState,
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
import { useHistory, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Tooltip from 'react-tooltip';
import { alpha } from '@material-ui/core/styles/colorManipulator';

import MainLayout from '../../components/Core/MainLayout';
import CustomSelect from '../../components/Core/Select/Select';
import Button from '../../components/Core/Button/Button';
import ButtonGroupToggle from '../../components/Core/ButtonGroupToggle';
import Checkbox from '../../components/Core/Checkbox/Checkbox2';
import Progress from '../../components/Core/Progress';
import usePermissions from '../../components/Core/usePermissions';
import { TIMELINE, COLORS_JOB_TYPE, COLORS_SHIFT } from '../../const';
import { resourcesMock } from '../../const/mock';
import { getJobTypes } from '../../store/jobTypes/actions';
import { getEmployees } from '../../store/employees/actions';
import {
  getSchedule,
  deleteTimeline,
  patchChangeTimeline,
  patchChangeEmployee,
  deleteShift, putShift, addTempemployee,
} from '../../store/schedule/actions';
import {
  loadEmployeesAll,
  getSchedule as getscheduleSetting,
} from '../../store/settings/actions';
import { employeesSelector } from '../../store/employees/selectors';
import { scheduleSelector, isLoadingSelector } from '../../store/schedule/selectors';
import { jobTypesSelector } from '../../store/jobTypes/selectors';

import EventContent from './EventContent';
import MonthView from './MonthView';
import ResourceAreaHeader from './ResourceAreaHeader';
import ResourceItem from './ResourceItem';
import Background from './Background';
import Footer from './Footer';
import './Schedule.scss';
import {
  scheduleSelector as scheduleSettingSelector,
} from '../../store/settings/selectors';
import { getShiftTypes } from '../../store/shiftsTypes/actions';
import {shiftTypesSelector} from '../../store/shiftsTypes/selector';
import AddTempEmployee from "./AddTempEmployee";
import Dropdown from "../../components/Core/Dropdown/Dropdown";
import {format} from "date-fns";
import { TheatersRounded } from '@material-ui/icons';

const permissionsConfig = [
  {
    name: 'cost',
    module: 'cost_earning',
  },
];

export default () => {
  const { t } = useTranslation();
  const history = useHistory();
  const [timeline, setTimeline] = useState(TIMELINE.DAY);
  const [filter, setFilter] = useState({ employers: [], place: [], shiftType: [], });
  const calendarRef = useRef();
  const fromDateRef = useRef(new Date());
  const resizeObserverRef = useRef();
  const { id: companyId } = useParams();
  const dispatch = useDispatch();
  const employees = useSelector(employeesSelector);
  const jobTypes = useSelector(jobTypesSelector);
  const shiftsTypes = useSelector(shiftTypesSelector);
  const schedule = useSelector(scheduleSelector);
  const isLoading = useSelector(isLoadingSelector);
  const [filterData, setFilterData] = useState({});
  const permissions = usePermissions(permissionsConfig);
  const scheduleSettings=useSelector(scheduleSettingSelector);
  const [modalAddTempEmployee,setmodalAddTempEmployee] = useState(null)
  const [tempShiftID,setTempShiftID] = useState(0)
  const [tempJobTypeID,setTempJobTypeID] = useState(0)
  const [tempEmployeeID,setTempEmployeeID] = useState(0)
  const [tempEventID,setTempEventID] = useState(0)
  const [dayCheckData,setDayCheckData] = useState(0)
  const today = format(new Date(), 'dd')


  const resources = useMemo(() => {
    let currentColor = 0;
    let colorType = 'bright';
    const updateChildren = (children, upLastShift, upLastJobType, upCustomTime) => {
      if (children) {
        return Object.values(children).map((item, index) => {
          const lastShift = upLastShift || (item.shiftId && ((children.length - 1) === index));
          const customTime = upCustomTime || item.custom_time;
          const lastJobType = upLastJobType || (item.job_type_id && ((children.length - 1) === index));
          if (item.shiftId) {
            item.count = item.count || 0;
            item.children.map((i) => {
              item.count = item.count + i.children.length;
            });
          }
          if (item.job_type_id) {
            item.count = item.children.length;
          }

          // Set color
          let eventBackgroundColor = item.color;
          let eventBorderColor = item.color;

          if (item.place_id){
            eventBorderColor = COLORS_JOB_TYPE[colorType][217];
            eventBackgroundColor = alpha(COLORS_JOB_TYPE[colorType][217], 0.5);
          }
          if (item.shiftId) {
            colorType = COLORS_SHIFT.bright.some((itemC) => itemC === item.color) ? 'bright' : 'calm';
            eventBorderColor = COLORS_SHIFT[colorType][currentColor];
            eventBackgroundColor = COLORS_SHIFT[colorType][currentColor];
          }

          if (item.job_type_id) {
            if (currentColor >= COLORS_JOB_TYPE[colorType].length) {
              currentColor = 0;
            }

            eventBorderColor = COLORS_JOB_TYPE[colorType][currentColor];
            eventBackgroundColor = COLORS_JOB_TYPE[colorType][currentColor];
            currentColor += 1;
          }

          if (item.employeeId) {
            eventBorderColor = COLORS_JOB_TYPE[colorType][currentColor - 1];
            eventBackgroundColor = alpha(COLORS_JOB_TYPE[colorType][currentColor - 1], 0.5);
          }
          if (item.employee_type == 3|| item.employee_type == 2 ) {
            eventBorderColor = COLORS_JOB_TYPE[colorType][216];
            eventBackgroundColor = alpha(COLORS_JOB_TYPE[colorType][216], 0.5);
          }
          const nextItem = {
            ...item,
            eventBackgroundColor,
            eventBorderColor,
            eventDurationEditable: schedule?.events[0]?.is_completed ? false : !!item.employeeId  ,
            children: updateChildren(item.children, lastShift, lastJobType, customTime),
          };
          if (lastShift) {
            nextItem.lastShift = lastShift;
          }

          if (lastJobType) {
            nextItem.lastJobType = lastJobType;
          }

          return nextItem;
        });
      }
      return [];
    };
    if (filterData[0] && (filter.employers.length || filter.place.length || filter.shiftType.length)) {
      return updateChildren(filterData);
    }

    if (schedule?.resources) {
      return updateChildren(schedule.resources);
    }

    // schedule.resources
    return schedule?.resources;
  }, [filterData, schedule?.resources]);

  const filteredShifts = () => {

    const updateShifts = (shifts) => {
      let filteredShiftsPreview = [];
      if (shifts) {
        for (let i in shifts || []) {
          for (let j in resources) {
            if (resources[j].children) {
              for (let k in resources[j].children) {
                if (shifts[i].id == resources[j].children[k].shiftId) {
                  let add = false;
                  if (resources[j].children[k].children) {
                    for (let m in resources[j].children[k].children) {
                      if (resources[j].children[k].children[m].children) {
                        for (let n in resources[j].children[k].children[m].children) {
                          add = true;
                        }
                      }
                    }
                  }
      
                  if (add) {
                    filteredShiftsPreview.push({...shifts[i]});
                  }
                }
              }
            }
          }
        }
      }

      return filteredShiftsPreview;
    };
    
    if (filterData[0] && (filter.employers.length || filter.place.length)) {
      return updateShifts(shiftsTypes?.shiftTypes);
    }
  
    if (shiftsTypes?.shiftTypes) {
      return shiftsTypes?.shiftTypes;
    }

    return shiftsTypes?.shiftTypes;

  };

  const filteringResource = (data) => {
    if (schedule?.resources) {
      handleGetSchedule({ fromDate: fromDateRef.current });
      const copyObject = cloneDeep(schedule.resources).__wrapped__;
      const a = copyObject.filter((i) => {
        i.children=i.children.filter((j) => {
          let checkShift = false;
          data.shiftType.map((shiftEl) => {
            if (shiftEl.id === j.shiftId) {
              checkShift = true;
            }
          });
          j.children = j.children.filter((k) => {
            let checkPlace = false;
            data.place.map((placeEL) => {
              if (placeEL.id === k.job_type_id) {
                checkPlace = true;
              }
            });
            k.children = k.children.filter((it) => {
              let checkEmployer = false;
              data.employers.map((employer) => {
                if (employer.id === it.employeeId) {
                  checkEmployer = true;
                }
              });
              if (!data.employers.length) { return true; }
              return checkEmployer;
            });
            if (!data.place.length) { return true; }
            return checkPlace;
          });
          if (!data.shiftType.length) { return true; }
          return checkShift;
        });
        return i.children.length;
      });
      if (data.employers.length || data.place.length || data.shiftType.length) {
        setFilterData(a);
      }
      else{
        setFilterData({});
      }
    }
  };

  const handleGetSchedule = ({ nextTimeline = timeline, fromDate = fromDateRef.current }) => {
    let nextFromDate = moment(fromDate);
    if (nextTimeline === TIMELINE.WEEK) {
      nextFromDate = nextFromDate.startOf('isoWeek');
    }

    dispatch(getSchedule({
      companyId,
      timeline: nextTimeline,
      fromDate: nextFromDate.format('YYYY-MM-DD'),
    }));
  };

  const onPlaceSelectFilter = (place) => {
    const arrChecked = place?.filter((i) => i.checked);
    setFilter((prevState) => ({
      ...prevState,
      place: arrChecked,
    }));
  };

  const onShiftSelectFilter = (shift) => {
    const arrChecked = shift?.filter((i) => i.checked);
    setFilter((prevState) => ({
      ...prevState,
      shiftType: arrChecked,
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
  }, [filter]);
  const handleChangeTimeline = (value) => {
    setTimeline(value);
    
    const calendarApi = calendarRef.current?.getApi();
    let send = { nextTimeline: value };
    
    if (!calendarApi?.view?.getCurrentData()?.currentDate)
    {
      send.fromDate = moment(new Date()).format('YYYY-MM-DD');
    }

    handleGetSchedule(send);
  };
  const handleCreateNewShift = () => {
    history.push(`/${companyId}/schedule/shift/create`);
  };
  const handleResourceLabelClassNames = ({ resource }) => {
    const { extendedProps: props } = resource;
    const classes = [];
    if (props.lastShift) {
      classes.push('fc-datagrid-cell-last-shift');
    }

    if (props.lastJobType) {
      classes.push('fc-datagrid-cell-last-job-type');
    }

    if (props.place_id) {
      classes.push('fc-datagrid-cell-place');
    } else if (props.shiftId) {
      classes.push('fc-datagrid-cell-shift');
    } else if (props.job_type_id) {
      classes.push('fc-datagrid-cell-job-type');
    } else if (props.employeeId || props.employeeId == 0) {
      classes.push('fc-datagrid-cell-employee');
    }
    if (props.lastJobType) {
      classes.push('fc-datagrid-cell-last-job-type');
    }
    if (props.employee_type == 3 || props.employee_type == 2){
      classes.push('fc-datagrid-cell-empty');
    }
    return classes;
  };
  const handleEditShift = (shiftId) => {
    history.push(`/${companyId}/schedule/shift/${shiftId}`);
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
    };
  };
  const handleDeleteShift = (shiftId) => {
    dispatch(deleteShift({
      companyId,
      id: shiftId,
      body: getBodyForGetSchedule(),
    }));
  };
  const handleChangeEmployee = ({ employeeId, shiftId, id }) => {
    dispatch(patchChangeEmployee({
      companyId,
      shiftId,
      data: {
        employee_id: employeeId,
        data: id,
      },
      body: getBodyForGetSchedule(),
      id,
    }));
  };
  const handleChangeWorkingTime = ({ shiftId, id, time }) => {
    dispatch(patchChangeTimeline({
      companyId,
      shiftId,

      data: {
        dateTime_start: time.start.format('YYYY-MM-DD HH:mm'),
        dateTime_end: time.end.format('YYYY-MM-DD HH:mm'),
        data: id,
      },
      body: getBodyForGetSchedule(),
      id,
    }));
  };
  const handleDeleteTimeline = ({ id, shiftId }) => {
    dispatch(deleteTimeline({
      companyId,
      shiftId,
      body: getBodyForGetSchedule(),
      id,
    }));
  };
  const addTempEmployees =  (shiftId,employeeId,jobTypeId,eventId) => {
     setmodalAddTempEmployee(data => !data)
      setTempShiftID(shiftId)
    setTempEmployeeID(employeeId)
    setTempJobTypeID(jobTypeId)
    setTempEventID(eventId)
  }

  const addTempEmployeeDispatch = (selectedEmployee) => {
    dispatch(addTempemployee({
              companyId: companyId,
              data: {
                employee_id: selectedEmployee,
                data:tempEventID
              },
              body: getBodyForGetSchedule(),
              shiftId: tempShiftID,
            }
        )
    )
    dispatch(getSchedule({
      companyId,
      timeline,
      fromDate: moment(new Date()).format('YYYY-MM-DD'),
      firstLoading: false,
    }));
  }
  const renderEventContent = ({ event, timeText, view }) => {
    const resourceInfo = event.getResources()[0];

    let shiftId;
    let placeId;
    let employee_Id;
    let jobTypeId;
    let withMenu = false;
    let employeeName;
    let endDay;
    let dayNumber;
    let isCompleted;
    if (resourceInfo.extendedProps.employeeId) {
      [placeId, shiftId] = resourceInfo.id.split('-');
      // const shiftInfo = view.calendar.getResourceById(`${placeId}-${shiftId}`).extendedProps;
      withMenu = true;
      employeeName = resourceInfo.title;
      employee_Id = resourceInfo.extendedProps.employeeId
      shiftId = resourceInfo.extendedProps.shift_id
      jobTypeId = resourceInfo.extendedProps.job_type_id
      endDay = event.endStr
      dayNumber = event._def.extendedProps.day_number
      isCompleted = event._def.extendedProps.is_completed
    }
  
    return (
      <EventContent
        id={event.id}
        shiftId={shiftId}
        resourceId={resourceInfo.id}
        title={event.title}
        employeeName={employeeName}
        timeText={timeText}
        start={event.start}
        newEmployee={event.extendedProps.new_employee}
        oldEmployee={event.extendedProps.old_employee}
        end={event.end}
        viewType={view.type}
        photo={resourceInfo.extendedProps.photo}
        withMenu={withMenu}
        jobTypeName={resourceInfo.extendedProps.job_type_name}
        onChangeEmployee={handleChangeEmployee}
        onChangeWorkingTime={handleChangeWorkingTime}
        onDeleteTimeline={handleDeleteTimeline}
        modalAddTempEmployee={modalAddTempEmployee}
        addEmployee={()=>addTempEmployees(shiftId,employee_Id,jobTypeId,event.id)}
        endDay={endDay}
        isCompleted={isCompleted}
      />
    );
  };
  const renderResourceLabelContent = ({ fieldValue, resource }) => {
    const {
      count,
      photo,
      shiftId,
      employeeId,
      employeesCount,
    } = resource.extendedProps;
    const realCount = employeesCount;

    return (
      <ResourceItem
        title={`${fieldValue} ${realCount ? `(${realCount})` : ''}`}
        photo={photo}
        shiftId={shiftId}
        withMenu={!!shiftId}
        employeeId={employeeId}
        onEditShift={() => handleEditShift(shiftId)}
        onDeleteShift={() => handleDeleteShift(shiftId)}
      />
    );
  };
  const renderResourceAreaHeaderContent = ({ view }) => {
    const viewTitle = view.title?.split(' ')[3]

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
    
    return (
      <ResourceAreaHeader
        title={view.title}
        onClickPrev={handleClickPrev}
        onClickNext={handleClickNext}
      />
    );
  };
  const handleEventChange = ({ event }) => {
    const resourceInfo = event.getResources()[0];
    const [shiftId] = resourceInfo.id.split('-');

    handleChangeWorkingTime({
      id: event.id,
      shiftId,
      time: {
        start: moment(event.start),
        end: moment(event.end),
      },
    });
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
  const handleViewDidMount = () => {
    const container = document.getElementsByClassName('fc-timeline-slots');
    resizeObserverRef.current = new ResizeObserver((item) => {
      const rows = item[0].target.children[0].children[1].children[0].children;
      updateWidthCell(rows);
    }).observe(container[0], { box: 'border-box' });

  };

  useEffect(() => {
    dispatch(getEmployees(companyId));
    dispatch(getJobTypes(companyId));

    dispatch(getSchedule({
      companyId,

      timeline,
      fromDate: moment(new Date()).format('YYYY-MM-DD'),
      firstLoading: true,
    }));
    dispatch(getscheduleSetting(companyId));
    dispatch(loadEmployeesAll(companyId));
    dispatch(getShiftTypes(companyId));

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
            const rows = container[0].firstChild.children[1].children[0].children;
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
      <div className='schedule-screen'>
        <div className='schedule-screen__header'>
          <CustomSelect
            placeholder={t('All job types')}
            buttonLabel={t('Filter')}
            items={jobTypes}
            onChange={onPlaceSelectFilter}
            // onChange={onSkillsSelectChange}
            width='auto'
          />
          <CustomSelect
            placeholder={t('All shifts')}
            buttonLabel={t('Filter')}
            items={filteredShifts()}
            onChange={onShiftSelectFilter}
            // onChange={onSkillsSelectChange}
            width='auto'
          />
          <CustomSelect
            placeholder={t('All employees')}
            buttonLabel={t('Filter')}
            items={employees}
            onChange={onEmployeesSelectFilter}
            width='auto'
          />
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
          {/*<Checkbox*/}
          {/*  onChange={handleChangeOnlyWorkingDays}*/}
          {/*  checked={isOnlyWorkingDays}*/}
          {/*  label={t('Show only working days')}*/}
          {/*/>*/}
          <Button onClick={handleCreateNewShift}>
            {t('Create new shift')}
          </Button>
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
                    resources={Object.values(resources) || resourcesMock}
                    events={schedule.events}
                    onChangeMonth={handleGetSchedule}
                    timesPanel={schedule.timesPanel}
                    withCost={permissions.cost}
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
                          slotLabelFormat: 'ddd DD',
                          slotDuration: '24:00',
                          snapDuration: '6:00',
                        },
                      }}
                      slotMinTime={scheduleSettings.working_at_night ? scheduleSettings.time_view_stats : '00:00:00'}
                      slotMaxTime={workAtNightMode()}
                      resourceOrder='sort'
                      headerToolbar={false}
                      aspectRatio={1}
                      height='100%'
                      agendaEventMinHeight={90}
                      schedulerLicenseKey='CC-Attribution-NonCommercial-NoDerivatives'
                      resources={resources}
                      events={schedule.events}
                      eventStartEditable={false}
                      eventDurationEditable={timeline === TIMELINE.DAY}
                      eventContent={renderEventContent}
                      resourceAreaHeaderContent={renderResourceAreaHeaderContent}
                      viewDidMount={handleViewDidMount}
                      resourceLabelClassNames={handleResourceLabelClassNames}
                      resourceLabelContent={renderResourceLabelContent}
                      eventResize={handleEventChange}
                      // nowIndicator
                    />
                    {
                      (modalAddTempEmployee)
                          ?<AddTempEmployee
                              setmodalAddTempEmployee={setmodalAddTempEmployee}
                              addTempEmployeeDispatch={addTempEmployeeDispatch}
                          />
                          : ''
                    }
                    <Tooltip
                      id='time'
                      className='schedule-screen__tooltip'
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
                      withCost={permissions.cost}
                    />
                  </>
                )
              }
            </>
          )
        }
        {
          (isLoading) && (
            <div className='schedule-screen__overlay-loading'>
              <Progress/>
            </div>
          )
        }
        <div/>
      </div>
    </MainLayout>
  );
};
