import React from 'react';
import { useTranslation } from 'react-i18next';
import CurrencySign from './CurrencySign';

const LabelWithCurrencySign = ({ text }) => {
  const { t } = useTranslation();

  return (
    <>
      {t(text)}
      <CurrencySign />
    </>
  );
};

export default LabelWithCurrencySign;
