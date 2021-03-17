import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { resetPassword } from '../../../store/services/actions';
import companyServicesInfoSelector from '../../../store/services/selectors';
import styles from '../Login.module.scss';
import BackgroundWrapper from '../BackgroundWrapper';
import Card from '../../Card';
import Button from '../../Core/Button/Button';
import Input from '../../Core/Input/Input';
import GoBackLink from '../../GoBack';
import { validateEmail } from '../../Helpers/emailValidation';
import EmailIcon from '../../Icons/EmailIcon';
import SuccessIcon from '../../Icons/SuccessIcon';
import Logo from '../../Logo';
import classes from './ForgotPassword.module.scss';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState(false);
  const [sent, setSent] = useState(false);

  const { t } = useTranslation();
  const history = useHistory();
  const dispatch = useDispatch();

  const { loading } = useSelector(companyServicesInfoSelector);

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

  const onSubmit = () => {
    dispatch(resetPassword(email))
      .then(() => setSent(true))
      .catch((e) => console.log(e));
  };

  return (
    <BackgroundWrapper className={classes.root}>
      {
        !sent
        && <GoBackLink text={t('Go back')} hiddenText onClick={() => history.goBack()} />
      }
      <Card className={classes.card}>
        <Logo />
        {
          !sent
            ? (
              <>
                <div className={classes.description}>
                  {t('Enter your email and we will send you a password reset link to your inbox')}
                </div>
                <Input
                  name='email'
                  type='email'
                  value={email}
                  placeholder='Enter your E-mail address'
                  fullWidth
                  iconLeft
                  underlined
                  icon={<EmailIcon />}
                  autoComplete='email'
                  onChange={changeInputHandler}
                  onBlur={onBlur}
                />
                <div className={styles.errorBlock}>
                  {
                    error && email && <p>{t('Wrong email address')}</p>
                  }
                </div>
              </>
            ) : (
              <>
                <p className={classes.description}>
                  {t('Password reset link has been sent to your inbox successfully')}
                </p>
                <p className={classes.description__email}>{email}</p>
              </>
            )
        }
        <div className={classes.buttonBlock}>
          {
            !sent
              ? (
                <Button
                  disabled={error || !email || loading}
                  onClick={onSubmit}
                >
                  {t('Reset password')}
                </Button>
              )
              : (
                <Button
                  green
                  aria-label='home'
                  onClick={() => history.replace('/')}
                >
                  <SuccessIcon aria-hidden />
                </Button>
              )
          }
        </div>
      </Card>
    </BackgroundWrapper>
  );
};

export default ForgotPassword;
