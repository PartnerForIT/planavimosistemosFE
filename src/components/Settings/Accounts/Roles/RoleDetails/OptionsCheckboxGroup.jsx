import { useTranslation } from 'react-i18next';
import React from 'react';
import StyledCheckbox from '../../../../Core/Checkbox/Checkbox';
import classes from '../Roles.module.scss';

const OptionsCheckBoxGroup = ({
  name = '',
  availableDetails = [],
  categoriesNames = {},
  roleAccess = {},
}) => {
  const { t } = useTranslation();

  return (

    availableDetails.some((item) => item.name === name)
    && (
      <>
        <StyledCheckbox
          label={t(categoriesNames[name] ?? '')}
          style={{ lineHeight: 0.5 }}
          onChange={() => ({})}
          id='logbook'
        />
        <ul className={classes.checklist}>
          <li>
            {
              availableDetails.filter((item) => item.name === name)
                .map((x) => (
                  <StyledCheckbox
                    key={x.action}
                    id={x.action}
                    label={t(roleAccess[x.name][x.action])}
                    style={{ lineHeight: 0.5 }}
                    onChange={() => ({})}
                  />
                ))
            }
          </li>
        </ul>
      </>
    ));
};

export default OptionsCheckBoxGroup;
