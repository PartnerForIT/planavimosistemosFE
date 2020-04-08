import React, { useState } from 'react';
import classNames from 'classnames';
import styles from './DTM.module.scss';
import StyledCheckbox from '../Checkbox/Checkbox';
import Row from './Row';
import TriangleIcon from '../../Icons/TriangleIcon';

const Group = ({
  group, label, rows, columns, ids, titleColor = '#4d7499', fieldIcons, selectedItem, setSelectedItem,
  titleBackground = 'rgba(0, 133, 255, 0.09)', selectable, onSelect, groupChecked,
}) => {
  const [expanded, setExpanded] = useState(false);

  const detailsClasses = classNames(
    styles.details,
    { [styles.datailsHidden]: !expanded, [styles.detailsShown]: expanded },
  );

  const iconClasses = classNames(
    styles.collapsIcon,
    { [styles.collapsIconRotated]: expanded },
  );

  return (
    <div className={classNames(styles.groupContainer)}>
      <div className={classNames(styles.groupLabel)} style={{ color: titleColor, backgroundColor: titleBackground }}>
        {
          selectable && (
            <div
              className={classNames(styles.flexRowGroup, styles.columnName, styles.checkboxCell)}
              style={{
                width: selectable ? `calc((100% - 50px) / ${columns.length})` : `calc(100% / ${columns.length})`,
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
        >
          {
            columns.map((column, idx) => {
              if (idx === 0) {
                return (
                  <span
                    key={idx.toString()}
                    className={classNames(styles.pointer, styles.nowrap, styles.flexRowGroup)}
                    style={{
                      width: selectable ? `calc((100% - 50px) / ${columns.length})` : `calc(100% / ${columns.length})`,
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
                  className={classNames(styles.flexRowGroup, styles.groupCell)}
                  style={{
                    width: selectable ? `calc((100% - 50px) / ${columns.length})` : `calc(100% / ${columns.length})`,
                  }}
                  role='cell'
                >
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
            />
          ))
        }
      </div>
    </div>
  );
};

export default Group;
