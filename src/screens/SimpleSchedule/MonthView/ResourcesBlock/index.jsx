import React from 'react';

import ResourcesCell from './ResourcesCell';
import classes from './ResourcesBlock.module.scss';

export default ({
  resources,
  onExpander,
  markerActive,
  handleAddEmployees,
  handleDeleteEmployees,
}) => {

  const unEmployees = () => {
    let result = [];

    const getChildren = (item) => {
      if (item.children) {
        item.children.forEach((child) => {
          result.push(child.id);
          getChildren(child);
        });
      }
    }

    resources.forEach((item) => {
      result.push(item.id);
      getChildren(item);
    });

    return result;
  }
  
  return (
    <div className={classes.resourcesBlock}>
      {
        resources.map((item, index) => (
          <ResourcesCell
            item={item}
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
            employeesCount={item.employeesCount}
            rowId={item.id}
            index={index + (index > 0 ? (resources[index - 1].children?.length || 0) : 0)}
            onDeleteEmployees={handleDeleteEmployees}
          />
        ))
      }

      { handleAddEmployees ? (
        <ResourcesCell
          onAddEmployees={handleAddEmployees}
          unavailableEmployees={unEmployees()}
        /> ) : null }
    </div>
  );
}