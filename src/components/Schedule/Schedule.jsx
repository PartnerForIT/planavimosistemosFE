import React, { useState, useEffect, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import interactionPlugin from '@fullcalendar/interaction';
import momentPlugin from '@fullcalendar/moment';
import resourceTimelinePlugin from '@fullcalendar/resource-timeline';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import { useHistory, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import MainLayout from '../Core/MainLayout';
import CustomSelect from '../Core/Select/Select';
import Button from '../Core/Button/Button';
import ButtonGroupToggle from '../Core/ButtonGroupToggle';
import Checkbox from '../Core/Checkbox/Checkbox2';
import Progress from '../Core/Progress';
import { getSkills } from '../../store/skills/actions';
import { getEmployees } from '../../store/employees/actions';
import { getSchedule } from '../../store/schedule/actions';
import { employeesSelector } from '../../store/employees/selectors';
import { skillsSelector } from '../../store/skills/selectors';
import { scheduleSelector, isLoadingSelector } from '../../store/schedule/selectors';
import './Schedule.scss';

const photo = 'data:image/jpeg;base64,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';

// const resourceGroupField = 'groupId';
const resources = [
  {
    id: 'A',
    title: 'Shift A',
    children: [
      {
        id: 'A1',
        title: 'Barmen',
        // todo create front
        eventBackgroundColor: 'red',
        count: 2,
        children: [
          {
            id: 'A11',
            title: 'Lisa Tontoni',
            // todo create front
            eventBackgroundColor: 'blue',
            job: 'true',
            photo,
          },
          {
            id: 'A12',
            title: 'Vardas Pavarde',
            // todo create front
            job: 'true',
            eventBackgroundColor: 'blue',
            photo,
          },
        ],
      },
      {
        id: 'A2',
        title: 'Waitress',
        color: 'red',
        // todo create front
        eventBackgroundColor: '#21D09D',
        eventBorderColor: '#21D09D',
        count: 2,
        children: [
          {
            id: 'A21',
            title: 'Jesica Topetti',
            // todo create front
            job: 'true',
            last: 'true',
            eventBackgroundColor: 'rgba(33, 208, 157, 0.5)',
            eventBorderColor: '#21D09D',
          },
          {
            id: 'A22',
            title: 'Lina Tartolietio',
            // todo create front
            job: 'true',
            last: 'true',
            eventBackgroundColor: 'rgba(33, 208, 157, 0.5)',
            eventBorderColor: '#21D09D',
          },
        ],
      },
    ],
  },
  {
    id: 'B',
    title: 'Shift B',
    eventBackgroundColor: '#3978F0',
    eventBorderColor: '#3978F0',
    // groupId: 'A',
  },
  {
    id: 'C',
    title: 'Shift C',
    // groupId: 'A',
  },
];
const events = [
  {
    id: '1',
    resourceId: 'B',
    title: 'Meeting',
    start: moment().add(-3, 'hours').format(),
    end: moment().add(1, 'hours').format(),
  },
  {
    id: '2',
    resourceId: 'A2',
    title: 'Meeting',
    start: moment().set({ hours: 0, minutes: 0 }).format(),
    end: moment().set({ hours: 24, minutes: 0 }).format(),
  },
  {
    id: '4',
    resourceId: 'C',
    title: 'Meeting',
    start: moment().set({ hours: 12, minutes: 0 }).format(),
    end: moment().set({ hours: 15, minutes: 0 }).format(),
  },
  {
    id: '3',
    resourceId: 'A22',
    title: 'Meeting',
    start: moment().add(-8, 'hours').format(),
    end: moment().format(),
  },
];

export default () => {
  const { t } = useTranslation();
  const history = useHistory();
  const [timeline, setTimeline] = useState('day');
  // const [filter, setFilter] = useState({});
  const [isOnlyWorkingDays, setIsOnlyWorkingDays] = useState(false);
  const calendarRef = useRef();
  const { id: companyId } = useParams();
  const dispatch = useDispatch();

  const employees = useSelector(employeesSelector);
  const skills = useSelector(skillsSelector);
  const isLoading = useSelector(isLoadingSelector);

  // const onSkillsSelectChange = (selectedSkills) => {
  //   setFilter((prevState) => ({
  //     ...prevState,
  //     skills: selectedSkills,
  //   }));
  // };
  const onSkillsSelectFilter = () => {
    // sendRequest({ skills: checkedSkills.map((item) => item.id) });
  };
  // const onEmployeesSelectChange = (selectedEmployees) => {
  //   console.log('selectedEmployees', selectedEmployees);
  //   setFilter((prevState) => ({
  //     ...prevState,
  //     employees: selectedEmployees,
  //   }));
  // };
  const onEmployeesSelectFilter = () => {
    // sendRequest({
    //   employees: checkedEmployees
    //       .map((item) => item.id)
    //       .filter((item) => typeof item !== 'string'),
    // });
  };
  const handleChangeTimeline = (value) => {
    const calendarApi = calendarRef.current.getApi();

    switch (value) {
      case 'day': {
        calendarApi.changeView(value);
        break;
      }
      case 'week': {
        calendarApi.changeView(value);
        break;
      }
      case 'month': {
        // custom view
        break;
      }
      default: break;
    }

    setTimeline(value);
  };
  const handleChangeOnlyWorkingDays = () => {
    setIsOnlyWorkingDays((prevState) => !prevState);
  };
  const handleCreateNewShift = () => {
    history.push(`/${companyId}/schedule/shift/create`);
  };
  const handleResourceLabelClassNames = ({ resource }) => {
    if (resource._resource.parentId) {
      if (resource._resource.extendedProps.job) {
        if (resource._resource.extendedProps.last) {
          return 'fc-datagrid-cell-sub-children-last';
        }

        return 'fc-datagrid-cell-sub-children';
      }

      return 'fc-datagrid-cell-children';
    }

    return '';
  };

  const renderEventContent = (eventInfo) => {
    return (
      <div style={{ backgroundColor: 'color' }}>
        <b>{eventInfo.timeText}</b>
        <i>{eventInfo.event.title}</i>
      </div>
    );
  };
  const renderResourceLabelContent = ({ fieldValue, resource }) => {
    // console.log('resource._resource', resource._resource.ui.backgroundColor);
    const { count, photo } = resource._resource.extendedProps;
    return (
      <>
        {`${fieldValue} ${count ? `(${count})` : ''}`}
        {
          photo && (
            <img
              alt=''
              // className={styles.cellNameWithAvatar__image}
              src={photo}
            />
          )
        }
      </>
    );
  };
  const renderResourceAreaHeaderContent = ({ view }) => {
    const handleClickPrev = () => {
      view.calendar.prev();
    };
    const handleClickNext = () => {
      view.calendar.next();
    };

    return (
      <>
        <button aria-label='prev' onClick={handleClickPrev} />
        <span>{view.title}</span>
        <button aria-label='next' onClick={handleClickNext} />
      </>
    );
  };

  // useEffect(() => {
  // }, []);
  const handleViewDidMount = () => {
    const calendar = document.getElementsByClassName('fc-scroller');
    calendar[1].addEventListener('scroll', () => {
      console.log('scroll');
    });
  };

  useEffect(() => {
    dispatch(getEmployees(companyId));
    dispatch(getSkills(companyId));
    dispatch(getSchedule({ companyId, timeline: 'day' }));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const total = {};
  const totals = [
    total,
    total,
    total,
  ];

  return (
    <MainLayout>
      <div className='schedule-screen'>
        <div className='schedule-screen__header'>
          <CustomSelect
            placeholder={t('All skills')}
            buttonLabel={t('Filter')}
            items={skills}
            onFilter={onSkillsSelectFilter}
            // onChange={onSkillsSelectChange}
            width='auto'
          />
          <CustomSelect
            placeholder={t('All shifts')}
            buttonLabel={t('Filter')}
            items={[]}
            // onFilter={onSkillsSelectFilter}
            // onChange={onSkillsSelectChange}
            width='auto'
          />
          <CustomSelect
            placeholder={t('All employees')}
            buttonLabel={t('Filter')}
            items={employees}
            onFilter={onEmployeesSelectFilter}
            // onChange={onEmployeesSelectChange}
            width='auto'
          />
          <ButtonGroupToggle
            buttons={[
              {
                label: t('Day'),
                id: 'day',
              },
              {
                label: t('Week'),
                id: 'week',
              },
              {
                label: t('Month'),
                id: 'month',
              },
            ]}
            onChange={handleChangeTimeline}
            value={timeline}
          />
          <Checkbox
            onChange={handleChangeOnlyWorkingDays}
            checked={isOnlyWorkingDays}
            label={t('Show only working days')}
          />
          <Button onClick={handleCreateNewShift}>
            {t('Create new shift')}
          </Button>
        </div>
        <FullCalendar
          // dayHeaderFormat={{ day: 'numeric' }}
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
          headerToolbar={false}
          aspectRatio={1}
          height='100%'
          agendaEventMinHeight={90}
          schedulerLicenseKey='CC-Attribution-NonCommercial-NoDerivatives'
          resources={resources}
          events={events}
          editable
          eventContent={renderEventContent}
          resourceAreaHeaderContent={renderResourceAreaHeaderContent}
          viewDidMount={handleViewDidMount}
          resourceLabelClassNames={handleResourceLabelClassNames}
          resourceLabelContent={renderResourceLabelContent}
          // loading={(prop) => console.log('prop', prop)}
        />
        <div className='schedule-screen__footer'>
          {/*{totals.map((item) => (*/}
          {/*  */}
          {/*))}*/}
        </div>
        {
          // (isLoading || true) && (
          //   <div className='schedule-screen__overlay-loading'>
          //     <Progress />
          //   </div>
          // )
        }
        <div />
      </div>
    </MainLayout>
  );
};
