import React, { useState, useCallback, useEffect, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import interactionPlugin from '@fullcalendar/interaction';
import momentPlugin from '@fullcalendar/moment';
import resourceTimelinePlugin from '@fullcalendar/resource-timeline';
import { useTranslation } from 'react-i18next';
//import moment from 'moment';
import { useHistory, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import MainLayout from '../Core/MainLayout';
import CustomSelect from '../Core/Select/Select';
import Button from '../Core/Button/Button';
import ButtonGroupToggle from '../Core/ButtonGroupToggle';
import Checkbox from '../Core/Checkbox/Checkbox2';
//import Progress from '../Core/Progress';
import { getSkills } from '../../store/skills/actions';
//import { getEmployees } from '../../store/employees/actions';
import { employeesSelector } from '../../store/settings/selectors';
import { getSchedule } from '../../store/schedule/actions';
//import { employeesSelector } from '../../store/employees/selectors';
import { skillsSelector } from '../../store/skills/selectors';
import { resourcesSelector, eventsSelector } from '../../store/schedule/selectors';
import useGroupingEmployees from '../../hooks/useGroupingEmployees';
import './Schedule.scss';

export default () => {
  const { t } = useTranslation();
  const history = useHistory();
  const [timeline, setTimeline] = useState('day');
  // const [filter, setFilter] = useState({});
  const [isOnlyWorkingDays, setIsOnlyWorkingDays] = useState(false);
  const calendarRef = useRef();
  const { id: companyId } = useParams();
  const dispatch = useDispatch();

  //const employees = useSelector(employeesSelector);
  const { users: employees } = useSelector(employeesSelector);
  const skills = useSelector(skillsSelector);
  //const isLoading = useSelector(isLoadingSelector);
  const resources = useSelector(resourcesSelector);
  const events = useSelector(eventsSelector);

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
            items={allSortedEmployees ?? []}
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
          locale={localStorage.getItem('i18nextLng') || 'en'}
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
