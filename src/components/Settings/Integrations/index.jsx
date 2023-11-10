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
import IntegrationsIcon from '../../Icons/IntegrationsIcon';
import Progress from '../../Core/Progress';
import ImportIikoDialog from '../../Core/Dialog/ImportIikoDialog';
import Form from './Form';
import {
  isLoadingSelector, isShowSnackbar,
  snackbarType, snackbarText, IntegrationsDataSelector,
} from '../../../store/settings/selectors';
import { loadIntegrations, editIntegrations, importIiko } from '../../../store/settings/actions';
import styles from './integrations.module.scss';

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

export default function Integrations() {
  const { id } = useParams();
  const classes = useStyles();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [iiko_import_date, setIikoImportDate] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [result, setResult] = useState(false);
  const [resultText, setResultText] = useState(false);
  const [loading, setLoading] = useState(false);

  const isLoadind = useSelector(isLoadingSelector);
  const isSnackbar = useSelector(isShowSnackbar);
  const typeSnackbar = useSelector(snackbarType);
  const textSnackbar = useSelector(snackbarText);
  const integrations = useSelector(IntegrationsDataSelector);

  const [integrationsData, setIntegrationsData] = useState({
    excel: false,
    excel_rest_weekdays: false,
    excel_rest_weekends: false,
    excel_rest_weekdays_code: 'P',
    excel_rest_weekends_code: 'V',
    excel_work_hours: false,
    excel_break_hours: false,
    excel_night_work_hours: false,
    excel_holiday_hours: false,
    excel_overtime_hours: false,
    excel_cost: false,
    rivile: false,
    rivile_worked_hours: false,
    rivile_break_hours: false,
    rivile_night_hours: false,
    rivile_holiday_hours: false,
    rivile_overtime_hours: false,
    rivile_working_days: false,
    rivile_rest_days: false,

    rivile_worked_hours_code: '000000000001',
    rivile_break_hours_code: '000000000108',
    rivile_night_hours_code: '000000000101',
    rivile_holiday_hours_code: '000000000104',
    rivile_overtime_hours_code: '000000000102',
    rivile_working_days_code: 'D',
    rivile_rest_days_code: 'P',
    rivile_fraction_number: '',

    rivile_use_object: false,
    rivile_use_places_unit: false,

    iiko: false,
    iiko_link: '',
    iiko_key: '',
    iiko_login: '',
    iiko_time: '05:00',
  });

  useEffect(() => {
    dispatch(loadIntegrations(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (Object.keys(integrations).length) {
      setIntegrationsData({ ...integrations });
    }
  }, [integrations]);

  const submit = useCallback((payload) => {
    const data = {
      excel: payload.excel ? 1 : 0,
      excel_rest_weekdays: payload.excel_rest_weekdays ? 1 : 0,
      excel_rest_weekends: payload.excel_rest_weekends ? 1 : 0,
      excel_rest_weekdays_code: payload.excel_rest_weekdays_code ? payload.excel_rest_weekdays_code : '',
      excel_rest_weekends_code: payload.excel_rest_weekends_code ? payload.excel_rest_weekends_code : '',
      excel_work_hours: payload.excel_work_hours ? 1 : 0,
      excel_break_hours: payload.excel_break_hours ? 1 : 0,
      excel_night_work_hours: payload.excel_night_work_hours ? 1 : 0,
      excel_holiday_hours: payload.excel_holiday_hours ? 1 : 0,
      excel_overtime_hours: payload.excel_overtime_hours ? 1 : 0,
      excel_cost: payload.excel_cost ? 1 : 0,
      rivile: payload.rivile ? 1 : 0,
      rivile_worked_hours: payload.rivile_worked_hours ? 1 : 0,
      rivile_break_hours: payload.rivile_break_hours ? 1 : 0,
      rivile_night_hours: payload.rivile_night_hours ? 1 : 0,
      rivile_holiday_hours: payload.rivile_holiday_hours ? 1 : 0,
      rivile_overtime_hours: payload.rivile_overtime_hours ? 1 : 0,
      rivile_working_days: payload.rivile_working_days ? 1 : 0,
      rivile_rest_days: payload.rivile_rest_days ? 1 : 0,
      rivile_use_object: payload.rivile_use_object ? 1 : 0,
      rivile_use_places_unit: payload.rivile_use_places_unit ? 1 : 0,
      rivile_worked_hours_code: payload.rivile_worked_hours_code ? payload.rivile_worked_hours_code : '',
      rivile_break_hours_code: payload.rivile_break_hours_code ? payload.rivile_break_hours_code : '',
      rivile_night_hours_code: payload.rivile_night_hours_code ? payload.rivile_night_hours_code : '',
      rivile_holiday_hours_code: payload.rivile_holiday_hours_code ? payload.rivile_holiday_hours_code : '',
      rivile_overtime_hours_code: payload.rivile_overtime_hours_code ? payload.rivile_overtime_hours_code : '',
      rivile_working_days_code: payload.rivile_working_days_code ? payload.rivile_working_days_code : '',
      rivile_rest_days_code: payload.rivile_rest_days_code ? payload.rivile_rest_days_code : '',
      rivile_fraction_number: payload.rivile_fraction_number ? payload.rivile_fraction_number : '',
      iiko: payload.iiko ? 1 : 0,
      iiko_link: payload.iiko_link ? payload.iiko_link : '',
      iiko_login: payload.iiko_login ? payload.iiko_login : '',
      iiko_key: payload.iiko_key ? payload.iiko_key : '',
      iiko_time: payload.iiko_time ? payload.iiko_time : '05:00',
    };
    dispatch(editIntegrations(id, data));
  }, [dispatch, id]);

  const handleInputChange = (event) => {
    const { name, value, type } = event.target;
    if (type === 'checkbox') {
      setIntegrationsData({ ...integrationsData, [name]: !integrationsData[name] });
      submit({ ...integrationsData, [name]: !integrationsData[name] });
    } else {
      setIntegrationsData({ ...integrationsData, [name]: value });
      submit({ ...integrationsData, [name]: value });
    }
  };

  const handleSystemChange = (value, system) => {
    setIntegrationsData({ ...integrationsData, [system]: !integrationsData[system] });
    submit({ ...integrationsData, [system]: !integrationsData[system] });
  }

  const importIikoData = () => {
    setResultText(false)
    setResult(false)
    setOpenDialog(true)
  }

  const cancelImportIiko = () => {
    setOpenDialog(false)
  };

  const submitImportIiko = () => {
    setLoading(true);
    dispatch(importIiko(id, iiko_import_date)).then(({data}) => {
      if (data.success) {
        setResult(data.import)
        if (data.import) {
          setResultText(data.count + ' ' + t('employees work times were imported'))
        } else {
          setResultText(t('Nothing to import'))
        }
      } else {
        setResult(false)
        setResultText(t('Date not closed'))
      }
      setLoading(false)
    })
    .catch(() => setTimeout(() => setLoading(false), 3000));
  };
  
  return (
    <MaynLayout>
      <Dashboard>
        <TitleBlock
          title={t('Integrations')}
        >
          <IntegrationsIcon viewBox='0 0 26 26' fill='rgba(226,235,244,0.85)' />
        </TitleBlock>
        <PageLayout>
          {
            isLoadind ? <Progress />
              : (
                <Form
                  t={t}
                  style={styles}
                  handleInputChange={handleInputChange}
                  handleSystemChange={handleSystemChange}
                  integrationsData={integrationsData}
                  iiko_import_date={iiko_import_date}
                  setIikoImportDate={setIikoImportDate}
                  importIikoData={importIikoData}
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
        <ImportIikoDialog
          open={openDialog}
          handleClose={cancelImportIiko}
          title={t('Import this date?')}
          buttonTitle2={t('Cancel')}
          buttonTitle={t('Import')}
          date={iiko_import_date}
          submitImportIiko={submitImportIiko}
          cancelImportIiko={cancelImportIiko}
          loading={loading}
          result={result}
          resultText={resultText}
        />
      </Dashboard>
    </MaynLayout>
  );
}