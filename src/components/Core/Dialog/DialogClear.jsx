import React from 'react';
import Dialog from '@material-ui/core/Dialog';

export default ({
  children, open, handleClose,
  maxWidth = 'md', ...props
}) => (
  <Dialog onClose={handleClose} maxWidth={maxWidth} open={open} {...props}>
    {children}
  </Dialog>
);
