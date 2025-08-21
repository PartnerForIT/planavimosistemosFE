import React from 'react'
import { useTranslation } from 'react-i18next'

import styles from './styles.module.scss'

const MyTimeOffSection = () => {
  const { t } = useTranslation()
  return (
    <div className={styles.container}>
      <div className={styles.section}>
        <div className={styles.sectionTitle}>{t('Upcoming requests')}</div>
        <div>
        </div>
      </div>
      <div className={styles.section}>
        <div className={styles.sectionTitle}>{t('Policies')}</div>

      </div>
    </div>
  )
}

export default MyTimeOffSection
