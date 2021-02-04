import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import BackgroundWrapper from '../background';
import Button from '../Core/Button/Button';
import ArrowBack from '../Icons/ArrowBack';
import RefreshArrow from '../Icons/RefreshArrow';
import classes from './styles.module.scss';

const Page404 = () => {
  const { t } = useTranslation();

  const history = useHistory();

  return (
    <BackgroundWrapper className={classes.root}>
      <a href='/' onClick={() => history.goBack()} className={classes.link}>
        <ArrowBack />
        {' '}
        <span>
          {t('Main menu')}
        </span>
      </a>
      <div className={classes.wrapper}>
        <h3>404</h3>
        <p>Page not found!</p>
        <p>Don’t worry, we have our best man working on fixing the persistent issue</p>
        <Button transparent size='medium'>
          <span className={classes.refresh}>
            {t('Refresh')}
            &nbsp;
            <RefreshArrow aria-hidden className={classes.icon} />
          </span>
        </Button>
      </div>
    </BackgroundWrapper>
  );
};

export default Page404;
