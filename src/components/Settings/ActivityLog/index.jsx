import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import MaynLayout from '../../Core/MainLayout';
import PageLayout from '../../Core/PageLayout';
import TitleBlock from '../../Core/TitleBlock';
import Dashboard from '../../Core/Dashboard';
import ActivityLogIcon from '../../Icons/ActivityLog';
import Progress from '../../Core/Progress';
import Snackbar from '@material-ui/core/Snackbar';
import {
  isLoadingSelector, isShowSnackbar,
  snackbarType, snackbarText, placesSelector, employeesSelector, activityLogSelector
} from '../../../store/settings/selectors';
import { loadPlace, loadEmployees, loadActivityLog } from '../../../store/settings/actions';
import Filter from './filter';
import Table from './table';

import styles from './activity.module.scss';

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


export default function ActivityLog() {
  const { id } = useParams();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const classes = useStyles();

  const [dateRange, setDateRange] = useState({});

  const [inputValues, setInputValues] = useState({
    from: '',
    employee: '',
    place: '',
  });

  const isLoadind = useSelector(isLoadingSelector);
  const isSnackbar = useSelector(isShowSnackbar);
  const typeSnackbar = useSelector(snackbarType);
  const textSnackbar = useSelector(snackbarText);
  const places = useSelector(placesSelector);
  const employees = useSelector(employeesSelector);
  const activityLog = useSelector(activityLogSelector);

  useEffect(() => {
    dispatch(loadPlace(id))
    dispatch(loadEmployees(id))
    dispatch(loadActivityLog(id))
  }, []);

  const handleInputChange = event => {
    const { name, value } = event.target;
    setInputValues({ ...inputValues, [name]: value });
  };

  return (
    <MaynLayout>
      <Dashboard>
        <TitleBlock
          title={"Activity Log"}
        >
          <ActivityLogIcon viewBox={'0 0 26 11'} fill={'rgba(226,235,244,0.85)'} />
        </TitleBlock>
        <PageLayout>
          {
            isLoadind ? <Progress /> :
              <>
                <Filter
                  inputValues={inputValues}
                  handleInputChange={handleInputChange}
                  style={styles}
                  places={places}
                  setDateRange={setDateRange}
                  dateRange={dateRange}
                  employees={employees}
                  t={t}
                />
                <Table
                  style={styles}
                  activityLog={activityLog}
                  employees={employees}
                  places={places}
                  t={t}
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
