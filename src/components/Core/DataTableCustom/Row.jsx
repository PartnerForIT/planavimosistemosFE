import React, { useState } from 'react';
import classNames from 'classnames';
import { makeStyles } from '@material-ui/core/styles';
import styles from './DTM.module.scss';
import StyledCheckbox from '../Checkbox/Checkbox';
import SimpleTable from './SimpleTable';
import TriangleIcon from '../../Icons/TriangleIcon';

const Row = ({
  row, columns, fieldIcons, selectable, onSelect,
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

  const iconClasses = classNames(
    styles.collapsIcon,
    { [styles.collapsIconRotated]: subTableExpanded },
  );

  return (
    <div
      className={classNames(styles.flexTable, styles.row)}
      role='rowgroup'
    >
      <div className={classNames(styles.rowWrapper)}>
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
            let fieldIcon = null;
            if (fieldIcons[column.field] && fieldIcons[column.field].length) {
              fieldIcon = fieldIcons[column.field].filter((icon) => icon.value === row[column.field])[0].icon;
            }
            return (
              <div // eslint-disable-line jsx-a11y/no-static-element-interactions
                onClick={() => setSubTableExpanded(!subTableExpanded)}
                key={idx.toString()}
                className={classNames(classes.flexRow, styles.cell)}
                role='cell'
              >
                {row.data && row.data.columns && row.data.items && idx === 0
                  ? <TriangleIcon className={iconClasses} fill='#0087ff' />
                  : null}
                {fieldIcon}
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
