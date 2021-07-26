import React from 'react';

import Content from './Content';
import OptionsCheckBoxGroup from './OptionsCheckboxGroup';

export default React.memo(({
  roleAccess = {},
  categoriesNames = {},
  activeRole,
  activePermissions = [],
  onChangeHandler,
  permissionsIds,
  readOnly,
}) => (
  <Content title='Access by module' tooltip='Tooltip'>
    {
      Object.keys(roleAccess.moduleAccess).map((key) => (
        <OptionsCheckBoxGroup
          key={key}
          id={permissionsIds[key].module_access}
          name={key}
          active={activePermissions.some((i) => i === permissionsIds[key].module_access)}
          enabled={permissionsIds[key]}
          readOnly={readOnly}
          details={roleAccess.moduleAccess[key].options}
          categoriesNames={categoriesNames}
          roleAccess={roleAccess}
          activeRole={activeRole}
          onChangeHandler={onChangeHandler}
          permissionsIds={permissionsIds}
          activePermissions={activePermissions}
        />
      ))
    }
  </Content>
));
