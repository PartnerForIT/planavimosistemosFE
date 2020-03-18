import React, { useState } from 'react';
import classNames from 'classnames';
import { makeStyles } from '@material-ui/core/styles';
import SvgIcon from '@material-ui/core/SvgIcon';
import styles from './DTM.module.scss';

/**
 * Simple Button encapsulating all design variations
 */
const Group = ({
  label, rows, columns, disabled, titleColor,
  titleBackground,
}) => {
  const [expanded, setExpanded] = useState(false);

  const useStyles = makeStyles({
    flexRow: {
      width: `calc(100% / ${columns.length})`,
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
      <div // eslint-disable-line jsx-a11y/no-static-element-interactions
        className={classNames(styles.groupLabel, classes.labelColor)}
        onClick={() => setExpanded(!expanded)}
      >
        <TriangleIcon className={iconClasses} />
        {label}
      </div>
      <div className={detailsClasses}>
        {
          rows.map((row) => (
            <div key={row.name} className={classNames(styles.flexTable, styles.row)} role='rowgroup'>
              {
                columns.map((column) => (
                  <div className={classNames(classes.flexRow, styles.cell)} role='cell'>
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
