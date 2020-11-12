import React from 'react';
import NativeSelect from '@material-ui/core/NativeSelect';
import Button from '../Core/Button/Button';
import InputBase from '@material-ui/core/InputBase';
import FormControl from '@material-ui/core/FormControl';
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
    margin: '5px 10px 10px 0',
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

export default function Filter({organizations, handleChangeOrganizations}) {
  const classes = useStyles();
  return(
    <div className={styles.filterBlock}>
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
    </div>
  )
}