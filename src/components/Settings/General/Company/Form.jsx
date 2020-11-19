import React from 'react';
import { useTranslation } from 'react-i18next';
import Label from '../../../Core/InputLabel';
import Tooltip from '../../../Core/Tooltip';
import Button from '../../../Core/Button/Button';
import Input from '../../../Core/Input/Input';


export default function CompaneForm({ styles, handleOpen, handleInputChange, inputValues }) {
  const { t } = useTranslation();

  return (
    <div className={styles.company}>
      <div className={styles.labelBlock}>
        <Label text={t('Company logo')} htmlFor={"logo"} />
        <Tooltip title={'Add Company Logo'} />
      </div>
      <Button inverse onClick={() => handleOpen()}>{t('Upload Logo')}</Button>
      <div className={styles.formControl}>
        <Label text={t('Company name')} htmlFor={"name"} />
        <Input
          placeholder={`${t('Enter your company name')}...`}
          value={inputValues.name}
          name="name"
          fullWidth
          onChange={handleInputChange}
        />
      </div>
      <div className={styles.formLine}></div>
      <div className={styles.formControl}>
        <div className={styles.labelBlock}>
          <Label text={t('Contact persons')} htmlFor={"contact_person_name"} />
          <Tooltip title={'Contact persons'} />
        </div>
        <Input
          placeholder={`${t('Enter your company name')}...`}
          value={inputValues.contact_person_name}
          name="contact_person_name"
          fullWidth
          onChange={handleInputChange}
        />
      </div>
      <div className={styles.formControl}>
        <div className={styles.labelBlock}>
          <Label text={t('Contact persons email')} htmlFor={"contact_person_email"} />
        </div>
        <Input
          placeholder={`${t('Contact persons email')}...`}
          value={inputValues.contact_person_email}
          name="contact_person_email"
          fullWidth
          onChange={handleInputChange}
        />
      </div>
    </div>
  )
}