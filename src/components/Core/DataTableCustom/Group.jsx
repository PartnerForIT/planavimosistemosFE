import React, { useState } from 'react';
import classNames from 'classnames';
import { makeStyles } from '@material-ui/core/styles';
import styles from './DTM.module.scss';
import StyledCheckbox from '../Checkbox/Checkbox';
import Row from './Row';
import TriangleIcon from '../../Icons/TriangleIcon';

const Group = ({
  group, label, rows, columns, ids, titleColor = '#4d7499', fieldIcons, selectedItem, setSelectedItem,
  titleBackground = 'rgba(0, 133, 255, 0.09)', selectable, onSelect, groupChecked,
}) => {
  const [expanded, setExpanded] = useState(false);

  const useStyles = makeStyles({
    flexRow: {
      width: selectable ? `calc((100% - 50px) / ${columns.length})` : `calc(100% / ${columns.length})`,
      minWidth: '140px',
      textAlign: 'left',
      padding: '0.5em 0.5em',
      color: '#333945',
    },

    details: {
      display: 'block',
    },

    labelColor: {
      color: titleColor,
      backgroundColor: titleBackground,
    },
  });
  const classes = useStyles();

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
      <div className={classNames(styles.groupLabel, classes.labelColor)}>
        {
          selectable && (
            <div
              className={classNames(classes.flexRow, styles.columnName, styles.checkboxCell)}
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
                    className={classNames(styles.pointer, styles.nowrap, classes.flexRow)}
                  >
                    <TriangleIcon className={iconClasses} fill={titleColor} />
                    <span className={classNames(styles.groupLabelText)}>{label}</span>
                  </span>
                );
              }
              return (
                <span
                  key={idx.toString()}
                  className={classNames(classes.flexRow, styles.groupCell)}
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
