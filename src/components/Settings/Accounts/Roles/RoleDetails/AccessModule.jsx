import React from 'react';
import Content from './Content';
import OptionsCheckBoxGroup from './OptionsCheckboxGroup';

const AccessModule = React.memo(({
  roleAccess = {},
  categoriesNames = {},
  setRoleAccess,
  activeRole,
  activePermissions = [],
  onChangeHandler,
  permissionsIds,
  setDisableReady,
  readOnly,
}) => {
  const { moduleAccess } = roleAccess;
  return (
    <Content title='Access by module' tooltip='Tooltip'>
      {
        Object.keys(moduleAccess).map((key) => (
          <OptionsCheckBoxGroup
            key={key}
            name={key}
            active={moduleAccess[key].enabled ? moduleAccess[key].checked ?? true : false}
            enabled={moduleAccess[key].enabled}
            readOnly={readOnly}
            details={moduleAccess[key].options}
            categoriesNames={categoriesNames}
            roleAccess={roleAccess}
            setRoleAccess={setRoleAccess}
            activeRole={activeRole}
            onChangeHandler={onChangeHandler}
            permissionsIds={permissionsIds}
            activePermissions={activePermissions}
            setDisableReady={setDisableReady}
          />
        ))
      }
    </Content>
  );
});

export default AccessModule;
