import React from 'react';
import _ from 'lodash';

import ResourcesCell from './ResourcesCell';
import classes from './ResourcesBlock.module.scss';

const ResourceBlock = ({
  resources,
  onExpander,
  markerActive,
  accumulatedHours,
  onEditShift,
  checkIfEventsExist,
  onGenerateTimes,
  onClearTimes,
  onDeleteShift,
}) => {
  return (
    <div className={classes.resourcesBlock}>
      {
        resources.map((item, index) => (
          <ResourcesCell
            title={item.title}
            key={index}
            items={item.children}
            expander={item.expander}
            onExpander={onExpander}
            markerActive={markerActive}
            accumulatedHours={accumulatedHours}
            withExpander={!!item.children?.length}
            withTemplate={item.template_id}
            withNumberInput
            countChildren={item.children?.length}
            rowId={item.id}
            index={index + (index > 0 ? (resources[index - 1].children?.length || 0) : 0)}
            onEditShift={ onEditShift }
            checkIfEventsExist={ checkIfEventsExist }
            onGenerateTimes={ onGenerateTimes }
            onClearTimes={ onClearTimes }
            onDeleteShift={ onDeleteShift }
            // employees={employees}
            // onSubmit={handleSubmitAddEmployees}
            // onChangeNumber={handleChangeNumber}
            // onDelete={handleDelete}
            // numberOfWeeks={numberOfWeeks}
            // main
          />
        ))
      }
    </div>
  );
}

export default React.memo(ResourceBlock, (prevProps, nextProps) => {
  return _.isEqual(prevProps.resources, nextProps.resources) &&
    _.isEqual(prevProps.markerActive, nextProps.markerActive) &&
    _.isEqual(prevProps.accumulatedHours, nextProps.accumulatedHours);
});