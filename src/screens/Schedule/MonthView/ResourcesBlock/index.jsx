import React from 'react';

import ResourcesCell from './ResourcesCell';
import classes from './ResourcesBlock.module.scss';

export default ({
  resources,
  onExpander,
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
            withExpander={!!item.children?.length}
            withNumberInput
            countChildren={item.children?.length}
            rowId={item.id}
            index={index + (index > 0 ? (resources[index - 1].children?.length || 0) : 0)}
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