import React, {useState} from "react";
import Dialog from '@material-ui/core/Dialog';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import styles from './Dialog.module.scss';

export default function AddNewOrganization({children, title, open, handleClose}) {
  const [maxWidth, setMaxWidth] = useState('md');
  return(
    <Dialog onClose={handleClose} maxWidth={maxWidth} open={open}>
      <div className={styles.dialogBlock}>
        <h4 className={styles.dialogTitle}>{title}</h4>
          <IconButton aria-label="close" className={styles.closeButton} onClick={handleClose}>
            <CloseIcon />
          </IconButton>
          {children}
      </div>
    </Dialog> 
  )
}
