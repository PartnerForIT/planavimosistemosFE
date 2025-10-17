import React from 'react';
import { useSelector } from 'react-redux';
import Snackbar from '@material-ui/core/Snackbar';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';

import {
  isShowSnackbar as isShowOrgSnackbar,
  snackbarText as orgSnackbarText,
  snackbarType as orgSnackbarType,
} from '../../../store/organizationList/selectors';

import {
  isShowSnackbar as isShowSettingsSnackbar,
  snackbarText as settingsSnackbarText,
  snackbarType as settingsSnackbarType,
} from '../../../store/settings/selectors';

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

export default () => {
  const classes = useStyles();
  const { t } = useTranslation();

  // Read from organizationList state
  const isOrgSnackbar = useSelector(isShowOrgSnackbar);
  const orgType = useSelector(orgSnackbarType);
  const orgText = useSelector(orgSnackbarText);

  // Read from settings state
  const isSettingsSnackbar = useSelector(isShowSettingsSnackbar);
  const settingsType = useSelector(settingsSnackbarType);
  const settingsText = useSelector(settingsSnackbarText);

  // Determine which snackbar to show (settings takes priority if both are active)
  const isSnackbar = isSettingsSnackbar || isOrgSnackbar;
  const typeSnackbar = isSettingsSnackbar ? settingsType : orgType;
  const textSnackbar = t(isSettingsSnackbar ? settingsText : orgText);

  return (
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
      key='right'
    />
  );
};
