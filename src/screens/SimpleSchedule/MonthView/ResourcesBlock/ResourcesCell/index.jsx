import React, {
  useCallback,
} from 'react';
import classnames from 'classnames';

import classes from './ResourcesCell.module.scss';
import Section from '../../../Shift/Table/Section';

const ResourceCell = ({
  rowId,
  items,
  withExpander,
  expander,
  onExpander,
  markerActive,
  title,
  skill,
  avatar,
  shiftId,
  nestingLevel = 0,
  lastChild1 = false,
  lastChild2 = false,
  isEmpty = false,
  employeesCount,
  employeeId,
  onEditShift,
  onDeleteShift,
}) => {

  const rowClasses = classnames(classes.resourcesCell, {
    [classes.resourcesCell_lastChild1]: lastChild1 && nestingLevel > 1,
    [classes.resourcesCell_lastChild2]: lastChild2 && nestingLevel > 2,
    [classes.resourcesCell__empty]: isEmpty,
  });

  const handleExpander = useCallback(() => {
    onExpander({ rowId });
    // eslint-disable-next-line
  }, [rowId]);
  
  return (
    <>
      <div className={rowClasses}>
        <div className={classes.resourcesCell__padding}>
          {new Array(nestingLevel).fill().map((item, i) => (
            <div key={i} className={classes.resourcesCell__padding__item} />
          ))}
        </div>
        <Section
          title={`${title} ${employeesCount ? `(${employeesCount})` : ''}`}
          skill={skill}
          avatar={avatar}
          onExpander={handleExpander}
          employeeId={employeeId}
          expander={expander}
          withExpander={withExpander && !markerActive}
          nestingLevel={nestingLevel}
          withMenu={nestingLevel === 1}
          onEditShift={() => { onEditShift(shiftId) }}
          onDeleteShift={() => { onDeleteShift(shiftId, title) }}
        />
      </div>
      {
        (expander || markerActive) && items?.map((item, index) => (
          <ResourceCell
            key={index+'_'+nestingLevel}
            rowId={item.id}
            title={item.title}
            skill={item.skill_name}
            avatar={item.photo}
            employeeId={item.employeeId}
            items={item.children}
            employeesCount={item.employeesCount}
            shiftId={item.shiftId}
            withExpander={!!item.children?.length}
            onExpander={onExpander}
            expander={item.expander}
            markerActive={markerActive}
            relatives={items}
            lastChild1={nestingLevel === 0 ? (index + 1 === items.length) : lastChild1}
            lastChild2={nestingLevel === 1 ? (index + 1 === items.length) : lastChild2}
            nestingLevel={nestingLevel + 1}
            isEmpty={item.empty}
            onEditShift={ onEditShift }
            onDeleteShift={ onDeleteShift }
          />
        ))
      }
    </>
  );
};

export default ResourceCell;
