import React from 'react';
import { useTranslation } from 'react-i18next';
import Label from '../../../Core/InputLabel';
import Tooltip from '../../../Core/Tooltip';
import Button from '../../../Core/Button/Button';
import Input from '../../../Core/Input/Input';
import langArray from '../../../Helpers/lang';
import formatArr from '../../../Helpers/dateFormat';
import SimpleSelect from '../../../Core/SimpleSelect';

export default function CompaneForm({
  styles, handleOpen, handleInputChange, handleCompanyChange,
  inputValues, countries = [], currencies = [],
  file, company, timeZones = [], readOnly,
}) {
  const { t } = useTranslation();

  return (
    <div className={styles.company}>
      <div className={styles.companyLogo}>
        <img src={file || company.logo} alt='' />
      </div>
      {
        !readOnly && (
          <>
            <div className={styles.labelBlock}>
              <Label text={t('Company logo')} htmlFor='logo' />
              <Tooltip title='Add Company Logo' />
            </div>
            <Button inverse onClick={() => handleOpen()}>
              {t('Upload Logo')}
            </Button>
          </>
        )
      }
      <div className={styles.formControl}>
        <Label text={t('Company name')} htmlFor='name' />
        <Input
          placeholder={`${t('Enter your company name')}...`}
          value={inputValues.name}
          name='name'
          fullWidth
          onChange={handleInputChange}
          readOnly={readOnly}
        />
      </div>
      <div className={styles.formLine} />
      <div className={styles.formControl}>
        <div className={styles.labelBlock}>
          <Label text={t('Contact persons')} htmlFor='contact_person_name' />
          <Tooltip title='Contact persons' />
        </div>
        <Input
          placeholder={`${t('Enter your company name')}...`}
          value={inputValues.contact_person_name}
          name='contact_person_name'
          fullWidth
          onChange={handleInputChange}
          readOnly={readOnly}
        />
      </div>
      <div className={styles.formControl}>
        <div className={styles.labelBlock}>
          <Label text={t('Contact persons email')} htmlFor='contact_person_email' />
        </div>
        <Input
          placeholder={`${t('Contact persons email')}...`}
          value={inputValues.contact_person_email}
          name='contact_person_email'
          fullWidth
          onChange={handleInputChange}
          readOnly={readOnly}
        />
      </div>
      <div className={styles.formLine} />
      <div className={styles.formControl}>
        <div className={styles.labelBlock}>
          <Label text={t('Country')} htmlFor='country' />
        </div>
        <SimpleSelect
          handleInputChange={handleCompanyChange}
          name='country'
          fullWidth
          value={inputValues.country}
          options={countries}
          readOnly={readOnly}
        />
      </div>
      <div className={styles.formControl}>
        <div className={styles.labelBlock}>
          <Label text={t('Language')} htmlFor='language' />
          <Tooltip title={t('Language')} />
        </div>
        <SimpleSelect
          handleInputChange={handleInputChange}
          name='lang'
          fullWidth
          value={inputValues.lang}
          options={langArray}
          readOnly
        />
      </div>
      <div className={styles.formControl}>
        <div className={styles.labelBlock}>
          <Label text={t('Timezone')} htmlFor='timezone' />
          <Tooltip title={t('Indicate in what time zone you work')} />
        </div>
        <SimpleSelect
          handleInputChange={handleInputChange}
          name='timezone'
          fullWidth
          value={inputValues.timezone}
          options={timeZones}
          readOnly={readOnly}
          placeholder='Select timezone'
        />
      </div>
      <div className={styles.formControl}>
        <div className={styles.labelBlock}>
          <Label text={t('Date format')} htmlFor='date_format' />
          <Tooltip title={t('Date format')} />
        </div>
        <SimpleSelect
          handleInputChange={handleInputChange}
          name='date_format'
          fullWidth
          value={inputValues.date_format}
          options={formatArr}
          readOnly={readOnly}
        />
      </div>
      <div className={styles.formControl}>
        <div className={styles.labelBlock}>
          <Label text={t('Currency')} htmlFor='currency' />
          <Tooltip title={t('Date format')} />
        </div>
        <SimpleSelect
          handleInputChange={handleInputChange}
          name='currency'
          fullWidth
          value={inputValues.currency}
          options={currencies}
          readOnly={readOnly}
        />
      </div>
    </div>
  );
}