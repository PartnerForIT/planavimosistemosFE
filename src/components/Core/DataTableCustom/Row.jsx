import React, { useState } from 'react';
import classNames from 'classnames';
// import { makeStyles } from '@material-ui/core/styles';
import styles from './DTM.module.scss';
import StyledCheckbox from '../Checkbox/Checkbox';
import SimpleTable from './SimpleTable';
import TriangleIcon from '../../Icons/TriangleIcon';
import ApprovedIcon from '../../Icons/ApprovedIcon';
import SuspendedIcon from '../../Icons/SuspendedIcon';
import PendingIcon from '../../Icons/PendingIcon';

const Row = ({
  row, columns, fieldIcons, selectable, onSelect, selectedItem, setSelectedItem,
}) => {
  const [subTableExpanded, setSubTableExpanded] = useState(false);

  // const useStyles = makeStyles({
  //   flexRow: {
  //     width: selectable ? `calc((100% - 50px) / ${columns.length})` : `calc(100% / ${columns.length})`,
  //     minWidth: '140px',
  //     textAlign: 'left',
  //     padding: '0.5em 0.5em',
  //     color: '#333945',
  //   },
  //
  //   approvedIconSelected: {
  //     g: {
  //       fill: '#fff !important',
  //     },
  //
  //     path: {
  //       stroke: '#319cff !important',
  //     },
  //   },
  // });
  // const classes = useStyles();

  const triangleIconClasses = classNames(
    styles.collapsIcon,
    {
      [styles.collapsIconRotated]: subTableExpanded,
      [styles.collapsIconSelected]: selectedItem && selectedItem.id === row.id,
    },
  );

  const rowClasses = classNames(
    styles.cell,
    {
      [styles.pointer]: row.data && row.data.columns && row.data.items,
      [styles.flexRowSelected]: selectedItem && selectedItem.id === row.id,
    },
  );

  const rowWrapperClasses = classNames(
    styles.rowWrapper,
    { [styles.rowSelected]: selectedItem && selectedItem.id === row.id },
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
    setSelectedItem(selectedRow);
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
            <div className={classNames(styles.cell, styles.checkboxCell)} role='cell'>
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
            return (
              <div // eslint-disable-line jsx-a11y/no-static-element-interactions
                onClick={() => selectRow(row)}
                key={idx.toString()}
                className={rowClasses}
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
            />
          )
          : null
      }
    </div>
  );
};

export default Row;
