import React from 'react';

import ResourcesCell from './ResourcesCell';
import classes from './ResourcesBlock.module.scss';

export default ({
  resources,
  height
}) => {
  return (
    <div className={classes.resourcesBlock}>
      {
        resources.map((item, index) => (
          <ResourcesCell
            title={item.title}
            photo={item.photo}
            skill={item.skill}
            place={item.place}
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