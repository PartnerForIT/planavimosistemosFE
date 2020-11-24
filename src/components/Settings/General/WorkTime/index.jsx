import React, { useState, useEffect } from 'react'
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import MaynLayout from '../../../Core/MainLayout';
import PageLayout from '../../../Core/PageLayout';
import TitleBlock from '../../../Core/TitleBlock';
import Dashboard from '../../../Core/Dashboard'
import {
  isLoadingSelector, isShowSnackbar,
  snackbarType, snackbarText, settingWorkTime
} from '../../../../store/settings/selectors';
import { getSettingWorkTime, patchWorkTime } from '../../../../store/settings/actions';
import WorkTimeIcon from '../../../Icons/WorkTime';
import Progress from '../../../Core/Progress';
import Snackbar from '@material-ui/core/Snackbar';
import Holidays from './Holidays';
import StartWeek from './StartWeek';
import WorkingTime from './WorkingTime';
import styles from './workTime.module.scss';

const useStyles = makeStyles(() => ({
  error: {
    background: '#de4343',
    color: "#fff",
  },
  success: {
    background: '#3bc39e',
    color: "#fff",
  }
}));

export default function WorkTime() {
  const params = useParams();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const classes = useStyles();

  const [inputValues, setInputValues] = useState({
    week_start: '',
    week_start_time: '',
  });

  const [startTime, setStartTime] = useState({});

  const [days, setDays] = useState({
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false,
    sunday: false,
  })

  useEffect(() => {
    if (params.id) {
      dispatch(getSettingWorkTime(params.id))
    }
  }, []);

  const isLoadind = useSelector(isLoadingSelector);
  const isSnackbar = useSelector(isShowSnackbar);
  const typeSnackbar = useSelector(snackbarType);
  const textSnackbar = useSelector(snackbarText);
  const workTime = useSelector(settingWorkTime);

  const filterWorksday = (idDay) => {
    const arr = workTime.work_time.work_days.days.days.filter(item => item.day === idDay);
    return arr;
  }

  useEffect(() => {
    setInputValues({
      ...inputValues,
      week_start: workTime.work_time.week_start || '1',
      week_start_time: workTime.work_time.week_start_time || '08:00',
    });
    if (Object.keys(workTime.work_time).length > 0) {
      setDays({
        monday: filterWorksday(1).length > 0,
        tuesday: filterWorksday(2).length > 0,
        wednesday: filterWorksday(3).length > 0,
        thursday: filterWorksday(4).length > 0,
        friday: filterWorksday(5).length > 0,
        saturday: filterWorksday(6).length > 0,
        sunday: filterWorksday(7).length > 0,
      })
      setStartTime({
        start1: (filterWorksday(1).length > 0 && filterWorksday(1)[0].start) ? filterWorksday(1)[0].start : '08:00',
        finish1: (filterWorksday(1).length > 0 && filterWorksday(1)[0].finish) ? filterWorksday(1)[0].finish : '17:00',
        start2: (filterWorksday(2).length > 0 && filterWorksday(2)[0].start) ? filterWorksday(2)[0].start : '08:00',
        finish2: filterWorksday(2).length > 0 ? filterWorksday(2)[0].finish : '17:00',
        start3: filterWorksday(3).length > 0 ? filterWorksday(3)[0].start : '10:00',
        finish3: filterWorksday(3).length > 0 ? filterWorksday(3)[0].finish : '17:00',
        start4: filterWorksday(4).length > 0 ? filterWorksday(4)[0].start : '08:00',
        finish4: filterWorksday(4).length > 0 ? filterWorksday(4)[0].finish : '17:00',
        start5: filterWorksday(5).length > 0 ? filterWorksday(5)[0].start : '08:00',
        finish5: filterWorksday(5).length > 0 ? filterWorksday(5)[0].finish : '17:00',
        start6: filterWorksday(6).length > 0 ? filterWorksday(6)[0].start : '08:00',
        finish6: filterWorksday(6).length > 0 ? filterWorksday(6)[0].finish : '17:00',
        start7: filterWorksday(7).length > 0 ? filterWorksday(7)[0].start : '08:00',
        finish7: filterWorksday(7).length > 0 ? filterWorksday(7)[0].finish : '08:00',
      })
    }

  }, [workTime])

  const handleInputChange = event => {
    const { name, value } = event.target;
    setInputValues({ ...inputValues, [name]: value });
  };

  const handleChangeStartTime = event => {
    const { name, value } = event.target;
    setStartTime({ ...startTime, [name]: value });
  };

  const handleChangeDays = (event) => {
    setDays({ ...days, [event.target.name]: event.target.checked });
  };

  const saveTime = () => {
    const daysData = [];
    Object.values(days).map((item, index) => {
      if (item) {
        daysData.push({ 'day': index + 1, 'start': startTime[`start${index + 1}`], 'finish': startTime[`finish${index + 1}`] })
      }
    })
    const data = {
      week_start: inputValues.week_start,
      week_start_time: inputValues.week_start_time,
      work_days: {
        days: daysData
      }
    };
    dispatch(patchWorkTime(data, params.id))
  }

  return (
    <MaynLayout>
      <Dashboard>
        <TitleBlock
          title={"Work Time"}
        >
          <WorkTimeIcon />
        </TitleBlock>
        <PageLayout>
          {
            isLoadind ? <Progress /> :
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
                  holidays={workTime.national_holidays}
                  companyHolidys={workTime.work_time.holidays}
                  companyId={params.id}
                />
              </>
          }
          <Snackbar
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            ContentProps={{
              classes: {
                root: typeSnackbar === 'error' ? classes.error : classes.success
              }
            }}
            severity="error"
            open={isSnackbar}
            message={textSnackbar}
            key={"rigth"}
          />
        </PageLayout>
      </Dashboard>
    </MaynLayout>
  )
}