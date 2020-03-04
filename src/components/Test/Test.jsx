import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
// import { useDispatch, useSelector } from 'react-redux';

import styles from './Test.module.scss';
import logo from '../../logo.svg';
// import { userSelector } from '../../store/auth/selectors';
// import { authCheck } from "../../store/auth/actions";

const Test = () => {
  const { t } = useTranslation();
  // const dispatch = useDispatch();
  // const user = useSelector(userSelector);

  useEffect(() => {
    // dispatch(authCheck()).then().catch()
    // do not add dispatch to the deps
  }, []);

  return (
    <div className={styles.app}>
      <header className={styles.appHeader}>
        <img src={logo} className={styles.appLogo} alt='logo' />
        <p>
          Edit
          {' '}
          <code>src/App.js</code>
          {' '}
          and save to reload.
        </p>
        <a
          className={styles.appLink}
          href='https://reactjs.org'
          target='_blank'
          rel='noopener noreferrer'
        >
          {t('Learn React')}
        </a>
      </header>
    </div>
  );
};

export default Test;
