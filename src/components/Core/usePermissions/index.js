import { useSelector } from 'react-redux';
import { useMemo } from 'react';

import { userSelector } from '../../../store/auth/selectors';
import { companyModules } from '../../../store/company/selectors';

export default (permissionsConfig) => {
  const user = useSelector(userSelector);
  const modules = useSelector(companyModules);

  const permissions = useMemo(() => {
    const isSuperAdmin = user?.user?.role_id === 1;
    if (user.user_permissions) {
      return permissionsConfig.reduce((acc, item) => {
        if (item.permission && item.module) {
          acc[item.name] = Boolean((isSuperAdmin || user.user_permissions[item.permission]) && modules[item.module]);
        } else if (item.permission) {
          //for permissions where true mean disabled
          acc[item.name] = item.default === false ? (user.user_permissions[item.permission] || false) : Boolean(isSuperAdmin || user.user_permissions[item.permission]);
        } else if (item.module) {
          acc[item.name] = Boolean(modules[item.module]);
        }

        return acc;
      }, {});
    }

    return {};
  }, [user, modules, permissionsConfig]);

  return permissions;
};
