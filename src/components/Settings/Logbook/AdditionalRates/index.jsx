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
import JournalIcon from '../../../Icons/JournalIcon';
import Progress from '../../../Core/Progress';
import {
  isLoadingSelector, isShowSnackbar,
  snackbarType, snackbarText, AdditionalRatesDataSelector,
} from '../../../../store/settings/selectors';
import { editLogbookAdditionalRates, loadLogbookAdditionalRates } from '../../../../store/settings/actions';
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
  {
    name: 'rates',
    module: 'rates',
  },
  {
    name: 'night_rates',
    module: 'night_rates',
  },
  {
    name: 'holiday_rates',
    module: 'holiday_rates',
  },
];

export default function AdditionalRates() {
  const { id } = useParams();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const classes = useStyles();
  const permissions = usePermissions(permissionsConfig);

  const [AdditionalRatesData, setAdditionalRatesData] = useState({
    night_time: false,
    night_time_time_start: '22:00',
    night_time_time_end: '06:00',
    night_time_type: 2,
    night_time_rate: 1.5,
    holiday: false,
    holiday_company: false,
    ignore_holiday_night_time: false,
    holiday_type: 2,
    holiday_rate: 1.5,
    holiday_night_type: 2,
    holiday_night_rate: 1.5,
  });

  const isLoadind = useSelector(isLoadingSelector);
  const isSnackbar = useSelector(isShowSnackbar);
  const typeSnackbar = useSelector(snackbarType);
  const textSnackbar = t(useSelector(snackbarText));
  const AdditionalRates = useSelector(AdditionalRatesDataSelector);

  useEffect(() => {
    if (id) {
      dispatch(loadLogbookAdditionalRates(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (Object.keys(AdditionalRates).length) {
      setAdditionalRatesData({ ...AdditionalRates });
    }
  }, [AdditionalRates]);

  const submit = useCallback((payload) => {
    const holiday_rate = document.querySelector('[name=\'holiday_rate\']:not(:disabled)')?.value ?? '';
    const night_time_rate = document.querySelector('[name=\'night_time_rate\']:not(:disabled)')?.value ?? '';
    const holiday_night_rate = document.querySelector('[name=\'holiday_night_rate\']:not(:disabled)')?.value ?? '';
    const data = {
      ...payload,
      holiday_rate: holiday_rate,
      night_time_rate: night_time_rate,
      holiday_night_rate: holiday_night_rate,
    };
    dispatch(editLogbookAdditionalRates(id, data));
  }, [dispatch, id]);

  const handleInputChange = (event) => {
    const {
      name,
      value,
      type,
    } = event.target;
    if (type === 'checkbox') {
      setAdditionalRatesData({
        ...AdditionalRatesData,
        [name]: !AdditionalRatesData[name],
      });
      submit({
        ...AdditionalRatesData,
        [name]: !AdditionalRatesData[name],
      });
    } else {
      setAdditionalRatesData({
        ...AdditionalRatesData,
        [name]: value,
      });
      submit({
        ...AdditionalRatesData,
        [name]: value,
      });
    }
  };

  const handleChangeCalculation = (name) => {
    setAdditionalRatesData({
      ...AdditionalRatesData,
      [name]: !AdditionalRatesData[name],
    });
    submit({
      ...AdditionalRatesData,
      [name]: !AdditionalRatesData[name],
    });
  };

  return (
    <MaynLayout>
      <Dashboard>
        <TitleBlock
          title={t('Additional rates')}
        >
          <JournalIcon />
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
                  AdditionalRatesData={AdditionalRatesData}
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
