import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import Card from '../../Card';
import Button from '../../Core/Button/Button';
import SuccessIcon from '../../Icons/SuccessIcon';
import Logo from '../../Logo';
import BackgroundWrapper from '../BackgroundWrapper';
import classes from './styles.module.scss';

const LockedAccount = () => {
  const { t } = useTranslation();

  const email = 'edgaras.vr@gmail.com';
  const history = useHistory();

  return (
    <BackgroundWrapper className={classes.root}>
      <Card className={classes.card}>
        <Logo />
        <p
          className={classes.title}
        >
          {`${t('Your account has been locked due to 5 failed login attempts, contact your company manager')}:`}
        </p>
        <p>{email}</p>
        <div className={classes.buttonBlock}>

          <Button
            red
            aria-label='home'
            danger
            onClick={() => history.replace('/')}
          >
            <SuccessIcon aria-hidden />
          </Button>
        </div>
      </Card>
    </BackgroundWrapper>
  );
};

export default LockedAccount;
