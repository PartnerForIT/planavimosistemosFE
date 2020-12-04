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

import styles from './overtime.module.scss';

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

  console.log('params', id)

  const isLoadind = useSelector(isLoadingSelector);
  const isSnackbar = useSelector(isShowSnackbar);
  const typeSnackbar = useSelector(snackbarType);
  const textSnackbar = useSelector(snackbarText);

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
              <div>Overtime {id}</div>
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