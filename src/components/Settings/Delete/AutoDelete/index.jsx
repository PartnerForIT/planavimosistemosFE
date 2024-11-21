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
import DeleteIcon from '../../../Icons/DeletePageIcon';
import Progress from '../../../Core/Progress';
import {
  isLoadingSelector, isShowSnackbar,
  snackbarType, snackbarText, AutoDeleteDataSelector,
} from '../../../../store/settings/selectors';
import { editAutoDelete, loadAutoDelete } from '../../../../store/settings/actions';
import Form from './Form';
import usePermissions from '../../../Core/usePermissions';

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

const permissionsConfig = [
  {
    name: 'data_delete',
    permission: 'data_delete',
  },
];

export default function AutoDelete() {
  const { id } = useParams();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const classes = useStyles();
  const permissions = usePermissions(permissionsConfig);

  const [AutoDeleteData, setAutoDeleteData] = useState({
    data_delete: false,
    data_delete_days: '',
  });

  const isLoadind = useSelector(isLoadingSelector);
  const isSnackbar = useSelector(isShowSnackbar);
  const typeSnackbar = useSelector(snackbarType);
  const textSnackbar = useSelector(snackbarText);
  const AutoDelete = useSelector(AutoDeleteDataSelector);

  useEffect(() => {
    if (id) {
      dispatch(loadAutoDelete(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (Object.keys(AutoDelete).length) {
      setAutoDeleteData({ ...AutoDelete });
    }
  }, [AutoDelete]);

  const submit = useCallback((payload) => {
    const data = {
      ...payload,
    };
    dispatch(editAutoDelete(id, data));
  }, [dispatch, id]);

  const handleInputChange = (event) => {
    const {
      name,
      value,
      type,
    } = event.target;
    if (type === 'checkbox') {
      setAutoDeleteData({
        ...AutoDeleteData,
        [name]: !AutoDeleteData[name],
      });
    } else {
      setAutoDeleteData({
        ...AutoDeleteData,
        [name]: value,
      });
    }
  };

  const onSubmit = () => {
    submit({
      ...AutoDeleteData,
    });
  };

  return (
    <MaynLayout>
      <Dashboard>
        <TitleBlock
          title={t('Auto Delete')}
        >
          <DeleteIcon />
        </TitleBlock>
        <PageLayout>
          {
            isLoadind ? <Progress />
              : (
                <Form
                  t={t}
                  style={styles}
                  handleInputChange={handleInputChange}
                 // handleChangeCalculation={handleChangeCalculation}
                  AutoDeleteData={AutoDeleteData}
                  readOnly={!permissions.data_delete}
                  permissions={permissions}
                  onSubmit={onSubmit}
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
