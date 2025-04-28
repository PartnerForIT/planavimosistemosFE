import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import Snackbar from '@material-ui/core/Snackbar';
import MaynLayout from '../../Core/MainLayout';
import PageLayout from '../../Core/PageLayout';
import TitleBlock from '../../Core/TitleBlock';
import Dashboard from '../../Core/Dashboard';
import ActivityLogIcon from '../../Icons/ActivityLog';
import Progress from '../../Core/Progress';
import {
  isLoadingSelector, isShowSnackbar,
  snackbarType, snackbarText, placesSelector, employeesSelector, activityLogSelector,
} from '../../../store/settings/selectors';
import {
  loadPlace, loadEmployees,
  // loadActivityLog,
  filterActivityLog,
} from '../../../store/settings/actions';
import Filter from './filter';
import Table from './table';

import styles from './activity.module.scss';

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
  const { id } = useParams();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const classes = useStyles();

  const [employees, setEmployees] = useState([]);
  const [places, setPlaces] = useState([]);
  const [inputValues, setInputValues] = useState({
    from: {},
    employee: '',
    place: '',
  });

  const isLoading = useSelector(isLoadingSelector);
  const isSnackbar = useSelector(isShowSnackbar);
  const typeSnackbar = useSelector(snackbarType);
  const textSnackbar = t(useSelector(snackbarText));
  const placesArr = useSelector(placesSelector);
  const { users: employeesArr } = useSelector(employeesSelector);
  const activityLog = useSelector(activityLogSelector);

  useEffect(() => {
    dispatch(loadPlace(id));
    dispatch(loadEmployees(id));
    // dispatch(loadActivityLog(id));
  }, [dispatch, id]);

  useEffect(() => {
    const data = {
      date_from: inputValues.from.startDate ? moment(inputValues.from.startDate).format('YYYY-MM-DD') : null,
      date_to: inputValues.from.endDate ? moment(inputValues.from.endDate).format('YYYY-MM-DD') : null,
      user_id: inputValues.employee !== t('Select employee') ? inputValues.employee : null,
      place_id: inputValues.place !== 'select' ? inputValues.place : null,
    };
    dispatch(filterActivityLog(id, data));
  }, [dispatch, id, inputValues, t]);

  useEffect(() => {
    setEmployees(employeesArr.map((item) => ({ fullName: `${item.name} ${item.surname}`, ...item })));
  }, [employeesArr]);

  useEffect(() => {
    setPlaces(placesArr);
  }, [placesArr]);

  const handleInputChange = (event) => {
    if (event.target) {
      const { name, value } = event.target;
      setInputValues({ ...inputValues, [name]: value });
    } else if (event.endDate) {
      setInputValues({
        ...inputValues,
        from: {
          startDate: event.startDate,
          endDate: event.endDate,
        },
      });
    }
  };

  return (
    <MaynLayout>
      <Dashboard>
        <TitleBlock
          title={t('Activity Log')}
        >
          <ActivityLogIcon viewBox='0 0 26 11' fill='rgba(226,235,244,0.85)' />
        </TitleBlock>
        <PageLayout>
          {
            isLoading ? <Progress />
              : (
                <>
                  <Filter
                    inputValues={inputValues}
                    handleInputChange={handleInputChange}
                    style={styles}
                    places={places}
                    employees={employees}
                    t={t}
                  />
                  <Table
                    style={styles}
                    activityLog={activityLog}
                    places={placesArr}
                    t={t}
                    isLoading={isLoading}
                  />
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
