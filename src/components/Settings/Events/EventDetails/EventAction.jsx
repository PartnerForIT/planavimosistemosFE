import React, { } from 'react';
import { useTranslation } from 'react-i18next';

import StyledCheckbox from '../../../Core/Checkbox/Checkbox';
import Content from './Content';

export default React.memo(({
  onChangeHandler,
  values,
}) => {
  const { t } = useTranslation();

  return (
    <Content tooltip='Tooltip' title='Event Action'>
      <StyledCheckbox
        label={t('Notify in Application')}
        id='notification_app'
        onChange={onChangeHandler}
        checked={values.notification_app}
      />

      <StyledCheckbox
        label={t('Notify by e-mail')}
        id='notification_email'
        onChange={onChangeHandler}
        checked={values.notification_email}
      />
    </Content>
  );
});
