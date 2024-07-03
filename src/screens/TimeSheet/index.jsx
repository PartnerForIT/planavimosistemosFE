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
//import { getEmployees } from '../../store/employees/actions';

import {
  getSheet,
  downloadIntegration,
  checkIntegration,
} from '../../store/sheet/actions';
import {
  loadEmployeesAll, loadIntegrations, getSettingWorkTime, loadTimeSheet,
} from '../../store/settings/actions';
//import { employeesSelector } from '../../store/employees/selectors';

import { employeesSelector, TimeSheetDataSelector } from '../../store/settings/selectors';
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
  const [filter, setFilter] = useState({ employers: [], place: [], skills: [] });
  const places = useSelector(placesSelector);
  const skills = useSelector(skillsSelector);
  const fromDateRef = useRef(new Date());
  const [currentDate, setCurrentDate] = useState(fromDateRef.current);
  const resizeObserverRef = useRef();
  const { id: companyId } = useParams();
  const dispatch = useDispatch();
  //const employees = useSelector(employeesSelector);
  const { users: employees } = useSelector(employeesSelector);
  const sheet = useSelector(sheetSelector);
  const isLoading = useSelector(isLoadingSelector);
  //const [filterData, setFilterData] = useState({});
  const permissions = usePermissions(permissionsConfig);
  const integrations = useSelector(IntegrationsDataSelector);
  const timesheet = useSelector(TimeSheetDataSelector);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const hasLoadedOnceRef = useRef(false);
  const onPage = 20;
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    ReactTooltip.rebuild();
  });

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

  const pageEmployeeIds = (pageNumber = page) => {
    return filteredEmployees.map(({id}) => id).splice((pageNumber - 1) * onPage, onPage);
  };

  const filteredEmployees = useMemo(() => {
    let copyObject = [];
    if (sheet?.resources) {
      copyObject.push(...sheet.resources);
    }
  
    employees.map((employee) => {
      if (!copyObject.find((i) => i.id === employee.id)) {
        copyObject.push(employee);
      }

      return employee;
    });

    return copyObject.filter((i) => {
      let checkSkill = true;
      if (filter?.skills?.length) {
        checkSkill = false;
        filter.skills.map((shiftEl) => {
          if (shiftEl.id*1 === i.skill_id*1) {
            checkSkill = true;
          }

          return shiftEl;
        });
      }
        
      let checkPlace = true;
      // if (filter?.place?.length) {
      //   checkPlace = false;
      //   filter.place.map((placeEL) => {
      //     if (placeEL.id*1 === i.place_id*1) {
      //       checkPlace = true;
      //     }

      //     return placeEL;
      //   });
      // }
          
      let checkEmployer = true;
      if (filter?.employers?.length) {
        checkEmployer = false;
        filter.employers.map((employer) => {
          if (employer.id === i.id) {
            checkEmployer = true;
          }

          return employer;
        });
      }

      return (checkSkill && checkPlace && checkEmployer) ? i : null;
          
    });
  }, [employees, filter, sheet]);

  useEffect(() => {
    setTotalPages(Math.ceil(filteredEmployees.length / onPage));
  }, [filteredEmployees, onPage]);

  const pageResources = useMemo(() => {
    return filteredEmployees.map((employee) => {
      return {
        ...employee,
        title: employee.title ? employee.title : `${employee.name} ${employee.surname}`,
        employeeId: employee.id*1,
      };
    });
    // eslint-disable-next-line
  }, [filteredEmployees]);

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


  const loadSheetByPage = (fromDate, fromPage) => {
    setLoading(true);

    const data = {
      skillsArr: filter.skills.map(({id}) => id),
      placesArr: filter.place.map(({id}) => id),
      employeesArr: pageEmployeeIds(fromPage),
    };

    dispatch(getSheet({
      companyId,
      data,
      fromDate
    })).then(() => {
      setLoading(false);
    });
  };

  const handleGetSheet = ({ fromDate = fromDateRef.current }) => {
   let nextFromDate = moment(fromDate);
    setCurrentDate(fromDate);

 
   loadSheetByPage(nextFromDate.format('YYYY-MM-DD'));
  }

  const handleSubmitFiler = () => {
    setPage(1);
    loadSheetByPage(moment(currentDate).format('YYYY-MM-DD'));
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
      const employee = employees.find((i) => i.id === id);
      return `${employee.name} ${employee.surname}`;
    }).join('<br />');
  }
  
  useEffect(() => {
    dispatch(getPlaces(companyId));
    dispatch(getSkills(companyId));
    //dispatch(getEmployees(companyId));
    dispatch(getSettingWorkTime(companyId));
    dispatch(loadIntegrations(companyId));
    dispatch(loadTimeSheet(companyId));

    //dispatch(getsheetSetting(companyId));
    dispatch(loadEmployeesAll(companyId, {page: 'time_sheet'}))

    return () => {
      // eslint-disable-next-line
      resizeObserverRef.current?.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (employees.length > 0 && !hasLoadedOnceRef.current) {
      handleGetSheet({ fromDate: moment(new Date()).format('YYYY-MM-DD') });
      hasLoadedOnceRef.current = true;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employees]); 
  
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
            disabled={isLoading || loading || (filter.employers.length === 0 && filter.place.length === 0 && filter.skills.length === 0)}
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
              resources={Object.values(pageResources) || []}
              holidays={sheet?.holidays}
              sheet={sheet?.sheet}
              fields={sheet?.fields}
              onChangeMonth={handleGetSheet}
              withCost={permissions.cost && permissions.time_sheet_costs}
              withAccumulated={timesheet.use_accumulated}
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
              setPage(newPage);
              loadSheetByPage(moment(currentDate).format('YYYY-MM-DD'), newPage);
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
