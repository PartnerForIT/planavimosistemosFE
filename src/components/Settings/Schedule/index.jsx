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
import Select from '../../Core/SimpleSelect';
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

  const monthArr = [
    { code: 1, name: t('January') },
    { code: 2, name: t('February') },
    { code: 3, name: t('March') },
    { code: 4, name: t('April') },
    { code: 5, name: t('May') },
    { code: 6, name: t('June') },
    { code: 7, name: t('July') },
    { code: 8, name: t('August') },
    { code: 9, name: t('September') },
    { code: 10, name: t('October') },
    { code: 11, name: t('November') },
    { code: 12, name: t('December') },
  ];

  const [inputValues, setInputValues] = useState({
    clock_in_restriction: false,
    work_night_excel: false,
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
    let {
      name,
      value,
      checked,
      type,
    } = event.target;

    value = (name === 'accumulated_months' && value && [1,2,3,4,6].includes(value)) ? 1 : value;

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

  return (
    <MaynLayout>
      <Dashboard>
        <TitleBlock title={t('Schedule')}>
          <Schedule2Icon className={styles.icon} />
        </TitleBlock>
        <PageLayout>
          {
            isLoading ? <Progress />
              : (
                <>
                  <div className={styles.clockInRestriction}>
                    <Label text={t('Clock in restriction')} />
                    <Tooltip title={t('Clock in restriction')} />
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
                    <Switch
                      onChange={(checked) => { handleSetInputValues({ working_at_night: checked }); }}
                      offColor='#808F94'
                      onColor='#0085FF'
                      uncheckedIcon={false}
                      checkedIcon={false}
                      checked={inputValues.working_at_night || false}
                      height={21}
                      width={40}
                    />
                    <Label text={t('Work at night')} />
                  </div>
                  <div className={styles.dayStart}>
                    <div className={styles.dayStart__label}>
                      <Label text={`${t('Schedule Day View starts')}:`} />
                      <Tooltip title={t('Schedule Day View starts')} />
                    </div>
                    <SimpleSelect
                      className={styles.dayStart__select}
                      readOnly={!inputValues.working_at_night}
                      handleInputChange={handleChangeInput}
                      name='time_view_stats'
                      value={inputValues.time_view_stats}
                      options={timeHoursArr}
                      withoutSearch
                      fullWidth
                    />
                  </div>
                  <div className={styles.hr} />
                  <div className={styles.workAtNight}>
                    <Switch
                      onChange={(checked) => { handleSetInputValues({ deduct_break: checked }); }}
                      offColor='#808F94'
                      onColor='#0085FF'
                      uncheckedIcon={false}
                      checkedIcon={false}
                      checked={inputValues.deduct_break || false}
                      height={21}
                      width={40}
                    />
                    <Label text={t('Deduct automatic break time in Schedule module')} />
                  </div>
                  { inputValues.deduct_break && (
                    <div className={styles.clockIn}>
                      <Checkbox
                          onChange={handleChangeInput}
                          checked={inputValues.break_from_job}
                          label={t('Use employees Break Times from the Job Types')}
                          name='break_from_job'
                        />
                    </div>
                  )
                  }
                  <div className={styles.hr} />
                  <div className={styles.workAtNight}>
                    <Switch
                      onChange={(checked) => { handleSetInputValues({ place_timeline: checked }); }}
                      offColor='#808F94'
                      onColor='#0085FF'
                      uncheckedIcon={false}
                      checkedIcon={false}
                      checked={inputValues.place_timeline || false}
                      height={21}
                      width={40}
                    />
                    <Label text={t('Show place timeline')} />
                  </div>
                  <div className={styles.workAtNight}>
                    <Switch
                      onChange={(checked) => { handleSetInputValues({ shift_timeline: checked }); }}
                      offColor='#808F94'
                      onColor='#0085FF'
                      uncheckedIcon={false}
                      checkedIcon={false}
                      checked={inputValues.shift_timeline || false}
                      height={21}
                      width={40}
                    />
                    <Label text={t('Show shift timeline')} />
                  </div>
                  <div className={styles.workAtNight}>
                    <Switch
                      onChange={(checked) => { handleSetInputValues({ job_timeline: checked }); }}
                      offColor='#808F94'
                      onColor='#0085FF'
                      uncheckedIcon={false}
                      checkedIcon={false}
                      checked={inputValues.job_timeline || false}
                      height={21}
                      width={40}
                    />
                    <Label text={t('Show job type timeline')} />
                  </div>
                  <div className={styles.hr} />
                  <div className={styles.workAtNight}>
                    <Switch
                      onChange={(checked) => { handleSetInputValues({ request_dayoff: checked }); }}
                      offColor='#808F94'
                      onColor='#0085FF'
                      uncheckedIcon={false}
                      checkedIcon={false}
                      checked={inputValues.request_dayoff || false}
                      height={21}
                      width={40}
                    />
                    <Label text={t('Use request day off mobile')} />
                  </div>
                  <div className={styles.hr} />
                  <div className={styles.workAtNight}>
                    <Switch
                      onChange={(checked) => { handleSetInputValues({ use_accumulated: checked }); }}
                      offColor='#808F94'
                      onColor='#0085FF'
                      uncheckedIcon={false}
                      checkedIcon={false}
                      checked={inputValues.use_accumulated || false}
                      height={21}
                      width={40}
                    />
                    <Label text={t('Use accumulated hours calculation')} />
                  </div>
                  { inputValues.use_accumulated && (
                    <div className={styles.clockIn}>
                      <Checkbox
                          onChange={handleChangeInput}
                          checked={inputValues.accumulated_from_country}
                          label={t('Use target hours for the period from the country working days')}
                          name='accumulated_from_country'
                        />
                    </div>
                  )
                  }
                  { inputValues.use_accumulated && (
                    <div className={styles.accumalated}>
                      {t('Calculate')}
                      <Input
                        value={inputValues.accumulated_months}
                        name='accumulated_months'
                        type='number'
                        placeholder='0'
                        min='1'
                        max='12'
                        onChange={handleChangeInput}
                      />
                      {t('months accumulated hours')}
                    </div>
                  )
                  }
                  { inputValues.use_accumulated && (
                    <div className={styles.accumalated}>
                      {t('Period starts from the first day of this month')}
                      <Select
                        handleInputChange={handleChangeInput}
                        name='accumulated_start'
                        value={inputValues.accumulated_start}
                        options={monthArr}
                        className={styles.accumalated_select}
                      />
                    </div>
                  )
                  }
                  <div className={styles.hr} />
                  <div className={styles.clockIn}>
                    <Checkbox
                        onChange={handleChangeInput}
                        checked={inputValues.work_night_excel}
                        label={t('Show Work and Night time hours in Export Excel')}
                        name='work_night_excel'
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
