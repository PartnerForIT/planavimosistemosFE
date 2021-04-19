import React from 'react';
import FormControl from '@material-ui/core/FormControl';
import { useTranslation } from 'react-i18next';
// import {
//   makeStyles,
// } from '@material-ui/core/styles';

import styles from './KioskUsers.module.scss';
import Button from '../../../Core/Button/Button';
import InputSelect from '../../../Core/InputSelect';

export default function Filter({
  users,
  handleChangeUser,
  changeUserKiosk,
  checkedItems,
  stats,
  onNewPin,
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
              value: 3,
              label: `All Users ${stats.accounts ?? ''}`,
            },
            {
              value: 1,
              label: `Activate ${stats.active ?? ''}`,
            },
            {
              value: 0,
              label: `Suspended ${stats.suspended ?? ''}`,
            },
          ]}
        />
      </FormControl>

      <div className={styles.filterBlock__inner}>
        <p>
          {checkedItems.length}
          {' '}
          USERS SELECTED:
        </p>

        <Button
          green
          onClick={() => changeUserKiosk('use')}
          disabled={!checkedItems.length > 0}
        >
          {t('Use Kiosk')}
        </Button>
        <Button
          yellow
          onClick={() => changeUserKiosk('remove')}
          disabled={!checkedItems.length > 0}
        >
          {t('Remove Kiosk')}
        </Button>
        <Button
          onClick={onNewPin}
          disabled={!checkedItems.length > 0}
        >
          {t('New PIN')}
        </Button>
      </div>
    </div>
  );
}
