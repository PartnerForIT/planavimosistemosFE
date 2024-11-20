import React from 'react';

import ResourcesCell from './ResourcesCell';
import classes from './ResourcesBlock.module.scss';

export default ({
  resources,
  onExpander,
  markerActive,
  onEditShift,
  onDeleteShift,
}) => {
  return (
    <div className={classes.resourcesBlock}>
      {
        resources.map((item, index) => (
          <ResourcesCell
            title={item.title}
            skill={item.skill_name}
            key={index}
            avatar={item.photo}
            items={item.children}
            expander={item.expander}
            onExpander={onExpander}
            markerActive={markerActive}
            withExpander={!!item.children?.length}
            withNumberInput
            countChildren={item.children?.length}
            rowId={item.id}
            index={index + (index > 0 ? (resources[index - 1].children?.length || 0) : 0)}
            onEditShift={ onEditShift }
            onDeleteShift={ onDeleteShift }
          />
        ))
      }
    </div>
  );
}