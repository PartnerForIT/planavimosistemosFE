import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import Content from './Content';
import OptionsCheckBoxGroup from './OptionsCheckboxGroup';

function AccessModule({
  availableDetails = [],
  roleAccess = {},
  categoriesNames = {},
}) {
  const { t } = useTranslation();

  const labels = useMemo(() => ({}), []);

  return (

    <Content title='Access by module' tooltip='Tooltip'>

      {/* Logbook */}
      <OptionsCheckBoxGroup
        name='logbook'
        availableDetails={availableDetails}
        categoriesNames={categoriesNames}
        roleAccess={roleAccess}
      />

      {/* Reports */}
      <OptionsCheckBoxGroup
        name='reports'
        availableDetails={availableDetails}
        categoriesNames={categoriesNames}
        roleAccess={roleAccess}
      />

      {/* Events */}
      <OptionsCheckBoxGroup
        name='events'
        availableDetails={availableDetails}
        categoriesNames={categoriesNames}
        roleAccess={roleAccess}
      />
    </Content>
  );
}

export default AccessModule;
