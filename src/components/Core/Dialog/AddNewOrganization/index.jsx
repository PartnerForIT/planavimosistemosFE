import React from "react";
import Dialog from '../index';


export default function AddNewOrganization({open, handleClose, title}) {
  return(
    <Dialog handleClose={handleClose} open={open} title={title}>
      <div>
          Add Org Dialog
      </div>
    </Dialog> 
  )
}

