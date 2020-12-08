import React from 'react';
import style from './grouping.module.scss';

export default function NoData({ title }) {
  return (
    <div className={style.noData}>
      <p>{title}</p>
    </div>
  );
}
