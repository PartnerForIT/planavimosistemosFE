import React, { useState, memo } from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import styles from './DTM.module.scss';
import StyledCheckbox from '../Checkbox/Checkbox';
import Row from './Row';
import TriangleIcon from '../../Icons/TriangleIcon';
import HolidayIcon from 'components/Core/HolidayIcon/HolidayIcon';
import WarningCircleIcon from 'components/Icons/WarningCircleIcon';


const Group = ({
  group, label, rows, columns, ids, titleColor = '#4d7499', fieldIcons, selectedItem, setSelectedItem,
  titleBackground = 'rgba(0, 133, 255, 0.09)', selectable, onSelect, groupChecked, reports, columnsWidth,
  totalCustomColumns, totalCustomWidthColumns,
}) => {
  const [expanded, setExpanded] = useState(false);
  const { t } = useTranslation();

  const detailsClasses = classNames(
    styles.details,
    {
      [styles.detailsReports]: reports,
      [styles.detailsNotSelectable]: !reports && !selectable,
    },
  );

  const iconClasses = classNames(
    styles.collapsIcon,
    { [styles.collapsIconRotated]: expanded },
  );

  const rowClasses = classNames(
    styles.flexRowGroup,
    styles.columnName,
    { [styles.checkboxCell]: selectable, [styles.flexRowGlobalReports]: reports },
  );

  const rowGroupClasses = classNames(
    styles.flexRowGroup,
    styles.groupCell,
    { [styles.flexRowGroupReports]: reports },
  );

  const groupLabelClasses = classNames(
    styles.pointer,
    styles.nowrap,
    styles.flexRowGroup,
    { [styles.groupLabelReports]: reports },
  );

  const groupContainerClasses = classNames(
    styles.groupContainer,
    { [styles.groupContainerReports]: reports },
  );

  return (
    <div className={groupContainerClasses}>
      <div
        className={classNames(styles.groupLabel)}
        style={{
          color: titleColor,
          backgroundColor: titleBackground,
          paddingRight: !selectable && '0',
        }}
      >
        {
          selectable && (
            <div
              className={rowClasses}
              role='columnheader'
            >
              <StyledCheckbox
                id={ids}
                className={classNames(styles.checkbox)}
                checked={groupChecked}
                onChange={onSelect}
              />
            </div>
          )
        }
        <div // eslint-disable-line jsx-a11y/no-static-element-interactions
          onClick={() => setExpanded(!expanded)}
          className={styles.groupClickableContainer}
          style={{ minWidth: selectable ? 'calc(100% - 15px)' : '100%' }}
        >
          {
            columns.map((column, idx) => {
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

              if (idx === 0) {

                return (
                  <span
                    key={idx.toString()}
                    className={groupLabelClasses}
                    style={{ width, minWidth }}
                  >
                    <TriangleIcon className={iconClasses} fill={titleColor} />
                    <span className={classNames(styles.groupLabelText)}>
                      {typeof label === 'string' ? t(label) : label}
                      {
                        group.holiday && group.holiday.length ?
                          <HolidayIcon
                            holidays={group.holiday}
                            inline={true}
                          />
                        : null
                      }
                      {
                        group.warning ?
                          <WarningCircleIcon
                          />
                        : null
                      }

                    </span>
                  </span>
                );
              }
              return (
                <span
                  key={idx.toString()}
                  className={rowGroupClasses}
                  style={{ width, minWidth, padding: '0 1px!important' }}
                  role='cell'
                >
                  { column.field === 'duration' && <span className={styles.total}>{t('Total')}:&nbsp;</span> }
                  <span className={classNames(styles.totals,
                    column.field === 'duration' && styles.blue,
                    column.field === 'cost' && styles.red,
                    column.field === 'profit' && styles.green,
                    styles.medium)}
                  >
                    {group[column.field]}
                  </span>
                </span>
              );
            })
          }
        </div>
      </div>
      {
        expanded
          ? <div className={detailsClasses}>
              {
                rows.map((row, idx) => {
                  return (
                    <Row
                      key={row.id.toString()}
                      row={row}
                      selectedItem={selectedItem}
                      setSelectedItem={setSelectedItem}
                      columns={columns}
                      selectable={selectable}
                      onSelect={onSelect}
                      fieldIcons={fieldIcons}
                      reports={reports}
                      columnsWidth={columnsWidth}
                      totalCustomWidthColumns={totalCustomWidthColumns}
                      totalCustomColumns={totalCustomColumns}
                    />
                  )
                })
              }
            </div>
          : null
      }
      
    </div>
  );
};

const isEqual = ({groupChecked: prevChecked, selectedItem: prevSelectedItem, rows: prevRows, group: prevGroup, ids: prevIds, columns: prevColumns}, {groupChecked, selectedItem, rows, group, ids, columns}) => {
  return (
    prevChecked === groupChecked
    && prevSelectedItem === selectedItem
    && prevRows === rows
    && prevGroup === group
    && prevIds === ids
    && prevColumns === columns
  )
}

export default memo(Group, isEqual);
