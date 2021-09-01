import { useSelector } from 'react-redux';

import { companyInfoSelector } from '../store/company/selectors';

export default () => {
  const companyInfo = useSelector(companyInfoSelector);

  return {
    dateFormat: companyInfo.date_format,
  };
};
