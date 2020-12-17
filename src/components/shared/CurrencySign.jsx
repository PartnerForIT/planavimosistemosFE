import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import _ from 'lodash';
import { currencySelector, settingCompanySelector } from '../../store/settings/selectors';
import { getCurrencies, getSettingCompany } from '../../store/settings/actions';
import { isLoadingSelector } from '../../store/organizationList/selectors';

const CurrencySign = React.memo(() => {
  const dispatch = useDispatch();

  const { id } = useParams();
  const currencies = useSelector(currencySelector);
  const company = useSelector(settingCompanySelector);
  const loading = useSelector(isLoadingSelector);

  useEffect(() => {
    if (!currencies.length && !loading) {
      dispatch(getCurrencies());
    }
  }, [currencies.length, dispatch, loading]);
  useEffect(() => {
    if (_.isEmpty(company)) {
      dispatch(getSettingCompany(id));
    }
  }, [company, dispatch, id]);

  const currency = useMemo(
    () => currencies.find((curr) => curr.code === company?.currency || curr.name === company?.currency)?.symbol ?? '',
    [company.currency, currencies],
  );

  return (
    <>
      {currency}
    </>
  );
});

export default CurrencySign;
