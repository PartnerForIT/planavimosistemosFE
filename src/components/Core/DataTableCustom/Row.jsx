import React, {
  useEffect, useMemo, useRef, useState,
} from 'react';
import classNames from 'classnames';
import styles from './DTM.module.scss';
import StyledCheckbox from '../Checkbox/Checkbox';
import SimpleTable from './SimpleTable';
import Button from '../../Core/Button/Button';
import TriangleIcon from '../../Icons/TriangleIcon';
import ApprovedIcon from '../../Icons/ApprovedIcon';
import SuspendedIcon from '../../Icons/SuspendedIcon';
import PendingIcon from '../../Icons/PendingIcon';
import CheckStatus from '../../Icons/CheckStatus';
import DeleteIcon from '../../Icons/DeleteIcon';
import DuplicateIcon from '../../Icons/DuplicateIcon';
import EditIconFixedFill from '../../Icons/EditIconFixedFill';
import TimeOffIcon from '../../Icons/TimeOff';
import { useTranslation } from 'react-i18next';

const Row = ({
  index, row, columns, fieldIcons, selectable, selectAll, onSelect, selectedItem, setSelectedItem, reports,
  columnsWidth, totalCustomColumns, totalCustomWidthColumns, statysIcon, editRow, removeRow, multiselect,
  hoverActions, hoverable = false, colored = { warning: false, error: false, success: false },
  withoutRightPanel = false, tableRef = null, onEditBreak, onOpenAssignGroup, onOpenWorkTime, onEditAddress,
  withoutShitCode, duplicateRow, timeOffRow, tallRows, openButton,
}) => {
  const { t } = useTranslation();
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
      [styles.flexRowGroupTall]: tallRows,
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
    { [styles.flexTableTall]: tallRows },
    { [styles.notActiveRow]: row.not_active },
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
    'Left geozone': <PendingIcon className={classNames(
      { [styles.pendingIconSelected]: selected && selected.id === row.id },
    )}
    />,
    'Out of Geozone': <PendingIcon className={classNames(
      { [styles.pendingIconSelected]: selected && selected.id === row.id },
    )}
    />,
    'Turned off geolocation': <PendingIcon className={classNames(
      { [styles.pendingIconSelected]: selected && selected.id === row.id },
    )}
    />,
    'Turned off internet or app': <PendingIcon className={classNames(
      { [styles.pendingIconSelected]: selected && selected.id === row.id },
    )}
    />,
    'Logged off the APP': <PendingIcon className={classNames(
      { [styles.pendingIconSelected]: selected && selected.id === row.id },
    )}
    />
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

  const displaySubgroupsWithGroup = (subgroups, groups) => {
    let result = '';
    groups.forEach((item) => {
      result += `${item.name}`;
      const subgroupsInner = subgroups.filter((subgroup) => subgroup.parent_group_id === item.id);
      if (subgroupsInner.length) {
        result += " / "+subgroupsInner.map((subgroup) => `${subgroup.name}`).join(" / ").trim();
      }
      result += "; ";
    });

    subgroups.forEach((item) => {
      if (!groups.find((group) => group.id === item.parent_group_id)) {
        result += `${item?.parent_group?.name} / ${item.name} `;
        result += "; ";
      };
    });


    return result.trim('; ');
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
  }, [index, tableRef, windowWidth, withoutRightPanel]);

  useEffect(() => {
    if (withoutShitCode) {
      return;
    }

    if (((colored.warning && row.warning)
        // || (colored.error && row.error)
        || (colored.success && row.success)) && row.checked) {
      onSelect(row.id, false);
    }
  }, [colored.success, colored.warning, onSelect, row.checked, row.id, row.success, row.warning, withoutShitCode]);

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
            duplicateRow={duplicateRow}
            timeOffRow={timeOffRow}
            openButton={openButton}
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
              const fieldIcon = fieldIcons[column.field].filter((icon) => icon.value === row[column.field])[0]?.value;
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
                {column.field !== 'breaks' && column.field !== 'place_groups' && column.field !== 'work_time' && column.field !== 'place_address' && (
                  <span className={(statysIcon && column.field === 'status' && width === 80) ? styles.opacityText : ''}>
                    {
                      row[column.field] !== 'tableActions'
                        && (column.cellRenderer ? column.cellRenderer(row, t) : t(row[column.field]))
                    }
                  </span>
                )}
                {/* for job breaks section */}
                {(column.field === 'breaks' && onEditBreak) 
                  && (
                    row[column.field] && row[column.field].length ? 
                    <span className={styles.existedBreak} onClick={() => onEditBreak(row.id)}>{row[column.field].map((item) => `${item.start} - ${item.end}`).join("; ")}</span> :
                    <span className={styles.addBreak} onClick={() => onEditBreak(row.id)}>+</span>
                  )
                }
                {/* for groups section */}
                {(column.field === 'place_groups' && onOpenAssignGroup) 
                  && (
                    ((row['groups'] && row['groups'].length) || (row['subgroups'] && row['subgroups'].length)) ? 
                    <span className={styles.existedBreak} onClick={() => onOpenAssignGroup(row.id)}>
                      {displaySubgroupsWithGroup(row['subgroups'], row['groups'])}
                    </span> :
                    <span className={styles.addBreak} onClick={() => onOpenAssignGroup(row.id)}>+</span>
                  )
                }
                {/* for groups section */}
                {(column.field === 'work_time' && onOpenWorkTime) 
                  && (
                    (row['work_time'] && Object.keys(row['work_time']).some(day => row['work_time'][day].checked)) ? 
                    <span className={styles.existedBreak} onClick={() => onOpenWorkTime(row.id)}>
                      {Object.keys(row['work_time'])
                        .sort((a, b) => ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"].indexOf(a) - ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"].indexOf(b))
                        .filter((day) => row['work_time'][day].checked) // Filter out days where checked is false
                        .map((day) => {
                          const dayIndex = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"].indexOf(day) + 1; // Get the correct day index
                          return `${dayIndex} - (${row['work_time'][day].start} - ${row['work_time'][day].finish})`;
                        })
                        .join("/ ")}
                    </span> :
                    <span className={styles.addBreak} onClick={() => onOpenWorkTime(row.id)}>+</span>
                  )
                }
                {/* for groups section */}
                {(column.field === 'place_address' && onEditAddress)
                  && (
                    row['address'] ? 
                    <span className={styles.existedBreak} onClick={() => onEditAddress(row.id)}>{row['address']} {row['disable_rtt'] ? <span className={styles.rttOff}>RTT OFF</span> : null}</span> :
                    <span className={styles.addBreak} onClick={() => onEditAddress(row.id)}>+</span>
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
                    <RowActions editRow={editRow} removeRow={removeRow} duplicateRow={duplicateRow} timeOffRow={timeOffRow} openButton={openButton} id={row.id} />
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
  id, editRow, removeRow, duplicateRow, timeOffRow, openButton, absolute = false, visible = true,
}) => {
  const { t } = useTranslation();
  const actionsClasses = classNames(
    styles.ActionsTable,
    (visible ? styles.actionsVisible : styles.actionsHidden),
    {
      [styles.absoluteActions]: absolute,
      [styles.duplicateActions]: duplicateRow,
    },
  );

  return (
    <div className={actionsClasses}>
      {
        duplicateRow && (
          <button onClick={() => duplicateRow(id)} data-tooltip-html={t('Duplicate')} data-tooltip-id="tooltip_button">
            <DuplicateIcon className={styles.iconButtonRow} />
          </button>
        )
      }
      { 
        editRow && (
          <button onClick={() => editRow(id)} data-tooltip-html={t('Edit')} data-tooltip-id="tooltip_button">
            <EditIconFixedFill className={styles.iconButtonRow} />
          </button>
        )
      }
      {
        timeOffRow && (
          <button onClick={() => timeOffRow(id)} data-tooltip-html={t('Time Off')} data-tooltip-id="tooltip_button">
            <TimeOffIcon className={styles.iconButtonRow} fill="rgb(105, 118, 122)" />
          </button>
        )
      }
      {
        removeRow && (
          <div data-tooltip-html={t('Delete')} data-tooltip-id="tooltip_button">
          <button onClick={() => removeRow(id)} >
            <DeleteIcon fill='#fd0d1b' className={styles.iconButtonRow} />
          </button>
          </div>
        )
      }
      {
        openButton && (
          <Button
            className={styles.openButtonRow}
            onClick={() => openButton(id)}
            size='little'
            primary
          >
            {t('Open')}
          </Button>
        )
      }
    </div>
  );
};
