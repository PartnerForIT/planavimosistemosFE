import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import styles from './Dialog.module.scss';

export default ({
  children, title, open, handleClose,
  onExited,
  maxWidth = 'md', ...props
}) => (
  <Dialog onClose={handleClose} maxWidth={maxWidth} open={open} {...props}>
    <div className={styles.dialogBlock}>
      <h4 className={styles.dialogTitle}>{title}</h4>
      <IconButton aria-label='close' className={styles.closeButton} onClick={handleClose}>
        <CloseIcon />
      </IconButton>
      {children}
    </div>
  </Dialog>
);
