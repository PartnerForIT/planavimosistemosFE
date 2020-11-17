import React, {useState, useEffect} from 'react';
import { useDispatch } from 'react-redux';
import NativeSelect from '@material-ui/core/NativeSelect';
import Button from '../Core/Button/Button';
import InputBase from '@material-ui/core/InputBase';
import Input from '../Core/Input/Input';
import SearchIcon from '../Icons/SearchIcon';
import FormControl from '@material-ui/core/FormControl';
import { useTranslation } from 'react-i18next';
import {getCompanies} from '../../store/organizationList/actions';
import useDebounce from '../Helpers/useDebounce'
import {
  withStyles,
  makeStyles,
} from '@material-ui/core/styles';

import styles from './orgList.module.scss';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  margin: {
    margin: '0 5px 0 0',
  },
  label: {
    color: '#808F94',
    fontSize: 14,
    fontWeight: 600,
    transform: 'translate(0, 1.5px) scale(1)',
  }
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
  organizations, 
  handleChangeOrganizations, 
  changeStatusCompany, 
  checkedItems, 
  enterOrganization,
}) {
  const classes = useStyles();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [search, setSearch] = useState('');

  const debouncedSearchTerm = useDebounce(search, 500)

  useEffect(() => {
    if(debouncedSearchTerm) {
      dispatch(getCompanies({search}));
    }
    if(search==='') {
      dispatch(getCompanies())
    }
  },[debouncedSearchTerm]);

  return(
    <div className={styles.filterBlock}>
      <div>
        <FormControl className={classes.margin}>
          <NativeSelect
            id="organizations-select"
            value={organizations}
            onChange={handleChangeOrganizations}
            inputProps={{
              name: 'organizations',
            }}
            input={<BootstrapInput />}
          >
            <option value={3}>All organizations</option>
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
        <Button onClick={()=> {enterOrganization()}} disabled={!checkedItems.length>0}>
          Enter Organization
        </Button>
        <Button green onClick={()=> changeStatusCompany('activate')} disabled={!checkedItems.length>0}>
          Active
        </Button>
        <Button yellow onClick={()=> changeStatusCompany('suspend')} disabled={!checkedItems.length>0}>
          Suspend
        </Button>
        <Button danger onClick={()=> changeStatusCompany('delete')} disabled={!checkedItems.length>0}>
          Delete
        </Button>
      </div>
    </div>
  )
}