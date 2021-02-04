import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import styles from '../Auth/Login.module.scss';
import BackgroundWrapper from '../background';
import Card from '../Card';
import Button from '../Core/Button/Button';
import Input from '../Core/Input/Input';
import GoBackLink from '../GoBack';
import { validateEmail } from '../Helpers/emailValidation';
import EmailIcon from '../Icons/EmailIcon';
import Logo from '../Logo';
import classes from './ForgotPassword.module.scss';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState(false);

  const { t } = useTranslation();
  const history = useHistory();

  const changeInputHandler = (e) => {
    setError(false);

    const text = e.target.value;
    if (text.trim()) {
      setEmail(text);
    }
  };

  const onBlur = () => {
    setError(!validateEmail(email));
  };

  return (
    <BackgroundWrapper className={classes.root}>
      <Card className={classes.card}>
        <Logo />
        <GoBackLink text={t('Go back')} hiddenText onClick={() => history.goBack()} />
        <Input
          name='email'
          type='email'
          value={email}
          fullWidth
          iconLeft
          underlined
          icon={<EmailIcon />}
          autoComplete='email'
          onChange={changeInputHandler}
          onBlur={onBlur}
        />
        <div className={styles.errorBlock}>
          {error && email
            && <p>{t('Wrong email address')}</p>}
        </div>
        <div className={classes.buttonBlock}>
          <Button disabled={error || !email}>{t('Generate password')}</Button>
        </div>
      </Card>
    </BackgroundWrapper>
  );
};

export default ForgotPassword;
