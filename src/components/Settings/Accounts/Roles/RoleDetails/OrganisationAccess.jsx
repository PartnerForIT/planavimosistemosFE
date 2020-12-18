import React from 'react';
import { useTranslation } from 'react-i18next';
import Content from './Content';
import StyledCheckbox from '../../../../Core/Checkbox/Checkbox';

const defaultAvailable = {
  pto: ['edit_settings'],
  groups: ['create'],
  roles: ['create'],
  data: ['delete'],
  categories: ['create'],
  accounts: ['create'],
  events: ['create'],
  activity_log: ['view'],
};

const OrganisationAccess = React.memo(({
  availableDetails,
  categoriesNames,
  roleAccess,
}) => {
  const { t } = useTranslation();

  return (
    <Content tooltip='Tooltip' title='Organisation access'>
      {
        Object.keys(defaultAvailable)
          .map((key, i) => (
            <React.Fragment key={key + i.toString()}>
              {
                defaultAvailable[key].map((name) => (
                  <StyledCheckbox
                    key={key + name}
                    label={t(roleAccess[key][name])}
                    id={key}
                    onChange={() => ({})}
                  />
                ))
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

      {/* Can edit Logbook settings */}
      {/* ??? */}

    </Content>
  );
});

export default OrganisationAccess;
