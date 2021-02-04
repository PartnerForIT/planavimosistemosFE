import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import BackgroundWrapper from '../background';
import Card from '../Card';
import StyledCheckbox from '../Core/Checkbox/Checkbox';
import LockLoginIcon from '../Icons/LockLoginIcon';
import LoginIcon from '../Icons/LoginIcon';
import styles from './Login.module.scss';
import Input from '../Core/Input/Input';
import Button from '../Core/Button/Button';
import { login } from '../../store/auth/actions';
import routes from '../../config/routes';
import { authErrorSelector } from '../../store/auth/selectors';

const LoginContainer = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const history = useHistory();
  const authError = useSelector(authErrorSelector);

  useEffect(() => {
    const checkAuth = async () => {
      const isAuthorized = await localStorage.getItem('token');
      if (isAuthorized && isAuthorized.length) history.goBack();
    };

    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogin = () => {
    dispatch(login(email, password)).then((data) => {
      const roleId = data.data.user.role_id;
      const company_id = data.data.user.id;
      roleId === 1 ? history.push(routes.ORG_LIST) : history.push(`${routes.LOGBOOK}/${company_id}`);
    }).catch((error) => {
      console.log('Login error', error);
    });
  };

  const Delimiter = () => (<div className={styles.delimiter} />);

  return (
    <BackgroundWrapper className={styles.container}>
      <Card className={styles.wrapper}>
        <div className={styles.content}>
          <p className={styles.title}>Sign In</p>
          <Input
            placeholder='Email'
            underline
            iconLeft
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={<LoginIcon />}
          />
          <Delimiter />
          <Input
            placeholder='Password'
            underline
            iconLeft
            fullWidth
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete='current-password'
            icon={<LockLoginIcon />}
          />
          <Delimiter />
          <Delimiter />
          <div className={styles.buttons}>
            <StyledCheckbox label={t('Remember me')} onChange={() => null} />
            <Button onClick={handleLogin}>{t('Sign in')}</Button>
          </div>
        </div>
        <div className={styles.errorBlock}>
          {
            authError && authError.response && authError.response.data && authError.response.data.error && (
              <p style={{ color: '#f44336' }}>{authError.response.data.error}</p>
            )
          }
        </div>
      </Card>
    </BackgroundWrapper>
  );
};

export default LoginContainer;
