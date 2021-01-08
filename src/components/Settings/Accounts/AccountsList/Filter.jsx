import React from 'react';
import NativeSelect from '@material-ui/core/NativeSelect';
import FormControl from '@material-ui/core/FormControl';
import { useTranslation } from 'react-i18next';
import {
  makeStyles,
} from '@material-ui/core/styles';

import styles from './accounts.module.scss';
import Button from '../../../Core/Button/Button';
import BootstrapInput from '../../../shared/SelectBootstrapInput';

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  margin: {
    margin: '5px 5px 5px 0',
  },
  label: {
    color: '#808F94',
    fontSize: 14,
    fontWeight: 600,
    transform: 'translate(0, 1.5px) scale(1)',
  },
}));

export default function Filter({
  users,
  handleChangeUser,
  changeUserStatus = () => ({}),
  checkedItems,
  stats,
}) {
  const classes = useStyles();
  const { t } = useTranslation();
  // const [search, setSearch] = useState('');
  // const [open, setOpen] = useState(false);

  // const handleClose = () => {
  //   clearCheckbox();
  //   setOpen(false);
  // };

  return (
    <div className={styles.filterBlock}>
      <div>
        <FormControl className={classes.margin}>
          <NativeSelect
            id='users'
            value={users}
            onChange={handleChangeUser}
            inputProps={{
              name: 'users',
            }}
            input={<BootstrapInput />}
          >
            <option value={3}>
              All Users
              {' '}
              {stats.accounts ?? ''}
            </option>
            <option value={1}>
              Active
              {' '}
              {stats.active}
            </option>
            <option value={0}>
              Suspended
              {' '}
              {stats.suspended ?? '' }
            </option>
          </NativeSelect>
        </FormControl>
      </div>

      <div className={styles.filterBlock__inner}>

        <p>
          {checkedItems.length}
          {' '}
          USERS SELECTED
        </p>

        <Button green onClick={() => changeUserStatus('activate')} disabled={!checkedItems.length > 0}>
          {t('Active')}
        </Button>
        <Button yellow onClick={() => changeUserStatus('suspend')} disabled={!checkedItems.length > 0}>
          {t('Suspend')}
        </Button>
        <Button danger onClick={() => changeUserStatus('delete')} disabled={!checkedItems.length > 0}>
          {t('Delete')}
        </Button>
      </div>
    </div>
  );
}
