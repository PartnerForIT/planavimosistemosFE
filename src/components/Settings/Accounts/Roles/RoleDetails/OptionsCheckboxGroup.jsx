import { useTranslation } from 'react-i18next';
import React from 'react';
import StyledCheckbox from '../../../../Core/Checkbox/Checkbox';
import classes from '../Roles.module.scss';

const OptionsCheckBoxGroup = ({
  name = '',
  id,
  details = {},
  categoriesNames = {},
  active = false,
  onChangeHandler,
  permissionsIds,
  activePermissions,
  enabled = false,
  readOnly = false,
}) => {
  const { t } = useTranslation();
  const style = { lineHeight: 0.5 };

  const getDisabled = (action) => {
    if (name === 'logbook' && action === 'costs') {
      return activePermissions.some((it) => it === permissionsIds[name].profit);
    }

    return false;
  };

  return (
    <>
      <StyledCheckbox
        label={t(categoriesNames[name] ?? '')}
        style={style}
        /* eslint-disable-next-line no-shadow */
        onChange={onChangeHandler}
        id={id}
        checked={active}
        disabled={!enabled || readOnly}
      />
      <ul className={classes.checklist}>
        <li>
          {
            Object.keys(details)
              .map((x) => {
                const detailId = permissionsIds[name][x] ?? 0;
                return (
                  <StyledCheckbox
                    key={x}
                    id={detailId}
                    label={t(details[x])}
                    style={style}
                    onChange={onChangeHandler}
                    disabled={!active || readOnly || getDisabled(x)}
                    checked={activePermissions.some((i) => i === detailId)}
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
