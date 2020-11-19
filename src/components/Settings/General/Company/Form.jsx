import React from 'react';
import { useTranslation } from 'react-i18next';
import Label from '../../../Core/InputLabel';
import Tooltip from '../../../Core/Tooltip';
import Button from '../../../Core/Button/Button';


export default function CompaneForm({ styles, handleOpen }) {
  const { t } = useTranslation();

  return (
    <div className={styles.company}>
      <div className={styles.labelBlock}>
        <Label text={t('Company logo')} htmlFor={"name"} />
        <Tooltip title={'Add Company Logo'} />
      </div>

      <Button inverse onClick={() => handleOpen()}>{t('Upload Logo')}</Button>
    </div>
  )
}