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
  const { t } = useTranslation();
  const { token } = useParams();
  const history = useHistory();
  const dispatch = useDispatch();

  const {
    email,
    security,
    loading,
  } = useSelector(companyServicesInfoSelector);


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
          <Button className={classes.buttonBlock} size='large' green>{t('Unblock Account')}</Button>
        </div>
      </Card>
    </BackgroundWrapper>
  );
};
