import React from 'react';
import moment from 'moment';
import Dialog from '../index';
import Button from '../../Button/Button';
import style from '../Dialog.module.scss';
import styles from './ImportIikoDialog.module.scss';
import classNames from 'classnames';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles({
  colorPrimary: {
    color: '#0087ff',
  },
});

export default function ImportIikoDialog({
  handleClose, title, open,
  buttonTitle, buttonTitle2, date, cancelImportIiko, submitImportIiko, result, resultText, loading
}) {
  const classes = useStyles();

  return (
    <Dialog handleClose={handleClose} open={open} title={title}>
      <div>
        {
          loading ? (
            <div className={classNames(styles.overlay, { [styles.overlayActive]: loading })}>
              <CircularProgress classes={{ colorPrimary: classes.colorPrimary }} />
            </div>
          ) : (
            <>
              <div className={styles.date}>
                <p>
                  {moment(date).format('YYYY-MM-DD')}
                </p>
              </div>
              <div className={styles.result}>
                { resultText != '' && (
                  result ? (
                      <p className={styles.success}>
                        {resultText}
                      </p>
                    ) : (
                      <p className={styles.error}>
                        {resultText}
                      </p>
                    )
                  )
                }
              </div>
            </>
          )
        }
      </div>
      { resultText == '' && (
        <div className={style.buttonsBlock}>
          <Button onClick={() => cancelImportIiko()} cancel size='big'>
            {buttonTitle2}
          </Button>
          <Button onClick={() => submitImportIiko()} size='big'>
            {buttonTitle}
          </Button>
        </div>
        )
      }
    </Dialog>
  );
}
