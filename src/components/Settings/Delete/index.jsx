import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import MaynLayout from '../../Core/MainLayout';
import PageLayout from '../../Core/PageLayout';
import TitleBlock from '../../Core/TitleBlock';
import Dashboard from '../../Core/Dashboard';
import DeleteIcon from '../../Icons/DeletePageIcon';
import Progress from '../../Core/Progress';
import Snackbar from '@material-ui/core/Snackbar';
import {
  isLoadingSelector, isShowSnackbar,
  snackbarType, snackbarText, employeesSelector
} from '../../../store/settings/selectors';
import { loadEmployees } from '../../../store/settings/actions';

import FilterDelete from './filterBlock'

import styles from './delete.module.scss';

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

export default function AccountsList() {
  const { id } = useParams();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const classes = useStyles();

  const [employees, setEmployees] = useState([]);
  const [inputValues, setInputValues] = useState({
    from: {},
    employee: '',
  });

  const isLoadind = useSelector(isLoadingSelector);
  const isSnackbar = useSelector(isShowSnackbar);
  const typeSnackbar = useSelector(snackbarType);
  const textSnackbar = useSelector(snackbarText);
  const employeesArr = useSelector(employeesSelector);

  useEffect(() => {
    dispatch(loadEmployees(id))
  }, []);

  useEffect(() => {
    employeesArr.unshift({ id: 'select', name: 'Select employees' })
    setEmployees(employeesArr)
  }, [employeesArr]);

  const handleInputChange = event => {
    if (event.target) {
      const { name, value } = event.target;
      setInputValues({ ...inputValues, [name]: value });
    }
    else {
      if (event.endDate) {
        setInputValues({
          ...inputValues,
          from: {
            startDate: event.startDate,
            endDate: event.endDate
          }
        })
      }
    }
  };

  return (
    <MaynLayout>
      <Dashboard>
        <TitleBlock
          title={"Delete Data"}
        >
          <DeleteIcon />
        </TitleBlock>
        <PageLayout>
          {
            isLoadind ? <Progress /> :
              <>
                <FilterDelete
                  style={styles}
                  inputValues={inputValues}
                  handleInputChange={handleInputChange}
                  employees={employees}
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