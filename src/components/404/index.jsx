import React from 'react';
import { useTranslation } from 'react-i18next';
import BackgroundWrapper from '../Auth/BackgroundWrapper';
import Button from '../Core/Button/Button';
import GoBackLink from '../GoBack';
import RefreshArrow from '../Icons/RefreshArrow';
import classes from './styles.module.scss';

const Page404 = () => {
  const { t } = useTranslation();

  return (
    <BackgroundWrapper className={classes.root}>
      <GoBackLink text='Main menu' />
      <div className={classes.wrapper}>
        <h3>404</h3>
        <p>Page not found!</p>
        <p>Don’t worry, we have our best man working on fixing the persistent issue</p>
        <Button transparent size='medium' onClick={() => null}>
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
