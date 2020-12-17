import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import _ from 'lodash';
import moment from 'moment';
import { settingCompanySelector } from '../../store/settings/selectors';
import { getSettingCompany } from '../../store/settings/actions';
import { isLoadingSelector } from '../../store/organizationList/selectors';

const TimeFormat = React.memo(({ date = null }) => {
  const dispatch = useDispatch();

  const { id } = useParams();
  const company = useSelector(settingCompanySelector);
  const loading = useSelector(isLoadingSelector);

  useEffect(() => {
    if (_.isEmpty(company) && !loading) {
      dispatch(getSettingCompany(id));
    }
  }, [company, dispatch, id, loading]);

  const formatDate = useMemo(() => moment(date)
    .format(company.date_format ?? 'lll'),
  [company.date_format, date]);

  return (
    <>
      {formatDate}
    </>
  );
});

export default TimeFormat;
