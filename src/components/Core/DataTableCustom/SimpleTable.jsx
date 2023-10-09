import React from 'react';
import classNames from 'classnames';
import styles from './DTM.module.scss';

import HolidayIcon from 'components/Core/HolidayIcon/HolidayIcon';

export default function SimpleTable({
  rows, columns, expanded, selectable, reports,
  columnsWidth,
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
          columns.map((column, idx) => {
            let width = `calc(100% / ${columns.length})`;
            let minWidth = `calc(100% / ${columns.length})`;
            if (columnsWidth && columnsWidth[column.field]) {
              width = columnsWidth[column.field];
              minWidth = columnsWidth[column.field];
              // minWidth = columnsWidth[column.field];
            }
            return (
              <div
                key={idx.toString()}
                className={simpleTableHeaderClasses}
                style={{ width, minWidth }}
                role='columnheader'
              >
                {column.label}
              </div>
            );
          })
        }
      </div>
      <div className={classNames(styles.simpleTableContent)}>
        {
          rows.map((row, idx) => (
            <div key={idx.toString()} className={classNames(styles.flexTable, styles.row)} role='rowgroup'>
              {
                columns.map((column, idz) => {
                  let width = `calc(100% / ${columns.length})`;
                  let minWidth = `calc(100% / ${columns.length})`;
                  if (columnsWidth && columnsWidth[column.field]) {
                    width = columnsWidth[column.field];
                    minWidth = columnsWidth[column.field];
                  }
                  return (
                    <div
                      key={idz.toString()}
                      className={simpleTableCellClasses}
                      style={{ width, minWidth }}
                      role='cell'
                    >
                      {row[column.field]}
                      {
                        column.field === 'date' && row.holiday && row.holiday.length ?
                          <HolidayIcon
                            holidays={row.holiday}
                            inline={true}
                          />
                        : null
                      }
                    </div>
                  );
                })
              }
            </div>
          ))
        }
      </div>
    </div>
  );
}
