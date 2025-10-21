import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
} from 'react';
import {useParams, useLocation, useHistory} from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import Switch from 'react-switch';
import moment from 'moment';

import MainLayout from '../../../components/Core/MainLayout';
import Tooltip from '../../../components/Core/Tooltip';
import Button from '../../../components/Core/Button/Button';
import InputSelect from '../../../components/Core/InputSelect';
import Progress from '../../../components/Core/Progress';
import Input from '../../../components/Core/Input/Input';
import Label from '../../../components/Core/InputLabel';
import PopupSave from './PopupSave';
import { getPlaces } from '../../../store/places/actions';
import { getSettingWorkTime, actionCreatePlace } from '../../../store/settings/actions';
import { getJobTypes } from '../../../store/jobTypes/actions';
import { getEmployees } from '../../../store/employees/actions';
import {
  postShift,
  getShift,
  putShift,
  resetShift,
} from '../../../store/schedule/actions';
import { placesSelector } from '../../../store/places/selectors';
//import { copyToolHistorySelector } from '../../../store/copyTool/selectors';
import { settingWorkTime, isLoadingSelector } from '../../../store/settings/selectors';
import { jobTypesSelector } from '../../../store/jobTypes/selectors';
import { employeesSelector } from '../../../store/employees/selectors';
import { postShiftIsLoadingSelector, shiftSelector } from '../../../store/schedule/selectors';
import usePermissions from '../../../components/Core/usePermissions';
import { COLORS_SHIFT } from '../../../const';
import ErrorModal from 'components/Core/Dialog/ErrorModal';
import { companyModules } from '../../../store/company/selectors';
import { getCompanySkills } from '../../../api';

import CopyTool from './../CopyTool';
import DatePicker from './DatePicker';
import ButtonsField from './ButtonsField';
import Table from './Table';
import DemanToolForm from './DemandToolForm';
import classes from './Shift.module.scss';

const makeShiftForOptions = [
  {
    label: 'One week',
    value: 1,
  },
  {
    label: 'Two weeks',
    value: 2,
  },
  {
    label: 'Three weeks',
    value: 3,
  },
  {
    label: 'Four weeks',
    value: 4,
  },
];
const weekMock = [
  {
    id: 1,
    label: 'Monday',
    checked: false,
  },
  {
    id: 2,
    label: 'Tuesday',
    checked: false,
  },
  {
    id: 3,
    label: 'Wednesday',
    checked: false,
  },
  {
    id: 4,
    label: 'Thursday',
    checked: false,
  },
  {
    id: 5,
    label: 'Friday',
    checked: false,
  },
  {
    id: 6,
    label: 'Saturday',
    checked: false,
  },
  {
    id: 7,
    label: 'Sunday',
    checked: false,
  },
];

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
    name: 'hybrid_mode',
    module: 'hybrid_mode',
  },
  {
    name: 'demand_tool',
    module: 'demand_tool',
  }
];

export default () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { id: companyId, shiftId } = useParams();
  const { pathname } = useLocation();
  const tableRef = useRef(null);

  const [colorShift, setColorShift] = useState(COLORS_SHIFT.bright[0]);
  const [selectedPlace, setSelectedPlace] = useState('');
  const [shiftName, setShiftName] = useState('');
  const [templateSchedule, setTemplateSchedule] = useState(true); // TODO: default true, need to change to false
  const [useDemandTool, setUseDemandTool] = useState(true); // TODO: default true, need to change to false
  const [excludeHolidays, setExcludeHolidays] = useState(false);
  const [minusHour, setMinusHour] = useState(false);
  const [numberOfWeeks, setNumberOfWeeks] = useState(1);
  const [startShiftFrom, setStartShiftFrom] = useState(moment());
  const [customWorkingTime, setCustomWorkingTime] = useState(true);
  const [saveChanges, setSaveChanges] = useState('');
  const [saveErrorModal, setSaveErrorModal] = useState(false);
  const places = useSelector(placesSelector);
  const workTime = useSelector(settingWorkTime);
  const allJobTypes = useSelector(jobTypesSelector);
  const employees = useSelector(employeesSelector);
  const isLoading = useSelector(isLoadingSelector);
  const isLoadingPostShift = useSelector(postShiftIsLoadingSelector);
  const shift = useSelector(shiftSelector);
  const permissions = usePermissions(permissionsConfig);
  const history = useHistory();
  const modules = useSelector(companyModules);
  const copyToolRef = useRef();
  //const copyToolHistory = useSelector(copyToolHistorySelector);
  const [copyTool,setCopyTool] = useState(false)
  const [copyToolTime,setCopyToolTime] = useState({})
  const [demandToolData, setDemandToolData] = useState({0: []})
  const [skills, setSkills] = useState([])

  const isCreate = useMemo(() => {
    const pathnameArr = pathname.split('/');
    return pathnameArr[4] === 'create';
  }, [pathname]);
  const initialValues = useMemo(() => {
    if (shift && !isCreate) {
      const sevenDays = new Array(7).fill();
      const parseEvents = (prevEvents, defaultJobTime) => Object.keys(prevEvents)
        .reduce((acc, week) => {

          acc[week] = prevEvents[week].map((event) => {
              if (!defaultJobTime[week]) defaultJobTime[week] = [];

              if (!defaultJobTime[week].find((item) => item.resourceId.toString() === event.resourceId.toString().split('-')[0])) {
                defaultJobTime[week].push({
                  resourceId: event.resourceId.toString().split('-')[0],
                  data: [],
                })
              }

              return {
                ...event,
                data: sevenDays.map((item, indexDay) => {
                  const foundItem = event.data.find((itemJ) => itemJ.day === indexDay);

                  let time;
                  if (foundItem) {
                    time = foundItem;
                  } else {
                    time = {
                      day: indexDay,
                      start: '08:00',
                      end: '17:00',
                      not_work: false,
                    };
                  }
                  return {
                    id: `${indexDay}`,
                    time,
                  };
                }),
              }
            }
          );
          
          if (defaultJobTime[week]) {
            defaultJobTime[week] = defaultJobTime[week].map(defaultJob => {
              acc[week].unshift({
                ...defaultJob,
                job: true,
                data: sevenDays.map((item, indexDay) => {
                  const foundItem = defaultJob.data.find((itemJ) => itemJ.day === indexDay);

                  let time;
                  if (foundItem) {
                    time = foundItem;
                  } else {
                    time = {
                      day: indexDay,
                      start: '08:00',
                      end: '17:00',
                      not_work: false,
                    };
                  }
                  return {
                    id: `${indexDay}`,
                    time,
                  };
                }),
              });

              return defaultJob;
            });
          }

          return acc;
        }, {});
      let data;
      if (shift.shift_info.custom_time) {
        data = parseEvents(shift.events, shift.defaultJobTime)
       
      } else {
        data = new Array(shift.shift_info.week_count).fill().reduce((acc, _, indexWeek) => {
          acc[indexWeek] = shift.resources.reduce((accJ, item) => {
            item.children.forEach((child) => {
              accJ.push({
                resourceId: child.id,
                data: weekMock.map((dayOfWeek, indexDay) => {
                  const foundItem = shift.defaultTime[indexWeek]
                    .find((itemJ) => (itemJ.day_of_week === (dayOfWeek.id - 1)));

                  const day = {
                    id: `defaultWorkingTime-${indexDay}`,
                    time: { day: indexDay },
                  };

                  if (foundItem) {
                    day.time.start = foundItem.start;
                    day.time.end = foundItem.end;
                  } else {
                    day.time.start = '08:00';
                    day.time.end = '17:00';
                  }

                  return day;
                }),
              });
            });

            return accJ;
          }, []);
          return acc;
        }, {});
      }

      return {
        shift_info: shift.shift_info,
        timesPanel: shift.timesPanel,
        resources: shift.resources.map((item) => ({
          id: item.id,
          title: item.title,
          jobTypeId: item.job_type_id,
          expander: true,
          children: item.children.map((itemJ) => ({
            employeeId: itemJ.employee_id,
            id: itemJ.id,
            photo: itemJ.photo,
            title: itemJ.title,
            empty: itemJ.empty,
          })),
        })),
        data: data,
      };
    }

    return undefined;

    // eslint-disable-next-line
  }, [shift]);

  const selectedDemandData = Object.entries(demandToolData).reduce((acc, [weekIndex, weekData]) => {
    const selectedDay = weekData.find(day => day.checked)
    if (selectedDay) {
      acc = {
        weekIndex: Number(weekIndex),
        ...selectedDay
      }
    }
    return acc
  }, null)

  const handleChangePlace = (event) => {
    setSelectedPlace(event.target.value);
  };
  const handleClose = () => {
    setSaveChanges(false);
  };
  const handleChangeShiftName = (event) => {
    setShiftName(event.target.value);
  };
  const handleChangeTemplateSchedule = (checked) => {
    setTemplateSchedule(checked); 
  };
  const handleChangeDemandTool = (checked) => {
    setUseDemandTool(checked);
  }
  const handleChangeExcludeHolidays = (checked) => {
    setExcludeHolidays(checked);
  };
  const handleChangeMinusHour = (checked) => {
    setMinusHour(checked);
  };
  const handleCreatePlace = (placeName) => {
    dispatch(actionCreatePlace({ name: placeName }, companyId));

    if (saveChanges === 'create_place') {
      setSaveChanges(false);
    }
  };
  const handleCopyTool = (time) => {
    setCopyToolTime(time)
    setCopyTool(!copyTool);
  }
  const handleAddHistory = (data) => {
    copyToolRef.current.addHistory(data);
  }
  const handleSaveShift = (values = {}) => {
    const {
      events,
      resources,
      daysOfWeek,
      defaultWorkingTime,
    } = tableRef.current;
    const parseEvents = (prevEvents) => Object.keys(prevEvents)
      .reduce((acc, week) => {
        if (numberOfWeeks * 1  > week * 1) {
          // eslint-disable-next-line
          acc[week] = prevEvents[week].map((event) => ({
            ...event,
            // eslint-disable-next-line
            data: event.data.reduce((accJ, item, indexDay) => {
              if (daysOfWeek[week]) {
                const currentDayOfWeek = daysOfWeek[week][indexDay];
                if (currentDayOfWeek.checked && !currentDayOfWeek.disabled) {
                  accJ.push({
                    ...item.time,
                    day: indexDay,
                  });
                }
                return accJ;
              }
            }, []),
          }));
        }
          return acc;
      }, {});
    const parseDefaultTime = (prevDefaultTime) => Object.keys(prevDefaultTime)
      .reduce((acc, week) => {
        acc[week] = prevDefaultTime[week].reduce((accJ, defaultTime, index) => {
          const currentDayOfWeek = daysOfWeek[week][index];
          if (currentDayOfWeek.checked && !currentDayOfWeek.disabled) {
            accJ.push({
              day_of_week: defaultTime.time.day,
              start: defaultTime.time.start,
              end: defaultTime.time.end,
            });
          }
          return accJ;
        }, []);
        return acc;
      }, {});
    const parseDaysOfWeek = (prevDaysOfWeek) => Object.keys(prevDaysOfWeek)
      .reduce((acc, week) => {
        acc[week] = prevDaysOfWeek[week].reduce((accJ, item) => {
          // eslint-disable-next-line no-param-reassign
          accJ[item.id - 1] = item.checked;
          return accJ;
        }, {});
        return acc;
      }, {});

    let submitEvents = customWorkingTime ? parseEvents(events) : {}
    if (modules?.manual_mode && !templateSchedule) {
      // eslint-disable-next-line
      Object.keys(submitEvents).map((key, index) => {
          submitEvents[key] = submitEvents[key].map(item => {
              return {
                ...item,
                data: [
                  {day: 0, start: '00:00', end: '00:00'},
                  {day: 1, start: '00:00', end: '00:00'},
                  {day: 2, start: '00:00', end: '00:00'},
                  {day: 3, start: '00:00', end: '00:00'},
                  {day: 4, start: '00:00', end: '00:00'},
                  {day: 5, start: '00:00', end: '00:00'},
                  {day: 6, start: '00:00', end: '00:00'},
                ]
              }
            }
          );
        }
      );
    }

    let emptyEvents = {};
    // eslint-disable-next-line
    Object.keys(submitEvents).map((key, index) => {
      emptyEvents[key] = submitEvents[key].map(item => {
          return {
            ...item,
            data: [
              {day: 0, start: '00:00', end: '00:00'},
              {day: 1, start: '00:00', end: '00:00'},
              {day: 2, start: '00:00', end: '00:00'},
              {day: 3, start: '00:00', end: '00:00'},
              {day: 4, start: '00:00', end: '00:00'},
              {day: 5, start: '00:00', end: '00:00'},
              {day: 6, start: '00:00', end: '00:00'},
            ]
          }
        }
      );
    });

    const dataResources = resources.map((item) => {
      let childrens = item.children.map((itemJ) => ({
        id: itemJ.id,
        employee_id: itemJ.employeeId,
      }))

      if (modules?.manual_mode && !templateSchedule) {
        childrens = childrens.filter(i => i.employee_id)
      }

      return {
        id: item.id,
        job_type_id: item.jobTypeId,
        children: childrens
      }
    });

    const data = {
      shift_info: {
        name: shiftName || values.shiftName,
        place_id: selectedPlace || values.placeId,
        template_schedule: templateSchedule,
        exclude_holidays: excludeHolidays,
        minus_hour: minusHour,
        color_shift: colorShift,
        date_start: (modules?.manual_mode && !templateSchedule) ? startShiftFrom.startOf('isoWeek').format('YYYY-MM-DD HH:mm') : startShiftFrom.format('YYYY-MM-DD HH:mm'),
        custom_time: Number(customWorkingTime),
        company_id: companyId, // ?
        week_count: numberOfWeeks,
        working_setting: parseDaysOfWeek(daysOfWeek),
        defaultTime: parseDefaultTime(defaultWorkingTime),
      },
      events: submitEvents,
      emptyEvents: emptyEvents,
      resources: dataResources,
    };

    const existJob = data.resources.find(i => i.job_type_id);
    const existEmployee = data.resources.find(i => i.children.find(c => c.employee_id));

    if (existJob && existEmployee) {
      if (isCreate) {
        dispatch(postShift({ companyId, data }));
      } else {
        dispatch(putShift({ companyId, data, id: shiftId }));
      }

      //tmp fix, need set in to (.then), when request come back.
      setTimeout(() => { saveChangesRoute() }, 2000);

      setSaveChanges('');
    } else {
      setSaveErrorModal(!existJob ? 'job' : 'employee')
    }
  };
  const handleChangeNumberOfWeeks = (value) => {
    setNumberOfWeeks(value);
    tableRef.current.updateCountOfWeeks(value);
  };
  const handleChangeStartDay = (value) => {
    setStartShiftFrom(value);
    if (tableRef?.current) {
      tableRef.current.updateStartDay(value);
    }
  };

  const saveChangesRoute = () =>{
      history.push(`/${companyId}/schedule`);
  }

  const handleSaveChanges = () => {

    if (selectedPlace && shiftName) {
      handleSaveShift();
    } else {
      setSaveChanges(true);
    }
  };
  const handleCopyToolSave = (data) => {
    if (tableRef?.current) {
      tableRef.current.updateData(data);
    }
  }

  useEffect(() => {
    getCompanySkills(companyId).then(res => {
      if (Array.isArray(res?.skills)) {
        setSkills(res.skills)
      }
    })

    if (history.action === 'POP') {
      // window.location.href = `/${companyId}/schedule`; // TODO: remove this line after testing
    }

    dispatch(getPlaces(companyId)).then(({ data }) => {
      if (!data.length) {
        setSaveChanges('create_place');
      }
    });
    dispatch(getJobTypes(companyId));
    dispatch(getEmployees(companyId));
    dispatch(getSettingWorkTime(companyId));

    if (!isCreate) {
      dispatch(getShift({ companyId, shiftId }));
    }
    
    return () => {
      dispatch(resetShift());
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  useEffect(() => {
    if (initialValues) {
      setShiftName(initialValues.shift_info.name);
      setColorShift(initialValues.shift_info.color_shift);
      setSelectedPlace(initialValues.shift_info.place.id);
      setTemplateSchedule(initialValues.shift_info.template_schedule);
      setExcludeHolidays(initialValues.shift_info.exclude_holidays);
      setMinusHour(initialValues.shift_info.minus_hour);
      setCustomWorkingTime(true);
      setNumberOfWeeks(initialValues.shift_info.week_count);
    }
  }, [initialValues]);
  useEffect(() => {
    if (workTime.work_time.work_days) {
      if (isCreate) {
        const days = workTime.work_time.work_days?.days ?? [];

        // это создание, значит тянем онли с work_time
        const week = weekMock.reduce((acc, item, index) => {
          acc[index] = days.some((itemJ) => (itemJ.day === item.id));
          return acc;
        }, {});
        const workingSetting = {
          0: week,
          1: week,
          2: week,
          3: week,
        };

        const defaultWorkingTime = weekMock.map((item, index) => {
          const foundItem = days.find((itemJ) => (itemJ.day === item.id));

          if (foundItem) {
            return {
              id: `defaultWorkingTime-${index}`,
              time: {
                day: index,
                start: foundItem.start,
                end: foundItem.finish,
              },
            };
          }

          return {
            id: `defaultWorkingTime-${index}`,
            time: {
              day: index,
              start: '08:00',
              end: '17:00',
            },
          };
        });
        const defaultTime = {
          0: defaultWorkingTime,
          1: defaultWorkingTime,
          2: defaultWorkingTime,
          3: defaultWorkingTime,
        };

        const workingDaysMap = days.reduce((acc, day) => ({
          ...acc,
          [day.day]: {
            start: day.start,
            end: day.finish
          },
        }), {})

        const workingDays = weekMock.map((day) => ({
          ...day,
          defaultTimes: workingDaysMap[day.id],
          jobTypes: {},
        }))

        const demandToolData = {
          0: workingDays,
          1: workingDays,
          2: workingDays,
          3: workingDays,
        }

        setDemandToolData(demandToolData);

        if (tableRef?.current) {
          tableRef.current.updateDefaultWorkingTime(workingSetting, defaultTime);
          
        }
        handleChangeStartDay(moment());
      } else if (shift) {
        // это редактирование и шифт уже загружен, значит тянем шифта и с ворк тайми
        handleChangeStartDay(moment(shift.shift_info.date_start));
        const days = workTime.work_time.work_days?.days ?? [];

        const defaultTime = new Array(4).fill().reduce((acc, _, index) => {
          acc[index] = weekMock.map((item, indexDay) => {

            //take default one for now
            const foundItemDefault = days.find((itemJ) => (itemJ.day === indexDay+1));

            if (foundItemDefault) {
              return {
                id: `defaultWorkingTime-${indexDay}`,
                time: {
                  day: indexDay,
                  start: foundItemDefault.start,
                  end: foundItemDefault.finish,
                },
              };
            }

            const foundItem = shift.defaultTime[index]?.find((itemJ) => (itemJ.day_of_week === indexDay));

            if (foundItem) {
              return {
                id: `defaultWorkingTime-${indexDay}`,
                time: {
                  day: indexDay,
                  start: foundItem.start,
                  end: foundItem.end,
                },
              };
            }

            return {
              id: `defaultWorkingTime-${indexDay}`,
              time: {
                day: indexDay,
                start: '08:00',
                end: '17:00',
              },
            };
          });
          return acc;
        }, {});
        const workingSetting = shift.working_setting;

        if (tableRef?.current) {
          tableRef.current.updateDefaultWorkingTime(workingSetting, defaultTime);
          tableRef.current.updateStartDay(moment(initialValues.shift_info.date_start));
        }
        // todo после ухода с экрана, нужно не забыть зачистить шифт,
        //  так как по этому условию будет подходить старый шифт
      }
    }
    // eslint-disable-next-line
  }, [workTime, shift]);

  const updateDemandDayData = (currentWeek, dayData) => {
    return Object.entries(demandToolData).reduce((acc, [weekIndex, weekData]) => {
      if (Number(weekIndex) === currentWeek) {
        const updatedWeekData = weekData.map(day => day.id === dayData.id ? dayData : day)
        return {
          ...acc,
          [currentWeek]: updatedWeekData,
        }
      }
      return acc
    }, demandToolData)
  }

  const handleSelectDemandToolDay = (currentWeek, item, value) => {
    const updated = Object.entries(demandToolData).reduce((acc, [weekIndex, weekData]) => {
      return {
        ...acc,
        [weekIndex]: weekData.map(day => ({...day, checked: (item.id === day.id && Number(weekIndex) === currentWeek) ? value : false})),
      }
    }, demandToolData)

    setDemandToolData(updated)
  }

  const handleChangeDemandShifts = (weekIndex, data) => {
    const updated = updateDemandDayData(weekIndex, data)
    setDemandToolData(updated)
  }

  const handleChangeWeekDays = (weekDays) => {
    const updated = Object.entries(demandToolData).reduce((acc, [weekIndex, weekData]) => {
      const updatedWeekData = weekData.map((day, j) => ({
        ...day,
        active: weekDays[weekIndex][j],
      }))
      return {
        ...acc,
        [weekIndex]: updatedWeekData,
      }
    }, demandToolData)
    setDemandToolData(updated)
  }

  
  const demandToolPlainData = Object.entries(demandToolData).filter(([weekIndex]) => weekIndex < numberOfWeeks).reduce((acc, [weekIndex, days]) => {
    return {
      ...acc,
      [weekIndex]: days.filter(d => d.active).map(d => {
        return {
          id: d.id,
          label: d.label,
          jobTypes: d.jobTypes,
        }
      })
    }
  }, {})

  console.log('numberOfWeeks -> ', numberOfWeeks)

  return (
    <MainLayout>
      <div className={classes.header}>
        <span className={classes.header__title}>
          {isCreate ? t('Create New Shift') : t('Edit Shift')}
        </span>
        {
          permissions.demand_tool || true // TODO: remove this true when permissions will work
            ? <div className={classes.checkButton}>
                <Label text={t('Use demand tool')} />
                <Switch
                  onChange={handleChangeDemandTool}
                  offColor='#808F94'
                  onColor='#0085FF'
                  uncheckedIcon={false}
                  checkedIcon={false}
                  name='demand_tool'
                  checked={useDemandTool}
                  height={21}
                  width={40}
                />
              </div>
            : null
        }
        {
          (permissions.hybrid_mode && isCreate) ? (
            <div className={classes.checkButton}>
              <Label text={t('Use automatic schedule')} />
              <Switch
                onChange={handleChangeTemplateSchedule}
                offColor='#808F94'
                onColor='#0085FF'
                uncheckedIcon={false}
                checkedIcon={false}
                name='template_schedule'
                checked={templateSchedule}
                height={21}
                width={40}
              />
            </div>
          ) : null
        }
        <Input
          placeholder={t('Enter Shift Name')}
          value={shiftName}
          name='place'
          onChange={handleChangeShiftName}
        />
        <InputSelect
          id='place-select'
          labelId='country'
          name='country'
          placeholder={t('Select place')}
          value={selectedPlace}
          onChange={handleChangePlace}
          options={places}
          className={classes.placeSelect}
          valueKey='id'
          labelKey='name'
        />
        <Button onClick={handleSaveChanges}>
          {t('Save Changes')}
        </Button>
      </div>
      { (!modules?.manual_mode || templateSchedule) && (<div className={classes.options}>
          <div className={classes.header__dayButtons}>
          <ButtonsField
            onChange={handleChangeNumberOfWeeks}
            value={numberOfWeeks}
            label={`${t('Make shift for')}:`}
            options={makeShiftForOptions.map(item => { return {...item, label: t(item.label)}})}
          />
          {
            templateSchedule && (
            <div className={classes.checkButton}>
              <Label text={t('Exclude bank holidays')} />
              <Switch
                onChange={handleChangeExcludeHolidays}
                offColor='#808F94'
                onColor='#0085FF'
                uncheckedIcon={false}
                checkedIcon={false}
                name='exclude_holidays'
                checked={excludeHolidays}
                height={21}
                width={40}
              />
            </div>
          )
          }
          {
            templateSchedule && excludeHolidays && (
            <div className={classes.checkButton}>
              <Label text={t('-1h before holidays')} />
              <Switch
                onChange={handleChangeMinusHour}
                offColor='#808F94'
                onColor='#0085FF'
                uncheckedIcon={false}
                checkedIcon={false}
                name='minus_hour'
                checked={minusHour}
                height={21}
                width={40}
              />
            </div>
          )
          }
          </div>
          <DatePicker
            label={`${t('Start Shift From')}:`}
            value={startShiftFrom}
            onChange={handleChangeStartDay}
          />
          <div className={classes.options__switch}>
            {t('Use custom working time')}
            <Tooltip title={t('Use custom working time')} />
            <Switch
              onChange={setCustomWorkingTime}
              offColor='#808F94'
              onColor='#0085FF'
              uncheckedIcon={false}
              checkedIcon={false}
              checked={customWorkingTime}
              height={21}
              width={40}
            />
          </div>
        </div>)
      }
      {
        (isLoading || !workTime.work_time.work_days || (!shift && !isCreate)) ? (
          <Progress />
        ) : (
          <Table
            ref={tableRef}
            numberOfWeeks={numberOfWeeks}
            customWorkingTime
            workTime={workTime}
            allJobTypes={allJobTypes}
            employees={employees}
            startShiftFrom={startShiftFrom}
            initialValues={initialValues}
            isCreate={isCreate}
            withCost={permissions.cost && permissions.schedule_costs}
            handleCopyTool={handleCopyTool}
            handleAddHistory={handleAddHistory}
            copyTool={copyTool}
            templateSchedule={templateSchedule}
            useDemandTool={useDemandTool}
            demandToolData={demandToolData}
            onSelectDemandToolDay={handleSelectDemandToolDay}
            onChangeWeekDays={handleChangeWeekDays}
          />
        )
      }
      {
        saveChanges && (
          <PopupSave
            saveChanges={saveChanges}
            places={places}
            shiftName={shiftName}
            selectedPlace={selectedPlace}
            onClose={handleClose}
            onCreatePlace={handleCreatePlace}
            onSaveShift={handleSaveShift}
          />
        )
      }
      {
        isLoadingPostShift && (
          <div className={classes.loading}>
            <Progress />
          </div>
        )
      }
      {
        saveErrorModal && (
          <ErrorModal 
            header={`${t('Missing Schedule Data')}`}
            text={saveErrorModal === 'job' ? `${t('None of work places has been created')}` : `${t('Please choose employee')}`}
            onClose={() => { setSaveErrorModal(false) }}
          />
        )
      }
      {
        (copyTool) && (
          <CopyTool
            ref={copyToolRef}
            start={copyToolTime.start || null}
            end={copyToolTime.end || null}
            onClose={handleCopyTool}
            shiftEdit={true}
            onSave={handleCopyToolSave}
          />
        )
      }
      <DemanToolForm
        active={Boolean(selectedDemandData)}
        data={selectedDemandData}
        weeksCount={numberOfWeeks}
        jobTypes={allJobTypes}
        skills={skills}
        onClose={handleSelectDemandToolDay}
        onChange={handleChangeDemandShifts} />
    </MainLayout>
  );
};
