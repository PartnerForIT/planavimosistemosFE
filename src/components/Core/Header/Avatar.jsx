import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import styles from './header.module.scss';
export default function AvatarComponent() {
  const user = JSON.parse(localStorage.getItem('user'))
  return(
    <div className={styles.userBlock}>
       <Avatar>{user&&user.name[0]}</Avatar>
       <span className={styles.userBlock__name}>{user.name}</span>
    </div>
  )
}