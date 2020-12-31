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
  });

  const [startTime, setStartTime] = useState({});
  const [year, setYear] = useState(new Date().getFullYear());

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
    ?.days?.days.filter((item) => item.day === idDay) ?? [],
  [workTime]);

  const [nationalHolidays, setNationalHolidays] = useState([]);
  const [companyHolidays, setCompanyHolidays] = useState([]);

  useEffect(() => {
    setCompanyHolidays(workTime.work_time?.holidays?.filter((item) => new Date(item.date).getFullYear() === year));
  }, [workTime.work_time.holidays, year]);

  useEffect(() => {
    setNationalHolidays(workTime.national_holidays?.filter((item) => new Date(item.date).getFullYear() === year));
  }, [workTime.national_holidays, year]);

  useEffect(() => {
    setInputValues({

      week_start: workTime.work_time?.week_start ?? '1',
      week_start_time: workTime.work_time?.week_start_time ?? '08:00',
    });
    if (Object.keys(workTime.work_time).length > 0) {
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

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setInputValues({ ...inputValues, [name]: value });
  };

  const handleChangeStartTime = (event) => {
    const { name, value } = event.target;
    setStartTime({ ...startTime, [name]: value });
  };

  const handleChangeDays = (event) => {
    setDays({ ...days, [event.target.name]: event.target.checked });
  };

  const saveTime = () => {
    const daysData = [];
    Object.values(days).forEach((item, index) => {
      if (item) {
        daysData.push({
          day: index + 1,
          start: startTime[`start${index + 1}`],
          finish: startTime[`finish${index + 1}`],
        });
      }
    });
    const data = {
      week_start: inputValues.week_start,
      week_start_time: inputValues.week_start_time,
      work_days: {
        days: daysData,
      },
    };
    dispatch(patchWorkTime(data, params.id));
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
                    saveTime={saveTime}
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
