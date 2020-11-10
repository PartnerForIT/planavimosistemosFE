import { styles } from "@material-ui/pickers/views/Calendar/Calendar";
import React from "react";
import Dialog from '../index';
import TextField from '@material-ui/core/TextField';
import style from '../Dialog.module.scss';

export default function AddNewOrganization({open, handleClose, title, countries}) {
  return(
    <Dialog handleClose={handleClose} open={open} title={title}>
      <div className={style.addOrg}>
          <div className={style.addOrg__inner}>
          <TextField 
            id="company-name" 
            label="Company Name"
            placeholder="Enter yuor company name"
            variant="outlined" />
          </div>
          <div className={style.addOrg__inner}>
          <TextField 
            id="company-person" 
            label="Contact persons"
            placeholder="Contact persons name"
            variant="outlined" />

            <TextField 
              id="compane-person-email" 
              label="Contact persons email"
              placeholder="Contact persons email"
              variant="outlined" />
          </div>
      </div>
    </Dialog> 
  )
}

