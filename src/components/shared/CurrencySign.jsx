import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import _ from 'lodash';
import {
  currencySelector,
  settingCompanySelector, settingsLoadingSelector,
} from '../../store/settings/selectors';
import { getCurrencies, getSettingCompany } from '../../store/settings/actions';

const CurrencySign = React.memo(() => {
  const dispatch = useDispatch();

  const { id } = useParams();
  const currencies = useSelector(currencySelector);
  const company = useSelector(settingCompanySelector);
  const settingsLoading = useSelector(settingsLoadingSelector);

  useEffect(() => {
    if (!currencies.length && !settingsLoading) {
      dispatch(getCurrencies());
    }
  }, [currencies, dispatch, settingsLoading]);

  useEffect(() => {
    if (_.isEmpty(company) && !settingsLoading) {
      dispatch(getSettingCompany(id));
    }
  }, [company, dispatch, id, settingsLoading]);

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
