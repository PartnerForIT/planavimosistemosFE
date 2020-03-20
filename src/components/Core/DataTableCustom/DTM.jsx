import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import Group from './Group';
import styles from './DTM.module.scss';
import StyledCheckbox from '../Checkbox/Checkbox';
import ExcelIcon from '../../Icons/ExcelIcon';
import PdfIcon from '../../Icons/PdfIcon';
import SortIcon from '../../Icons/SortIcon';

export default function DenseTable({
  data, columns, selectable, sortable, onSelect, onSort, fieldIcons,
}) {
  // const [allSelected, setAllSelected] = useState(false);
  const [sortOptionsAsc, setSortOptionsAsc] = useState({});

  useEffect(() => {
    const initSortOptions = (options) => {
      const arrayCopy = { ...options };
      for (let i = 0; i < columns.length; i += 1) {
        if (typeof arrayCopy[columns[i].field] === 'undefined') {
          arrayCopy[columns[i].field] = false;
        }
      }
      return arrayCopy;
    };
    setSortOptionsAsc(initSortOptions);
  }, [columns]);

  const useStyles = makeStyles({
    flexRow: {
      display: 'flex',
      width: selectable ? `calc((100% - 50px) / ${columns.length})` : `calc(100% / ${columns.length})`,
      textAlign: 'left',
      padding: '0 0.5em',
    },

    detailsRoot: {
      display: 'block',
    },
  });
  const classes = useStyles();

  const sort = (field, asc) => {
    setSortOptionsAsc({ ...sortOptionsAsc, [field]: !asc });
    onSort(field, !asc);
  };

  return (
    <div className={classNames(styles.tableContainer)} role='table' aria-label='Destinations'>
      <div className={classNames(styles.flexTable, styles.header)} role='rowgroup'>
        {
          selectable && (
            <div
              className={classNames(classes.flexRow, styles.columnName, styles.checkboxCell)}
              role='columnheader'
            >
              <StyledCheckbox
                id='all'
                className={classNames(styles.checkbox)}
                // checked={allSelected}
                onChange={onSelect}
              />
            </div>
          )
        }
        {
          columns.map((column, idx) => (
            <div
              key={idx.toString()}
              className={classNames(classes.flexRow, styles.columnName)}
              role='columnheader'
            >
              <div // eslint-disable-line jsx-a11y/no-static-element-interactions
                className={classNames(styles.sortBlock)}
                onClick={() => sort(column.field, sortOptionsAsc[column.field])}
              >
                <div className={classNames(styles.flexCenter)}>{column.title}</div>
                {
                  (fieldIcons[column.field] && fieldIcons[column.field].length)
                  && fieldIcons[column.field].map((icon) => icon.icon)
                }
                { sortable && (
                <div className={classNames(styles.flexCenter, styles.sortIcon)}>
                  <SortIcon />
                </div>
                ) }
              </div>
            </div>
          ))
        }
      </div>
      {
        data.map((group, idx) => {
          let checkedNumber = 0;
          for (let i = 0; i < group.items.length; i += 1) {
            if (group.items[i].checked) checkedNumber += 1;
          }
          // if (checkedNumber !== group.items.length && allSelected) {
          //   setAllSelected(false);
          // } else if (checkedNumber === group.items.length && !allSelected) {
          //   setAllSelected(true);
          // }
          return (
            <Group
              key={idx.toString()}
              label={group.label}
              rows={group.items}
              ids={group.items.map((item) => item.id)}
              columns={columns}
              groupChecked={checkedNumber === group.items.length}
              selectable={selectable}
              onSelect={onSelect}
              titleColor={group.titleColor || null}
              titleBackground={group.backgroundColor || null}
              fieldIcons={fieldIcons}
            />
          );
        })
      }
      <div className={classNames(styles.tableFooter)}>
        <ExcelIcon />
        <PdfIcon />
      </div>
    </div>
  );
}
