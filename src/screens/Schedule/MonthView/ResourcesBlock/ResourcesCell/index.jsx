import React, {
  useCallback, useMemo,
} from 'react';
import classnames from 'classnames';

import classes from './ResourcesCell.module.scss';
import Section from '../../../Shift/Table/Section';
import usePermissions from '../../../../../components/Core/usePermissions';
import { useSelector } from 'react-redux';
import { userSelector } from '../../../../../store/auth/selectors';

const permissionsConfig = [
  {
    name: 'schedule_create_and_edit',
    module: 'schedule_shift',
    permission: 'schedule_create_and_edit',
  },
];

const ResourceCell = ({
  // employees,
  // onSubmit,
  // onChangeNumber,
  // onDelete,
  // numberOfWeeks,
  rowId,
  // parentRowId,
  items,
  item,
  withExpander,
  withTemplate,
  expander,
  onExpander,
  markerActive,
  title,
  avatar,
  shiftId,
  nestingLevel = 0,
  lastChild1 = false,
  lastChild2 = false,
  isEmpty = false,
  employeesCount,
  employeeId,
  accumulatedHours,
  onEditShift,
  checkIfEventsExist,
  onGenerateTimes,
  onClearTimes,
  onDeleteShift,
}) => {

  const permissions = usePermissions(permissionsConfig);
  const user = useSelector(userSelector);

  const rowClasses = classnames(classes.resourcesCell, {
    [classes.resourcesCell_lastChild1]: lastChild1 && nestingLevel > 1,
    [classes.resourcesCell_lastChild2]: lastChild2 && nestingLevel > 2,
    [classes.resourcesCell__empty]: isEmpty,
  });

  const editShiftPermission = useMemo(() => {
    const place_id = item?.place_id;
    const jobTypeId = item?.jobTypeId;
    if (user?.employee?.place?.[0]?.id && user?.employee?.place?.[0]?.id === place_id) {
      if (user?.employee?.job_type_id) {
        if (jobTypeId && user?.employee?.job_type_id.toString() === jobTypeId.toString()) {
          return permissions?.schedule_create_and_edit;
        } else {
          return false;
        }
      }

      return permissions?.schedule_create_and_edit;
    }

    return permissions?.schedule_create_and_edit
  }, [permissions, item, user]);

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
    // eslint-disable-next-line
  }, [rowId]);
  // const handleDelete = useCallback(() => {
  //   onDelete({ rowId, parentRowId });
  // }, [rowId, parentRowId]);
  const accumulatedHoursDetected = employeeId && accumulatedHours && item?.jobTypeId && accumulatedHours[employeeId+'-'+item?.jobTypeId] ? accumulatedHours[employeeId+'-'+item?.jobTypeId] : (employeeId && accumulatedHours && accumulatedHours[employeeId] ? accumulatedHours[employeeId] : []);
  const employeeShiftId = rowId ? rowId.toString().split('-')[0] : null;
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
          accumulatedHours={accumulatedHoursDetected}
          employeeId={employeeId}
          expander={expander}
          withExpander={withExpander && !markerActive}
          withTemplate={withTemplate && editShiftPermission}
          nestingLevel={nestingLevel}
          withMenu={nestingLevel === 1 && editShiftPermission}
          onEditShift={() => { onEditShift(withTemplate ? withTemplate : shiftId) }}
          onGenerateTimes={!checkIfEventsExist(shiftId || employeeShiftId, employeeId) ? () => { onGenerateTimes(shiftId || employeeShiftId, employeeId) } : null}
          onClearTimes={() => { onClearTimes(shiftId || employeeShiftId, employeeId) }}
          onDeleteShift={() => { onDeleteShift(shiftId, title) }}
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
            item={item}
            employeesCount={item.employeesCount}
            shiftId={item.shiftId}
            withExpander={!!item.children?.length}
            withTemplate={item.template_id}
            onExpander={onExpander}
            expander={item.expander}
            accumulatedHours={accumulatedHours}
            markerActive={markerActive}
            relatives={items}
            lastChild1={nestingLevel === 0 ? (index + 1 === items.length) : lastChild1}
            lastChild2={nestingLevel === 1 ? (index + 1 === items.length) : lastChild2}
            nestingLevel={nestingLevel + 1}
            isEmpty={item.empty}
            onEditShift={ onEditShift }
            checkIfEventsExist={ checkIfEventsExist }
            onGenerateTimes={ onGenerateTimes }
            onClearTimes={ onClearTimes }
            onDeleteShift={ onDeleteShift }
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
