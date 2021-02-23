import React from 'react';

import Dialog from '../index';
import Button from '../../Button/Button';
import styles from './styles.module.scss';

export default ({
  open,
  handleClose,
  onDelete,
  title,
  description,
}) => (
  <Dialog
    handleClose={handleClose}
    open={open}
    title={title}
    maxWidth='sm'
  >
    <div className={styles.description}>
      {description}
    </div>
    <div className={styles.buttons}>
      <Button inverse onClick={handleClose}>
        Cancel
      </Button>
      <Button danger onClick={onDelete}>
        Delete
      </Button>
    </div>
  </Dialog>
);
