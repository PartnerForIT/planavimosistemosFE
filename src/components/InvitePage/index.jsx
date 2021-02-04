import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from '../Auth/Login.module.scss';
import BackgroundWrapper from '../background';
import Card from '../Card';
import Button from '../Core/Button/Button';
import Input from '../Core/Input/Input';
import LockLoginIcon from '../Icons/LockLoginIcon';
import Logo from '../Logo';
import classes from './InvitePage.module.scss';

const InvitePage = () => {
  const { t } = useTranslation();

  const companyName = 'companyName';
  const email = 'employee@hisemail.com';

  const [values, setValues] = useState({
    password: '',
    repeatPassword: '',
  });
  const [error, setError] = useState('');

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

  return (
    <BackgroundWrapper className={classes.root}>
      <Card className={classes.card}>

        <Logo />
        <div className={classes.description}>
          <p>
            {t(`You have been invited to the ${companyName} organization account as a company employee.`)}
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

          }

        </form>
      </Card>
    </BackgroundWrapper>
  );
};

export default InvitePage;
