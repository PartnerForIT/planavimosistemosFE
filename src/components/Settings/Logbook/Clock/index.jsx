import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import Snackbar from '@material-ui/core/Snackbar';
import MaynLayout from '../../../Core/MainLayout';
import PageLayout from '../../../Core/PageLayout';
import TitleBlock from '../../../Core/TitleBlock';
import Dashboard from '../../../Core/Dashboard';
import WorkTimeIcon from '../../../Icons/WorkTime';
import Progress from '../../../Core/Progress';
import {
  isLoadingSelector, isShowSnackbar,
  snackbarType, snackbarText, ClockDataSelector,
} from '../../../../store/settings/selectors';
import { editLogbookClock, loadLogbookClock } from '../../../../store/settings/actions';
import Form from './Form';
import usePermissions from '../../../Core/usePermissions';

import styles from '../logbook.module.scss';

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

const permissionsConfig = [
  {
    name: 'logbook_settings',
    permission: 'logbook_edit_settings',
  },
];

export default function Clock() {
  const { id } = useParams();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const classes = useStyles();
  const permissions = usePermissions(permissionsConfig);

  const [ClockData, setClockData] = useState({
    mobile_break_time: false,
    geolocation_restriction_clock_in: false,
    geolocation_restriction_clock_out: false,
  });

  const isLoadind = useSelector(isLoadingSelector);
  const isSnackbar = useSelector(isShowSnackbar);
  const typeSnackbar = useSelector(snackbarType);
  const textSnackbar = useSelector(snackbarText);
  const Clock = useSelector(ClockDataSelector);

  useEffect(() => {
    if (id) {
      dispatch(loadLogbookClock(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (Object.keys(Clock).length) {
      setClockData({ ...Clock });
    }
  }, [Clock]);

  const submit = useCallback((payload) => {
    const data = {
      ...payload,
    };
    dispatch(editLogbookClock(id, data));
  }, [dispatch, id]);

  const handleInputChange = (event) => {
    const {
      name,
      value,
      type,
    } = event.target;
    console.log('change', event);
    if (type === 'checkbox') {
      setClockData({
        ...ClockData,
        [name]: !ClockData[name],
      });
      submit({
        ...ClockData,
        [name]: !ClockData[name],
      });
    } else {
      setClockData({
        ...ClockData,
        [name]: value,
      });
      submit({
        ...ClockData,
        [name]: value,
      });
    }
  };

  const handleChangeCalculation = (name) => {
    setClockData({
      ...ClockData,
      [name]: !ClockData[name],
    });
    submit({
      ...ClockData,
      [name]: !ClockData[name],
    });
  };

  return (
    <MaynLayout>
      <Dashboard>
        <TitleBlock
          title={t('Clock')}
        >
          <WorkTimeIcon />
        </TitleBlock>
        <PageLayout>
          {
            isLoadind ? <Progress />
              : (
                <Form
                  t={t}
                  style={styles}
                  handleInputChange={handleInputChange}
                  handleChangeCalculation={handleChangeCalculation}
                  ClockData={ClockData}
                  readOnly={!permissions.logbook_settings}
                  permissions={permissions}
                />
              )
          }
          <Snackbar
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
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
