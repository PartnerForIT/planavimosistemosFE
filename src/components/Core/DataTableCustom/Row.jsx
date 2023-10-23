import React, {
  useEffect, useMemo, useRef, useState,
} from 'react';
import classNames from 'classnames';
import styles from './DTM.module.scss';
import StyledCheckbox from '../Checkbox/Checkbox';
import SimpleTable from './SimpleTable';
import TriangleIcon from '../../Icons/TriangleIcon';
import ApprovedIcon from '../../Icons/ApprovedIcon';
import SuspendedIcon from '../../Icons/SuspendedIcon';
import PendingIcon from '../../Icons/PendingIcon';
import CheckStatus from '../../Icons/CheckStatus';
import DeleteIcon from '../../Icons/DeleteIcon';
import EditIconFixedFill from '../../Icons/EditIconFixedFill';

const Row = ({
  index, row, columns, fieldIcons, selectable, selectAll, onSelect, selectedItem, setSelectedItem, reports,
  columnsWidth, totalCustomColumns, totalCustomWidthColumns, statysIcon, editRow, removeRow, multiselect,
  hoverActions, hoverable = false, colored = { warning: false, error: false, success: false },
  withoutRightPanel = false, tableRef = null, onEditBreak,
  withoutShitCode,
}) => {
  const selected = useMemo(() => {
    if (multiselect) {
      return selectedItem.find((item) => item.id === row.id);
    }
    return selectedItem;
  }, [multiselect, row.id, selectedItem]);

  const [subTableExpanded, setSubTableExpanded] = useState(false);
  const [actionsVisible, setActionsVisible] = useState(false);

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const triangleIconClasses = classNames(
    styles.collapsIcon,
    {
      [styles.collapsIconRotated]: subTableExpanded,
      [styles.collapsIconSelected]: selected && selected.id === row.id && !reports,
    },
  );

  const rowClasses = classNames(
    styles.flexRowGroup,
    styles.cell,
    {
      [styles.pointer]: row.data && row.data.columns && row.data.items,
      [styles.flexRowSelected]: selected && selected.id === row.id && !reports,
      [styles.reportsFlexRowSelected]: subTableExpanded && reports,
      [styles.flexRowGroupReports]: reports,
    },
  );

  const rowWrapperClasses = classNames(
    styles.rowWrapper,
    { [styles.rowWarning]: (colored.warning && row.warning) },
    { [styles.rowError]: (colored.error && row.error) },
    { [styles.reportsRowSelected]: subTableExpanded && reports },
    { [styles.contentVisibility]: !hoverActions },
    { [styles.rowSuccess]: row.success },
  );

  const containerClasses = classNames(
    styles.flexTable, styles.row,
    { [styles.rowSelected]: (selected && selected.id === row.id && !reports) || (hoverable && actionsVisible) },
  );

  const Components = {
    Approved: <ApprovedIcon className={classNames(
      { [styles.approvedIconSelected]: selected && selected.id === row.id },
    )}
    />,
    Suspended: <SuspendedIcon className={classNames(
      { [styles.suspendedIconSelected]: selected && selected.id === row.id },
    )}
    />,
    Pending: <PendingIcon className={classNames(
      { [styles.pendingIconSelected]: selected && selected.id === row.id },
    )}
    />,
    'Stopped by System': <PendingIcon className={classNames(
      { [styles.pendingIconSelected]: selected && selected.id === row.id },
    )}
    />,
    'Stopped by Manager': <PendingIcon className={classNames(
      { [styles.pendingIconSelected]: selected && selected.id === row.id },
    )}
    />,
  };

  const selectRow = (selectedRow) => {
    if (typeof setSelectedItem === 'function') setSelectedItem(selectedRow);
    setSubTableExpanded(!subTableExpanded);
  };

  const onSelectHandler = (id, checked, e) => {
    if (!(colored.warning && row.warning)
        // && !(colored.error && row.error)
        && !(colored.success && row.success)) {
      onSelect(id, checked, e);
    }
  };

  const rowRef = useRef(null);

  useEffect(() => {
    const resize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  useEffect(() => {
    if (!index) {
      if (rowRef && tableRef) {
        const { left: rowLeft } = rowRef.current.getBoundingClientRect();
        const { right: tableRight } = tableRef.current.getBoundingClientRect();
        // const { width: actionsWidth } = actionsRef.current.getBoundingClientRect();
        document.documentElement.style.setProperty('--hover-actions-left',
          `${windowWidth - (rowLeft + windowWidth - tableRight)
          /* actions width */ - (withoutRightPanel ? 70 : 120) /* scroll width */ - (withoutRightPanel ? 17 : 32)}px`);
      }
    }
  }, [index, tableRef, windowWidth]);

  useEffect(() => {
    if (withoutShitCode) {
      return;
    }

    if (((colored.warning && row.warning)
        // || (colored.error && row.error)
        || (colored.success && row.success)) && row.checked) {
      onSelect(row.id, false);
    }
  }, [colored.success, colored.warning, onSelect, row.checked, row.id, row.success, row.warning]);

  return (
    <div
      className={containerClasses}
      role='rowgroup'
      onMouseEnter={hoverActions ? () => setActionsVisible(true) : null}
      onMouseLeave={hoverActions ? () => setActionsVisible(false) : null}
      ref={rowRef}
    >
      {
        hoverActions && (
          <RowActions
            editRow={editRow}
            removeRow={removeRow}
            visible={actionsVisible || (selected && selected.id === row.id && !reports)}
            absolute
            id={row.id}
          />
        )
      }
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
                onChange={onSelectHandler}
                disabled={(colored.warning && row.warning)
                // || (colored.error && row.error)
                || (colored.success && row.success)}
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
            let minWidth = column.minWidth || null;
            const offsetSelectable = selectable && !selectAll ? 5 : 35;
            if (totalCustomWidthColumns > 0) {
              if (columnsWidth[column.field]) {
                minWidth = selectable && idx === 0
                  ? columnsWidth[column.field] - offsetSelectable
                  : columnsWidth[column.field];
                width = minWidth;
              } else {
                width = selectable
                  ? `calc((100% - ${totalCustomWidthColumns
                    + offsetSelectable}px) / ${columns.length - totalCustomColumns})`
                  : `calc((100% - ${totalCustomWidthColumns}px) / ${columns.length - totalCustomColumns})`;
              }
            } else {
              width = selectable
                ? `calc((100% - ${offsetSelectable}px) / ${columns.length})`
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
                {column.field !== 'breaks' && (
                  <span className={(statysIcon && column.field === 'status' && width === 80) ? styles.opacityText : ''}>
                    {
                      row[column.field] !== 'tableActions'
                        && (column.cellRenderer ? column.cellRenderer(row) : row[column.field])
                    }
                  </span>
                )}
                {/* bor job breaks section */}
                {(column.field === 'breaks' && onEditBreak) 
                  && (
                    row[column.field] && row[column.field].length ? 
                    <span className={styles.existedBreak} onClick={() => onEditBreak(row.id)}>{row[column.field].map((item) => `${item.start.slice(0, 5)} - ${item.end.slice(0, 5)}`).join("; ")}</span> :
                    <span className={styles.addBreak} onClick={() => onEditBreak(row.id)}>+</span>
                  )
                }
                {/* icon statys */}
                {(statysIcon && column.field === 'status' && (width === 80 || 80 - 35))
                  && (
                  <span className={styles.IconStatus}>
                    {row[column.field] === 1 && <CheckStatus />}
                    {row[column.field] === 0 && <CheckStatus fill='#FD9D27' />}
                    {row[column.field] === 2 && <CheckStatus fill='#fd0d1b' />}
                    {row[column.field] === 3 && <CheckStatus blocked />}
                  </span>
                  )}
                {
                  row[column.field] === 'tableActions'
                  && (
                    <RowActions editRow={editRow} removeRow={removeRow} id={row.id} />
                  )
                }
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
              columnsWidth={row.data.columnsWidth}
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

const RowActions = ({
  id, editRow, removeRow, absolute = false, visible = true,
}) => {
  const actionsClasses = classNames(
    styles.ActionsTable,
    (visible ? styles.actionsVisible : styles.actionsHidden),
    {
      [styles.absoluteActions]: absolute,
    },
  );

  return (
    <div className={actionsClasses}>
      <button onClick={() => editRow(id)}>
        <EditIconFixedFill className={styles.iconButtonRow} />
      </button>
      {
        removeRow && (
          <button onClick={() => removeRow(id)}>
            <DeleteIcon fill='#fd0d1b' className={styles.iconButtonRow} />
          </button>
        )
      }
    </div>
  );
};
