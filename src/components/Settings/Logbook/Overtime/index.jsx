import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import MaynLayout from '../../../Core/MainLayout';
import PageLayout from '../../../Core/PageLayout';
import TitleBlock from '../../../Core/TitleBlock';
import Dashboard from '../../../Core/Dashboard';
import OvertimeIcon from '../../../Icons/WorkTime';
import Progress from '../../../Core/Progress';
import Snackbar from '@material-ui/core/Snackbar';
import {
  isLoadingSelector, isShowSnackbar,
  snackbarType, snackbarText
} from '../../../../store/settings/selectors';
import { loadLogbookOvertime } from '../../../../store/settings/actions';
import Form from './Form';

import styles from '../logbook.module.scss';

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

export default function Overtime() {
  const { id } = useParams();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const classes = useStyles();

  const [overtimeData, setOvertimeData] = useState({
    status: true,
    daily_overtime_enable: false,
    daily_overtime: '',
    weekly_overtime_enable: false,
    weekly_overtime: '',
    saturday_overtime_enable: false,
    saturday_overtime: '',
    sunday_overtime_enable: false,
    sunday_overtime: '',
  });

  const isLoadind = useSelector(isLoadingSelector);
  const isSnackbar = useSelector(isShowSnackbar);
  const typeSnackbar = useSelector(snackbarType);
  const textSnackbar = useSelector(snackbarText);

  useEffect(() => {
    if (id) {
      dispatch(loadLogbookOvertime(id))
    }
  }, [])


  const handleInputChange = event => {
    const { name, value, type } = event.target;
    if (type === 'checkbox') {
      setOvertimeData({ ...overtimeData, [name]: !overtimeData[name] });
    } else {
      setOvertimeData({ ...overtimeData, [name]: value });
    }
  };

  const handleChangeCalculation = () => {
    setOvertimeData({ ...overtimeData, status: !overtimeData.status });
  }

  const submit = () => {
    console.log('submit')
  }

  return (
    <MaynLayout>
      <Dashboard>
        <TitleBlock
          title={"Overtime"}
        >
          <OvertimeIcon />
        </TitleBlock>
        <PageLayout>
          {
            isLoadind ? <Progress /> :
              <Form
                t={t}
                style={styles}
                submit={submit}
                handleInputChange={handleInputChange}
                handleChangeCalculation={handleChangeCalculation}
                overtimeData={overtimeData}
              />
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