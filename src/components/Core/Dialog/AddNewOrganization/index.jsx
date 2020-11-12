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

export default function AddNewOrganization({
  open, handleClose, countries,  title ,inputValues, handleInputChange, saveOrg
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
              <BootstrapInput 
                name="name" 
                onChange={handleInputChange} 
                value={inputValues.name}
                placeholder="Enter yuor company name" 
                id="name" />
            </FormControl>
            <FormControl className={classes.margin}>
              <InputLabel shrink htmlFor="external-id" className={classes.label}>
                External ID
              </InputLabel>
              <BootstrapInput
                name="admin_id"
                onChange={handleInputChange} 
                value={inputValues.admin_id}
                placeholder="Company external id"
                id="external-id" />
            </FormControl>
            <FormControl className={classes.margin}>
              <InputLabel shrink htmlFor="country-select" className={classes.label}>
                Country
              </InputLabel>
              <NativeSelect
                id="country-select"
                value={inputValues.country}
                onChange={handleInputChange}
                inputProps={{
                  name: 'country',
                }}
                input={<BootstrapInput name="country" />}
              >
                {_.map(countries, (item) => (
                  <option key={item.code} value={item.code}>{item.name}</option>
                ))}
              </NativeSelect>
            </FormControl>
            <FormControl className={classes.margin}>
              <InputLabel shrink htmlFor="country-select" className={classes.label}>
                Language
              </InputLabel>
              <NativeSelect
                id="country-select"
                value={inputValues.lang}
                placeholder="Select your Language"
                onChange={handleInputChange}
                inputProps={{
                  name: 'lang',
                }}
                input={<BootstrapInput />}
              >
                <option value={'EN'}>English</option>
                <option value={'RU'}>Russian</option>
              </NativeSelect>
            </FormControl>
          </div>
          <div className={style.addOrg__inner}>
            <div>
              <FormControl className={classes.margin} >
                <InputLabel shrink htmlFor="person" className={classes.label}>
                  Contact persons
                </InputLabel>
                <BootstrapInput 
                  placeholder="Contact persons name" 
                  id="person"
                  name="contact_person_name"
                  value={inputValues.contact_person_name}
                  onChange={handleInputChange}
                />
              </FormControl>

              <FormControl className={classes.margin}>
                <InputLabel shrink htmlFor="email" className={classes.label}>
                  Contact persons email
                </InputLabel>
                <BootstrapInput 
                  placeholder="Contact persons email" 
                  id="email"
                  name="contact_person_email"
                  value={inputValues.contact_person_email}
                  onChange={handleInputChange}
                />
              </FormControl>
            </div>
            <div className={style.buttonBlock}>
              <Button cancel size="big" onClick={handleClose}>Cancel</Button>
              <Button 
                size="big" 
                onClick={()=> saveOrg()}
                disabled={!inputValues.admin_id || !inputValues.name}
              >
                Save and Invite
              </Button>
            </div>
          </div>
      </div>
    </Dialog> 
  )
}
