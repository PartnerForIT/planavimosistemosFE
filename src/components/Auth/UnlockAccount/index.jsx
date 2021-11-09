import React, {
  useEffect,
  useLayoutEffect,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';
import { setNewPassword, getCompanyInfo } from '../../../store/services/actions';
import companyServicesInfoSelector from '../../../store/services/selectors';
import BackgroundWrapper from '../BackgroundWrapper';
import Card from '../../Card';
import Logo from '../../Logo';
import classes from './UnlockAccount.module.scss';
import Button from '../../Core/Button/Button';

export default () => {
  const [values, setValues] = useState({
    password: '',
    repeatPassword: '',
  });

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


  useLayoutEffect(() => {
    dispatch(getCompanyInfo(token));
  }, [dispatch, token]);

  const onSubmit = () => {
    dispatch(setNewPassword({
      email,
      password_confirmation: values.repeatPassword,
      password: values.password,
      token,
    }))
      .then(({ data }) => {
        localStorage.setItem('token', data.token);
        history.push('/');
      })
      .catch((e) => console.log(e));
  };

  return (
    <BackgroundWrapper className={classes.root}>
      <Card className={classes.card}>
        <Logo />
        <div className={classes.description}>
          <p>
            {`${t('Unblock Account text')}:`}
          </p>
          <p className={classes.black}>
            {email}
          </p>
          <Button size='large' green>{t('Unblock Account')}</Button>
        </div>
      </Card>
    </BackgroundWrapper>
  );
};
