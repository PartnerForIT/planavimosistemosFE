import React from 'react';
import { useTranslation } from 'react-i18next';
import Content from './Content';

function AccessModule() {
  const { t } = useTranslation();

  return (

    <Content title='Access by module' tooltip='Tooltip'>
      content
    </Content>
  );
}

export default AccessModule;
