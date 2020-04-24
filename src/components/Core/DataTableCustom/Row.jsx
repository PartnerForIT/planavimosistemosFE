import React, { useState } from 'react';
import classNames from 'classnames';
import styles from './DTM.module.scss';
import StyledCheckbox from '../Checkbox/Checkbox';
import SimpleTable from './SimpleTable';
import TriangleIcon from '../../Icons/TriangleIcon';
import ApprovedIcon from '../../Icons/ApprovedIcon';
import SuspendedIcon from '../../Icons/SuspendedIcon';
import PendingIcon from '../../Icons/PendingIcon';

const Row = ({
  row, columns, fieldIcons, selectable, onSelect, selectedItem, setSelectedItem, reports, columnsWidth,
  totalCustomColumns, totalCustomWidthColumns,
}) => {
  const [subTableExpanded, setSubTableExpanded] = useState(false);

  const triangleIconClasses = classNames(
    styles.collapsIcon,
    {
      [styles.collapsIconRotated]: subTableExpanded,
      [styles.collapsIconSelected]: selectedItem && selectedItem.id === row.id && !reports,
    },
  );

  const rowClasses = classNames(
    styles.flexRowGroup,
    styles.cell,
    {
      [styles.pointer]: row.data && row.data.columns && row.data.items,
      [styles.flexRowSelected]: selectedItem && selectedItem.id === row.id && !reports,
      [styles.reportsFlexRowSelected]: subTableExpanded && reports,
      [styles.flexRowGroupReports]: reports,
    },
  );

  const rowWrapperClasses = classNames(
    styles.rowWrapper,
    { [styles.rowSelected]: selectedItem && selectedItem.id === row.id && !reports },
    { [styles.reportsRowSelected]: subTableExpanded && reports },
  );

  const Components = {
    Approved: <ApprovedIcon className={classNames(
      { [styles.approvedIconSelected]: selectedItem && selectedItem.id === row.id },
    )}
    />,
    Suspended: <SuspendedIcon className={classNames(
      { [styles.suspendedIconSelected]: selectedItem && selectedItem.id === row.id },
    )}
    />,
    Pending: <PendingIcon className={classNames(
      { [styles.pendingIconSelected]: selectedItem && selectedItem.id === row.id },
    )}
    />,
  };

  const selectRow = (selectedRow) => {
    if (typeof setSelectedItem === 'function') setSelectedItem(selectedRow);
    setSubTableExpanded(!subTableExpanded);
  };

  return (
    <div
      className={classNames(styles.flexTable, styles.row)}
      role='rowgroup'
    >
      <div className={rowWrapperClasses}>
        {
          selectable && (
            <div
              className={classNames(styles.flexRowGroup, styles.cell, styles.checkboxCell)}
              role='cell'
            >
              <StyledCheckbox
                id={row.id}
                className={classNames(styles.checkbox)}
                checked={!!row.checked}
                onChange={onSelect}
              />
            </div>
          )
        }
        {
          columns.map((column, idx) => {
            let IconComponent = null;
            if (fieldIcons && fieldIcons[column.field] && fieldIcons[column.field].length) {
              const fieldIcon = fieldIcons[column.field].filter((icon) => icon.value === row[column.field])[0].value;
              IconComponent = Components[fieldIcon];
            }
            let width = '';
            let minWidth = null;
            if (totalCustomWidthColumns > 0) {
              if (columnsWidth[column.field]) {
                width = columnsWidth[column.field];
                minWidth = columnsWidth[column.field];
              } else {
                width = selectable
                  ? `calc((100% - ${totalCustomWidthColumns + 35}px) / ${columns.length - totalCustomColumns})`
                  : `calc((100% - ${totalCustomWidthColumns}px) / ${columns.length - totalCustomColumns})`;
              }
            } else {
              width = selectable
                ? `calc((100% - 35px) / ${columns.length})`
                : `calc((100%) / ${columns.length})`;
            }

            return (
              <div // eslint-disable-line jsx-a11y/no-static-element-interactions
                onClick={() => selectRow(row)}
                key={idx.toString()}
                className={rowClasses}
                style={{ width, minWidth }}
                role='cell'
              >
                {row.data && row.data.columns && row.data.items && idx === 0
                  ? <TriangleIcon className={triangleIconClasses} />
                  : null}
                {IconComponent}
                {row[column.field]}
              </div>
            );
          })
        }
      </div>
      {
        row.data && row.data.columns && row.data.items
          ? (
            <SimpleTable
              columns={row.data.columns}
              rows={row.data.items}
              expanded={subTableExpanded}
              selectable={selectable}
              reports={reports}
            />
          )
          : null
      }
    </div>
  );
};

export default Row;
