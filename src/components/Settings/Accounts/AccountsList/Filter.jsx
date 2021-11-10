import React from 'react';
import FormControl from '@material-ui/core/FormControl';
import { useTranslation } from 'react-i18next';
// import {
//   makeStyles,
// } from '@material-ui/core/styles';

import styles from './accounts.module.scss';
import Button from '../../../Core/Button/Button';
import InputSelect from '../../../Core/InputSelect';

// const useStyles = makeStyles(() => ({
//   root: {
//     display: 'flex',
//     flexWrap: 'wrap',
//   },
//   margin: {
//     margin: '5px 5px 5px 0',
//     flex: 1,
//     display: 'flex',
//   },
//   label: {
//     color: '#808F94',
//     fontSize: 14,
//     fontWeight: 600,
//     transform: 'translate(0, 1.5px) scale(1)',
//   },
// }));

export default function Filter({
  users,
  handleChangeUser,
  changeUserStatus = () => ({}),
  checkedItems,
  stats,
  selectedItem,
  withDeleteButton,
}) {
  // const classes = useStyles();
  const { t } = useTranslation();
  // const [search, setSearch] = useState('');
  // const [open, setOpen] = useState(false);

  // const handleClose = () => {
  //   clearCheckbox();
  //   setOpen(false);
  // };
  return (
    <div className={styles.filterBlock}>
      <FormControl className={styles.filterBlock__leftContainer}>
        <InputSelect
          id='users'
          name='users'
          onChange={handleChangeUser}
          value={users}
          options={[
            {
              value: 4,
              label: `All Users ${stats.accounts ?? ''}`,
            },
            {
              value: 1,
              label: `Active ${stats.active ?? ''}`,
            },
            {
              value: 0,
              label: `Suspended ${stats.suspended ?? ''}`,
            },
            {
              value: 3,
              label: `Blocked ${stats.blocked ?? ''}`,
            },
          ]}
        />
      </FormControl>

      <div className={styles.filterBlock__inner}>
        <p>
          {checkedItems.length || (selectedItem.id ? '1' : '0')}
          {' '}
          USERS SELECTED
        </p>
        {stats?.blocked >= 1
        && (
        <Button
          danger
          onClick={() => null}
          disabled={!checkedItems.length > 0 && !selectedItem.id}
        >
          {t('Unblock')}
        </Button>
)}
        <Button
          green
          onClick={() => changeUserStatus('activate')}
          disabled={!checkedItems.length > 0 && !selectedItem.id}
        >
          {t('Activate')}
        </Button>
        <Button
          yellow
          onClick={() => changeUserStatus('suspend')}
          disabled={!checkedItems.length > 0 && !selectedItem.id}
        >
          {t('Suspend')}
        </Button>
        {
          withDeleteButton && (
            <Button
              black
              onClick={() => changeUserStatus('delete')}
              disabled={!checkedItems.length > 0 && !selectedItem.id}
            >
              {t('Delete')}
            </Button>
          )
        }
      </div>
    </div>
  );
}
