import React from 'react';
import { useTranslation } from 'react-i18next';
import Content from './Content';

function Users() {
  const { t } = useTranslation();

  return (
    <Content tooltip='Tooltip' title='Users within this role'>
      content
    </Content>
  );
}

export default Users;
