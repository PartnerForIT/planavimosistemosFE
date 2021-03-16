import { useTranslation } from 'react-i18next';
import React from 'react';
import StyledCheckbox from '../../../Core/Checkbox/Checkbox';
import classes from '../Events.module.scss';

const OptionsCheckBoxGroup = ({
  name = '',
  details = {},
  categoriesNames = {},
  active = false,
  setRoleAccess,
  onChangeHandler,
  permissionsIds,
  activePermissions,
  setDisableReady,
  enabled = false,
  readOnly = false,
}) => {
  const { t } = useTranslation();
  return (
    <>
      <StyledCheckbox
        label={t(categoriesNames[name] ?? '')}
        style={{ lineHeight: 0.5 }}
        /* eslint-disable-next-line no-shadow */
        onChange={(opt, checked) => {
          setRoleAccess((prevState) => ({
            ...prevState,
            moduleAccess: {
              ...prevState.moduleAccess,
              [opt]: {
                ...prevState.moduleAccess[opt],
                checked,
              },
            },
          }));
          if (!checked) {
            setDisableReady(true);
          }
        }}
        id={name}
        checked={active}
        disabled={!enabled || readOnly}
      />
      <ul className={classes.checklist}>
        <li>
          {
            Object.keys(details)
              .map((x) => {
                const id = permissionsIds[name][x] ?? 0;
                return (
                  <StyledCheckbox
                    key={x}
                    id={id}
                    label={t(details[x])}
                    style={{ lineHeight: 0.5 }}
                    onChange={onChangeHandler}
                    disabled={!active || readOnly}
                    checked={activePermissions.some((i) => i === id)}
                  />
                );
              })
          }
        </li>
      </ul>
    </>
  );
};

export default OptionsCheckBoxGroup;
