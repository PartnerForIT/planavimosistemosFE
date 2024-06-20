import React, { useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import MaynLayout from '../Core/MainLayout';
import Dashboard from '../Core/Dashboard';
import usePermissions from '../Core/usePermissions';

const permissionsConfig = [
  {
    name: 'activity_log',
    permission: 'activity_log_view',
    module: 'activity_log',
  },
  {
    name: 'groups',
    module: 'create_groups',
    permission: 'groups_create',
  },
  {
    name: 'logbook',
    module: 'logbook',
    permission: 'logbook_module_access',
  },
  {
    name: 'logbook_edit_settings',
    permission: 'logbook_edit_settings',
  },
  {
    name: 'events',
    module: 'events',
    permission: 'events_create',
  },
  {
    name: 'company_edit_settings',
    permission: 'company_edit_settings',
  },
  {
    name: 'roles_create',
    permission: 'roles_create',
  },
  {
    name: 'data_delete',
    permission: 'data_delete',
  },
  {
    name: 'categories_create',
    permission: 'categories_create',
  },
  {
    name: 'accounts_see_and_edit',
    permission: 'accounts_see_and_edit',
  },
  {
    name: 'kiosk',
    permission: 'kiosk_create',
    module: 'kiosk',
  },
  {
    name: 'schedule_schedule_shift',
    permission: 'schedule_schedule_shift',
  },
  {
    name: 'schedule_shift',
    module: 'schedule_shift',
    permission: 'schedule_module_access',
  },
  {
    name: 'schedule_simple',
    module: 'schedule_simple',
    permission: 'schedule_module_access',
  },
  {
    name: 'additional-rates',
    permission: 'rates_create_and_edit',
  },
];

export default () => {
  const permissions = usePermissions(permissionsConfig);
  const { id: companyId } = useParams();
  const history = useHistory();

  useEffect(() => {
    const mainPath = `/${companyId}/settings`;
    if (permissions.accounts_see_and_edit) {
      history.push(`${mainPath}/accounts/accounts-list`);
    } else if (permissions.company_edit_settings) {
      history.push(`${mainPath}/general/company`);
    } else if (permissions.roles_create) {
      history.push(`${mainPath}/accounts/roles`);
    } else if (permissions.groups) {
      history.push(`${mainPath}/accounts/grouping`);
    } else if (permissions.logbook && permissions.logbook_edit_settings) {
      history.push(`${mainPath}/logbook/journal`);
    } else if (permissions.logbook && permissions.rates_create_and_edit) {
      history.push(`${mainPath}/logbook/additional-rates`);
    } else if (permissions.kiosk) {
      history.push(`${mainPath}/kiosk/kiosk-list`);
    } else if (permissions.events) {
      history.push(`${mainPath}/events`);
    } else if ((permissions.schedule_shift || permissions.schedule_simple) && permissions.schedule_schedule_shift) {
      history.push(`${mainPath}/schedule`);
    } else if (permissions.activity_log) {
      history.push(`${mainPath}/activity-log`);
    } else if (permissions.data_delete) {
      history.push(`${mainPath}/delete`);
    } else if (permissions.categories_create) {
      history.push(`${mainPath}/categories`);
    }
  }, [permissions, companyId, history]);

  return (
    <MaynLayout>
      <Dashboard />
    </MaynLayout>
  );
};
