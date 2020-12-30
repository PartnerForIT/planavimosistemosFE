import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import styles from './header.module.scss';

export default function AvatarComponent() {
  const user = JSON.parse(localStorage.getItem('user'));
  return (
    <div className={styles.userBlock}>
      <Avatar>{user?.employee?.photo}</Avatar>
      <span className={styles.userBlock__name}>
        {user?.employee?.name?.slice(0, 1)}
        {user?.employee?.surname?.slice(0, 1)}
      </span>
    </div>
  );
}
