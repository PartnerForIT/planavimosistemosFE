import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
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
      const isAuthorized = await localStorage.getItem('user');
      if (isAuthorized && isAuthorized.length) history.goBack();
    };

    checkAuth();
  }, []);

  const handleLogin = () => {
    dispatch(login(email, password)).then(() => {
      history.push(routes.LOGBOOK);
    }).catch((error) => {
      console.log('Login error', error);
    });
  };

  const Delimiter = () => (<div className={styles.delimiter} />);

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.content}>
          <h3>Sign In</h3>
          <Input
            placeholder='Email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Delimiter />
          <Input
            placeholder='Password'
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Delimiter />
          <Button onClick={handleLogin}>{t('Sign in')}</Button>
        </div>
        <Delimiter />
        <div className={styles.errorBlock}>
          {
            authError && authError.response && authError.response.data && authError.response.data.error && (
              <p style={{ color: '#f44336' }}>{authError.response.data.error}</p>
            )
          }
        </div>
      </div>
    </div>
  );
};

export default LoginContainer;
