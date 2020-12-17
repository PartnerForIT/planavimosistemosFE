import React from 'react';
import { useTranslation } from 'react-i18next';
import Content from './Content';
import StyledCheckbox from '../../../../Core/Checkbox/Checkbox';
import classes from '../Roles.module.scss';

function AccessModule({
  availableDetails = [],
  roleAccess = {},
  categoriesNames = {},
}) {
  const { t } = useTranslation();

  return (

    <Content title='Access by module' tooltip='Tooltip'>

      {/* Logbook */}
      {
        availableDetails.some((item) => item.name === 'logbook')
        && (
          <>
            <StyledCheckbox
              label={t(categoriesNames.logbook ?? '')}
              style={{ lineHeight: 0.5 }}
              onChange={() => ({})}
              id='logbook'
            />
            <ul className={classes.checklist}>
              <li>
                <StyledCheckbox id='id' label='label' style={{ lineHeight: 0.5 }} onChange={() => ({})} />
                <StyledCheckbox id='id' label='label' style={{ lineHeight: 0.5 }} onChange={() => ({})} />
                <StyledCheckbox id='id' label='label' style={{ lineHeight: 0.5 }} onChange={() => ({})} />
              </li>
            </ul>
          </>
        )
      }
      <pre>
        {/* {JSON.stringify(roleAccess, null, 2)} */}
        {JSON.stringify(availableDetails, null, 2)}
      </pre>
    </Content>
  );
}

export default AccessModule;
