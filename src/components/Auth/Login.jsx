/* eslint-disable camelcase */
import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import BackgroundWrapper from './BackgroundWrapper';
import Card from '../Card';
import StyledCheckbox from '../Core/Checkbox/Checkbox';
import LockLoginIcon from '../Icons/LockLoginIcon';
import LoginIcon from '../Icons/LoginIcon';
import Logo from '../Logo';
import styles from './Login.module.scss';
import Input from '../Core/Input/Input';
import Button from '../Core/Button/Button';
import { authCheck, login } from '../../store/auth/actions';
import routes from '../../config/routes';
import {
  authErrorSelector,
  isLoadingSelector,
} from '../../store/auth/selectors';
import Progress from '../Core/Progress';

const LoginContainer = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const history = useHistory();
  const authError = useSelector(authErrorSelector);
  const isLoading = useSelector(isLoadingSelector);

  useEffect(() => {
    if (localStorage.getItem('token')) {
      dispatch(authCheck())
        .then((data) => {
          const {
            role_id: roleId,
            company_id: companyId,
          } = data.data.user;
          history.push(roleId === 1 ? routes.ORG_LIST : `${companyId}/settings/`);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    } else {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogin = () => {
    dispatch(login(email, password)).then((data) => {
      const {
        role_id: roleId,
        company_id: companyId,
      } = data.data.user;

      if (roleId === 1) {
        history.push(routes.ORG_LIST);
      } else {
        history.push(`/${companyId}/settings`);
      }
    }).catch(({ error }) => {
      if (error.response.data.error === 'Your account is blocked') {
        history.push('/locked');
      }
    });
  };
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleLogin();
    }
  };

  const Delimiter = () => (<div className={styles.delimiter} />);

  if (loading) {
    return (
      <div className={styles.porgressBlock}>
        <Progress />
      </div>
    );
  }

  return (
    <BackgroundWrapper className={styles.container}>
      <Card className={styles.wrapper}>
        <div className={styles.content}>
          <Logo />
          <Input
            placeholder='Email'
            underlined
            iconLeft
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={<LoginIcon />}
            error={authError}
            onKeyDown={handleKeyDown}
          />
          <Delimiter />
          <Input
            placeholder='Password'
            underlined
            iconLeft
            fullWidth
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete='current-password'
            icon={<LockLoginIcon />}
            error={authError}
            onKeyDown={handleKeyDown}
          />
          <div className={styles.errorBlock}>
            {
              authError?.response?.data?.error && (
                <p>{t('Wrong password or email')}</p>
              )
            }
          </div>
          <Delimiter />
          <div className={styles.buttons}>
            <StyledCheckbox label={t('Remember me')} onChange={() => null} />
            <Button onClick={handleLogin} size='medium' loading={isLoading}>
              {t('Login')}
            </Button>
          </div>
        </div>
      </Card>

      <footer>
        <Link to='/forgot-password' className={styles.forgotLink}>{t('Forgot your password?')}</Link>
      </footer>

    </BackgroundWrapper>
  );
};

export default LoginContainer;
