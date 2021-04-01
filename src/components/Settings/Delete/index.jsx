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
import DeleteIcon from '../../Icons/DeletePageIcon';
import Progress from '../../Core/Progress';
import {
  isLoadingSelector, isShowSnackbar,
  snackbarType, snackbarText, employeesSelector, deleteDataSelector,
} from '../../../store/settings/selectors';
import { loadEmployees, loadDeleteData, deleteDataCompany } from '../../../store/settings/actions';
import FilterDelete from './filterBlock';
import Table from './TableBlock';

import styles from './delete.module.scss';

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

  const [openDialog, setOpenDialog] = useState(false);

  const isLoading = useSelector(isLoadingSelector);
  const isSnackbar = useSelector(isShowSnackbar);
  const typeSnackbar = useSelector(snackbarType);
  const textSnackbar = useSelector(snackbarText);
  const { users: employeesArr } = useSelector(employeesSelector);
  const deleteData = useSelector(deleteDataSelector);

  useEffect(() => {
    dispatch(loadEmployees(id));
    dispatch(loadDeleteData(id));
  }, [dispatch, id]);

  useEffect(() => {
    setEmployees(employeesArr.map((item) => ({ fullName: `${item.name} ${item.surname}`, ...item })));
  }, [employeesArr]);

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

  const handleDialog = () => {
    setOpenDialog(false);
  };
  const cancelDelete = () => {
    setInputValues({ from: {}, employee: '' });
    setOpenDialog(false);
  };

  const employeeId = () => {
    // eslint-disable-next-line no-shadow
    const id = employeesArr.filter((item) => item.user_id === parseInt(inputValues.employee, 10));
    return id[0] ? `${id[0].id}` : '';
  };

  const submitDeleteData = () => {
    const data = {
      employee_id: parseInt(employeeId(), 10),
      date_from: moment(inputValues.from.startDate).format('YYYY-MM-DD'),
      date_to: moment(inputValues.from.endDate).format('YYYY-MM-DD'),
    };
    dispatch(deleteDataCompany(id, data));
    setOpenDialog(false);
    setInputValues({ from: {}, employee: '' });
  };

  return (
    <MaynLayout>
      <Dashboard withoutScroll>
        <TitleBlock
          title='Delete Data'
        >
          <DeleteIcon />
        </TitleBlock>
        <PageLayout>
          {
            isLoading ? <Progress />
              : (
                <>
                  <FilterDelete
                    style={styles}
                    inputValues={inputValues}
                    handleInputChange={handleInputChange}
                    employees={employees}
                    submitDeleteData={submitDeleteData}
                    setInputValues={setInputValues}
                    handleDialog={handleDialog}
                    cancelDelete={cancelDelete}
                    openDialog={openDialog}
                    setOpenDialog={setOpenDialog}
                    t={t}
                  />
                  <Table
                    style={styles}
                    deleteData={deleteData}
                    employees={employeesArr}
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
