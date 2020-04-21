import React, { useState } from 'react';
import classNames from 'classnames';
import styles from './DTM.module.scss';
import StyledCheckbox from '../Checkbox/Checkbox';
import Row from './Row';
import TriangleIcon from '../../Icons/TriangleIcon';

const Group = ({
  group, label, rows, columns, ids, titleColor = '#4d7499', fieldIcons, selectedItem, setSelectedItem,
  titleBackground = 'rgba(0, 133, 255, 0.09)', selectable, onSelect, groupChecked, reports,
}) => {
  const [expanded, setExpanded] = useState(false);

  const detailsClasses = classNames(
    styles.details,
    { [styles.datailsHidden]: !expanded, [styles.detailsShown]: expanded , [styles.detailsReports]: reports },
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

  return (
    <div className={classNames(styles.groupContainer)}>
      <div className={classNames(styles.groupLabel)} style={{ color: titleColor, backgroundColor: titleBackground }}>
        {
          selectable && (
            <div
              className={rowClasses}
              style={{
                width: selectable ? `calc((100% - 35px) / ${columns.length})` : `calc(100% / ${columns.length})`,
              }}
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
              if (idx === 0) {
                return (
                  <span
                    key={idx.toString()}
                    className={groupLabelClasses}
                    style={{
                      width: selectable ? `calc((100% - 35px) / ${columns.length})` : `calc(100% / ${columns.length})`,
                    }}
                  >
                    <TriangleIcon className={iconClasses} fill={titleColor} />
                    <span className={classNames(styles.groupLabelText)}>{label}</span>
                  </span>
                );
              }
              return (
                <span
                  key={idx.toString()}
                  className={rowGroupClasses}
                  style={{
                    width: selectable ? `calc((100% - 35px) / ${columns.length})` : `calc(100% / ${columns.length})`,
                    padding: '0 1px!important',
                  }}
                  role='cell'
                >
                  { column.field === 'duration' && <span className={styles.total}>Total:&nbsp;</span> }
                  <span className={classNames(styles.blueTotals, styles.medium)}>{group[column.field]}</span>
                </span>
              );
            })
          }
        </div>
      </div>
      <div className={detailsClasses}>
        {
          rows.map((row, idx) => (
            <Row
              key={idx.toString()}
              row={row}
              selectedItem={selectedItem}
              setSelectedItem={setSelectedItem}
              columns={columns}
              selectable={selectable}
              onSelect={onSelect}
              fieldIcons={fieldIcons}
              reports={reports}
            />
          ))
        }
      </div>
    </div>
  );
};

export default Group;
