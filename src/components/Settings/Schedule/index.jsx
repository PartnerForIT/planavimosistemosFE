import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import Switch from 'react-switch';
import { makeStyles } from '@material-ui/core/styles';
import Snackbar from '@material-ui/core/Snackbar';

import MaynLayout from '../../Core/MainLayout';
import PageLayout from '../../Core/PageLayout';
import TitleBlock from '../../Core/TitleBlock';
import Dashboard from '../../Core/Dashboard';
import Schedule2Icon from '../../Icons/Schedule2';
import Progress from '../../Core/Progress';
import {
  isShowSnackbar,
  snackbarType,
  snackbarText,
  scheduleLoadingSelector,
  scheduleSelector,
} from '../../../store/settings/selectors';
import {
  getSchedule,
  postSchedule,
} from '../../../store/settings/actions';
import { timeHoursArr } from '../../Helpers/time';

import Label from '../../Core/InputLabel';
import Input from '../../Core/Input/Input';
import Tooltip from '../../Core/Tooltip';
import Checkbox from '../../Core/Checkbox/Checkbox2';
import SimpleSelect from '../../Core/SimpleSelect';
import styles from './schedule.module.scss';

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

export default function ActivityLog() {
  const { id: companyId } = useParams();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const classes = useStyles();

  const [inputValues, setInputValues] = useState({
    clock_in_restriction: false,
  });

  const isSnackbar = useSelector(isShowSnackbar);
  const typeSnackbar = useSelector(snackbarType);
  const textSnackbar = useSelector(snackbarText);
  const isLoading = useSelector(scheduleLoadingSelector);
  const schedule = useSelector(scheduleSelector);

  useEffect(() => {
    dispatch(getSchedule(companyId));
  }, [dispatch, companyId]);

  useEffect(() => {
    if (schedule.company_id) {
      setInputValues({ ...schedule });
    }
  }, [schedule]);

  const handleSetInputValues = (nextState) => {
    const data = {
      ...inputValues,
      ...nextState,
    };
    setInputValues(data);
    dispatch(postSchedule(companyId, data));
  };
  const handleChangeInput = (event) => {
    const {
      name,
      value,
      checked,
      type,
    } = event.target;

    switch (type) {
      case 'checkbox': {
        handleSetInputValues({
          [name]: checked,
        });
        break;
      }
      default: {
        handleSetInputValues({
          [name]: value,
        });
      }
    }
  };
  const handleChangeSwitch = (checked) => {
    handleSetInputValues({
      working_at_night: checked,
    });
  };

  return (
    <MaynLayout>
      <Dashboard>
        <TitleBlock title='Schedule'>
          <Schedule2Icon className={styles.icon} />
        </TitleBlock>
        <PageLayout>
          {
            isLoading ? <Progress />
              : (
                <>
                  <div className={styles.clockInRestriction}>
                    <Label text={t('Clock in restriction')} />
                    <Tooltip title='Clock in restriction' />
                  </div>
                  <div className={styles.clockIn}>
                    <Checkbox
                      onChange={handleChangeInput}
                      checked={inputValues.clock_in_restriction}
                      label={t('Do not let to Clock-in to Scheduled work earlier than')}
                      name='clock_in_restriction'
                    />
                    <Input
                      value={inputValues.clock_in_minutes}
                      name='clock_in_minutes'
                      type='number'
                      placeholder='0'
                      min='0'
                      disabled={!inputValues.clock_in_restriction}
                      onChange={handleChangeInput}
                    />
                    {t('min')}
                  </div>
                  <div className={styles.hr} />
                  <div className={styles.workAtNight}>
                    <Label text={t('Work at night')} />
                    <Switch
                      onChange={handleChangeSwitch}
                      offColor='#808F94'
                      onColor='#0085FF'
                      uncheckedIcon={false}
                      checkedIcon={false}
                      checked={inputValues.working_at_night}
                      height={21}
                      width={40}
                    />
                  </div>
                  <div className={styles.dayStart}>
                    <div className={styles.dayStart__label}>
                      <Label text={`${t('Schedule Day View starts')}:`} />
                      <Tooltip title='Schedule Day View starts' />
                    </div>
                    <SimpleSelect
                      readOnly={!inputValues.working_at_night}
                      handleInputChange={handleChangeInput}
                      name='time_view_stats'
                      value={inputValues.time_view_stats}
                      options={timeHoursArr}
                      withoutSearch
                      fullWidth
                    />
                  </div>
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
            key='rigth'
          />
        </PageLayout>
      </Dashboard>
    </MaynLayout>
  );
}
