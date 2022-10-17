import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
} from 'react';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import cloneDeep from 'lodash';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getSettingWorkTime } from '../../store/settings/actions';
import { placesSelector } from '../../store/places/selectors';
import { skillsSelector } from '../../store/skills/selectors';

import MainLayout from '../../components/Core/MainLayout';
import CustomSelect from '../../components/Core/Select/Select';
import Progress from '../../components/Core/Progress';
import usePermissions from '../../components/Core/usePermissions';
import { resourcesMock } from '../../const/mock';
import { getEmployees } from '../../store/employees/actions';

import {
  getSheet,
} from '../../store/sheet/actions';
import {
  loadEmployeesAll,
  getSheet as getsheetSetting,
} from '../../store/settings/actions';
import { employeesSelector } from '../../store/employees/selectors';
import { sheetSelector, isLoadingSelector } from '../../store/sheet/selectors';
import { getPlaces } from '../../store/places/actions';
import { getSkills } from '../../store/skills/actions';

import MonthView from './MonthView';
import './TimeSheet.scss';

const permissionsConfig = [
  {
    name: 'cost',
    module: 'cost_earning',
  },
];

export default () => {
  const { t } = useTranslation();
  const [filter, setFilter] = useState({ employers: [], places: [], skills: [] });
  const places = useSelector(placesSelector);
  const skills = useSelector(skillsSelector);
  const fromDateRef = useRef(new Date());
  const resizeObserverRef = useRef();
  const { id: companyId } = useParams();
  const dispatch = useDispatch();
  const employees = useSelector(employeesSelector);
  const sheet = useSelector(sheetSelector);
  const isLoading = useSelector(isLoadingSelector);
  const [filterData, setFilterData] = useState({});
  const permissions = usePermissions(permissionsConfig);

  const resources = useMemo(() => {

    if (sheet?.resources) {
      const copyObject = [...sheet.resources];
      return copyObject.filter((i) => {
        let checkSkill = true;
        if (filter?.skills?.length) {
          checkSkill = false;
          filter.skills.map((shiftEl) => {
            if (shiftEl.id === i.skill_id) {
              checkSkill = true;
            }
          });
        }
          
        let checkPlace = true;
        if (filter?.place?.length) {
          checkPlace = false;
          filter.place.map((placeEL) => {
            if (placeEL.id === i.place_id) {
              checkPlace = true;
            }
          });
        }
            
        let checkEmployer = true;
        if (filter?.employers?.length) {
          checkEmployer = false;
          filter.employers.map((employer) => {
            if (employer.id === i.employeeId) {
              checkEmployer = true;
            }
          });
        }

        return checkSkill && checkPlace && checkEmployer;
            
      });
    }

    return sheet?.resources;

  }, [filter, sheet?.resources]);

  const handleGetSheet = ({ fromDate = fromDateRef.current }) => {
    let nextFromDate = moment(fromDate);
    
    dispatch(getSheet({
      companyId,
      fromDate: nextFromDate.format('YYYY-MM-DD'),
    }));
  };

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

  const filteringResource = (data) => {
    if (sheet?.resources) {
      handleGetSheet({ fromDate: fromDateRef.current });
      const copyObject = [...sheet.resources];
      const a = copyObject.filter((i) => {
        
        let checkSkill = true;
        if (data?.skills?.length) {
          checkSkill = false;
          data.skills.map((shiftEl) => {
            if (shiftEl.id === i.skill_id) {
              checkSkill = true;
            }
          });
        }
          
        let checkPlace = true;
        if (data?.place?.length) {
          checkPlace = false;
          data.place.map((placeEL) => {
            if (placeEL.id === i.place_id) {
              checkPlace = true;
            }
          });
        }
            
        let checkEmployer = true;
        if (data?.employers?.length) {
          checkEmployer = false;
          data.employers.map((employer) => {
            if (employer.id === i.employeeId) {
              checkEmployer = true;
            }
          });
        }

        return checkSkill && checkPlace && checkEmployer;
            
      });

      if (data?.employers?.length || data?.place?.length || data?.skills?.length) {
        setFilterData(a);
      }
      else{
        setFilterData({});
      }
    }
  };

  useEffect(() => {
    //filteringResource(filter);
  }, [filter]);
  
  useEffect(() => {
    dispatch(getPlaces(companyId));
    dispatch(getSkills(companyId));
    dispatch(getEmployees(companyId));
    dispatch(getSettingWorkTime(companyId));

    dispatch(getSheet({
      companyId,
      fromDate: moment(new Date()).format('YYYY-MM-DD'),
      firstLoading: true,
    }));
    dispatch(getsheetSetting(companyId));
    dispatch(loadEmployeesAll(companyId));

    return () => {
      // eslint-disable-next-line no-unused-expressions
      resizeObserverRef.current?.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
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
          />
          <CustomSelect
            placeholder={t('All skills')}
            buttonLabel={t('Filter')}
            items={skills}
            onChange={onSkillSelectFilter}
            width='auto'
          />
          <CustomSelect
            placeholder={t('All employees')}
            buttonLabel={t('Filter')}
            items={employees}
            onChange={onEmployeesSelectFilter}
            width='auto'
          />
        </div>
        {
          (!sheet) ? (
            // <Progress />
              <></>
          ) : (
            <MonthView
              resources={Object.values(resources) || resourcesMock}
              holidays={sheet?.holidays}
              sheet={sheet?.sheet}
              fields={sheet?.fields}
              onChangeMonth={handleGetSheet}
              withCost={permissions.cost}
            />
          )
        }
        {
          (isLoading) && (
            <div className='timeSheet-screen__overlay-loading'>
              <Progress/>
            </div>
          )
        }
        <div/>
      </div>
    </MainLayout>
  );
};
