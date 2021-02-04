import React, { useEffect, useLayoutEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { isEmpty } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import getCompanyInfo from '../../../store/services/actions';
import companyServicesInfoSelector from '../../../store/services/selectors';
import styles from '../Login.module.scss';
import BackgroundWrapper from '../BackgroundWrapper';
import Card from '../../Card';
import Button from '../../Core/Button/Button';
import Input from '../../Core/Input/Input';
import passwordValidator from '../../Helpers/passwordValidator';
import LockLoginIcon from '../../Icons/LockLoginIcon';
import Logo from '../../Logo';
import classes from './InvitePage.module.scss';

const InvitePage = () => {
  const { t } = useTranslation();
  const { token } = useParams();
  const dispatch = useDispatch();

  const { email, security, company: { companyName = '' } } = useSelector(companyServicesInfoSelector);

  useLayoutEffect(() => {
    dispatch(getCompanyInfo(token));
  }, [dispatch, token]);

  const admin = true;
  const employee = false;

  const {
    minLength = 8, numbers = true, specialChars = true, uppercase = true,
  } = security;

  const [values, setValues] = useState({
    password: '',
    repeatPassword: '',
  });
  const [error, setError] = useState(null);

  const [matchError, setMatchError] = useState(false);

  const handleInput = (e) => {
    const fieldId = e.target.name;
    const text = e.target.value;
    setMatchError(false);
    if (text.trim()) {
      setValues((prevState) => ({
        ...prevState,
        [fieldId]: text,
      }));
    }
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

  return (
    <BackgroundWrapper className={classes.root}>
      <Card className={classes.card}>

        <Logo />
        <div className={classes.description}>
          <p>
            {
              employee && t(`You have been invited to the ${companyName} organization account as a company employee.`)
            }
            {
              admin && t(`You are the main admin user of the ${companyName} organization account.`)
            }
          </p>
          <p>
            {t('Your registered e-mail')}
            :
          </p>
          <p className={classes.black}>{email}</p>
          <p>{t('Please create your password and login')}</p>
        </div>
        <form>

          <div className={classes.formItem}>
            <Input
              name='password'
              value={values.password}
              fullWidth
              underlined
              iconLeft
              placeholder={t('Create password')}
              icon={<LockLoginIcon aria-hidden />}
              onChange={handleInput}
              onBlur={validateOnBlur}
            />
          </div>
          <div className={classes.formItem}>
            <Input
              name='repeatPassword'
              fullWidth
              value={values.repeatPassword}
              underlined
              iconLeft
              placeholder={t('Re-enter password')}
              icon={<LockLoginIcon aria-hidden />}
              onChange={handleInput}
              onBlur={validateOnBlur}
            />
          </div>
          <div className={styles.errorBlock}>
            {
              matchError && <p>{t('Passwords do not match')}</p>
            }
          </div>
          <div className={classes.buttonBlock}>
            <Button
              size='large'
              disabled={matchError || !values.password || !values.repeatPassword || error}
            >
              {t('Login')}
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

export default InvitePage;
