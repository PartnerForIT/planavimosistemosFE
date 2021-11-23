import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';

import Content from './Content';
import StyledCheckbox from '../../../../Core/Checkbox/Checkbox';

export default memo(({
  roleAccess: {
    organisation,
  } = {},
  activePermissions = [],
  permissionsIds,
  onChangeHandler,
  readOnly,
}) => {
  const { t } = useTranslation();
  const getDisabled = (module, action) => {
    if (module === 'accounts' && action !== 'see_and_edit') {
      return activePermissions.every((it) => it !== permissionsIds[module].see_and_edit);
    }

    return false;
  };

  return (
    <Content tooltip='Tooltip' title='Organisation access'>
      {
        Object.keys(organisation)
          .map((key, i) => (
            <React.Fragment key={key + i.toString()}>
              {
                Object.keys(organisation[key].options).map((name) => {
                  const id = permissionsIds[key][name] ?? 0;
                  return (
                    <StyledCheckbox
                      key={key + name}
                      label={t(organisation[key].options[name])}
                      id={id}
                      onChange={onChangeHandler}
                      disabled={!organisation[key].enabled || readOnly || getDisabled(key, name)}
                      checked={activePermissions.some((it) => it === id)}
                    />
                  );
                })
              }
            </React.Fragment>
          ))
      }

      {/* Use Managers Mobile View */}
      {/* ???? */}

      {/* Can see & edit Accounts List */}
      {/* ??? */}

      {/* Can delete Accounts list */}
      {/* ??? */}

      {/* Can edit Events settings */}
      {/* ??? */}

    </Content>
  );
});
