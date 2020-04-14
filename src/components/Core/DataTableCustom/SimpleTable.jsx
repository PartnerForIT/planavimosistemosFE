import React from 'react';
import classNames from 'classnames';
import styles from './DTM.module.scss';

export default function SimpleTable({
  rows, columns, expanded, selectable, reports,
}) {
  const simpleTableContainer = classNames(
    styles.simpleTableContainer,
    { [styles.simpleTableContainerHidden]: !expanded, [styles.simpleTableContainerShown]: expanded },
  );

  const simpleTableHeaderClasses = classNames(
    styles.flexRowSimpleTable,
    styles.columnName,
    { [styles.flexRowGlobalReports]: reports },
  );

  const simpleTableCellClasses = classNames(
    styles.flexRowSimpleTable,
    styles.cell,
    { [styles.flexRowGlobalReports]: reports },
  );

  return (
    <div
      className={simpleTableContainer}
      style={{
        width: selectable ? 'calc(100% - 50px)' : '100%',
        marginLeft: selectable ? '50px' : '0',
      }}
      role='table'
      aria-label='Destinations'
    >
      <div className={classNames(styles.flexTable, styles.header)} role='rowgroup'>
        {
          columns.map((column, idx) => (
            <div
              key={idx.toString()}
              className={simpleTableHeaderClasses}
              style={{ width: `calc(100% / ${columns.length})` }}
              role='columnheader'
            >
              {column.label}
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
                  <div
                    key={idz.toString()}
                    className={simpleTableCellClasses}
                    style={{ width: `calc(100% / ${columns.length})` }}
                    role='cell'
                  >
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
