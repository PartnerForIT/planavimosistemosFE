import React from 'react';
import { useTranslation } from 'react-i18next';
import classnames from 'classnames';
import classes from './Roles.module.scss';

function RolesBlock({ roles = [] }) {
  const { t } = useTranslation();

  return (
    <div className={classes.roles}>

      <div className={classnames(classes.card, classes.default)}>
        <p className={classes.card_title}>New role</p>
        <small>{t('Create a new role')}</small>
      </div>

      <div className={classes.card}>
        <p className={classes.card_title}>New role</p>
        <small>{t('Create a new role')}</small>
      </div>
      {' '}
      <div className={classes.card}>
        <p className={classes.card_title}>New role</p>
        <small>{t('Create a new role')}</small>
      </div>
      {' '}
      <div className={classes.card}>
        <p className={classes.card_title}>New role</p>
        <small>{t('Create a new role')}</small>
      </div>
      {' '}
      <div className={classes.card}>
        <p className={classes.card_title}>New role</p>
        <small>{t('Create a new role')}</small>
      </div>
      {' '}
      <div className={classes.card}>
        <p className={classes.card_title}>New role</p>
        <small>{t('Create a new role')}</small>
      </div>

    </div>
  );
}

export default RolesBlock;
