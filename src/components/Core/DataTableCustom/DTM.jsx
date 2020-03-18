import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import { format } from 'date-fns';
import Group from './Group';
import styles from './DTM.module.scss';

export default function DenseTable({ data, columns }) {
  const useStyles = makeStyles({
    flexRow: {
      width: `calc(100% / ${columns.length})`,
      textAlign: 'left',
      padding: '0.5em 0.5em',
    },

    detailsRoot: {
      display: 'block',
    },
  });
  const classes = useStyles();

  return (
    <div className={classNames(styles.tableContainer)} role='table' aria-label='Destinations'>
      <div className={classNames(styles.flexTable, styles.header)} role='rowgroup'>
        {
          columns.map((column) => (
            <div
              className={classNames(classes.flexRow, styles.columnName)}
              role='columnheader'
            >
              {column.title}
            </div>
          ))
        }
      </div>
      {
        data.map((group) => (
          <Group
            label={format(new Date(group.label), 'EEEE, dd, MMMM, Y')}
            rows={group.items}
            columns={columns}
            titleColor={group.titleColor || null}
            titleBackground={group.backgroundColor || null}
          />
        ))
      }
    </div>
  );
}
