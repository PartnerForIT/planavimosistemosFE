import React from 'react';
import { useSelector } from 'react-redux';
import Snackbar from '@material-ui/core/Snackbar';
import { makeStyles } from '@material-ui/core/styles';

import {
  isShowSnackbar,
  snackbarText,
  snackbarType,
} from '../../../store/organizationList/selectors';

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

  const isSnackbar = useSelector(isShowSnackbar);
  const typeSnackbar = useSelector(snackbarType);
  const textSnackbar = useSelector(snackbarText);

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
