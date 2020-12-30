import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import _ from 'lodash';
import moment from 'moment';
import { settingCompanySelector, settingsLoadingSelector } from '../../store/settings/selectors';
import { getSettingCompany } from '../../store/settings/actions';

const TimeFormat = ({ date = null }) => {
  const dispatch = useDispatch();

  const { id } = useParams();
  const company = useSelector(settingCompanySelector);
  const settingsLoading = useSelector(settingsLoadingSelector);

  useEffect(() => {
    if (_.isEmpty(company) && !settingsLoading) {
      dispatch(getSettingCompany(id));
    }
  }, [company, dispatch, id, settingsLoading]);

  const formatDate = useMemo(() => moment(date)
    .format(company.date_format ?? 'lll'),
  [company.date_format, date]);

  return (
    <>
      {formatDate}
    </>
  );
};

export default TimeFormat;
