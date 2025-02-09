import React, {
  useEffect,
  useLayoutEffect,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams, useHistory } from 'react-router-dom';
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
import { login } from '../../../store/auth/actions';
import routes from '../../../config/routes';

export default () => {
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
    min_password_length: minLength = 1,
    special_chars: specialChars = false,
    numbers = false,
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
    if (values.password !== values.repeatPassword) { setMatchError(true); } else { setMatchError(false); }
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
  }, [minLength, numbers, specialChars, uppercase, values.password, values.repeatPassword]);

  const onSubmit = async () => {
    await dispatch(setNewPassword({
      email,
      password_confirmation: values.repeatPassword,
      password: values.password,
      token,
    }))
      .then(({ data }) => {
        localStorage.setItem('token', data.access_token);
      })
      .catch((e) => console.log(e));
    await dispatch(login(email, values.password, false)).then((data) => {
      const {
        role_id: roleId,
        company_id: companyId,
      } = data.data.user;
      if (roleId === 1) {
        history.push(routes.ORG_LIST);
      } else {
        history.push(`/${companyId}/settings`);
      }
    });
  };
  if (!Object.keys(security).length && loading) {
    return (
      <BackgroundWrapper className={classes.root}>

      </BackgroundWrapper>
    )
  }
  if (!Object.keys(security).length && !loading) {
    //return <Page404 />;
    return (
      <BackgroundWrapper className={classes.root}>
        <Card className={classes.card}>
          <Logo />
          <div className={classes.description}>
            <p>
              {`${t('Oops! It seems that this link is no longer valid or has already been used to change the password. To initiate the process again, please click on the ‘Forgot Password?’ button below.')}`}
            </p>
          </div>
          <div className={classes.buttonBlock}>
            <Link
              className={classes.forgotLink}
              to='/forgot-password'
            >
              {t('Forgot Password?')}
            </Link>
          </div>
        </Card>
      </BackgroundWrapper>
    )
  }
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
              loading={loading}
              disabled={matchError || error}
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
