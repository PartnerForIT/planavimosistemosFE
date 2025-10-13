import React from 'react';
import FormControl from '@material-ui/core/FormControl';
import { useTranslation } from 'react-i18next';

import styles from '../timeoff.module.scss';
import Button from '../../../Core/Button/Button';
import SearchIcon from '../../../Icons/SearchIcon';
import Input from '../../../Core/Input/Input';
import usePermissions from '../../../Core/usePermissions';

const permissionsConfig = [
  {
    name: 'time_off_see_all_requests',
    permission: 'time_off_see_all_requests',
    module: 'time_off',
  },
  {
    name: 'time_off_see_my_employees',
    permission: 'time_off_see_my_employees',
    module: 'time_off',
  },
  {
    name: 'time_off_fill_request_behalf',
    permission: 'time_off_fill_request_behalf',
    module: 'time_off',
  },
  {
    name: 'time_off_adjust_balance',
    permission: 'time_off_adjust_balance',
    module: 'time_off',
  },
  {
    name: 'time_off_adjust_time_used',
    permission: 'time_off_adjust_time_used',
    module: 'time_off',
  },
  {
    name: 'time_off_see_private_requests',
    permission: 'time_off_see_private_requests',
    module: 'time_off',
  },
]

export default function Filter({
  changeUserStatus = () => ({}),
  handleUnassign,
  handleRequestBehalf,
  handleAdjustBalance,
  handleAdjustTimeUsed,
  checkedItems,
  selectedItem,
  setSearch,
  search,
  info,
}) {
  const { t } = useTranslation();
  const permissions = usePermissions(permissionsConfig);

  return (
    <div className={styles.filterBlock}>
      <div>
        <FormControl className={styles.margin}>
          <Input
            icon={<SearchIcon />}
            placeholder={`${t('Search')}...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </FormControl>
      </div>
      {
        info
          ? Object.entries(info).map(([key, value]) => {
            return (
              <div key={key} className={styles.assignedUsers}>
                { value } { key }
              </div>
            )
          })
          : null
      }
      <div className={styles.filterBlock__inner}>
        <p>
          {checkedItems.length || (selectedItem.id ? '1' : '0')}
          {' '}
          {t('USERS SELECTED')}
        </p>
        
        {permissions.time_off_fill_request_behalf && (
        <Button
          onClick={handleRequestBehalf}
          primary
          disabled={!checkedItems.length > 0 && !selectedItem.id}
        >
          {t('Request on behalf')}
        </Button>
        )}
        {permissions.time_off_adjust_balance && (
        <Button
          onClick={handleAdjustBalance}
          primary
          disabled={!checkedItems.length > 0 && !selectedItem.id}
        >
          {t('Adjust balance')}
        </Button>
        )}
        {permissions.time_off_adjust_time_used && (
        <Button
          onClick={handleAdjustTimeUsed}
          primary
          disabled={!checkedItems.length > 0 && !selectedItem.id}
        >
          {t('Adjust time used')}
        </Button>
        )}
        {
          handleUnassign
           ? <Button
              black
              onClick={handleUnassign}
              disabled={!checkedItems.length > 0 && !selectedItem.id}
            >
              {t('Unassign')}
            </Button>
          : null
        }        
      </div>
    </div>
  );
}
