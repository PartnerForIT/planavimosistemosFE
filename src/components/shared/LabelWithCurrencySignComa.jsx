import React from 'react';
import { useTranslation } from 'react-i18next';
import CurrencySign from './CurrencySign';

const LabelWithCurrencySignComa = ({ label }) => {
  const { t } = useTranslation();

  return (
    <>
      {t(label)}
      {', '}
      <CurrencySign />
    </>
  );
};

export default LabelWithCurrencySignComa;
