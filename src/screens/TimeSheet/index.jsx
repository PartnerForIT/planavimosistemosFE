import React, {
  useState,
  useCallback,
  useEffect,
  useRef,
  useMemo,
} from 'react';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { placesSelector } from '../../store/places/selectors';
import { skillsSelector } from '../../store/skills/selectors';

import MainLayout from '../../components/Core/MainLayout';
import CustomSelect from '../../components/Core/Select/Select';
import Progress from '../../components/Core/Progress';
import FlatButton from '../../components/Core/FlatButton/FlatButton';
import Button from '../../components/Core/Button/Button';
import ArrowEIPIcon from '../../components/Icons/ArrowEIPIcon';
import ExcelIcon from '../../components/Icons/ExcelIcon';
import usePermissions from '../../components/Core/usePermissions';
import ReactTooltip from 'react-tooltip';
import {
  scheduleSelector,
} from '../../store/settings/selectors';
import {
  getSheet,
  downloadIntegration,
  checkIntegration,
} from '../../store/sheet/actions';
import {
  getSchedule, loadEmployeesAll, loadIntegrations, getSettingWorkTime, loadTimeSheet,
} from '../../store/settings/actions';

import { TimeSheetDataSelector } from '../../store/settings/selectors';
import { sheetSelector, isLoadingSelector } from '../../store/sheet/selectors';
import { IntegrationsDataSelector } from '../../store/settings/selectors';
import { getPlaces } from '../../store/places/actions';
import { getSkills } from '../../store/skills/actions';
import useGroupingEmployees from '../../hooks/useGroupingEmployees';

import MonthView from './MonthView';
import PagesBlock from './PagesBlock';
import './TimeSheet.scss';

const permissionsConfig = [
  {
    name: 'cost',
    module: 'cost_earning',
  },
  {
    name: 'time_sheet_costs',
    module: 'time_sheet',
    permission: 'time_sheet_costs',
  },
  {
    name: 'integrations_module',
    module: 'integrations',
    permission: 'integrations_module_access',
  },
  {
    name: 'schedule_create_and_edit',
    module: 'schedule_shift',
    permission: 'schedule_create_and_edit',
  },  
];

export default () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [filter, setFilter] = useState({ employers: [], place: [], skills: [] });
  const places = useSelector(placesSelector);
  const skills = useSelector(skillsSelector);
  const fromDateRef = useRef(new Date());
  const [currentDate, setCurrentDate] = useState(fromDateRef.current);
  const resizeObserverRef = useRef();
  const { id: companyId } = useParams();
  
  const sheet = useSelector(sheetSelector);
  const isLoading = useSelector(isLoadingSelector);
  const users = useSelector(state => state.settings.employees.users);

  const permissions = usePermissions(permissionsConfig);
  const integrations = useSelector(IntegrationsDataSelector);
  const timesheet = useSelector(TimeSheetDataSelector);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [employees, setEmployees] = useState(users)
  const schedule = useSelector(scheduleSelector);
  
  const applyingFilters = useRef(false)
  const sheetResources = sheet?.resources
  const display_employee_ids = sheet?.display_employee_ids
  const onPage = 20;

  const filteredEmployees = useMemo(() => {
    return display_employee_ids?.length
      ? employees.filter(emp => display_employee_ids.includes(emp.id))
      : employees;
  }, [employees, display_employee_ids]);

  const totalPages = Math.ceil(filteredEmployees.length / onPage)

  const employeesData = useMemo(() => {
    return users.reduce((acc, employee) => {
      return {
        ...acc,
        [employee.id]: {
          ...employee,
          title: `${employee.name} ${employee.surname}`,
          employeeId: employee.id,
        }
      }
    }, {})
  }, [users])

  const currentEmployeeIds = filteredEmployees
    .map(({ id }) => id)
    .slice((page - 1) * onPage, page * onPage);

  const { currentEmployees } = currentEmployeeIds
    .filter(id => display_employee_ids?.length ? display_employee_ids?.includes(id) : true) // filter by display_employee_ids
    .map(id => employeesData[id])
    .reduce(
      (acc, employee) => {
        const existInResources = acc.resources.filter(res => res.employeeId === employee.id);
        if (existInResources.length) {
          return {
            currentEmployees: [...acc.currentEmployees, ...existInResources],
            resources: acc.resources.filter(res => res.employeeId !== employee.id),
          };
        }
        if (filter.place.length) return acc;
        return {
          ...acc,
          currentEmployees: [...acc.currentEmployees, employee],
        };
      },
      { currentEmployees: [], resources: sheetResources || [] }
    );

  useEffect(() => {
    ReactTooltip.rebuild();
    dispatch(getPlaces(companyId));
    dispatch(getSkills(companyId));
    dispatch(getSettingWorkTime(companyId));
    dispatch(loadIntegrations(companyId));
    dispatch(loadTimeSheet(companyId));
    dispatch(getSchedule(companyId));

    //dispatch(getsheetSetting(companyId));
    dispatch(loadEmployeesAll(companyId, {page: 'time_sheet'}))

    return () => {
      // eslint-disable-next-line
      resizeObserverRef.current?.disconnect();
    };
  }, [dispatch, companyId]);

  useEffect(() => {
    if (users.length) {
      setEmployees(users)
    }
  }, [users])

  useEffect(() => {
    if (employees.length && !applyingFilters.current) {
      loadSheetByPage(moment(currentDate).format('YYYY-MM-DD'))
    } else if (applyingFilters.current) {
      applyingFilters.current = false
    }
    // eslint-disable-next-line
  }, [page, employees, currentDate])

  const employToCheck = useCallback(({
    id,
    name,
    surname,
  }) => ({
    id,
    label: `${name} ${surname}`,
    // checked: checkedEmployees.some(({ id: employeeId }) => employeeId === id),
  }), []);

  const visibleUsers = useMemo(() => {
    return display_employee_ids?.length
      ? users.filter(u => display_employee_ids.includes(u.id))
      : users;
  }, [users, display_employee_ids]);
  
  const allSortedEmployees = useGroupingEmployees(visibleUsers, employToCheck);

  const pageEmployeeIds = (pageNumber = page) => {
    return filteredEmployees
      .map(({ id }) => id)
      .slice((pageNumber - 1) * onPage, pageNumber * onPage);
  };

  const downloadIntegrationFile = (type) => {
    let nextFromDate = moment(currentDate);
    const data = {
      integrationType: type,
      skillsArr: filter.skills.map(({id}) => id),
      employeesArr: filter.employers.map(({id}) => id),
      placesArr: filter.place.map(({id}) => id),
    };

    setLoading(true);
    dispatch(downloadIntegration(companyId, nextFromDate.format('YYYY-MM-DD'), data)).then(({ data }) => {
      if (data) {
        askIntegrationReady(data);
      } else {
        setLoading(false);
      }
    }).catch();
  }

  const askIntegrationReady = (data) => {
    dispatch(checkIntegration(
      companyId,
      data.file,
    )).then((response) => {
      if (response.status === 'ready') {
        const link = document.createElement('a');
        link.setAttribute('download', data.file);
        link.setAttribute('target', '_blank');
        link.href = `${data.path}`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        setLoading(false);
      } else {
        setTimeout(() => {
          askIntegrationReady(data);
        }, 1000);
      }
    });
  }

  const loadSheetByPage = async (fromDate, employeeIds) => {
    setLoading(true)
    const data = {
      skillsArr: filter.skills.map(({id}) => id),
      placesArr: filter.place.map(({id}) => id),
      employeesArr: employeeIds ?? currentEmployeeIds,
    }
    await dispatch(getSheet({
      companyId,
      data,
      fromDate
    }))
    setLoading(false)
  };

  const handleGetSheet = ({ fromDate = fromDateRef.current }) => {
   let nextFromDate = moment(fromDate);
    setCurrentDate(fromDate);

 
   loadSheetByPage(nextFromDate.format('YYYY-MM-DD'));
  }

  const handleSubmitFiler = () => {
    let tempList = users
    if (filter.place.length) {
      const placeIds = filter.place.reduce((acc, place) => ({...acc, [place.id]: true}), {})
      tempList = users.filter(u => u.places_where_worked.some(placeId => placeIds[placeId]))
    }
    if (filter.skills.length) {
      const skillLabels = filter.skills.reduce((acc, skill) => ({...acc, [skill.label]: true}), {})
      tempList = tempList.filter(u => skillLabels[u.skills])
    }
    if (filter.employers.length) {
      const employerIds = filter.employers.reduce((acc, employer) => ({...acc, [employer.id]: true}), {})
      tempList = tempList.filter(u => employerIds[u.id])
    }
    setEmployees(tempList)
    if (page !== 1) {
      applyingFilters.current = true
      setPage(1)
    }
    loadSheetByPage(moment(currentDate).format('YYYY-MM-DD'), tempList.map(e => e.id))
  }

  const onEmployeesSelectFilter = (emp) => {
    const arrChecked = emp?.filter((i) => i.checked);
    setFilter((prevState) => ({
      ...prevState,
      employers: arrChecked,
    }));
  };

  const onPlaceSelectFilter = (place) => {
    const arrChecked = place?.filter((i) => i.checked);
    setFilter((prevState) => ({
      ...prevState,
      place: arrChecked,
    }));
  };

  const onSkillSelectFilter = (skill) => {
    const arrChecked = skill?.filter((i) => i.checked);
    setFilter((prevState) => ({
      ...prevState,
      skills: arrChecked,
    }));
  };

  const tooltipEmployees = (pageNumber) => {
    return pageEmployeeIds(pageNumber).map((id) => {
      const employee = employeesData[id]
      return `${employee.name} ${employee.surname}`;
    }).join('<br />');
  }

  return (
    <MainLayout>
      <div className='timeSheet-screen'>
        <div className='timeSheet-screen__header'>
          <CustomSelect
            placeholder={t('All places')}
            buttonLabel={t('Filter')}
            items={places}
            onChange={onPlaceSelectFilter}
            width='auto'
            withSearch={true}
          />
          <CustomSelect
            placeholder={t('All skills')}
            buttonLabel={t('Filter')}
            items={skills}
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
          <Button
            onClick={handleSubmitFiler}
            className='timeSheet-screen__buttonFilter'
            disabled={isLoading || loading || (filter.employers.length === 0 && filter.place.length === 0 && filter.skills.length === 0 && false)}
          >
            {t('Search')}
          </Button>

          { permissions.integrations_module && integrations.rivile && (
            <FlatButton onClick={() => downloadIntegrationFile('eip')} className='timeSheet-screen__buttonDownload'>
              <ArrowEIPIcon className='timeSheet-screen__buttonArrow' /> {t('.EIP')}
            </FlatButton>
          )}

          { permissions.integrations_module && integrations.excel && (
            <FlatButton onClick={() => downloadIntegrationFile('excel')} className='timeSheet-screen__buttonDownload'>
              <ArrowEIPIcon className='timeSheet-screen__buttonArrow' /> <ExcelIcon />
            </FlatButton>
          )}
        </div>
        {
          (!sheet) ? (
            <></>
          ) : (
            <MonthView
              resources={currentEmployees || []}
              holidays={sheet?.holidays}
              sheet={sheet?.sheet}
              fields={sheet?.fields}
              onChangeMonth={handleGetSheet}
              withCost={permissions.cost && permissions.time_sheet_costs}
              withAccumulated={timesheet.use_accumulated}
              accumulatedMonths={schedule.accumulated_months}
              mergeTimesheetPlaces={timesheet.merge_timesheet_places}
            />
          )
        }
        {
          (loading) && (
            <div className='timeSheet-screen__overlay-loading'>
              <Progress/>
            </div>
          )
        }

        { totalPages > 1 && sheet && (
          <>
          <PagesBlock
            page={page}
            totalPages={totalPages}
            onPageChange={(newPage) => {
              setPage(newPage)
              // loadSheetByPage(moment(currentDate).format('YYYY-MM-DD'), newPage);
            }}
            tooltip={tooltipEmployees}
          />
          <ReactTooltip
            id='employees_tooltip'
            className={'schedule-screen__tooltip'}
            effect='solid'
            html={true}
          />
          </>
        )}
      </div>
    </MainLayout>
  );
};
