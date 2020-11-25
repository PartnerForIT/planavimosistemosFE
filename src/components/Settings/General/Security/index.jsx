import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import Switch from "react-switch";
import {
  isLoadingSelector, isShowSnackbar,
  snackbarType, snackbarText, securityCompanySelector
} from '../../../../store/settings/selectors';
import { getSecurityCompany, editSecurityPage } from '../../../../store/settings/actions'
import MaynLayout from '../../../Core/MainLayout';
import PageLayout from '../../../Core/PageLayout';
import TitleBlock from '../../../Core/TitleBlock';
import Dashboard from '../../../Core/Dashboard';
import SecurityIcon from '../../../Icons/Security';
import Progress from '../../../Core/Progress';
import Snackbar from '@material-ui/core/Snackbar';
import Tooltip from '../../../Core/Tooltip';
import PasswordSetting from './passwordSetting';
import styles from './security.module.scss';

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

export default function Sesurity() {
  const params = useParams();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const classes = useStyles();

  const isLoadind = useSelector(isLoadingSelector);
  const isSnackbar = useSelector(isShowSnackbar);
  const typeSnackbar = useSelector(snackbarType);
  const textSnackbar = useSelector(snackbarText);
  const security = useSelector(securityCompanySelector);

  console.log('params', params)

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
    if (params.id) {
      dispatch(getSecurityCompany(params.id))
    }
  }, []);

  useEffect(() => {
    if (Object.keys(security).length > 0) {
      setInvitation(security.invitation === 1 ? true : false);
      setSettings({
        send_password: security.send_password === 1 ? true : false,
        min_length: (security.min_password_length && security.min_password_length > 4) ? true : false,
        numbers: security.numbers === 1 ? true : false,
        special_chars: security.special_chars === 1 ? true : false,
        uppercase: security.uppercase === 1 ? true : false,
        notify_admin: security.notify_admin === 1 ? true : false,
      })
      setMin_password_length((security.min_password_length && security.min_password_length > 4) ? security.min_password_length : 6);
      setLogin_attempts((security.login_attempts && security.login_attempts > 0) ? security.login_attempts : '')
    }
  }, [security])

  const handleChangeInvitation = () => {
    setInvitation(!invitation);
  }

  const handleChangeSettings = (event) => {
    setSettings({ ...settings, [event.target.name]: event.target.checked });
  };

  const changeMinPassword = (event) => {
    if (event.target.value < 3) {
      setMin_password_length(3)
    } else if (event.target.value > 12) {
      setMin_password_length(12)
    } else {
      setMin_password_length(event.target.value)
    }
  }

  const changeSecuritySettings = () => {
    const data = {
      send_password: settings.send_password,
      numbers: settings.numbers,
      special_chars: settings.special_chars,
      uppercase: settings.uppercase,
      notify_admin: settings.notify_admin,
      invitation: invitation === true ? 1 : 0,
      min_password_length: settings.min_length ? min_password_length : null,
      login_attempts: login_attempts !== '' ? login_attempts : null
    }
    dispatch(editSecurityPage(data, params.id))
  }

  return (
    <MaynLayout>
      <Dashboard>
        <TitleBlock
          title={"Security"}
        >
          <SecurityIcon />
        </TitleBlock>
        <PageLayout>
          {
            isLoadind ? <Progress /> :
              <div className={styles.securityPage}>
                <div className={styles.labelBlock}>
                  <Switch
                    onChange={handleChangeInvitation}
                    offColor={'#808F94'}
                    onColor={'#0085FF'}
                    uncheckedIcon={false}
                    checkedIcon={false}
                    checked={invitation}
                    height={21}
                    width={40}
                  />
                  <div className={styles.label}>{t('Invitation link via e-mail')}</div>
                  <Tooltip title={'Invitation link via e-mail'} />
                </div>
                <div className={styles.formLine}></div>
                <PasswordSetting
                  settings={settings}
                  handleChangeSettings={handleChangeSettings}
                  t={t}
                  min_password_length={min_password_length}
                  changeMinPassword={changeMinPassword}
                  login_attempts={login_attempts}
                  setLogin_attempts={setLogin_attempts}
                  changeSecuritySettings={changeSecuritySettings}
                />
              </div>
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