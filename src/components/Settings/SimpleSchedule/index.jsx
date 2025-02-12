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

import Label from '../../Core/InputLabel';
import Input from '../../Core/Input/Input';
import Checkbox from '../../Core/Checkbox/Checkbox2';
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
    ignore_clockin_restriction: false,
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
        if (name === 'clock_in_restriction' && !checked) {
          handleSetInputValues({
            [name]: checked,
            ignore_clockin_restriction: false,
          });
        } else {
          handleSetInputValues({
            [name]: checked,
          });
        }
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
