import React from 'react';

import ResourcesCell from './ResourcesCell';
import classes from './ResourcesBlock.module.scss';

export default ({
  resources,
  height,
  mergeTimesheetPlaces,
}) => {
  return (
    <div className={classes.resourcesBlock}>
      {
        resources.map((item, index) => (
          <ResourcesCell
            title={item.title}
            photo={item.photo}
            skill={item.skill}
            place={mergeTimesheetPlaces ? '' : item.place}
            height={height}
            key={index}
            rowId={item.id}
            index={index}
          />
        ))
      }
    </div>
  );
}