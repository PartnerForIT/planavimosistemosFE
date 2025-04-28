/* eslint-disable camelcase */
import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import Switch from 'react-switch';
import { makeStyles } from '@material-ui/core/styles';
import Snackbar from '@material-ui/core/Snackbar';

import {
  isLoadingSelector, isShowSnackbar,
  snackbarType, snackbarText, securityCompanySelector,
} from '../../../../store/settings/selectors';
import { getSecurityCompany, editSecurityPage } from '../../../../store/settings/actions';
import MaynLayout from '../../../Core/MainLayout';
import PageLayout from '../../../Core/PageLayout';
import TitleBlock from '../../../Core/TitleBlock';
import Dashboard from '../../../Core/Dashboard';
import SecurityIcon from '../../../Icons/Security';
import Progress from '../../../Core/Progress';
import Tooltip from '../../../Core/Tooltip';
import PasswordSetting from './passwordSetting';
import styles from './security.module.scss';

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

export default function Sesurity() {
  const { id } = useParams();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const classes = useStyles();

  const isLoadind = useSelector(isLoadingSelector);
  const isSnackbar = useSelector(isShowSnackbar);
  const typeSnackbar = useSelector(snackbarType);
  const textSnackbar = t(useSelector(snackbarText));
  const security = useSelector(securityCompanySelector);

  const [settings, setSettings] = useState({
    send_password: false,
    min_length: false,
    numbers: false,
    special_chars: false,
    uppercase: false,
    notify_admin: false,
  });
  const [min_password_length, setMin_password_length] = useState(6);
  const [login_attempts, setLogin_attempts] = useState('');

  const [invitation, setInvitation] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(getSecurityCompany(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (Object.keys(security).length > 0) {
      setInvitation(security.invitation === 1);
      setSettings({
        send_password: security.send_password === 1,
        min_length: !!((security.min_password_length && security.min_password_length > 4)),
        numbers: security.numbers === 1,
        special_chars: security.special_chars === 1,
        uppercase: security.uppercase === 1,
        notify_admin: security.notify_admin === 1,
      });
      setMin_password_length((security.min_password_length && security.min_password_length > 4)
        ? security.min_password_length
        : 6);
      setLogin_attempts((security.login_attempts && security.login_attempts > 0) ? security.login_attempts : '');
    }
  }, [security]);

  const changeSecuritySettings = useCallback((payload) => {
    const data = {
      send_password: payload.send_password,
      numbers: payload.numbers,
      special_chars: payload.special_chars,
      uppercase: payload.uppercase,
      notify_admin: payload.notify_admin,
      invitation: payload.invitation === true ? 1 : 0,
      min_password_length: payload.min_length ? payload.min_password_length : null,
      login_attempts: payload.login_attempts !== '' ? payload.login_attempts : null,
    };
    dispatch(editSecurityPage(data, id));
  }, [dispatch, id]);

  const handleChangeInvitation = () => {
    setInvitation(!invitation);
    changeSecuritySettings({
      ...settings,
      invitation: !invitation,
      min_password_length,
      login_attempts,
    });
  };

  const handleChangeSettings = (event) => {
    setSettings({ ...settings, [event.target.name]: event.target.checked });
    changeSecuritySettings({
      ...settings,
      [event.target.name]: event.target.checked,
      invitation,
      min_password_length,
      login_attempts,
    });
  };

  const handleChangeLoginAttempts = (value) => {
    setLogin_attempts(value);
    changeSecuritySettings({
      ...settings,
      invitation,
      min_password_length,
      login_attempts: value,
    });
  };

  const changeMinPassword = (event) => {
    if (event.target.value < 3) {
      setMin_password_length(3);
      changeSecuritySettings({
        ...settings,
        invitation,
        min_password_length: 3,
        login_attempts,
      });
    } else if (event.target.value > 12) {
      setMin_password_length(12);
      changeSecuritySettings({
        ...settings,
        invitation,
        min_password_length: 12,
        login_attempts,
      });
    } else {
      setMin_password_length(event.target.value);
      changeSecuritySettings({
        ...settings,
        invitation,
        min_password_length: event.target.value,
        login_attempts,
      });
    }
  };

  return (
    <MaynLayout>
      <Dashboard>
        <TitleBlock
          title={t('Security')}
        >
          <SecurityIcon />
        </TitleBlock>
        <PageLayout>
          {
            isLoadind ? <Progress />
              : (
                <div className={styles.securityPage}>
                  <div className={styles.labelBlock}>
                    <Switch
                      onChange={handleChangeInvitation}
                      offColor='#808F94'
                      onColor='#0085FF'
                      uncheckedIcon={false}
                      checkedIcon={false}
                      checked={invitation}
                      height={21}
                      width={40}
                    />
                    <div className={styles.label}>{t('Invitation link via e-mail')}</div>
                    <Tooltip title={t('Invitation link via e-mail')} />
                  </div>
                  <div className={styles.formLine} />
                  <PasswordSetting
                    settings={settings}
                    handleChangeSettings={handleChangeSettings}
                    t={t}
                    min_password_length={min_password_length}
                    changeMinPassword={changeMinPassword}
                    login_attempts={login_attempts}
                    setLogin_attempts={handleChangeLoginAttempts}
                  />
                </div>
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
