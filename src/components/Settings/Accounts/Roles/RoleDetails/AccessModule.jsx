import React, { useMemo } from 'react';

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
  modules,
  isSuperAdmin,
}) => {
  const moduleAccess = useMemo(() => {
    const allModuleAccess = {
      ...roleAccess.moduleAccess,
    };

    if (!isSuperAdmin) {
      if (!modules.reports) {
        delete allModuleAccess.reports;
      }
      if (!modules.events) {
        delete allModuleAccess.events;
      }
      if (!modules.logbook) {
        delete allModuleAccess.logbook;
      } else if (!modules.use_approval_flow) {
        delete allModuleAccess.logbook.options.requests;
        delete allModuleAccess.logbook.options.requests_in_place;
      }
    }

    return allModuleAccess;
  }, [modules, isSuperAdmin, roleAccess.moduleAccess]);

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
