import React from "react";
import * as _ from "lodash";
import Dialog from '../index';
import {
  withStyles,
  makeStyles,
} from '@material-ui/core/styles';
import InputBase from '@material-ui/core/InputBase';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import NativeSelect from '@material-ui/core/NativeSelect';
import Button from '../../Button/Button';

import style from '../Dialog.module.scss';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  margin: {
    margin: theme.spacing(1),
    width: '100%',
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
    border: '1px solid #ced4da',
    fontSize: 14,
    lineHeight: '16px',
    padding: '11px',
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    '&:focus': {
      boxShadow: 'none',
      borderRadius: 4,
      borderColor: '#4d7499',
    },
  },
}))(InputBase); 

export default function AddNewOrganization({
  open, handleClose, title, countries, country, language, setCountry, setLanguage, setCompanyName, setId, setName, setEmail,
}) {
  const classes = useStyles();

  return(
    <Dialog handleClose={handleClose} open={open} title={title}>
      <div className={style.addOrg}>
          <div className={style.addOrg__inner}>
            <FormControl className={classes.margin}>
              <InputLabel shrink htmlFor="name" className={classes.label}>
                Company Name
              </InputLabel>
              <BootstrapInput placeholder="Enter yuor company name" id="name" />
            </FormControl>
            <FormControl className={classes.margin}>
              <InputLabel shrink htmlFor="external-id" className={classes.label}>
                External ID
              </InputLabel>
              <BootstrapInput placeholder="Company external id" id="external-id" />
            </FormControl>
            <FormControl className={classes.margin}>
              <InputLabel shrink htmlFor="country-select" className={classes.label}>
                Country
              </InputLabel>
              <NativeSelect
                id="country-select"
                value={country}
                defaultValue={country}
                onChange={setCountry}
                input={<BootstrapInput />}
              >
                {_.map(countries, (country) => (
                  <option key={country.code} value={country.code}>{country.name}</option>
                ))}
              </NativeSelect>
            </FormControl>
            <FormControl className={classes.margin}>
              <InputLabel shrink htmlFor="country-select" className={classes.label}>
                Language
              </InputLabel>
              <NativeSelect
                id="country-select"
                value={language}
                defaultValue={language}
                placeholder="Select your Language"
                onChange={setLanguage}
                input={<BootstrapInput />}
              >
                <option value={'En'}>English</option>
                <option value={'Ru'}>Russian</option>
              </NativeSelect>
            </FormControl>
          </div>
          <div className={style.addOrg__inner}>
            <div>
              <FormControl className={classes.margin} >
                <InputLabel shrink htmlFor="person" className={classes.label}>
                  Contact persons
                </InputLabel>
                <BootstrapInput placeholder="Contact persons name" id="person" />
              </FormControl>

              <FormControl className={classes.margin}>
                <InputLabel shrink htmlFor="email" className={classes.label}>
                  Contact persons email
                </InputLabel>
                <BootstrapInput placeholder="Contact persons email" id="email" />
              </FormControl>
            </div>
            <div className={style.buttonBlock}>
              <Button cancel size="big" onClick={()=> {}}>Cancel</Button>
              <Button size="big" onClick={()=> {}}>Save and Invite</Button>
            </div>
          </div>
      </div>
    </Dialog> 
  )
}
