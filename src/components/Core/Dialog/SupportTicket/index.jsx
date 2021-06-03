import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Dialog from '../index';
import styles from './SupportTicket.module.scss';
import Button from '../../Button/Button';
import CheckMark from '../../../Icons/CheckMark';

export default ({
  handleClose,
  onExited,
  open,
  onSubmit,
  loading,
  isCreateTicket,
}) => {
  const { t } = useTranslation();
  const [value, setValue] = useState('');

  const handleChange = (e) => {
    setValue(e.target.value);
  };
  const handleSubmit = () => {
    onSubmit(value);
  };

  return (
    <Dialog
      handleClose={handleClose}
      onExited={onExited}
      open={open}
      title={isCreateTicket ? t('Your ticket has been received') : t('Need assistance?')}
    >
      {
        isCreateTicket ? (
          <>
            <div className={styles.description}>
              {/* eslint-disable-next-line max-len */}
              {t('Your ticket has been sent to Grownu support team, we will answer your support request as soon as possible')}
            </div>
            <Button
              onClick={handleClose}
              size='big'
              className={styles.buttonDone}
              loading={loading}
              green
            >
              <CheckMark className={styles.buttonDoneIcon} />
            </Button>
          </>
        ) : (
          <>
            <div className={styles.description}>
              {t('It can take up to 24 hours to resolve your ticket')}
            </div>
            <label htmlFor='text' className={styles.form}>
              {` ${t('Please describe your problem')}`}
              <textarea
                name='text'
                value={value}
                className={styles.textarea}
                rows={10}
                onChange={handleChange}
                placeholder={t('Describe your problem as detailed as possible that our support team could help you')}
              />
            </label>
            <Button
              onClick={handleSubmit}
              size='big'
              className={styles.button}
              loading={loading}
            >
              {t('Create a support ticket')}
            </Button>
          </>
        )
      }
    </Dialog>
  );
};
