import React from 'react'
import cn from 'classnames'
import { useTranslation } from 'react-i18next'

import styles from './styles.module.scss'

const AvailabilityCard = ({event, isActive, onPress}) => {
  const { t } = useTranslation()
  const props = event.extendedProps || {}
  const tooltipContent = isActive ? `<b>${t('Click to exit the expanded day overview mode')}</b>` : `<b>${t('Click to expand the day overview')}</b>`
  const isDisabled = props.metadata.unavailableEmployees === 0
  return (
    <div
      data-tooltip-id="availability_description"
      data-tooltip-html={tooltipContent}
      className={cn(styles.container, {[styles.active]: isActive, [styles.disabled]: isDisabled})} onClick={isDisabled ? null : () => onPress(isActive ? null : event.id)}>
      <div className={styles.employeesCount}>{props.metadata.unavailableEmployees}</div>
      <div className={styles.progressBar}>
        <div className={styles.progress} style={{width: `${props.metadata.percentage}%`}}></div>
      </div>
    </div>
  )
}

export default AvailabilityCard
