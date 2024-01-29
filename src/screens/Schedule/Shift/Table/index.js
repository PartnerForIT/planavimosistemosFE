import React, {
  useState,
  useCallback,
  useMemo,
  useRef,
  useImperativeHandle,
  forwardRef,
} from 'react';
import { useTranslation } from 'react-i18next';
import classnames from 'classnames';
import moment from 'moment';
import { useSelector } from 'react-redux';

import TimeRangePicker from '../TimeRangePicker';
import Header from './Header';
import Footer from './Footer';
import AddJobType from './AddJobType';
import SectionEmpty from './SectionEmpty';
import Section from './Section';
import DefaultShiftTime from './DefaultShiftTime';
import classes from './Table.module.scss';
import { companyModules } from '../../../../store/company/selectors';
import { copyToolHistorySelector } from '../../../../store/copyTool/selectors';

/*
data: [
resourceId: '',
times: []
]
 */

/* consts */

const cellArr = new Array(7).fill().map((_, index) => ({ id: index }));
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
const daysOfWeekInitial = {
  0: weekMock,
  1: weekMock,
  2: weekMock,
  3: weekMock,
};
const initialData = {
  0: [],
  1: [],
  2: [],
  3: [],
};
const initialTimesPanel = {
  0: {},
  1: {},
  2: {},
  3: {},
};

const ResourcesCell = ({
  title,
  expander,
  withExpander,
  onExpander,
  withNumberInput,
  items,
  main,
  rowId,
  parentRowId,
  employees,
  relatives,
  onSubmit,
  countChildren,
  onChangeNumber,
  onDelete,
  parentTitle,
  avatar,
  empty,
}) => {
  const rowClasses = classnames(classes.table__content__resources__cell, {
    [classes.table__content__resources__cell_main]: main,
    [classes.table__content__resources__cell_children]: !main,
  });

  const handleChangeNumber = useCallback((value) => {
    onChangeNumber({ rowId, value });
  }, [rowId]);
  const handleSubmit = useCallback((values) => {
    onSubmit({
      items: values,
      parentRowId,
    });
  }, [onSubmit, parentRowId]);
  const handleExpander = useCallback(() => {
    onExpander({ rowId });
  }, [rowId]);
  const handleDelete = useCallback(() => {
    onDelete({ rowId, parentRowId });
  }, [rowId, parentRowId]);
  
  return (
    <>
      <div className={rowClasses}>
        {
          (title && !empty) ? (
            <Section
              title={title}
              avatar={avatar}
              onExpander={handleExpander}
              expander={expander}
              withExpander={withExpander}
              withNumberInput={withNumberInput}
              count={countChildren}
              onChangeNumber={handleChangeNumber}
              onDelete={handleDelete}
              withMenu
            />
          ) : (
            <SectionEmpty
              employees={employees}
              relatives={relatives}
              onSubmit={handleSubmit}
              jobTypeTitle={parentTitle}
            />
          )
        }
      </div>
      {
        expander && items?.map((item, index) => (
          <ResourcesCell
            key={index}
            rowId={item.id}
            parentRowId={rowId}
            title={item.title}
            avatar={item.photo}
            empty={item.empty}
            withExpander={!!item.children?.length}
            onExpander={onExpander}
            expander={expander}
            relatives={items}
            employees={employees}
            onSubmit={onSubmit}
            onDelete={onDelete}
            parentTitle={title}
          />
        ))
      }
    </>
  );
};

const RowContent = ({
  items,
  resources,
  onDuplicateTimeToRow,
  onDuplicateTimeToColumn,
  onNotWorkToday,
  expander,
  onChange,
  resourceId,
  withDots,
  title,
  avatar,
  disabledCell,
  daysOfWeek,
  defaultWorkingTime,
  currentWeek,
  handleCopyTool,
  handleAddHistory,
  copyTool
}) => {
  const handleChangeTime = useCallback((values) => {
    onChange({
      ...values,
      resourceId,
    });
  }, [resourceId, onChange]);
  const handleDuplicateTimeToRow = useCallback((values) => {
    onDuplicateTimeToRow({
      ...values,
      resourceId,
    });
  }, [resourceId, onDuplicateTimeToRow]);
  const handleDuplicateTimeToColumn = useCallback((values) => {
    onDuplicateTimeToColumn({
      ...values,
      resourceId,
    });
  }, [resourceId, onDuplicateTimeToColumn]);

  const handleNotWorkToday = useCallback((values) => {
    onNotWorkToday({
      ...values,
      resourceId,
    });
  }, [resourceId, onNotWorkToday]);

  const foundItem = useMemo(() => items ? items.find((item) => resourceId.toString() === item.resourceId.toString()) : {}, [items]);
  //console.log('foundItem', foundItem, items, resourceId);

  const rowClasses = classnames(classes.table__content__data__row, {
    [classes.table__content__data__row_jobWorkingTime]: foundItem && foundItem.job,
  });

  return (
    <>
      <div className={rowClasses}>
        {
          foundItem?.data?.map((itemJ, indexJ) => (
            <div key={itemJ.id} className={classes.table__content__data__row__cell}>
              {
                itemJ?.time?.start && daysOfWeek[indexJ].checked && !daysOfWeek[indexJ].disabled && !(foundItem.job && copyTool) && (
                  <TimeRangePicker
                    value={itemJ.time}
                    cellId={indexJ}
                    resourceId={resourceId}
                    onChange={handleChangeTime}
                    // disabled={disabledCell}
                    withDots={withDots}
                    // jobTypeName={jobType}
                    currentWeek={currentWeek}
                    avatar={avatar}
                    fullName={title}
                    onDuplicateTimeToRow={handleDuplicateTimeToRow}
                    onDuplicateTimeToColumn={handleDuplicateTimeToColumn}
                    onNotWorkToday={handleNotWorkToday}
                    disabled={disabledCell}
                    handleCopyTool={handleCopyTool}
                    handleAddHistory={handleAddHistory}
                    copyTool={copyTool}
                  />
                )
              }
            </div>
          ))
        }
      </div>
      {
        expander && resources?.map((item) => (
          <RowContent
            key={item.id}
            items={items}
            resources={item.children}
            resourceId={item.id}
            onDuplicateTimeToRow={onDuplicateTimeToRow}
            onDuplicateTimeToColumn={onDuplicateTimeToColumn}
            onNotWorkToday={onNotWorkToday}
            currentWeek={currentWeek}
            title={item.title}
            avatar={item.photo}
            withDots={withDots}
            onChange={onChange}
            daysOfWeek={daysOfWeek}
            disabledCell={disabledCell}
            defaultWorkingTime={defaultWorkingTime}
            handleCopyTool={handleCopyTool}
            handleAddHistory={handleAddHistory}
            copyTool={copyTool}
          />
        ))
      }
    </>
  );
};
const RowDefaultTimeContent = ({
  items,
  onChange,
  customWorkingTime,
  daysOfWeek,
}) => {
  const rowClasses = classnames(classes.table__content__data__row, {
    [classes.table__content__data__row_defaultWorkingTime]: !customWorkingTime,
    [classes.table__content__data__row_customWorkingTime]: customWorkingTime,
  });

  return (
    <div className={rowClasses}>
      {
        items.map((itemJ, indexJ) => (
          <div
            key={`${itemJ?.time?.start}-${indexJ}`}
            className={classes.table__content__data__row__cell}
          >
            {
              itemJ?.time?.start && daysOfWeek[indexJ].checked && !daysOfWeek[indexJ].disabled && (
                <TimeRangePicker
                  value={itemJ.time}
                  cellId={indexJ}
                  onChange={onChange}
                />
              )
            }
          </div>
        ))
      }
    </div>
  );
};

const trackYProps = {
  renderer: ({ elementRef, ...props }) => (
    <span
      {...props}
      ref={elementRef}
      className={classes.scrollableContent__scrollbarTrackY}
    />
  ),
};

export default forwardRef(({
  numberOfWeeks,
  customWorkingTime,
  allJobTypes,
  employees,
  startShiftFrom,
  withCost,
  initialValues = {
    data: initialData,
    resources: [],
    timesPanel: initialTimesPanel,
  },
  handleCopyTool,
  handleAddHistory,
  copyTool,
}, ref) => {
  const [data, setData] = useState(initialValues.data);
  const [resources, setResources] = useState(initialValues.resources);
  const [daysOfWeek, setDaysOfWeek] = useState(daysOfWeekInitial);
  const [defaultWorkingTime, setDefaultWorkingTime] = useState({ 0: [] });
  const [currentWeek, setCurrentWeek] = useState(0);
  const contentRef = useRef(null);
  const modules = useSelector(companyModules);
  const copyToolHistory = useSelector(copyToolHistorySelector);

  const handleClickPrev = () => {
    setCurrentWeek((prevState) => (prevState - 1));
  };
  const handleClickNext = () => {
    setCurrentWeek((prevState) => (prevState + 1));
  };
  const handleExpander = ({ rowId }) => {
    setResources((prevState) => {
      const foundIndex = prevState.findIndex((item) => item.id === rowId);
      return [
        ...prevState.slice(0, foundIndex),
        {
          ...prevState[foundIndex],
          expander: !prevState[foundIndex].expander,
        },
        ...prevState.slice(foundIndex + 1),
      ];
    });
  };
  const handleDuplicateTimeToRow = ({ time, resourceId }) => {
    setData((prevState) => {
      const foundIndex = prevState[currentWeek].findIndex((item) => item.resourceId === resourceId);

      return {
        ...prevState,
        [currentWeek]: [
          ...prevState[currentWeek].slice(0, foundIndex),
          {
            ...prevState[currentWeek][foundIndex],
            data: prevState[currentWeek][foundIndex].data.map((item, indexDay) => {
              if (!item.time.start) {
                return item;
              }

              return {
                ...item,
                time: {
                  day: indexDay,
                  ...time,
                },
              };
            }),
          },
          ...prevState[currentWeek].slice(foundIndex + 1),
        ],
      };
    });
  };
  const handleDuplicateTimeToColumn = ({ time, cellId }) => {
    const cellIndex = cellId;

    setData((prevState) => ({
      ...prevState,
      [currentWeek]: prevState[currentWeek].map((item) => {
        if (!item.data[cellIndex]) {
          return item;
        }

        return {
          ...item,
          data: [
            ...item.data.slice(0, cellIndex),
            {
              ...item.data[cellIndex],
              time,
            },
            ...item.data.slice(cellIndex + 1),
          ],
        };
      }),
    }));
  };
  const handleNotWorkToday = ({ time, cellId, resourceId}) => {
    const cellIndex = cellId;
    setData((prevState) => {
      
      const mweek = prevState[currentWeek].map((item, index) => {

        if (!item.data[cellIndex] || resourceId != item.resourceId) {
          return item;
        }

        return {
          ...item,
          data: item.data.map((c, i) => (
            {
              ...c,
              time: {
                ...c.time,
                not_work: i === cellIndex ? !c.time.not_work : c.time.not_work
              }
            }
          )),
        }
      })

      return {
      ...prevState,
      [currentWeek]: mweek
    }});
  };
  const handleChangeWeek = (_, checked, event) => {
    const { name } = event.target;
    const columnIndex = name - 1;

    setDaysOfWeek((prevState) => ({
      ...prevState,
      [currentWeek]: [
        ...prevState[currentWeek].slice(0, columnIndex),
        {
          ...prevState[currentWeek][columnIndex],
          checked,
        },
        ...prevState[currentWeek].slice(columnIndex + 1),
      ],
    }));
  };
  const handleChangeTime = ({ time, resourceId, cellId }) => {
    
    const cellIndex = cellId;
    setData((prevState) => {
      
      const mweek = prevState[currentWeek].map((item, index) => {

        if (!item.data[cellIndex] || (resourceId.toString() != item.resourceId.toString() && item.resourceId.toString().indexOf(resourceId+'-') !== 0)){
          return item;
        }

        return {
          ...item,
          data: item.data.map((c, i) => {

            return i === cellIndex ? {
              ...c,
              time: {
                ...time,
                not_work: c.time.not_work
              }
            } : {...c}
          }),
        }
      })

      return {
      ...prevState,
      [currentWeek]: mweek
    }});

    // setData((prevState) => {
    //   const foundIndex = prevState[currentWeek].findIndex((item) => item.resourceId === resourceId);
    //   const cellIndex = cellId;
    //   return {
    //     ...prevState,
    //     [currentWeek]: [
    //       ...prevState[currentWeek].slice(0, foundIndex),
    //       {
    //         ...prevState[currentWeek][foundIndex],
    //         data: [
    //           ...prevState[currentWeek][foundIndex].data.slice(0, cellIndex),
    //           {
    //             ...prevState[currentWeek][foundIndex].data[cellIndex],
    //             time,
    //           },
    //           ...prevState[currentWeek][foundIndex].data.slice(cellIndex + 1),
    //         ],
    //       },
    //       ...prevState[currentWeek].slice(foundIndex + 1),
    //     ],
    //   };
    // });
  };
  const handleChangeDefaultTime = ({ time, cellId }) => {
    const cellIndex = cellId;

    setDefaultWorkingTime((prevState) => ({
      ...prevState,
      [currentWeek]: [
        ...prevState[currentWeek].slice(0, cellIndex),
        {
          ...prevState[currentWeek][cellIndex],
          time,
        },
        ...prevState[currentWeek].slice(cellIndex + 1),
      ],
    }));

    handleDuplicateTimeToColumn({ time, cellId });
  };
  const handleSubmitAddJobTypes = (addJobTypes) => {

    const newData = [];

    setResources((prevState) => [
      ...prevState,
      ...addJobTypes.map((item) => {

        newData.push({
          resourceId: `${item.id}`,
          job: true,
        });

        return {
          title: item.title,
          jobTypeId: item.id,
          expander: true,
          id: item.id,
          children: new Array(item.value || 1).fill().map((_, index) => ({ id: `${item.id}-${index}` })),
      }}),
    ]);

    setData((prevState) => Object.keys(prevState).reduce((acc, item) => {
      if ((+item + 1) <= numberOfWeeks) {
        acc[item] = [
          ...prevState[item],
          ...newData.map((itemJ) => ({
            ...itemJ,
            data: defaultWorkingTime[item],
          })),
        ];
      } else {
        acc[item] = prevState[item];
      }

      return acc;
    }, {}));
  };
  const handleSubmitAddEmployees = useCallback(({ parentRowId, items }) => {
    let currentItemIndex = 0;
    const newData = [];
    setResources((prevState) => {
      const foundIndex = prevState.findIndex((item) => item.id === parentRowId);
      return [
        ...prevState.slice(0, foundIndex),
        {
          ...prevState[foundIndex],
          children: prevState[foundIndex].children.map((item) => {
            if ((!item.title || item.title === 'Empty') && items[currentItemIndex]) {
              currentItemIndex += 1;
              newData.push({
                resourceId: `${prevState[foundIndex].id}-${items[currentItemIndex - 1]?.id}`,
              });

              return {
                ...item,
                employeeId: items[currentItemIndex - 1].id,
                title: items[currentItemIndex - 1].label,
                photo: items[currentItemIndex - 1].photo,
                id: `${prevState[foundIndex].id}-${items[currentItemIndex - 1]?.id}`,
                empty: false,
              };
            }

            return item;
          }),
        },
        ...prevState.slice(foundIndex + 1),
      ];
    });

    setData((prevState) => Object.keys(prevState).reduce((acc, item) => {
      if ((+item + 1) <= numberOfWeeks) {
        
        acc[item] = [
          ...prevState[item],
          ...newData.map((itemJ) => {
            const findJob = prevState[item].find(i => i.resourceId.toString() === itemJ.resourceId.split('-')[0]);

            return {
              ...itemJ,
              data: findJob ? findJob.data : defaultWorkingTime[item],
            }
          }),
        ];
      } else {
        acc[item] = prevState[item];
      }

      return acc;
    }, {}));
  }, [numberOfWeeks, defaultWorkingTime]);
  const handleChangeNumber = ({ rowId, value }) => {
    setResources((prevState) => {
      const foundIndex = prevState.findIndex((item) => item.id === rowId);
      let children;
      if (value > prevState[foundIndex].children.length) {
        children = [
          ...prevState[foundIndex].children,
          {
            id: prevState[foundIndex].children.length,
          },
        ];
      } else if (prevState[foundIndex].children.every((item) => item.title && item.title !== 'Empty')) {
        return prevState;
      } else {
        const foundEmptyLastIndex = prevState[foundIndex].children
          .reduce((acc, curr, index) => ((!curr.title || curr.title === 'Empty') ? index : acc), 0);
        children = [
          ...prevState[foundIndex].children.slice(0, foundEmptyLastIndex),
          ...prevState[foundIndex].children.slice(foundEmptyLastIndex + 1),
        ];
      }

      return [
        ...prevState.slice(0, foundIndex),
        {
          ...prevState[foundIndex],
          children,
        },
        ...prevState.slice(foundIndex + 1),
      ];
    });
  };
  const handleDelete = ({ rowId, parentRowId }) => {
    setResources((prevState) => {
      if (parentRowId) {
        const foundIndexParent = prevState.findIndex((item) => item.id === parentRowId);
        const foundIndex = prevState[foundIndexParent].children.findIndex((item) => item.id === rowId);

        return [
          ...prevState.slice(0, foundIndexParent),
          {
            ...prevState[foundIndexParent],
            children: [
              ...prevState[foundIndexParent].children.slice(0, foundIndex),
              {
                id: `${prevState[foundIndexParent].id}-${foundIndex}`,
              },
              ...prevState[foundIndexParent].children.slice(foundIndex + 1),
            ],
          },
          ...prevState.slice(foundIndexParent + 1),
        ];
      }

      const foundIndex = prevState.findIndex((item) => item.id === rowId);

      return [
        ...prevState.slice(0, foundIndex),
        ...prevState.slice(foundIndex + 1),
      ];
    });
    setData((prevState) => {
      const foundIndex = prevState[currentWeek].findIndex((item) => item.resourceId === rowId);

      return {
        ...prevState,
        [currentWeek]: [
          ...prevState[currentWeek].slice(0, foundIndex),
          ...prevState[currentWeek].slice(foundIndex + 1),
        ],
      };
    });
  };

  const mergeObjects = (obj1, obj2) => {
    let firstObj = JSON.parse(JSON.stringify(obj1));
    const secondObj = [...obj2];
    for (let i in firstObj) {
      const entry = firstObj[i];

      for (let j in entry) {
        const resourceId = entry[j].resourceId;

        secondObj.forEach(updateEntry => {
          if (updateEntry.resourceId.toString() === resourceId.toString() && i*1 === updateEntry.currentWeek*1) {
            const day = updateEntry.day;
            entry[j].data.forEach(dataEntry => {
                if (dataEntry.time && dataEntry.time.day === day) {
                  firstObj[i][j].data[day].time.not_work = false;
                  firstObj[i][j].data[day].time.start = moment(updateEntry.start).format('HH:mm');
                  firstObj[i][j].data[day].time.end = moment(updateEntry.end).format('HH:mm');
                }
            });
          }
        });
      }
    }

    return firstObj;

  }

  useImperativeHandle(ref, () => ({
    events: data,
    resources,
    daysOfWeek,
    defaultWorkingTime,
    updateCountOfWeeks: (countOfWeeks) => {
      if ((countOfWeeks - 1) < currentWeek) {
        setCurrentWeek((countOfWeeks - 1));
      }

      if ((countOfWeeks - 1) > 0) {
        setData((prevState) => {
          const nextState = {};

          // eslint-disable-next-line prefer-destructuring
          nextState[1] = prevState[1].length ? [...prevState[1]] : [...prevState[0]];

          if ((countOfWeeks - 1) > 1) {
            // eslint-disable-next-line prefer-destructuring
            nextState[2] = prevState[2].length ? [...prevState[2]] : [...prevState[0]];
          }
          if ((countOfWeeks - 1) > 2) {
            // eslint-disable-next-line prefer-destructuring
            nextState[3] = prevState[3].length ? [...prevState[3]] : [...prevState[0]];
          }

          return {
            ...prevState,
            ...nextState,
          };
        });
      }
    },
    updateStartDay: (startDay) => {
      setDaysOfWeek((prevState) => {
        const startDayNumber = (moment(startDay).day() || 7);
        return {
          ...prevState,
          0: prevState[0].map((item) => ({
            ...item,
            disabled: item.id < startDayNumber,
          })),
        };
      });
    },
    updateDefaultWorkingTime: (workingSetting, defaultTime) => {
      setDaysOfWeek((prevState) => Object.keys(prevState)
        .reduce((acc, _, indexWeek) => {
          acc[indexWeek] = prevState[indexWeek].map((item, indexDay) => ({
            ...item,
            checked: workingSetting[indexWeek][indexDay],
          }));
          return acc;
        }, {}));

      setDefaultWorkingTime(defaultTime);
    },
    updateData: (copyData) => {
      if (!copyData) return;
      
      setData(mergeObjects(data, copyData));
    }
  }));

  const mergedData = useMemo(() => {
    if (!data || !copyToolHistory) return data;

    return mergeObjects(data, copyToolHistory);

  }, [data, copyToolHistory]);

  const jobTypes = useMemo(() => allJobTypes
    .filter((item) => !resources
      .some((itemJ) => itemJ.jobTypeId === item.id)),
  [resources.length, allJobTypes]);
  const backgroundArr = useMemo(() => {
    const countRows = Math.ceil((window.innerHeight - 68 - 74 - 218) / 41) - 2;
    const countResources = resources.reduce((acc, item) => (acc + 1 + item.children.length ?? 0), 0);
    const count = (countRows > countResources ? countRows : countResources) + 1;

    return new Array(count).fill().map((_, index) => ({ id: `row-background-${index}`, data: cellArr }));
  }, [resources]);
  const timesPanel = useMemo(() => {
    const startDay = startShiftFrom.clone().startOf('isoWeek').add(-1, 'days');
    return Object.keys(initialTimesPanel).reduce((acc, week) => {
      if (week <= numberOfWeeks - 1) {
        const total = {
          children: resources.map((jobType) => {
            const children = jobType.children.reduce((accK, employee) => {
              if (employee.title) {
                const foundEmployee = employees.find((itemE) => itemE.id === employee.employeeId);
                const foundData = mergedData[week] ? mergedData[week].find((itemD) => itemD.resourceId === employee.id) : false;
                const foundEmployeeInsideJob = foundEmployee ? jobType.children.find((itemE) => itemE.employeeId === foundEmployee.id && !itemE.empty) : false;
                if (foundEmployee && foundData && foundEmployeeInsideJob) {
                  accK.push({
                    avatar: employee.photo,
                    employeeId: employee.employeeId,
                    name: employee.title,
                    job_type_name: jobType.title,
                    cost: 0,
                    time: 0,
                  });
                }
              }
              return accK;
            }, []);

            return {
              name: jobType.title,
              jobTypeId: jobType.jobTypeId,
              employeesCount: children.length,
              cost: 0,
              time: 0,
              children,
            };
          }),
          cost: 0,
          time: 0,
        };

        let uniqueEmployees = [];
        let uniqueEmployeePhotos = [];
        
        const weekInfo = weekMock.reduce((accJ, dayOfWeek, indexDay) => {
          let totalDayEmployees = 0;
          let dayTotalTime = 0;
          let dayTotalCost = 0;
          const photos = [];

          const dayInfo = {
            children: resources.map((jobType, index) => {
              const {
                children,
                jobTypeTotalTime,
                jobTypeTotalCost,
              } = jobType.children.reduce((accK, employee, indexJ) => {
                if (employee.title) {
                  if (daysOfWeek[week][indexDay]?.checked && !daysOfWeek[week][indexDay]?.disabled) {
                    const foundEmployee = employees.find((itemE) => itemE.id === employee.employeeId);
                    const foundData = mergedData[week] ? mergedData[week].find((itemD) => itemD.resourceId === employee.id) : false;
                    const foundEmployeeInsideJob = foundEmployee ? jobType.children.find((itemE) => itemE.employeeId === foundEmployee.id && !itemE.empty) : false;
                    if (foundData && foundEmployee && foundEmployeeInsideJob) {
                      const timeStart = foundData.data[indexDay].time.start.split(':');
                      const timeEnd = foundData.data[indexDay].time.end.split(':');
                      const totalTimeStart = +timeStart[0] + timeStart[1] / 60;
                      const totalTimeEnd = +timeEnd[0] + timeEnd[1] / 60;
                      const time = totalTimeEnd > totalTimeStart
                        ? totalTimeEnd - totalTimeStart
                        : totalTimeStart - totalTimeEnd;

                      const cost = time * foundEmployee.profitability.cost;

                      if (!uniqueEmployees.includes(foundEmployee.employeeId)) {
                        uniqueEmployees.push(foundEmployee.employeeId);
                      }

                      if (uniqueEmployeePhotos.length < 2 && !uniqueEmployeePhotos.includes(employee.photo)) {
                        uniqueEmployeePhotos.push(employee.photo);
                      }

                      accK.jobTypeTotalTime += time;
                      accK.jobTypeTotalCost += cost;
                      accK.children.push({
                        avatar: foundEmployee.photo,
                        photo: foundEmployee.photo,
                        employeeId: foundEmployee.employeeId,
                        name: employee.title,
                        title: employee.title,
                        job_type_name: jobType.title,
                        jobTypeId: jobType.id,
                        employee_type: "3",
                        time,
                        cost,
                      });

                      // total

                        if (!total.children[index].children[indexJ]) {
                          total.children[index].children[indexJ] = {cost: 0, time: 0};
                        }
                      
                        total.children[index].children[indexJ].cost += cost;
                        total.children[index].children[indexJ].time += time;
                        total.children[index].cost += cost;
                        total.children[index].time += time;
                        total.cost += cost;
                        total.time += time;

                      if (photos.length < 2 && employee.photo) {
                        photos.push(employee.photo);
                      }
                    }
                  }
                }
                return accK;
              }, {
                children: [],
                jobTypeTotalTime: 0,
                jobTypeTotalCost: 0,
              });

              totalDayEmployees += children.length;
              dayTotalTime += jobTypeTotalTime;
              dayTotalCost += jobTypeTotalCost;

              return {
                name: jobType.title,
                jobTypeId: jobType.jobTypeId,
                employeesCount: children.length,
                children,
                time: jobTypeTotalTime,
                cost: jobTypeTotalCost,
              };
            }),
            employeesCount: totalDayEmployees,
            photos,
            time: dayTotalTime,
            cost: dayTotalCost,
            title: startDay.add(1, 'days').format('dddd MMMM DD'),
          };

          return {
            ...accJ,
            [dayOfWeek.id]: dayInfo,
          };
        }, {});

        total.photos = uniqueEmployeePhotos;
        total.employeesCount = uniqueEmployees.length;

        acc[week] = {
          ...weekInfo,
          total,
        };
      } else {
        acc[week] = {};
      }

      return acc;
    }, {});
  }, [startShiftFrom, employees, resources, data, mergedData, numberOfWeeks, daysOfWeek, currentWeek]);

  const { t } = useTranslation();
  const timesPanelFull = useMemo(() => {
    let res = {};
    
    Object.keys(timesPanel[currentWeek]).map((key) => {
      if (timesPanel[currentWeek][key]) {
        res[key] = {...timesPanel[currentWeek][key]};
        res[key].children = [{...timesPanel[currentWeek][key], id: initialValues?.shift_info?.id, place_id: initialValues?.shift_info?.id, title: ((initialValues?.shift_info?.name) ? initialValues?.shift_info?.name : t('no shift name')), name: ((initialValues?.shift_info?.name) ? initialValues?.shift_info?.name : t('no shift name'))}];
      }
    });

    let resShift = {};
    Object.keys(res).map((key) => {
      if (res[key]) {
        resShift[key] = {...res[key]};
        resShift[key].children = [{...res[key], id: initialValues?.shift_info?.place?.id, place_id: initialValues?.shift_info?.place?.id, title: ((initialValues?.shift_info?.place?.name) ? initialValues?.shift_info?.place?.name : t('no place name')), name: ((initialValues?.shift_info?.place?.name) ? initialValues?.shift_info?.place?.name : t('no place name'))}];
      }
    });

    return resShift;

  }, [startShiftFrom, employees, resources, data, mergedData, numberOfWeeks, daysOfWeek, currentWeek]);
  //console.log('mergedData', mergedData, numberOfWeeks);
  //console.log('resources', resources);
  return (
    <div className={classnames(classes.table, modules?.manual_mode ? classes.table__gray : '')}>
      { !modules?.manual_mode && (
        <Header
          onClickNext={handleClickNext}
          onClickPrev={handleClickPrev}
          daysOfWeek={daysOfWeek}
          onChange={handleChangeWeek}
          makeShiftFor={numberOfWeeks}
          currentWeek={currentWeek}
        />
        )
      }
        <>
          <div className={classes.table__content} ref={contentRef}>
            <div className={classes.table__content__resources}>
              <div className={classes.table__content__resources__cell}>
                <DefaultShiftTime />
              </div>
              <div className={classes.table__content__resources__cell}>
                <AddJobType
                  allJobTypes={jobTypes}
                  onSubmit={handleSubmitAddJobTypes}
                />
              </div>
              {
                resources.map((item, index) => (
                  <ResourcesCell
                    title={item.title}
                    key={item.id}
                    items={item.children}
                    expander={item.expander}
                    onExpander={handleExpander}
                    withExpander={!!item.children?.length}
                    withNumberInput
                    countChildren={item.children?.length}
                    rowId={item.id}
                    index={index + (index > 0 ? (resources[index - 1].children?.length || 0) : 0)}
                    employees={employees}
                    onSubmit={handleSubmitAddEmployees}
                    onChangeNumber={handleChangeNumber}
                    onDelete={handleDelete}
                    numberOfWeeks={numberOfWeeks}
                    main
                  />
                ))
              }
            </div>
            
            { !modules?.manual_mode && (
              <div className={classes.table__content__data}>
                <RowDefaultTimeContent
                  items={defaultWorkingTime[currentWeek]}
                  onChange={handleChangeDefaultTime}
                  customWorkingTime={customWorkingTime}
                  daysOfWeek={daysOfWeek[currentWeek]}
                />
                <div className={classes.table__content__data__row} />
                {
                  resources.map((item) => (
                    <RowContent
                      key={`${currentWeek}-${item.id}`}
                      title={item.title}
                      items={mergedData[currentWeek]}
                      resources={item.children}
                      expander={item.expander}
                      resourceId={item.id}
                      currentWeek={currentWeek}
                      onChange={handleChangeTime}
                      onDuplicateTimeToRow={handleDuplicateTimeToRow}
                      onDuplicateTimeToColumn={handleDuplicateTimeToColumn}
                      onNotWorkToday={handleNotWorkToday}
                      disabledCell={!customWorkingTime}
                      daysOfWeek={daysOfWeek[currentWeek]}
                      defaultWorkingTime={defaultWorkingTime[currentWeek]}
                      withDots
                      handleCopyTool={handleCopyTool}
                      handleAddHistory={handleAddHistory}
                      copyTool={copyTool}
                    />
                  ))
                }
              </div>
            )
          }
          </div>
          { !modules?.manual_mode && (
            <div className={classes.table__background}>
              {backgroundArr.map((item) => (
                <div key={`cell-background-${item.id}`} className={classes.table__background__row}>
                  <div className={classes.table__background__row__resource} />
                  {
                    item.data.map((itemJ) => (
                      <div key={itemJ.id} className={classes.table__background__row__cell} />
                    ))
                  }
                </div>
              ))}
            </div>
          )
          }
        </>
      { !modules?.manual_mode && 
        (<Footer
          timesPanel={timesPanelFull}
          daysOfWeek={daysOfWeek[currentWeek]}
          withCost={withCost}
        />)
      }
    </div>
  );
});
