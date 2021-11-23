import React, { useMemo } from 'react';
import Avatar from '@material-ui/core/Avatar';
import { useSelector } from 'react-redux';

import styles from './header.module.scss';
import { onKeyDown } from '../../Helpers';
import { userSelector } from '../../../store/auth/selectors';

export default function AvatarComponent({
  setAnchorEl = () => ({}), setMenuOpen = () => ({}),
}) {
  const user = useSelector(userSelector);

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
