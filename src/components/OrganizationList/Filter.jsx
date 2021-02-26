import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import FormControl from '@material-ui/core/FormControl';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import EditModules from '../Core/Dialog/EditModules';
import Button from '../Core/Button/Button';
import InputSelect from '../Core/InputSelect';
import Input from '../Core/Input/Input';
import SearchIcon from '../Icons/SearchIcon';
import { getCompanies } from '../../store/organizationList/actions';
import useDebounce from '../Helpers/useDebounce';

import styles from './orgList.module.scss';

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  margin: {
    margin: '5px 5px 5px 0',
    width: 189,

    '& > input': {
      height: 36,
    },
  },
  label: {
    color: '#808F94',
    fontSize: 14,
    fontWeight: 600,
    transform: 'translate(0, 1.5px) scale(1)',
  },
}));

export default function Filter({
  organizations,
  handleChangeOrganizations,
  changeStatusCompany,
  checkedItems,
  selectedItem,
  enterOrganization,
  companies,
  clearCheckbox,
}) {
  const classes = useStyles();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);

  const debouncedSearchTerm = useDebounce(search, 500);
  useEffect(() => {
    if (debouncedSearchTerm) {
      dispatch(getCompanies({ search }));
    }
    if (search === '') {
      dispatch(getCompanies());
    }
  }, [debouncedSearchTerm, dispatch, search]);

  const handleClose = () => {
    clearCheckbox();
    setOpen(false);
  };

  const options = useMemo(() => [
    {
      value: 3,
      label: 'All organizations',
    },
    {
      value: 1,
      label: 'Active',
    },
    {
      value: 0,
      label: 'Suspended',
    },
    {
      value: 2,
      label: 'Terminated',
    },
  ], []);

  return (
    <div className={styles.filterBlock}>
      <div>
        <FormControl className={classes.margin}>
          <InputSelect
            id='organizations-select'
            name='organizations'
            value={organizations}
            onChange={handleChangeOrganizations}
            options={options}
          />
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
        <Button
          navyBlue
          onClick={() => setOpen(true)}
          disabled={(!checkedItems.length > 0 && !selectedItem) || checkedItems.length > 1}
        >
          {t('Edit Modules')}
        </Button>
        <Button
          onClick={() => { enterOrganization(); }}
          disabled={(!checkedItems.length > 0 && !selectedItem) || checkedItems.length > 1}
        >
          {t('Enter Organization')}
        </Button>
        <Button
          green
          onClick={() => changeStatusCompany('activate')}
          disabled={!checkedItems.length > 0 && !selectedItem}
        >
          {t('Active')}
        </Button>
        {/*<Button*/}
        {/*  yellow*/}
        {/*  onClick={() => changeStatusCompany('suspend')}*/}
        {/*  disabled={!checkedItems.length > 0 && !selectedItem}*/}
        {/*>*/}
        {/*  {t('Suspend')}*/}
        {/*</Button>*/}
        {/*<Button*/}
        {/*  danger*/}
        {/*  onClick={() => changeStatusCompany('delete')}*/}
        {/*  disabled={!checkedItems.length > 0 && !selectedItem}*/}
        {/*>*/}
        {/*  {t('Terminate')}*/}
        {/*</Button>*/}
        {/*<Button*/}
        {/*  black*/}
        {/*  onClick={() => changeStatusCompany('destroy')}*/}
        {/*  disabled={!checkedItems.length > 0 && !selectedItem}*/}
        {/*>*/}
        {/*  {t('Delete')}*/}
        {/*</Button>*/}
      </div>
      <EditModules
        open={open}
        handleClose={handleClose}
        companies={companies}
        checkedItem={checkedItems[0] || selectedItem?.id}
        title={t('Have access to these modules')}
      />
    </div>
  );
}
