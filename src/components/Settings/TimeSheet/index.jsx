import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import Snackbar from '@material-ui/core/Snackbar';

import MaynLayout from '../../Core/MainLayout';
import PageLayout from '../../Core/PageLayout';
import TitleBlock from '../../Core/TitleBlock';
import Dashboard from '../../Core/Dashboard';
import TimeSheetIcon from '../../Icons/TimeSheet';
import Progress from '../../Core/Progress';
import Form from './Form';
import {
  isLoadingSelector, isShowSnackbar,
  snackbarType, snackbarText, TimeSheetDataSelector, AdditionalRatesDataSelector,
} from '../../../store/settings/selectors';
import { loadTimeSheet, editTimeSheet } from '../../../store/settings/actions';
import styles from './timesheet.module.scss';

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

export default function TimeSheet() {
  const { id } = useParams();
  const classes = useStyles();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const isLoadind = useSelector(isLoadingSelector);
  const isSnackbar = useSelector(isShowSnackbar);
  const typeSnackbar = useSelector(snackbarType);
  const textSnackbar = useSelector(snackbarText);
  const timesheet = useSelector(TimeSheetDataSelector);
  const AdditionalRates = useSelector(AdditionalRatesDataSelector);

  const [timeSheetData, setTimeSheetData] = useState({
    total_hours: false,
    worked_hours: false,
    break_hours: false,
    night_hours: false,
    holiday_hours: false,
    overtime_hours: false,
    show_costs: false,
    working_days: false,
    use_accumulated: false,
  });

  useEffect(() => {
    dispatch(loadTimeSheet(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (Object.keys(timesheet).length) {
      setTimeSheetData({ ...timesheet });
    }
  }, [timesheet]);

  const submit = useCallback((payload) => {
    const data = {
      total_hours: payload.total_hours ? 1 : 0,
      worked_hours: payload.worked_hours ? 1 : 0,
      break_hours: payload.break_hours ? 1 : 0,
      night_hours: payload.night_hours ? 1 : 0,
      holiday_hours: payload.holiday_hours ? 1 : 0,
      overtime_hours: payload.overtime_hours ? 1 : 0,
      show_costs: payload.show_costs ? 1 : 0,
      working_days: payload.working_days ? 1 : 0,
      use_accumulated: payload.use_accumulated ? 1 : 0,
    };
    dispatch(editTimeSheet(id, data));
  }, [dispatch, id]);

  const handleInputChange = (event) => {
    const { name, value, type } = event.target;
    if (type === 'checkbox') {
      setTimeSheetData({ ...timeSheetData, [name]: !timeSheetData[name] });
      submit({ ...timeSheetData, [name]: !timeSheetData[name] });
    } else {
      setTimeSheetData({ ...timeSheetData, [name]: value });
      submit({ ...timeSheetData, [name]: value });
    }
  };
  
  return (
    <MaynLayout>
      <Dashboard>
        <TitleBlock
          title={t('Time Sheet')}
        >
          <TimeSheetIcon viewBox='0 0 26 26' fill='rgba(226,235,244,0.85)' />
        </TitleBlock>
        <PageLayout>
          {
            isLoadind ? <Progress />
              : (
                <Form
                  t={t}
                  style={styles}
                  handleInputChange={handleInputChange}
                  timeSheetData={timeSheetData}
                  AdditionalRates={AdditionalRates}
                />
              )
          }
        </PageLayout>
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
      </Dashboard>
    </MaynLayout>
  );
}