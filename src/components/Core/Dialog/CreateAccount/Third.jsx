import React from 'react';
import { useTranslation } from 'react-i18next';
import classnames from 'classnames';
import style from './CreateAccount.module.scss';
import Button from '../../Button/Button';
import UserCard from './UserCard';

function Third({
  user, previousStep, groups, places, skills,
}) {
  const { t } = useTranslation();

  return (
    <>
      <div className={style.thirdForm}>

        <div className={classnames(style.info, style.borderRight)}>
          <UserCard user={user} groups={groups} places={places} skills={skills} />
        </div>
        <div className={style.form}>
          form
        </div>

      </div>
      <div className={style.buttons}>
        <Button onClick={previousStep} size='big' cancel>{t('Back')}</Button>
        <Button onClick={() => ({})} size='big' green inverse>{t('Create and Invite')}</Button>
      </div>
    </>
  );
}

export default Third;
