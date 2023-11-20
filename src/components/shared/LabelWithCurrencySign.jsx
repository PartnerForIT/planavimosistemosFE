import React from 'react';
import { useTranslation } from 'react-i18next';
import CurrencySign from './CurrencySign';

const LabelWithCurrencySign = ({ text, tail }) => {
  const { t } = useTranslation();

  return (
    <>
      {t(text)}
      {' '}
      <CurrencySign />
      {tail ? tail : ''}
    </>
  );
};

export default LabelWithCurrencySign;
