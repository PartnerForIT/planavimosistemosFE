import React from 'react';
import FormControl from '@material-ui/core/FormControl';
import { useTranslation } from 'react-i18next';

import Button from '../../../Core/Button/Button';
import InputSelect from '../../../Core/InputSelect';
import Input from '../../../Core/Input/Input';
import SearchIcon from '../../../Icons/SearchIcon';
import styles from './KioskUsers.module.scss';

export default function Filter({
  dropdownValue,
  handleChangeUser,
  changeUserKiosk,
  checkedItems,
  stats,
  onNewPinCodes,
  search,
  setSearch,
}) {
  const { t } = useTranslation();

  return (
    <div className={styles.filterBlock}>
      <div>
        <FormControl className={styles.filterBlock__leftContainer}>
          <InputSelect
            id='users'
            name='users'
            onChange={handleChangeUser}
            value={dropdownValue}
            options={[
              {
                value: null,
                label: `${t('All Users')} ${stats.total ?? ''}`,
              },
              {
                value: 1,
                label: `${t('Yes')} ${stats.yes ?? ''}`,
              },
              {
                value: 0,
                label: `${t('No')} ${stats.no ?? ''}`,
              },
            ]}
          />
        </FormControl>
        <FormControl className={styles.margin}>
          <Input
            icon={<SearchIcon />}
            placeholder={`${t('Search')}...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </FormControl>
      </div>

      <div className={styles.filterBlock__inner}>
        <p>
          {checkedItems.length}
          {' '}
          {t('USERS SELECTED')}:
        </p>

        <Button
          green
          onClick={() => changeUserKiosk(true)}
          disabled={!checkedItems.length > 0}
        >
          {t('Use Kiosk')}
        </Button>
        <Button
          yellow
          onClick={() => changeUserKiosk(false)}
          disabled={!checkedItems.length > 0}
        >
          {t('Remove Kiosk')}
        </Button>
        <Button
          onClick={onNewPinCodes}
          disabled={!checkedItems.length > 0}
        >
          {t('New PIN')}
        </Button>
      </div>
    </div>
  );
}
