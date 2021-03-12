import React, { } from 'react';
import { useTranslation } from 'react-i18next';

import Content from './Content';

export default React.memo(({
  roleAccess = {},
  activePermissions = [],
  permissionsIds,
  onChangeHandler,
  readOnly,
  modules,
  isSuperAdmin,
}) => {
  const { t } = useTranslation();

  return (
    <Content tooltip='Tooltip' title='Organisation access'>
      Organisation access
    </Content>
  );
});
