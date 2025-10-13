import React from 'react';
import FormControl from '@material-ui/core/FormControl';
import { useTranslation } from 'react-i18next';

import styles from '../timeoff.module.scss';
import Button from '../../../Core/Button/Button';
import SearchIcon from '../../../Icons/SearchIcon';
import Input from '../../../Core/Input/Input';


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
}) {
  const { t } = useTranslation();
  
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

      <div className={styles.filterBlock__inner}>
        <p>
          {checkedItems.length || (selectedItem.id ? '1' : '0')}
          {' '}
          {t('USERS SELECTED')}
        </p>
        
        <Button
          onClick={handleRequestBehalf}
          primary
          disabled={!checkedItems.length > 0 && !selectedItem.id}
        >
          {t('Request on behalf')}
        </Button>
        <Button
          onClick={handleAdjustBalance}
          primary
          disabled={!checkedItems.length > 0 && !selectedItem.id}
        >
          {t('Adjust balance')}
        </Button>
        <Button
          onClick={handleAdjustTimeUsed}
          primary
          disabled={!checkedItems.length > 0 && !selectedItem.id}
        >
          {t('Adjust time used')}
        </Button>
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
