import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
  useImperativeHandle,
  forwardRef,
} from 'react';
import classnames from 'classnames';
import moment from 'moment';
import Scrollbar from 'react-scrollbars-custom';

import TimeRangePicker from '../TimeRangePicker';
import Header from './Header';
import Footer from './Footer';
import AddJobType from './AddJobType';
import SectionEmpty from './SectionEmpty';
import Section from './Section';
import DefaultShiftTime from './DefaultShiftTime';
import classes from './Table.module.scss';
import MainLayout from "../../../Core/MainLayout";

/* consts */
const cellArr = new Array(7).fill().map((_, index) => ({ id: `cell-background-${index}` }));
const weekMock = [
  {
    id: 1,
    label: 'Monday',
    checked: false,
  },
  {
    id: 2,
    label: 'Thuesday',
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
const dataInitial = {
  0: [],
  1: [],
  2: [],
  3: [],
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
          title ? (
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
        expander && items?.map((item) => (
          <ResourcesCell
            key={item.id}
            rowId={item.id}
            parentRowId={rowId}
            title={item.title}
            avatar={item.photo}
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
  expander,
  onChange,
  resourceId,
  withDots,
  title,
  avatar,
  disabledCell,
  daysOfWeek,
  defaultWorkingTime,
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

  const foundItem = useMemo(() => items.find((item) => resourceId === item.resourceId), [items]);

  return (
    <>
      <div className={classes.table__content__data__row}>
        {
          foundItem?.data.map((itemJ, indexJ) => (
            <div key={itemJ.id} className={classes.table__content__data__row__cell}>
              {
                itemJ?.time?.start && daysOfWeek[indexJ].checked && !daysOfWeek[indexJ].disabled && (
                  <TimeRangePicker
                    value={itemJ.time}
                    cellId={indexJ}
                    onChange={handleChangeTime}
                    // disabled={disabledCell}
                    withDots={withDots}
                    // jobTypeName={jobType}
                    avatar={avatar}
                    fullName={title}
                    onDuplicateTimeToRow={handleDuplicateTimeToRow}
                    onDuplicateTimeToColumn={handleDuplicateTimeToColumn}
                    disabled={disabledCell}
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
            title={item.title}
            avatar={item.avatar}
            withDots={withDots}
            onChange={onChange}
            daysOfWeek={daysOfWeek}
            disabledCell={disabledCell}
            defaultWorkingTime={defaultWorkingTime}
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

// initialData={initialValues.data}
export default forwardRef(({
  numberOfWeeks,
  customWorkingTime,
  allJobTypes,
  employees,
  initialValues = {
    data: dataInitial,
    resources: [],
  },
}, ref) => {
  // console.log('table = ', initialValues);
  const [data, setData] = useState(initialValues.data);
  const [resources, setResources] = useState(initialValues.resources);
  const [daysOfWeek, setDaysOfWeek] = useState(daysOfWeekInitial);
  const [defaultWorkingTime, setDefaultWorkingTime] = useState({ 0: [] });
  const [currentWeek, setCurrentWeek] = useState(0);
  const scrollContainerRef = useRef(null);
  const contentRef = useRef(null);

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
    setData((prevState) => {
      const foundIndex = prevState[currentWeek].findIndex((item) => item.resourceId === resourceId);
      const cellIndex = cellId;

      console.log('currentWeek', currentWeek);
      console.log('prevState', prevState);
      return {
        ...prevState,
        [currentWeek]: [
          ...prevState[currentWeek].slice(0, foundIndex),
          {
            ...prevState[currentWeek][foundIndex],
            data: [
              ...prevState[currentWeek][foundIndex].data.slice(0, cellIndex),
              {
                ...prevState[currentWeek][foundIndex].data[cellIndex],
                time,
              },
              ...prevState[currentWeek][foundIndex].data.slice(cellIndex + 1),
            ],
          },
          ...prevState[currentWeek].slice(foundIndex + 1),
        ],
      };
    });
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
    setResources((prevState) => [
      ...prevState,
      ...addJobTypes.map((item) => ({
        title: item.title,
        jobTypeId: item.id,
        expander: true,
        id: item.id,
        children: new Array(item.value || 1).fill().map((_, index) => ({ id: `${item.id}-${index}` })),
      })),
    ]);
  };
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
      } else if (prevState[foundIndex].children.every((item) => item.title)) {
        return prevState;
      } else {
        const foundEmptyLastIndex = prevState[foundIndex].children
          .reduce((acc, curr, index) => (!curr.title ? index : acc), 0);
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
            if (!item.title && items[currentItemIndex]) {
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
  }, [numberOfWeeks, defaultWorkingTime]);
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

          if (prevState[1]) {
            // eslint-disable-next-line prefer-destructuring
            nextState[1] = prevState[0];
          }
          if ((countOfWeeks - 1) > 1 && prevState[2]) {
            // eslint-disable-next-line prefer-destructuring
            nextState[2] = prevState[0];
          }
          if ((countOfWeeks - 1) > 2 && prevState[3]) {
            // eslint-disable-next-line prefer-destructuring
            nextState[3] = prevState[0];
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
  }));

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

  return (
    <div className={classes.table}>
      <Header
        onClickNext={handleClickNext}
        onClickPrev={handleClickPrev}
        daysOfWeek={daysOfWeek}
        onChange={handleChangeWeek}
        makeShiftFor={numberOfWeeks}
        currentWeek={currentWeek}
      />
      <Scrollbar
        className={classes.scrollableContent}
        ref={scrollContainerRef}
        noScrollX
        trackYProps={{
          renderer: (props) => {
            const { elementRef, ...restProps } = props;
            return (
              <span
                {...restProps}
                ref={elementRef}
                className={classes.scrollableContent__scrollbarTrackY}
              />
            );
          },
        }}
      >
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
                    items={data[currentWeek]}
                    resources={item.children}
                    expander={item.expander}
                    resourceId={item.id}
                    onChange={handleChangeTime}
                    onDuplicateTimeToRow={handleDuplicateTimeToRow}
                    onDuplicateTimeToColumn={handleDuplicateTimeToColumn}
                    disabledCell={!customWorkingTime}
                    daysOfWeek={daysOfWeek[currentWeek]}
                    defaultWorkingTime={defaultWorkingTime[currentWeek]}
                    withDots
                  />
                ))
              }
            </div>
          </div>
          <div className={classes.table__background}>
            {backgroundArr.map((item) => (
              <div key={item.id} className={classes.table__background__row}>
                <div className={classes.table__background__row__resource} />
                {
                  item.data.map((itemJ) => (
                    <div key={itemJ.id} className={classes.table__background__row__cell} />
                  ))
                }
              </div>
            ))}
          </div>
        </>
      </Scrollbar>
      <Footer
        data={new Array(8).fill()}
      />
    </div>
  );
});
