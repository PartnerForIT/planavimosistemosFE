import React, {
  //useState,
  useEffect,
  //useCallback
  } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import Snackbar from '@material-ui/core/Snackbar';

import MaynLayout from '../../Core/MainLayout';
import PageLayout from '../../Core/PageLayout';
import TitleBlock from '../../Core/TitleBlock';
import Dashboard from '../../Core/Dashboard';
import TimeOffIcon from '../../Icons/TimeOff';
import Progress from '../../Core/Progress';
import Form from './Form';
import {
  isLoadingSelector, isShowSnackbar,
  snackbarType, snackbarText,
  //TimeOffDataSelector, AdditionalRatesDataSelector,
} from '../../../store/settings/selectors';
// import { loadTimeOff, editTimeOff } from '../../../store/settings/actions';
import styles from './timeoff.module.scss';

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

export default function TimeOff() {
  const { id } = useParams();
  const classes = useStyles();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const isLoadind = useSelector(isLoadingSelector);
  const isSnackbar = useSelector(isShowSnackbar);
  const typeSnackbar = useSelector(snackbarType);
  const textSnackbar = useSelector(snackbarText);
  //const timeoff = useSelector(TimeOffDataSelector);

  // const [timeOffData, setTimeOffData] = useState({
    
  // });

  useEffect(() => {
    //dispatch(loadTimeOff(id));
  }, [dispatch, id]);

  // useEffect(() => {
  //   if (Object.keys(timeoff).length) {
  //     setTimeOffData({ ...timeoff });
  //   }
  // }, [timeoff]);

  // const submit = useCallback((payload) => {
  //   const data = {

  //   };
  //   //dispatch(editTimeOff(id, data));
  // }, [dispatch, id]);

  const handleInputChange = (event) => {
    // const { name, value, type } = event.target;
    // if (type === 'checkbox') {
    //   setTimeOffData({ ...timeOffData, [name]: !timeOffData[name] });
    //   submit({ ...timeOffData, [name]: !timeOffData[name] });
    // } else {
    //   setTimeOffData({ ...timeOffData, [name]: value });
    //   submit({ ...timeOffData, [name]: value });
    // }
  };
  
  return (
    <MaynLayout>
      <Dashboard>
        <TitleBlock
          title={t('Time Off')}
        >
          <TimeOffIcon viewBox='0 0 26 26' fill='rgba(226,235,244,0.85)' />
        </TitleBlock>
        <PageLayout>
          {
            isLoadind ? <Progress />
              : (
                <Form
                  t={t}
                  style={styles}
                  handleInputChange={handleInputChange}
                  //timeOffData={timeOffData}
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