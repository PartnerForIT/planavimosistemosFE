import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from 'react';
import classnames from 'classnames';
import { useTranslation } from 'react-i18next';

import classes from './ResourcesCell.module.scss';
import Section from '../../../Shift/Table/Section';

const ResourceCell = ({
  // employees,
  // onSubmit,
  // onChangeNumber,
  // onDelete,
  // numberOfWeeks,
  rowId,
  // parentRowId,
  items,
  withExpander,
  expander,
  onExpander,
  markerActive,
  title,
  avatar,
  nestingLevel = 0,
  lastChild1 = false,
  lastChild2 = false,
  isEmpty = false,
  employeesCount,
  employeeId,
  accumulatedHours,
}) => {
  const { t } = useTranslation();

  const rowClasses = classnames(classes.resourcesCell, {
    [classes.resourcesCell_lastChild1]: lastChild1 && nestingLevel > 1,
    [classes.resourcesCell_lastChild2]: lastChild2 && nestingLevel > 2,
    [classes.resourcesCell__empty]: isEmpty,
  });

  // const handleChangeNumber = useCallback((value) => {
  //   onChangeNumber({ rowId, value });
  // }, [rowId]);
  // const handleSubmit = useCallback((values) => {
  //   onSubmit({
  //     items: values,
  //     parentRowId,
  //   });
  // }, [onSubmit, parentRowId]);
  const handleExpander = useCallback(() => {
    onExpander({ rowId });
  }, [rowId]);
  // const handleDelete = useCallback(() => {
  //   onDelete({ rowId, parentRowId });
  // }, [rowId, parentRowId]);
  
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
          avatar={avatar}
          onExpander={handleExpander}
          accumulatedHours={employeeId && accumulatedHours && accumulatedHours[employeeId] ? accumulatedHours[employeeId] : []}
          employeeId={employeeId}
          expander={expander}
          withExpander={withExpander && !markerActive}
          nestingLevel={nestingLevel}
          // withNumberInput={withNumberInput}
          // count={countChildren}
          // onChangeNumber={handleChangeNumber}
          // onDelete={handleDelete}
        />
      </div>
      {
        (expander || markerActive) && items?.map((item, index) => (
          <ResourceCell
            key={index+'_'+nestingLevel}
            rowId={item.id}
            title={item.title}
            avatar={item.photo}
            employeeId={item.employeeId}
            items={item.children}
            employeesCount={item.employeesCount}
            withExpander={!!item.children?.length}
            onExpander={onExpander}
            expander={item.expander}
            accumulatedHours={accumulatedHours}
            markerActive={markerActive}
            relatives={items}
            lastChild1={nestingLevel === 0 ? (index + 1 === items.length) : lastChild1}
            lastChild2={nestingLevel === 1 ? (index + 1 === items.length) : lastChild2}
            nestingLevel={nestingLevel + 1}
            isEmpty={item.empty}
            // lastChild={index + 1 === items.length}
            // employees={employees}
            // onSubmit={onSubmit}
            // onDelete={onDelete}
            // parentTitle={title}
          />
        ))
      }
    </>
  );
};

export default ResourceCell;
