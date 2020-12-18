import React from 'react';
import Content from './Content';
import OptionsCheckBoxGroup from './OptionsCheckboxGroup';

const AccessModule = React.memo(({
  roleAccess = {},
  categoriesNames = {},
  setRoleAccess,
}) => {
  const { moduleAccess } = roleAccess;

  return (
    <Content title='Access by module' tooltip='Tooltip'>
      {
        Object.keys(moduleAccess).map((key) => (
          <OptionsCheckBoxGroup
            key={key}
            name={key}
            active={moduleAccess[key].enabled}
            details={moduleAccess[key].options}
            categoriesNames={categoriesNames}
            roleAccess={roleAccess}
            setRoleAccess={setRoleAccess}
          />
        ))
      }
    </Content>
  );
});

export default AccessModule;
