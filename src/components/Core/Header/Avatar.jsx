import React, { useMemo } from 'react';
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

  const shortName = useMemo(
    () => user?.employee?.name?.slice(0, 1) + user?.employee?.surname?.slice(0, 1),
    [user.employee.name, user.employee.surname],
  );

  return (
    <div
      tabIndex={0}
      className={styles.userBlock}
      onClick={clickHandler}
      role='button'
      aria-haspopup='menu'
      onKeyDown={(event) => onKeyDown(event, () => clickHandler(event))}
    >
      <Avatar aria-hidden src={user?.employee?.photo}>
        {shortName}
      </Avatar>
      <span className={styles.userBlock__name} aria-label='user shortened name'>
        {shortName}
      </span>
    </div>
  );
}
