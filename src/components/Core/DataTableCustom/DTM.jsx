/* eslint-disable camelcase */
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Pagination from 'react-js-pagination';
import Scrollbar from 'react-scrollbars-custom';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import CurrencySign from '../../shared/CurrencySign';
import Group from './Group';
import styles from './DTM.module.scss';
import StyledCheckbox from '../Checkbox/Checkbox';
import CogwheelIcon from '../../Icons/CogwheelIcon';
import CheckboxGroupRaw from '../CheckboxGroupRaw/CheckboxGroupRaw';
import ExcelIcon from '../../Icons/ExcelIcon';
import PdfIcon from '../../Icons/PdfIcon';
import ReactTooltip from 'react-tooltip';

const useStyles = makeStyles({
  colorPrimary: {
    color: '#0087ff',
  },
});

const TextWithSign = ({ label }) => (
  <>
    <CurrencySign />
    {label}
  </>
);

const FooterTitle = ({
  wrapperClassNames = '', title = '', amountColorClassName = '', amount,
}) => (
  <p className={wrapperClassNames}>
    {title}
    <span className={classNames(styles.totals, amountColorClassName, styles.bold)}>{amount}</span>
  </p>
);

export default function DataTable({
  data, columns, selectable, sortable, onSelect, onSort, fieldIcons, onColumnsChange, total, loading,
  lastPage, activePage, itemsCountPerPage, totalItemsCount, handlePagination = Function.prototype,
  selectedItem, setSelectedItem, reports,
  downloadExcel, downloadPdf, verticalOffset = '0px', columnsWidth, statusClickable = false, sortStatus = [],
  settingsCustom,
  permissions = {},
  withCost,
  withProfit,
  withSallary,
  amount: { sallary = 0, cost = 0, profit = 0 } = {},
  white = false,
}) {
  const [tableData, setTableData] = useState(data);
  const [allSelected, setAllSelected] = useState({ checked: 0, total: 0 });
  const [sortOptionsAsc, setSortOptionsAsc] = useState({});
  const [showSettingsPopup, setShowSettingsPopup] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState([]);
  const [totalCustomWidthColumns, setTotalCustomWidthColumns] = useState(0);
  const [totalCustomColumns, setTotalCustomColumns] = useState(0);
  const { t } = useTranslation();

  const classes = useStyles();

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
    if (data.length) setAllSelected(checkAllSelected);
    setTableData(data);
  }, [data]);

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

  const footerTitleClasses = classNames(
    styles.footerTitle,
    styles.footerTitleReports,
  );

  const footerTitleCosts = classNames(
    styles.footerTitle, styles.footerCost, styles.margin0,
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
    { [styles.scrollableContentReports]: reports },
  );

  const flexTableClasses = classNames(
    styles.flexTable,
    styles.header,
    { [styles.flexTableHeaderReports]: reports, [styles.flexTableHeaderNotSelectable]: !reports && !selectable },
  );

  const tableContentClasses = classNames(
    styles.tableContent,
    { [styles.tableContentNotSortable]: !sortable },
  );

  const tableContainerClasses = classNames(
    styles.tableContainer,
    {
      [styles.tableContainer_white]: white,
      [styles.tableContainer_reports]: reports,
    },
  );

  return (
    <div
      className={tableContainerClasses}
      style={{ height: `calc(100vh - ${verticalOffset})` }}
      role='table'
      aria-label='Destinations'
    >
      <ReactTooltip
        id='holiday'
        className='schedule-screen__tooltip'
        effect='solid'
      />
      <Scrollbar
        className={scrollableContentClasses}
        style={{ height: `calc(100vh - ${verticalOffset} - 47px)` }}
        removeTracksWhenNotUsed
        trackXProps={{
          renderer: ({ elementRef, ...restProps }) => (
            <span
              {...restProps}
              ref={elementRef}
              className={styles.scrollbarTrackX}
            />
          ),
        }}
        trackYProps={{
          renderer: ({ elementRef, ...restProps }) => (
            <span
              {...restProps}
              ref={elementRef}
              className={styles.scrollbarTrackY}
            />
          ),
        }}
      >
        <div className={tableContentClasses}>
          <div className={styles.headerWrapper}>
            <header className={flexTableClasses} role='rowgroup'>
              {
                selectable && tableData.length > 0 && (
                  <div
                    className={classNames(styles.flexRowGlobal, styles.columnName, styles.checkboxCell)}
                    style={{
                      marginRight: '5px',
                    }}
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
                visibleColumns.length > 0 && visibleColumns.map((column, idx) => {
                  let width = '';
                  let minWidth = null;
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
                      <div // eslint-disable-line jsx-a11y/no-static-element-interactions
                        className={sortBlockClasses}
                        onClick={() => sortable && sort(column.field, sortOptionsAsc[column.field])}
                      >
                        <div className={classNames(styles.flexCenter)}>{column.label}</div>
                        {
                          (fieldIcons && fieldIcons[column.field] && fieldIcons[column.field].length)
                          && fieldIcons[column.field].map((icon) => (
                            ( !icon.hideTop ?
                                <React.Fragment key={icon.value}>
                                  {
                                  statusClickable
                                    ? (
                                      <button
                                        className={classNames(styles.iconButton,
                                          sortStatus.some((i) => i === icon.value) ? styles.deselect : '')}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          icon.onClick(icon.value);
                                        }}
                                      >
                                        {icon.icon}
                                      </button>
                                    )
                                    : icon.icon
                                  }
                                </React.Fragment>
                              : null
                            )
                          ))
                        }
                      </div>
                    </div>
                  );
                })
              }
            </header>
          </div>
          {
            tableData.length ? tableData.map((group, idx) => {
              let checkedNumber = 0;
              for (let i = 0; i < group.items.length; i += 1) {
                if (group.items[i].checked) checkedNumber += 1;
              }
              return (
                <Group
                  key={idx.toString()}
                  group={group}
                  label={group.label}
                  rows={group.items}
                  ids={group.items.map((item) => item.id)}
                  columns={visibleColumns}
                  groupChecked={checkedNumber === group.items.length}
                  selectable={selectable}
                  onSelect={onSelect}
                  selectedItem={selectedItem}
                  setSelectedItem={setSelectedItem}
                  titleColor={group.titleColor || null}
                  titleBackground={group.backgroundColor || null}
                  fieldIcons={fieldIcons}
                  reports={reports}
                  columnsWidth={columnsWidth}
                  totalCustomWidthColumns={totalCustomWidthColumns}
                  totalCustomColumns={totalCustomColumns}
                />
              );
            }) : null
          }
        </div>
      </Scrollbar>
      <div className={styles.tableFooter}>
        { typeof downloadExcel === 'function'
        && (
          <div // eslint-disable-line jsx-a11y/no-static-element-interactions
            className={classNames(styles.pointer, styles.mr10)}
            onClick={downloadExcel}
          >
            <ExcelIcon />
          </div>
        ) }
        { typeof downloadPdf === 'function'
        && (
          <div // eslint-disable-line jsx-a11y/no-static-element-interactions
            className={styles.pointer}
            onClick={downloadPdf}
          >
            <PdfIcon />
          </div>
        ) }
        {
          reports && <div className={styles.tableFooter__spacer} />
        }
        {
          total && (
            <FooterTitle
              title={t('Overall')+': '}
              wrapperClassNames={`${footerTitleClasses} ${styles.footerTitle_first}`}
              amountColorClassName={styles.blue}
              amount={total.duration}
            />
          )
        }
        {
          (withCost || (permissions.cost && !!cost)) && (
            <FooterTitle
              wrapperClassNames={footerTitleCosts}
              amountColorClassName={styles.red}
              amount={<TextWithSign label={total.cost} />}
            />
          )
        }
        {
          (withSallary || (permissions.cost && permissions.profit && !!sallary)) && (
            <FooterTitle
              wrapperClassNames={footerTitleCosts}
              amount={<TextWithSign label={total.sallary} />}
            />
          )
        }
        {
          (withProfit || (permissions.cost && permissions.profit && !!profit)) && (
            <FooterTitle
              wrapperClassNames={footerTitleCosts}
              amountColorClassName={styles.green}
              amount={<TextWithSign label={total.profit} />}
            />
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
      <div className={classNames(styles.scrollingPanel)}>
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
                      {settingsCustom}
                      <CheckboxGroupRaw items={columns} onChange={columnsChangeHandler} />
                    </div>
                  )
                }
              </aside>
            </ClickAwayListener>
          )
        }
      </div>
      <div className={classNames(styles.overlay, { [styles.overlayActive]: loading })}>
        <CircularProgress classes={{ colorPrimary: classes.colorPrimary }} />
      </div>
    </div>
  );
}
