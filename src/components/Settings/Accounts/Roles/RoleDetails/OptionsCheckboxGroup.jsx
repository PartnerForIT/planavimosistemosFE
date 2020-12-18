import { useTranslation } from 'react-i18next';
import React from 'react';
import StyledCheckbox from '../../../../Core/Checkbox/Checkbox';
import classes from '../Roles.module.scss';

const OptionsCheckBoxGroup = ({
  name = '',
  details = {},
  categoriesNames = {},
  active = false,
  setRoleAccess,
}) => {
  const { t } = useTranslation();
  return (
    <>
      <StyledCheckbox
        label={t(categoriesNames[name] ?? '')}
        style={{ lineHeight: 0.5 }}
        /* eslint-disable-next-line no-shadow */
        onChange={(opt, checked) => setRoleAccess((prevState) => ({
          ...prevState,
          moduleAccess: {
            ...prevState.moduleAccess,
            [opt]: {
              ...prevState.moduleAccess[opt],
              enabled: checked,
            },
          },
        }))}
        id={name}
        checked={active}
      />
      <ul className={classes.checklist}>
        <li>
          {
            Object.keys(details)
              .map((x) => (
                <StyledCheckbox
                  key={x}
                  id={x}
                  label={t(details[x])}
                  style={{ lineHeight: 0.5 }}
                  onChange={() => ({})}
                  disabled={!active}
                />
              ))
          }
        </li>
      </ul>
    </>
  );
};

export default OptionsCheckBoxGroup;
