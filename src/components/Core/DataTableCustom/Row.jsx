import React, { useState } from 'react';
import classNames from 'classnames';
import { makeStyles } from '@material-ui/core/styles';
import styles from './DTM.module.scss';
import StyledCheckbox from '../Checkbox/Checkbox';
import SimpleTable from './SimpleTable';
import TriangleIcon from '../../Icons/TriangleIcon';
import ApprovedIcon from '../../Icons/ApprovedIcon';
import SuspendedIcon from '../../Icons/SuspendedIcon';
import PendingIcon from '../../Icons/PendingIcon';

const Row = ({
  row, columns, fieldIcons, selectable, onSelect, selectedItemId, setSelectedItemId,
}) => {
  const [subTableExpanded, setSubTableExpanded] = useState(false);

  const useStyles = makeStyles({
    flexRow: {
      width: selectable ? `calc((100% - 50px) / ${columns.length})` : `calc(100% / ${columns.length})`,
      textAlign: 'left',
      padding: '0.5em 0.5em',
      color: '#333945',
    },
  });
  const classes = useStyles();

  const triangleIconClasses = classNames(
    styles.collapsIcon,
    { [styles.collapsIconRotated]: subTableExpanded, [styles.collapsIconSelected]: selectedItemId === row.id },
  );

  const rowClasses = classNames(
    classes.flexRow,
    styles.cell,
    {
      [styles.pointer]: row.data && row.data.columns && row.data.items,
      [styles.flexRowSelected]: selectedItemId === row.id,
    },
  );

  const rowWrapperClasses = classNames(
    styles.rowWrapper,
    { [styles.rowSelected]: selectedItemId === row.id },
  );

  const Components = {
    Approved: <ApprovedIcon className={classNames({ [styles.approvedIconSelected]: selectedItemId === row.id })} />,
    Suspended: <SuspendedIcon className={classNames({ [styles.suspendedIconSelected]: selectedItemId === row.id })} />,
    Pending: <PendingIcon className={classNames({ [styles.pendingIconSelected]: selectedItemId === row.id })} />,
  };

  const selectRow = (id) => {
    setSelectedItemId(id);
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
            <div className={classNames(classes.flexRow, styles.cell, styles.checkboxCell)} role='cell'>
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
            if (fieldIcons[column.field] && fieldIcons[column.field].length) {
              const fieldIcon = fieldIcons[column.field].filter((icon) => icon.value === row[column.field])[0].value;
              IconComponent = Components[fieldIcon];
            }
            return (
              <div // eslint-disable-line jsx-a11y/no-static-element-interactions
                onClick={() => selectRow(row.id)}
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
