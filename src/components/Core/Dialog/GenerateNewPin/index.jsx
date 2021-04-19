import React from 'react';
import { useTranslation } from 'react-i18next';

import Dialog from '../index';
import Button from '../../Button/Button';
import styles from './GenerateNewPin.module.scss';

export default ({
  handleClose,
  open,
  onGenerateNewPins,
  count,
}) => {
  const { t } = useTranslation();

  return (
    <Dialog handleClose={handleClose} open={open} title={t('Generate new PIN?')}>
      <div className={styles.description}>
        {t('This will generate and send e-mails with new PIN codes for the selected users')}
      </div>
      <div className={styles.userSelected}>
        {`${t('User selected')} ${count}`}
      </div>
      <Button
        onClick={onGenerateNewPins}
        fillWidth
        size='big'
      >
        {t('Generate PIN and send email')}
      </Button>
    </Dialog>
  );
};
