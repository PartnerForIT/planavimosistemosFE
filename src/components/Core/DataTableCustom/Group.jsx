import React, { useState } from 'react';
import classNames from 'classnames';
import { makeStyles } from '@material-ui/core/styles';
import SvgIcon from '@material-ui/core/SvgIcon';
import styles from './DTM.module.scss';
import StyledCheckbox from '../Checkbox/Checkbox';

/**
 * Simple Button encapsulating all design variations
 */
const Group = ({
  label, rows, columns, ids, disabled, titleColor,
  titleBackground, selectable, onSelect, groupChecked,
}) => {
  const [expanded, setExpanded] = useState(false);

  const useStyles = makeStyles({
    flexRow: {
      width: selectable ? `calc((100% - 50px) / ${columns.length})` : `calc(100% / ${columns.length})`,
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

    fill: {
      fill: titleColor,
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

  const TriangleIcon = ({ className }) => (
    <SvgIcon viewBox='0 0 8.315 5.21' className={className}>
      <path id='Path_1157' data-name='Path 1157' d='M8.315,0,4.157,5.21,0,0Z' className={classNames(classes.fill)} />
    </SvgIcon>
  );

  return (
    <div
      className={classes}
      disabled={disabled}
    >
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
        <span // eslint-disable-line jsx-a11y/no-static-element-interactions
          onClick={() => setExpanded(!expanded)}
          className={classNames(styles.pointer)}
        >
          <TriangleIcon className={iconClasses} />
          <span className={classNames(styles.groupLabelText)}>{label}</span>
        </span>
      </div>
      <div className={detailsClasses}>
        {
          rows.map((row, idx) => (
            <div key={idx.toString()} className={classNames(styles.flexTable, styles.row)} role='rowgroup'>
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
                // let fieldIcon = null;
                // if (fieldIcons[column.field] && fieldIcons[column.field].length) {
                //   fieldIcon = fieldIcons[column.field].filter((icon) => icon.value === row[column.field])[0].icon;
                // }
                columns.map((column, idz) => (
                  <div key={idz.toString()} className={classNames(classes.flexRow, styles.cell)} role='cell'>
                    {row[column.field]}
                  </div>
                ))
              }
            </div>
          ))
        }
      </div>
    </div>
  );
};

export default Group;
