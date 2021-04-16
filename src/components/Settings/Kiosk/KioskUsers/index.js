import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import Snackbar from '@material-ui/core/Snackbar';
import { makeStyles } from '@material-ui/core/styles';

import MainLayout from '../../../Core/MainLayout';
import PageLayout from '../../../Core/PageLayout';
import TitleBlock from '../../../Core/TitleBlock';
import Dashboard from '../../../Core/Dashboard';
import Kiosk2Icon from '../../../Icons/Kiosk2';
import { isShowSnackbar, snackbarText, snackbarType } from '../../../../store/settings/selectors';

export default () => {
  const { t } = useTranslation();

  const isSnackbar = useSelector(isShowSnackbar);
  const typeSnackbar = useSelector(snackbarType);
  const textSnackbar = useSelector(snackbarText);

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
  const classes = useStyles();

  return (
    <MainLayout>
      <Dashboard withoutScroll>
        <TitleBlock
          title={t('Kiosk users')}
          info={{
            Users: 6,
            Yes: 1,
            No: 5,
          }}
          tooltip={t('Kiosk users')}
        >
          <Kiosk2Icon />
        </TitleBlock>
        <PageLayout>
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
    </MainLayout>
  );
};
