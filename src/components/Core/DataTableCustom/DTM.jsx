import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Group from './Group';
import styles from './DTM.module.scss';
import StyledCheckbox from '../Checkbox/Checkbox';
import ExcelIcon from '../../Icons/ExcelIcon';
import PdfIcon from '../../Icons/PdfIcon';
import SortIcon from '../../Icons/SortIcon';
import CogwheelIcon from '../../Icons/CogwheelIcon';
import CheckboxGroupRaw from '../CheckboxGroupRaw/CheckboxGroupRaw';

export default function DataTable({
  data, columns, selectable, sortable, onSelect, onSort, fieldIcons, onColumnsChange,
}) {
  const [allSelected, setAllSelected] = useState({ checked: 0, total: 0 });
  const [sortOptionsAsc, setSortOptionsAsc] = useState({});
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [showSettingsPopup, setShowSettingsPopup] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState([]);

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
    setVisibleColumns(columns.filter((column) => column.checked));
  }, [columns]);

  useEffect(() => {
    const initData = { checked: 0, total: 0 };
    const checkAllSelected = () => {
      data.map((group) => {
        let checkedNumber = 0;
        for (let i = 0; i < group.items.length; i += 1) {
          if (group.items[i].checked) checkedNumber += 1;
        }
        if (checkedNumber === group.items.length) {
          initData.checked += 1;
          initData.total += 1;
        } else {
          initData.total += 1;
        }
        return group;
      });
      return initData;
    };
    setAllSelected(checkAllSelected);
  }, [data]);

  const useStyles = makeStyles({
    flexRow: {
      display: 'flex',
      width: selectable
        ? `calc((100% - 70px) / ${visibleColumns.length})`
        : `calc((100% - 20px) / ${visibleColumns.length})`,
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

  const columnsChangeHandler = (item) => {
    const arrayCopy = [...columns];
    for (let i = 0; i < arrayCopy.length; i += 1) {
      if (arrayCopy[i].field === item.field) {
        arrayCopy[i].checked = !arrayCopy[i].checked;
      }
    }
    onColumnsChange(arrayCopy);
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
                checked={allSelected.checked === allSelected.total}
                onChange={onSelect}
              />
            </div>
          )
        }
        {
          visibleColumns.map((column, idx) => (
            <div
              key={idx.toString()}
              className={classNames(classes.flexRow, styles.columnName)}
              role='columnheader'
            >
              <div // eslint-disable-line jsx-a11y/no-static-element-interactions
                className={classNames(styles.sortBlock)}
                onClick={() => sort(column.field, sortOptionsAsc[column.field])}
              >
                <div className={classNames(styles.flexCenter)}>{column.label}</div>
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
        <ClickAwayListener onClickAway={() => setShowSettingsPopup(false)}>
          <div
            className={classNames(classes.flexRow, styles.columnName, styles.settingsCell)}
            role='columnheader'
          >
            {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
            <div onClick={() => setShowSettingsPopup(!showSettingsPopup)}>
              <CogwheelIcon />
            </div>
            {
              showSettingsPopup && (
              <div className={styles.settingsPopup}>
                <CheckboxGroupRaw items={columns} onChange={columnsChangeHandler} />
              </div>
              )
            }
          </div>
        </ClickAwayListener>
      </div>
      <div className={styles.tableContent}>
        {
          data.map((group, idx) => {
            let checkedNumber = 0;
            for (let i = 0; i < group.items.length; i += 1) {
              if (group.items[i].checked) checkedNumber += 1;
            }
            return (
              <Group
                key={idx.toString()}
                label={group.label}
                rows={group.items}
                ids={group.items.map((item) => item.id)}
                columns={visibleColumns}
                groupChecked={checkedNumber === group.items.length}
                selectable={selectable}
                onSelect={onSelect}
                selectedItemId={selectedItemId}
                setSelectedItemId={setSelectedItemId}
                titleColor={group.titleColor || null}
                titleBackground={group.backgroundColor || null}
                fieldIcons={fieldIcons}
              />
            );
          })
        }
      </div>
      <div className={classNames(styles.tableFooter)}>
        <ExcelIcon />
        <PdfIcon />
      </div>
    </div>
  );
}
