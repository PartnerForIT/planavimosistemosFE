import { useSelector } from 'react-redux';

import { companyInfoSelector } from '../store/company/selectors';

export default () => {
  const companyInfo = useSelector(companyInfoSelector);

  const getDateFormat = (formats) => formats[companyInfo.date_format];

  return {
    dateFormat: companyInfo.date_format,
    getDateFormat,
  };
};
