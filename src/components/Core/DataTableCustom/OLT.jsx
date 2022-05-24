import React, {
  useEffect, useLayoutEffect, useRef, useState, useMemo,
} from 'react';
import classNames from 'classnames';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Pagination from 'react-js-pagination';
import Scrollbar from 'react-scrollbars-custom';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import Row from './Row';
import styles from './DTM.module.scss';
import CogwheelIcon from '../../Icons/CogwheelIcon';
import CheckboxGroupRaw from '../CheckboxGroupRaw/CheckboxGroupRaw';
import ExcelIcon from '../../Icons/ExcelIcon';
import PdfIcon from '../../Icons/PdfIcon';
import StyledCheckbox from '../Checkbox/Checkbox';

const useStyles = makeStyles({
  colorPrimary: {
    color: '#0087ff',
  },
});

const columnsWidthInitial = {};
export default function DataTable({
  data, columns, selectable, sortable, onSelect, onSort, fieldIcons, onColumnsChange, totalDuration, loading,
  lastPage, activePage, itemsCountPerPage, totalItemsCount, handlePagination, selectedItem, setSelectedItem, reports,
  downloadExcel, downloadPdf, verticalOffset = '0px',
  columnsWidth = columnsWidthInitial, simpleTable, editRow = () => ({}),
  removeRow, multiselect = false, hoverActions = false, hoverable = false, id = 'first', grey, greyTitle,
  withoutFilterColumns = false,
  selectAllItems = null, colored = { warning: false, error: false },
  all = false, setAll = () => ({}), statusIcon = true,
  accountList = false,
  withoutShitCode,
}) {
  const [tableData, setTableData] = useState(data);
  const [, setAllSelected] = useState({ checked: 0, total: 0 });
  const [sortOptionsAsc, setSortOptionsAsc] = useState({});
  const [showSettingsPopup, setShowSettingsPopup] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState([]);
  const [totalCustomWidthColumns, setTotalCustomWidthColumns] = useState(0);
  const [totalCustomColumns, setTotalCustomColumns] = useState(0);
  const [selectAll, setSelectAll] = useState(false);

  const classes = useStyles();

  const tableRef = useRef(null);

  useLayoutEffect(() => {
    if (typeof selectAllItems === 'function') {
      setSelectAll(true);
    }
  }, [selectAllItems]);

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
    setTotalCustomWidthColumns(columns.reduce((total, column) => {
      if (column.checked && columnsWidth && columnsWidth[column.field]) {
        return total + columnsWidth[column.field];
      }
      return total;
    }, 0));
    setTotalCustomColumns(columns.reduce((total, column) => {
      if (column.checked && columnsWidth && columnsWidth[column.field]) {
        return total + 1;
      }
      return total;
    }, 0));
  }, [columns, columnsWidth]);

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
    if (data.length && data.items) setAllSelected(checkAllSelected);
    setTableData(data);
  }, [data]);

  useEffect(() => {
    document.documentElement.style.setProperty(`--scroll-left-${id}`, '0px');
  }, [id]);

  const sort = (field, asc, column) => {
    setSortOptionsAsc({ ...sortOptionsAsc, [field]: !asc });
    onSort(field, !asc, column);
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

  const footerTitleClasses = classNames(
    styles.footerTitle, styles.footerTitleReports,
  );

  const tableHeaderCell = classNames(
    styles.flexRowGlobal,
    styles.columnName,
    { [styles.flexRowGlobalReports]: reports },
  );

  const sortBlockClasses = classNames(
    styles.sortBlock,
    { [styles.pointer]: sortable },
  );

  const scrollableContentClasses = classNames(
    styles.scrollableContent,
    { [styles.scrollableContentWithoutRightPanel]: withoutFilterColumns },
    { [styles.scrollableContentReports]: reports },
  );

  const flexTableClasses = classNames(
    styles.flexTable,
    styles.header,
    { [styles.flexTableHeaderReports]: reports },
    { [styles.flexTableHeaderWithSelectable]: selectable && !selectAll },
    // { [styles.flexTableHeaderReports]: reports, [styles.flexTableHeaderNotSelectable]: !reports && !selectable },
  );

  const tableContentClasses = classNames(
    styles.tableContent,
    {
      [styles.tableContentNotSortable]: !sortable,
    },
  );

  const tableContainerClasses = classNames(
    styles.tableContainer,
    {
      [styles.tableContainer_grey]: grey,
      [styles.tableContainer_greyTitle]: greyTitle,
      [styles.tableContainer_accountList]: accountList,
      [styles.tableContainer_simpleTable]: simpleTable,
    },
  );

  const onScroll = useMemo(() => {
    if (hoverActions) {
      return (e) => {
        if (e.scrollLeft <= e.contentScrollWidth - e.clientWidth) {
          document.documentElement.style.setProperty(`--scroll-left-${id}`, `${e.scrollLeft}px`);
        }
      };
    }

    return undefined;
  }, [hoverActions, id]);

  return (
    <div
      className={tableContainerClasses}
      style={{ height: `calc(100vh - ${verticalOffset})` }}
      role='table'
      aria-label='Destinations'
      data-id={id}
      ref={tableRef}
    >
      <Scrollbar
        className={scrollableContentClasses}
        style={{
          height: `calc(100vh - ${verticalOffset} - ${simpleTable ? 0 : 47}px + ${accountList ? 47 : 0}px)`,
        }}
        removeTracksWhenNotUsed
        trackXProps={{
          renderer: ({ elementRef, ...restProps }) => (
            <span
              {...restProps}
              ref={elementRef}
              className={classNames(styles.scrollableContent__scrollbarTrackX, { trackX: true })}
            />
          ),
        }}
        trackYProps={{
          renderer: ({ elementRef, ...restProps }) => (
            <span
              {...restProps}
              ref={elementRef}
              className={classNames(styles.scrollableContent__scrollbarTrackY, { trackY: true })}
            />
          ),
        }}
        onScroll={onScroll}
      >
        <div className={tableContentClasses}>
          {/* <div className={onSerach ? styles.headerWrapperSearch : styles.headerWrapper}> */}
          <div className={simpleTable ? styles.simpleTable : styles.headerWrapper}>
            <header className={flexTableClasses} role='rowgroup'>
              {
                visibleColumns.length > 0 && visibleColumns.map((column, idx) => {
                  let width = '';
                  let minWidth = column.minWidth || null;
                  if (totalCustomWidthColumns > 0) {
                    if (columnsWidth[column.field]) {
                      width = columnsWidth[column.field];
                      minWidth = columnsWidth[column.field];
                    } else {
                      width = selectable
                        ? `calc((100% - ${totalCustomWidthColumns + 40}px) / ${visibleColumns.length
                        - totalCustomColumns})`
                        : `calc((100% - ${totalCustomWidthColumns}px) / ${visibleColumns.length - totalCustomColumns})`;
                    }
                  } else {
                    width = selectable
                      ? `calc((100% - 40px) / ${visibleColumns.length})`
                      : `calc((100%) / ${visibleColumns.length})`;
                  }
                  return (
                    <div
                      key={idx.toString()}
                      className={tableHeaderCell}
                      style={{ width, minWidth }}
                      role='columnheader'
                    >
                      {
                       selectAll && idx === 0
                        && (
                        <StyledCheckbox
                          style={{ padding: '0 9px 0 3px' }}
                          checked={all}
                          onChange={() => {
                            setAll((prevState) => {
                              if (!prevState) {
                                selectAllItems(tableData);
                              } else {
                                selectAllItems([]);
                              }
                              return !prevState;
                            });
                          }}
                        />
                        )
                      }
                      <div // eslint-disable-line jsx-a11y/no-static-element-interactions
                        className={sortBlockClasses}
                        onClick={() => sortable && sort(column.field, sortOptionsAsc[column.field], column)}
                      >
                        <div className={classNames(styles.flexCenter)}>
                          {column.label}
                        </div>
                        {
                          (fieldIcons && fieldIcons[column.field] && fieldIcons[column.field].length)
                          && fieldIcons[column.field].map((icon) => icon.icon)
                        }
                      </div>
                      {/* { (onSerach && columnsWidth[column.field] !== 80) &&
                        <div className={styles.headerSearch}>
                          <RowSearch />
                        </div>
                      } */}
                    </div>
                  );
                })
              }
            </header>
          </div>
          {
            tableData.length ? tableData.map((row, idx) => (
              <Row
                withoutRightPanel={withoutFilterColumns}
                index={idx}
                key={idx.toString()}
                row={row}
                selectedItem={selectedItem}
                setSelectedItem={setSelectedItem}
                columns={visibleColumns}
                selectable={selectable}
                selectAll={selectAll}
                statysIcon={statusIcon}
                onSelect={onSelect}
                fieldIcons={fieldIcons}
                reports={reports}
                columnsWidth={columnsWidth}
                totalCustomWidthColumns={totalCustomWidthColumns}
                totalCustomColumns={totalCustomColumns}
                editRow={editRow}
                removeRow={removeRow}
                multiselect={multiselect}
                hoverActions={hoverActions}
                hoverable={hoverable}
                colored={colored}
                tableRef={tableRef}
                withoutShitCode={withoutShitCode}
              />
            )) : null
          }
        </div>
      </Scrollbar>
      {!simpleTable
        && (
        <div className={classNames(styles.tableFooter)}>
          {typeof downloadExcel === 'function'
            && (
              <div // eslint-disable-line jsx-a11y/no-static-element-interactions
                className={styles.pointer}
                onClick={downloadExcel}
              >
                <ExcelIcon />
              </div>
            )}
          {typeof downloadPdf === 'function'
            && (
              <div // eslint-disable-line jsx-a11y/no-static-element-interactions
                className={styles.pointer}
                onClick={downloadPdf}
              >
                <PdfIcon />
              </div>
            )}
          {
            totalDuration && (
              <p className={footerTitleClasses}>
                {
                  'Overall worktime: '
                }
                <span className={classNames(styles.totals, styles.blue, styles.bold)}>{totalDuration}</span>
              </p>
            )
          }
          {
            lastPage && lastPage > 1
              ? (
                <div className={classNames(styles.pagination)}>
                  <Pagination
                    activePage={activePage}
                    itemsCountPerPage={itemsCountPerPage}
                    totalItemsCount={totalItemsCount}
                    pageRangeDisplayed={3}
                    onChange={handlePagination}
                    itemClass={classNames(styles.paginationItem)}
                    linkClass={classNames(styles.paginationLink)}
                    activeLinkClass={classNames(styles.paginationLinkActive)}
                  />
                </div>
              )
              : null
          }
        </div>
        )}

      {
        !withoutFilterColumns && (
          <div className={classNames(simpleTable ? styles.scrollingSimplePanel : styles.scrollingPanel)}>
            {
              !reports && tableData.length > 0 && (
                <ClickAwayListener onClickAway={() => setShowSettingsPopup(false)}>
                  <aside
                    className={classNames(styles.columnName, styles.settingsCell)}
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
                  </aside>
                </ClickAwayListener>
              )
            }
          </div>
        )
      }
      <div className={classNames(styles.overlay, { [styles.overlayActive]: loading })}>
        <CircularProgress classes={{ colorPrimary: classes.colorPrimary }} />
      </div>
    </div>
  );
}
