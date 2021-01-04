import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import styles from './header.module.scss';
import { onKeyDown } from '../../Helpers';

export default function AvatarComponent({
  setAnchorEl = () => ({}), setMenuOpen = () => ({}),
}) {
  const user = JSON.parse(localStorage.getItem('user'));

  const clickHandler = (e) => {
    setAnchorEl(e.currentTarget);
    setMenuOpen(true);
  };

  return (
    <div
      tabIndex={0}
      className={styles.userBlock}
      onClick={clickHandler}
      role='button'
      aria-haspopup='menu'
      onKeyDown={(event) => onKeyDown(event, () => clickHandler(event))}
    >
      <Avatar aria-hidden>{user?.employee?.photo}</Avatar>
      <span className={styles.userBlock__name} aria-label='user shortened name'>
        {user?.employee?.name?.slice(0, 1)}
        {user?.employee?.surname?.slice(0, 1)}
      </span>
    </div>
  );
}
