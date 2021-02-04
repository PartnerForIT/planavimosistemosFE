import classnames from 'classnames';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import classes from './styles.module.scss';
import ArrowBack from '../Icons/ArrowBack';

const GoBackLink = ({
  className, to = '/', onClick = null, hiddenText, text = 'Main menu', ...props
}) => {
  const history = useHistory();
  const { t } = useTranslation();

  return (
    <>
      <a
        href={to}
        onClick={!onClick ? () => history.push('/') : onClick}
        aria-label={t(text)}
        className={classnames(classes.link, className)}
        {...props}
      >
        <ArrowBack aria-hidden />
        <span style={hiddenText ? { visibility: 'hidden' } : {}}>{text}</span>
      </a>
    </>
  );
};

export default GoBackLink;
