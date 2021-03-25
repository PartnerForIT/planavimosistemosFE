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
}) => (
  <Content title='Access by module' tooltip='Tooltip'>
    {
      Object.keys(roleAccess.moduleAccess).map((key) => (
        <OptionsCheckBoxGroup
          key={key}
          name={key}
          active={roleAccess.moduleAccess[key].enabled ? roleAccess.moduleAccess[key].checked ?? true : false}
          enabled={roleAccess.moduleAccess[key].enabled}
          readOnly={readOnly}
          details={roleAccess.moduleAccess[key].options}
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
));

export default AccessModule;
