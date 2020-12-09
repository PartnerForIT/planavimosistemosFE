import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import NativeSelect from '@material-ui/core/NativeSelect';
import InputBase from '@material-ui/core/InputBase';
import FormControl from '@material-ui/core/FormControl';
import { useTranslation } from 'react-i18next';
import {
  withStyles,
  makeStyles,
} from '@material-ui/core/styles';

import styles from './accounts.module.scss';
import Button from '../../../Core/Button/Button';
import Input from '../../../Core/Input/Input';
import SearchIcon from '../../../Icons/SearchIcon';

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

const BootstrapInput = withStyles((theme) => ({
  root: {
    'label + &': {
      marginTop: theme.spacing(3),
    },
    '& label.Mui-focused': {
      color: '#4d7499',
    },
  },
  input: {
    borderRadius: 4,
    width: '100%',
    position: 'relative',
    backgroundColor: theme.palette.common.white,
    border: '1px solid #e8eff6',
    fontSize: 14,
    lineHeight: '16px',
    padding: '11px',
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    '&:focus': {
      boxShadow: 'none',
      borderRadius: 4,
      backgroundColor: theme.palette.common.white,
      borderColor: '#0087ff',
    },
  },
}))(InputBase);

export default function Filter({
  users,
  handleChangeUser,
  changeUserStatus = () => ({}),
  checkedItems,
  clearCheckbox,
}) {
  const classes = useStyles();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    clearCheckbox();
    setOpen(false);
  };

  return (
    <div className={styles.filterBlock}>
      <div>
        <FormControl className={classes.margin}>
          <NativeSelect
            id='users-select'
            value={users}
            onChange={handleChangeUser}
            inputProps={{
              name: 'users',
            }}
            input={<BootstrapInput />}
          >
            <option value={3}>All Users</option>
            <option value={1}>Active</option>
            <option value={0}>Suspended</option>
            <option value={2}>Terminated</option>
          </NativeSelect>
        </FormControl>
        <FormControl className={classes.margin}>
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
      {/* <EditModules */}
      {/*  open={open} */}
      {/*  handleClose={handleClose} */}
      {/*  companies={companies} */}
      {/*  checkedItem={checkedItems.length > 0 ? checkedItems[0] : null} */}
      {/*  title={t('Have access to these modules')} */}
      {/* /> */}
    </div>
  );
}
