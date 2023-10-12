/* eslint-disable camelcase */
import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Snackbar from '@material-ui/core/Snackbar';

import MainLayout from '../../../Core/MainLayout';
import PageLayout from '../../../Core/PageLayout';
import TitleBlock from '../../../Core/TitleBlock';
import Dashboard from '../../../Core/Dashboard';
import {
  isLoadingSelector, isShowSnackbar,
  snackbarType, snackbarText, settingWorkTime,
} from '../../../../store/settings/selectors';
import { getSettingWorkTime, patchWorkTime } from '../../../../store/settings/actions';
import WorkTimeIcon from '../../../Icons/WorkTime';
import Progress from '../../../Core/Progress';
import Holidays from './holidays';
import StartWeek from './StartWeek';
import WorkingTime from './WorkingTime';
import WorkingDays from './WorkingDays';
import styles from './workTime.module.scss';

const useStyles = makeStyles(() => ({
  error: {
    background: '#de4343',
    color: '#fff',
  },
  success: {
    background: '#3bc39e',
    color: '#fff',
  },
}));

export default function WorkTime() {
  const params = useParams();
  const dispatch = useDispatch();
  const classes = useStyles();

  const [inputValues, setInputValues] = useState({
    week_start: '',
    week_start_time: '',
    working_hours: 8,
  });

  const [startTime, setStartTime] = useState({});
  const [year, setYear] = useState(new Date().getFullYear());
  const [yearWorkingDays, setYearWorkingDays] = useState(new Date().getFullYear());

  const [days, setDays] = useState({
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false,
    sunday: false,
  });

  useEffect(() => {
    if (params.id) {
      dispatch(getSettingWorkTime(params.id));
    }
  }, [dispatch, params.id]);

  const isLoading = useSelector(isLoadingSelector);
  const isSnackbar = useSelector(isShowSnackbar);
  const typeSnackbar = useSelector(snackbarType);
  const textSnackbar = useSelector(snackbarText);
  const workTime = useSelector(settingWorkTime);

  const filterWorksDay = useCallback((idDay) => workTime.work_time?.work_days
    ?.days?.filter((item) => item.day === idDay) ?? [],
  [workTime]);

  const [nationalHolidays, setNationalHolidays] = useState([]);
  const [companyHolidays, setCompanyHolidays] = useState([]);
  const [workingDays, setWorkingDays] = useState([]);

  useEffect(() => {
    const holidays = workTime.work_time?.holidays ?? [];
    if (holidays.length) {
      setCompanyHolidays(holidays.filter((item) => new Date(item.date).getFullYear() === year));
    }
  }, [workTime.work_time, year]);

  useEffect(() => {
    const { national_holidays = [] } = workTime;
    if (national_holidays.length) {
      setNationalHolidays(national_holidays.filter((item) => new Date(item.date).getFullYear() === year));
    }
  }, [workTime, year]);

  useEffect(() => {
    const { working_days = [] } = workTime;
    if (working_days.month) {
      setWorkingDays(working_days);
    }
  }, [workTime, yearWorkingDays]);

  useEffect(() => {
    setInputValues({

      week_start: workTime.work_time?.week_start ?? '1',
      week_start_time: workTime.work_time?.week_start_time ?? '08:00',
      working_hours:  workTime.work_time?.working_hours ?? '8',
    });
    if (workTime.work_time && Object.keys(workTime.work_time).length > 0) {
      setDays({
        monday: filterWorksDay(1).length > 0,
        tuesday: filterWorksDay(2).length > 0,
        wednesday: filterWorksDay(3).length > 0,
        thursday: filterWorksDay(4).length > 0,
        friday: filterWorksDay(5).length > 0,
        saturday: filterWorksDay(6).length > 0,
        sunday: filterWorksDay(7).length > 0,
      });
      setStartTime({
        start1: (filterWorksDay(1).length > 0 && filterWorksDay(1)[0].start) ? filterWorksDay(1)[0].start : '08:00',
        finish1: (filterWorksDay(1).length > 0 && filterWorksDay(1)[0].finish) ? filterWorksDay(1)[0].finish : '17:00',
        start2: (filterWorksDay(2).length > 0 && filterWorksDay(2)[0].start) ? filterWorksDay(2)[0].start : '08:00',
        finish2: filterWorksDay(2).length > 0 ? filterWorksDay(2)[0].finish : '17:00',
        start3: filterWorksDay(3).length > 0 ? filterWorksDay(3)[0].start : '08:00',
        finish3: filterWorksDay(3).length > 0 ? filterWorksDay(3)[0].finish : '17:00',
        start4: filterWorksDay(4).length > 0 ? filterWorksDay(4)[0].start : '08:00',
        finish4: filterWorksDay(4).length > 0 ? filterWorksDay(4)[0].finish : '17:00',
        start5: filterWorksDay(5).length > 0 ? filterWorksDay(5)[0].start : '08:00',
        finish5: filterWorksDay(5).length > 0 ? filterWorksDay(5)[0].finish : '17:00',
        start6: filterWorksDay(6).length > 0 ? filterWorksDay(6)[0].start : '08:00',
        finish6: filterWorksDay(6).length > 0 ? filterWorksDay(6)[0].finish : '17:00',
        start7: filterWorksDay(7).length > 0 ? filterWorksDay(7)[0].start : '08:00',
        finish7: filterWorksDay(7).length > 0 ? filterWorksDay(7)[0].finish : '08:00',
      });
    }
  }, [filterWorksDay, workTime.work_time]);

  const saveTime = useCallback((payload) => {
    const daysData = [];
    Object.values(payload.days).forEach((item, index) => {
      if (item) {
        daysData.push({
          day: index + 1,
          start: payload.startTime[`start${index + 1}`],
          finish: payload.startTime[`finish${index + 1}`],
        });
      }
    });
    const data = {
      week_start: payload.inputValues.week_start,
      week_start_time: payload.inputValues.week_start_time,
      working_hours:  payload.inputValues.working_hours,
      work_days: [...daysData],
    };
    dispatch(patchWorkTime(data, params.id));
  }, [dispatch, params.id]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setInputValues({ ...inputValues, [name]: value });
    saveTime({
      inputValues: { ...inputValues, [name]: value },
      startTime,
      days,
    });
  };

  const handleChangeStartTime = (event) => {
    const { name, value } = event.target;
    setStartTime({ ...startTime, [name]: value });
    saveTime({
      inputValues,
      days,
      startTime: { ...startTime, [name]: value },
    });
  };

  const handleChangeDays = (event) => {
    setDays({ ...days, [event.target.name]: event.target.checked });
    saveTime({
      days: { ...days, [event.target.name]: event.target.checked },
      inputValues,
      startTime,
    });
  };

  return (
    <MainLayout>
      <Dashboard>
        <TitleBlock
          title='Work Time'
        >
          <WorkTimeIcon />
        </TitleBlock>
        <PageLayout>
          {
            isLoading ? <Progress />
              : (
                <>
                  <StartWeek
                    styles={styles}
                    days={workTime.days}
                    workTime={workTime.work_time}
                    handleInputChange={handleInputChange}
                    inputValues={inputValues}
                  />
                  <WorkingTime
                    styles={styles}
                    days={days}
                    handleChangeDays={handleChangeDays}
                    startTime={startTime}
                    handleChangeStartTime={handleChangeStartTime}
                  />
                  <WorkingDays
                    styles={styles}
                    inputValues={inputValues}
                    workingDays={workingDays}
                    companyId={params.id}
                    year={yearWorkingDays}
                    setYear={setYearWorkingDays}
                    setWorkingHours={handleInputChange}
                  />
                  <Holidays
                    styles={styles}
                    holidays={nationalHolidays}
                    companyHolidays={companyHolidays}
                    companyId={params.id}
                    year={year}
                    setYear={setYear}
                  />
                </>
              )
          }
          <Snackbar
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            ContentProps={{
              classes: {
                root: typeSnackbar === 'error' ? classes.error : classes.success,
              },
            }}
            severity='error'
            open={isSnackbar}
            message={textSnackbar}
            key='right'
          />
        </PageLayout>
      </Dashboard>
    </MainLayout>
  );
}
