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
import TaskerIcon from '../../Icons/Tasker';
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

import Label from '../../Core/InputLabel';
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
    ignore_clockin_restriction: false,
    work_night_excel: false,
  });

  const isSnackbar = useSelector(isShowSnackbar);
  const typeSnackbar = useSelector(snackbarType);
  const textSnackbar = t(useSelector(snackbarText));
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
  
  return (
    <MaynLayout>
      <Dashboard>
        <TitleBlock title={t('Tasker')}>
          <TaskerIcon className={styles.icon} />
        </TitleBlock>
        <PageLayout>
          {
            isLoading ? <Progress />
              : (
                <>
                  <div className={styles.workAtNight}>
                    <Switch
                      onChange={(checked) => { handleSetInputValues({ use_publish: checked }); }}
                      offColor='#808F94'
                      onColor='#0085FF'
                      uncheckedIcon={false}
                      checkedIcon={false}
                      checked={inputValues.use_publish || false}
                      height={21}
                      width={40}
                    />
                    <Label text={t('Use publish month and change notifications')} />
                  </div>
                  <div className={styles.hr} />
                  <div className={styles.workAtNight}>
                    <Switch
                      onChange={(checked) => { handleSetInputValues({ group_timeline: checked }); }}
                      offColor='#808F94'
                      onColor='#0085FF'
                      uncheckedIcon={false}
                      checkedIcon={false}
                      checked={inputValues.group_timeline || false}
                      height={21}
                      width={40}
                    />
                    <Label text={t('Show group timeline')} />
                  </div>
                  <div className={styles.workAtNight}>
                    <Switch
                      onChange={(checked) => { handleSetInputValues({ subgroup_timeline: checked }); }}
                      offColor='#808F94'
                      onColor='#0085FF'
                      uncheckedIcon={false}
                      checkedIcon={false}
                      checked={inputValues.subgroup_timeline || false}
                      height={21}
                      width={40}
                    />
                    <Label text={t('Show sub-group timeline')} />
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
