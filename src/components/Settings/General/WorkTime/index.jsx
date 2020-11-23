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
import { getSettingWorkTime } from '../../../../store/settings/actions';
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

  useEffect(() => {
    setInputValues({
      ...inputValues,
      week_start: workTime.work_time.week_start || '1',
      week_start_time: workTime.work_time.week_start_time || '08:00',
    });
  }, [workTime])

  const handleInputChange = event => {
    const { name, value } = event.target;
    setInputValues({ ...inputValues, [name]: value });
  };

  const handleChangeDays = (event) => {
    setDays({ ...days, [event.target.name]: event.target.checked });
  };

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
                  inputValues={inputValues}
                />
                <Holidays
                  styles={styles}
                  holidays={workTime.national_holidays}
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