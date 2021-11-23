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
  title,
  avatar,
  nestingLevel = 0,
  lastChild1 = false,
  lastChild2 = false,
}) => {
  const { t } = useTranslation();

  const rowClasses = classnames(classes.resourcesCell, {
    [classes.resourcesCell_lastChild1]: lastChild1 && nestingLevel > 1,
    [classes.resourcesCell_lastChild2]: lastChild2 && nestingLevel > 2,
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
          {new Array(nestingLevel).fill().map(() => (
            <div className={classes.resourcesCell__padding__item} />
          ))}
        </div>
        <Section
          title={`${title}-(${nestingLevel})`}
          avatar={avatar}
          onExpander={handleExpander}
          expander={expander}
          withExpander={withExpander}
          nestingLevel={nestingLevel}
          // withNumberInput={withNumberInput}
          // count={countChildren}
          // onChangeNumber={handleChangeNumber}
          // onDelete={handleDelete}
        />
      </div>
      {
        expander && items?.map((item, index) => (
          <ResourceCell
            key={item.id}
            rowId={item.id}
            title={item.title}
            avatar={item.photo}
            items={item.children}
            withExpander={!!item.children?.length}
            onExpander={onExpander}
            expander={item.expander}
            relatives={items}
            lastChild1={nestingLevel === 0 ? (index + 1 === items.length) : lastChild1}
            lastChild2={nestingLevel === 1 ? (index + 1 === items.length) : lastChild2}
            nestingLevel={nestingLevel + 1}
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
