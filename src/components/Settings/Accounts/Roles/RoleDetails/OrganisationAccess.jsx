import React from 'react';
import { useTranslation } from 'react-i18next';

import Content from './Content';
import StyledCheckbox from '../../../../Core/Checkbox/Checkbox';

const OrganisationAccess = React.memo(({
  roleAccess: {
    organisation,
  } = {},
  activePermissions = [],
  permissionsIds,
  onChangeHandler,
  readOnly,
}) => {
  const { t } = useTranslation();

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
                      disabled={!organisation[key].enabled || readOnly}
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

export default OrganisationAccess;
