import React, { } from 'react';
import { useTranslation } from 'react-i18next';

import StyledCheckbox from '../../../Core/Checkbox/Checkbox';
import Content from './Content';

export default React.memo(({
  onChangeHandler,
}) => {
  const { t } = useTranslation();

  return (
    <Content tooltip='Tooltip' title='Event Action'>
      <StyledCheckbox
        label={t('Notify in Application')}
        id='show_costs'
        onChange={onChangeHandler}
        checked={true}
      />

      <StyledCheckbox
        label={t('Notify by e-mail')}
        id='show_costs'
        onChange={onChangeHandler}
        checked={true}
      />
    </Content>
  );
});
