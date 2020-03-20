import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import styles from './DTM.module.scss';


export default function SimpleTable({
  rows, columns, expanded, selectable,
}) {
  const useStyles = makeStyles({
    flexRow: {
      display: 'flex',
      width: `calc(100% / ${columns.length})`,
      textAlign: 'left',
      padding: '0.5em 0',
    },

    detailsRoot: {
      display: 'block',
    },

    tableWidth: {
      width: selectable ? 'calc(100% - 50px)' : '100%',
      marginLeft: selectable ? '50px' : '0',
    },
  });
  const classes = useStyles();

  const simpleTableContainer = classNames(
    styles.simpleTableContainer,
    classes.tableWidth,
    { [styles.simpleTableContainerHidden]: !expanded, [styles.simpleTableContainerShown]: expanded },
  );

  return (
    <div className={simpleTableContainer} role='table' aria-label='Destinations'>
      <div className={classNames(styles.flexTable, styles.header)} role='rowgroup'>
        {
          columns.map((column, idx) => (
            <div
              key={idx.toString()}
              className={classNames(classes.flexRow, styles.columnName)}
              role='columnheader'
            >
              {column.title}
            </div>
          ))
        }
      </div>
      <div className={classNames(styles.simpleTableContent)}>
        {
          rows.map((row, idx) => (
            <div key={idx.toString()} className={classNames(styles.flexTable, styles.row)} role='rowgroup'>
              {
                columns.map((column, idz) => (
                  <div key={idz.toString()} className={classNames(classes.flexRow, styles.cell)} role='cell'>
                    {row[column.field]}
                  </div>
                ))
              }
            </div>
          ))
        }
      </div>
    </div>
  );
}
