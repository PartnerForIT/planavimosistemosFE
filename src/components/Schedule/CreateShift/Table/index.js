import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import { useTranslation } from 'react-i18next';
import classnames from 'classnames';
import moment from 'moment';

import PlusIcon from '../../../Icons/Plus';
import TimeRangePicker from '../TimeRangePicker';
import Header from './Header';
import AddJobTypeModal from './AddJobTypeModal';
import AddEmployeesModal from './AddEmployeesModal';
import Section from './Section';
import classes from './Table.module.scss';

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
  1: weekMock,
  2: weekMock,
  3: weekMock,
  4: weekMock,
};
const dataInitial = {
  1: [],
  2: [],
  3: [],
  4: [],
};
const backgroundArr = new Array(20).fill();

// const colors = {
//   bright: [
//     '#F23D79',
//     '#F23DB6',
//     '#F23DF2',
//     '#B63DF2',
//     '#793DF2',
//     '#3D3DF2',
//     '#3D79F2',
//     '#3DB6F2',
//     '#3DF2F2',
//     '#3DF2B6',
//     '#3DF279',
//     '#3DF23D',
//     '#79F23D',
//     '#B6F23D',
//     '#F2F23D',
//     '#F2B63D',
//     '#F2793D',
//     '#F23D3D',
//   ],
//   calm: [
//     '#CC527A',
//     '#CC52A3',
//     '#CC52CC',
//     '#7A3D99',
//     '#7A52CC',
//     '#5252CC',
//     '#527ACC',
//     '#52A3CC',
//     '#52CCCC',
//     '#52CCA3',
//     '#52CC7A',
//     '#52CC52',
//     '#7ACC52',
//     '#A3CC52',
//     '#CCCC52',
//     '#CCA352',
//     '#CC7A52',
//     '#CC5252',
//   ],
// };

const SectionEmpty = ({
  jobTypeTitle,
  employees,
  relatives,
  onSubmit,
}) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const total = useMemo(() => relatives.reduce((acc, item) => {
    if (!item.title) {
      return acc + 1;
    }

    return acc;
  }, 0), [relatives]);

  const handleClick = () => {
    setIsOpen(true);
  };
  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      <button
        className={classes.sectionEmpty}
        onClick={handleClick}
      >
        {t('Empty')}
        <div className={classes.sectionEmpty__iconWrapper}>
          <PlusIcon />
        </div>
      </button>
      {
        isOpen && (
          <AddEmployeesModal
            onClose={handleClose}
            onSubmit={onSubmit}
            items={employees}
            relatives={relatives}
            jobTypeTitle={jobTypeTitle}
            total={total}
          />
        )
      }
    </>
  );
};
const AddJobType = ({
  allJobTypes,
  onSubmit,
}) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    setIsOpen(true);
  };
  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      <button
        className={classes.addJobType}
        onClick={handleClick}
      >
        {t('Add Job Type')}
        <div className={classes.addJobType__iconWrapper}>
          <PlusIcon />
        </div>
      </button>
      {
        isOpen && (
          <AddJobTypeModal
            onClose={handleClose}
            onSubmit={onSubmit}
            items={allJobTypes}
          />
        )
      }
    </>
  );
};

const DefaultShiftTime = () => {
  const { t } = useTranslation();

  return (
    <div className={classes.defaultShiftTime}>
      {t('Default Shift Time')}
    </div>
  );
};

const Row = ({
  title,
  avatar,
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
  }, [parentRowId]);
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
          <Row
            key={item.id}
            rowId={item.id}
            parentRowId={rowId}
            title={item.title}
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
}) => {
  const handleChangeTime = useCallback((values) => {
    onChange({
      ...values,
      resourceId,
    });
  }, [resourceId]);
  const handleDuplicateTimeToRow = useCallback((values) => {
    onDuplicateTimeToRow({
      ...values,
      resourceId,
    });
  }, [resourceId]);
  const handleDuplicateTimeToColumn = useCallback((values) => {
    onDuplicateTimeToColumn({
      ...values,
      resourceId,
    });
  }, [resourceId]);

  const foundItem = useMemo(() => items.find((item) => resourceId === item.resourceId), [items]);

  return (
    <>
      <div className={classes.table__content__data__row}>
        {
          foundItem?.data.map((itemJ, indexJ) => (
            <div className={classes.table__content__data__row__cell}>
              {
                itemJ?.time?.start && !daysOfWeek[indexJ].disabled && (
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
              itemJ?.time?.start && !daysOfWeek[indexJ].disabled && (
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

export default ({
  makeShiftFor,
  customWorkingTime,
  workTime,
  allJobTypes,
  employees,
  startShiftFrom,
}) => {
  const [data, setData] = useState(dataInitial);
  const [resources, setResources] = useState([]);
  const [daysOfWeek, setDaysOfWeek] = useState(daysOfWeekInitial);
  const [defaultWorkingTime, setDefaultWorkingTime] = useState({ 1: [] });
  const [currentWeek, setCurrentWeek] = useState(1);

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
            data: prevState[currentWeek][foundIndex].data.map((item) => {
              if (!item.time.start) {
                return item;
              }

              return {
                ...item,
                time,
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
    setDaysOfWeek((prevState) => {
      const foundIndex = prevState[currentWeek].findIndex((item) => `${item.id}` === name);
      return {
        ...prevState,
        [currentWeek]: [
          ...prevState[currentWeek].slice(0, foundIndex),
          {
            ...prevState[currentWeek][foundIndex],
            checked,
          },
          ...prevState[currentWeek].slice(foundIndex + 1),
        ],
      };
    });
  };
  const handleChangeTime = ({ time, resourceId, cellId }) => {
    setData((prevState) => {
      const foundIndex = prevState[currentWeek].findIndex((item) => item.resourceId === resourceId);
      const cellIndex = cellId;

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
        items: [],
        expander: true,
        id: item.id,
        children: new Array(item.value || 1).fill().map((_, index) => ({ id: `${item.id}-${index}` })),
      })),
    ]);
    const initialDataTime = new Array(7).fill();
    const newData = addJobTypes.reduce((acc, item) => {
      acc.push({ resourceId: item.id, data: initialDataTime });
      new Array(item.value || 1).fill().forEach((itemJ, index) => {
        acc.push({ resourceId: `${item.id}-${index}`, data: initialDataTime });
      });

      return acc;
    }, []);
    setData((prevState) => ({
      ...prevState,
      [currentWeek]: [
        ...prevState[currentWeek],
        ...newData,
      ],
    }));
  };
  const handleSubmitAddEmployees = ({ parentRowId, items }) => {
    let currentItemIndex = 0;
    const newDataIds = [];
    setResources((prevState) => {
      const foundIndex = prevState.findIndex((item) => item.id === parentRowId);
      return [
        ...prevState.slice(0, foundIndex),
        {
          ...prevState[foundIndex],
          children: prevState[foundIndex].children.map((item, index) => {
            if (!item.title && items[currentItemIndex]) {
              currentItemIndex += 1;
              newDataIds.push({
                id: `${prevState[foundIndex].id}-${index}`,
                newId: `${prevState[foundIndex].id}-${items[currentItemIndex - 1]?.id}`,
              });

              return {
                ...item,
                employeeId: items[currentItemIndex - 1].id,
                title: items[currentItemIndex - 1].label,
                avatar: items[currentItemIndex - 1].avatar,
                id: `${prevState[foundIndex].id}-${items[currentItemIndex - 1]?.id}`,
              };
            }

            return item;
          }),
        },
        ...prevState.slice(foundIndex + 1),
      ];
    });
    setData((prevState) => ({
      ...prevState,
      [currentWeek]: prevState[currentWeek].map((item) => {
        const foundItem = newDataIds.find((itemJ) => itemJ.id === item.resourceId);
        if (foundItem) {
          return {
            resourceId: foundItem.newId,
            data: defaultWorkingTime[currentWeek],
          };
        }
        return item;
      }),
    }));
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
        children = prevState[foundIndex].children.slice(0, prevState[foundIndex].children.length - 1);
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
                id: prevState[foundIndexParent].children[foundIndex].id,
              },
              ...prevState[foundIndexParent].children.slice(foundIndex + 1),
            ],
          },
          ...prevState.slice(foundIndexParent + 1),
        ];
      } else {
        const foundIndex = prevState.findIndex((item) => item.id === rowId);

        return [
          ...prevState.slice(0, foundIndex),
          ...prevState.slice(foundIndex + 1),
        ];
      }
    });
  };

  useEffect(() => {
    if (workTime.work_time.work_days) {
      setDaysOfWeek((prevState) => {
        const nextState = prevState[1].map((item) => ({
          ...item,
          checked: workTime.work_time.work_days.days.some((itemJ) => (itemJ.day === item.id)),
        }));
        const nextState2 = prevState[2].map((item) => ({
          ...item,
          checked: workTime.work_time.work_days.days.some((itemJ) => (itemJ.day === item.id)),
        }));

        return {
          1: nextState,
          2: nextState2,
          3: nextState2,
          4: nextState2,
        };
      });

      const nextDefaultWorkingTime = weekMock.map((item, index) => {
        const foundItem = workTime.work_time.work_days.days.find((itemJ) => (itemJ.day === item.id)) || {};
        return { id: `${index}`, time: foundItem };
      });
      setDefaultWorkingTime({
        1: nextDefaultWorkingTime,
        2: nextDefaultWorkingTime,
        3: nextDefaultWorkingTime,
        4: nextDefaultWorkingTime,
      });
    }
  }, [workTime]);
  useEffect(() => {
    if (makeShiftFor < currentWeek) {
      setCurrentWeek(makeShiftFor);
    }

    if (makeShiftFor > 1) {
      setData((prevState) => {
        const nextState = {};

        if (prevState[2]) {
          // eslint-disable-next-line prefer-destructuring
          nextState[2] = prevState[1];
        }
        if (makeShiftFor > 2 && prevState[3]) {
          // eslint-disable-next-line prefer-destructuring
          nextState[3] = prevState[1];
        }
        if (makeShiftFor > 3 && prevState[4]) {
          // eslint-disable-next-line prefer-destructuring
          nextState[4] = prevState[1];
        }

        return {
          ...prevState,
          ...nextState,
        };
      });
    }
  }, [makeShiftFor]);
  useEffect(() => {
    if (workTime.work_time.work_days) {
      setDaysOfWeek((prevState) => ({
        ...prevState,
        1: prevState[1].map((item) => ({
          ...item,
          disabled: item.id < (moment(startShiftFrom).day() || 7),
        })),
      }));
    }
  }, [workTime, startShiftFrom]);

  const jobTypes = useMemo(() => {
    if (!data[currentWeek].length) {
      return allJobTypes;
    }

    return allJobTypes.filter((item) => !resources
      .some((itemJ) => itemJ.jobTypeId === item.id));
  }, [resources.length, allJobTypes]);

  console.log('resources = ', resources);
  console.log('data = ', data);
  console.log('workTime = ', workTime);
  return (
    <div className={classes.table}>
      <Header
        onClickNext={handleClickNext}
        onClickPrev={handleClickPrev}
        daysOfWeek={daysOfWeek}
        onChange={handleChangeWeek}
        makeShiftFor={makeShiftFor}
        currentWeek={currentWeek}
      />
      <div className={classes.table__content}>
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
              <Row
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
                key={item.id}
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
                withDots
              />
            ))
          }
        </div>
      </div>
      <div className={classes.table__background}>
        {backgroundArr.map((_, index) => (
          <div key={`row-background-${index}`} className={classes.table__background__row}>
            <div className={classes.table__background__row__resource} />
            {
              new Array(7).fill().map((item, indexJ) => (
                <div key={`cell-background-${indexJ}`} className={classes.table__background__row__cell} />
              ))
            }
          </div>
        ))}
      </div>
    </div>
  );
};
