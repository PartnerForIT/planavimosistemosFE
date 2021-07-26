import React, {
  useEffect,
  useLayoutEffect,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';
import { isEmpty } from 'lodash';

import { setNewPassword, getCompanyInfo } from '../../../store/services/actions';
import companyServicesInfoSelector from '../../../store/services/selectors';
import BackgroundWrapper from '../BackgroundWrapper';
import passwordValidator from '../../Helpers/passwordValidator';
import Card from '../../Card';
import Button from '../../Core/Button/Button';
import Input from '../../Core/Input/Input';
import LockLoginIcon from '../../Icons/LockLoginIcon';
import Logo from '../../Logo';
import classes from './ResetPassword.module.scss';

const ResetPassword = () => {
  const [values, setValues] = useState({
    password: '',
    repeatPassword: '',
  });
  const [matchError, setMatchError] = useState(false);
  const [error, setError] = useState(false);

  const { t } = useTranslation();
  const { token } = useParams();
  const history = useHistory();
  const dispatch = useDispatch();

  const {
    email,
    security,
    loading,
  } = useSelector(companyServicesInfoSelector);
  const {
    minLength = 1,
    numbers = false,
    specialChars = false,
    uppercase = false,
  } = security;

  const handleInput = (e) => {
    const fieldId = e.target.name;
    const text = e.target.value;
    setMatchError(false);
    setValues((prevState) => ({
      ...prevState,
      [fieldId]: text,
    }));
  };
  const validateOnBlur = () => {
    if (values.password && values.repeatPassword) {
      if (values.password !== values.repeatPassword) {
        setMatchError(true);
      } else {
        setMatchError(false);
      }
    }
  };

  useLayoutEffect(() => {
    dispatch(getCompanyInfo(token));
  }, [dispatch, token]);
  useEffect(() => {
    if (values.password) {
      const { password: err } = passwordValidator({
        password: values.password, minLength, numbers, specialChars, uppercase,
      });
      if (!isEmpty(err)) {
        setError(err);
      } else {
        setError(null);
      }
    }
  }, [minLength, numbers, specialChars, uppercase, values.password]);

  const onSubmit = () => {
    dispatch(setNewPassword({
      email,
      password_confirmation: values.repeatPassword,
      password: values.password,
      token,
    }))
      .then(() => history.push('/'))
      .catch((e) => console.log(e));
  };

  return (
    <BackgroundWrapper className={classes.root}>
      <Card className={classes.card}>
        <Logo />
        <div className={classes.description}>
          <p>
            {`${t('You have initiated reset password process for your account')}:`}
          </p>
          <p className={classes.black}>
            {email}
          </p>
          <p>{t('Please create your new password')}</p>
        </div>
        <form>
          <div className={classes.formItem}>
            <Input
              name='password'
              type='password'
              value={values.password}
              placeholder='Create password'
              fullWidth
              iconLeft
              underlined
              icon={<LockLoginIcon />}
              autoComplete='password'
              onChange={handleInput}
              onBlur={validateOnBlur}
            />
          </div>
          <div className={classes.formItem}>
            <Input
              name='repeatPassword'
              type='password'
              value={values.repeatPassword}
              placeholder='Re-enter password'
              fullWidth
              iconLeft
              underlined
              icon={<LockLoginIcon />}
              autoComplete='password'
              onChange={handleInput}
              onBlur={validateOnBlur}
            />
          </div>
          <div className={classes.errorBlock}>
            {
              matchError && <p>{t('Passwords do not match')}</p>
            }
          </div>
          <div className={classes.buttonBlock}>
            <Button
              disabled={matchError || error || loading}
              onClick={onSubmit}
              size='big'
            >
              {t('Create')}
            </Button>
          </div>
          {
            error && (
              <p className={classes.error}>{error.message}</p>
            )
          }
        </form>
      </Card>
    </BackgroundWrapper>
  );
};

export default ResetPassword;
