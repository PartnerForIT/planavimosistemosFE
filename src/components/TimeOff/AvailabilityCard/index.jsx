import React from 'react'
import cn from 'classnames'

import styles from './styles.module.scss'

const AvailabilityCard = ({event, isActive, onPress}) => {
  const props = event.extendedProps || {}
  return (
    <div className={cn(styles.container, {[styles.active]: isActive})} onClick={() => onPress(isActive ? null : event.id)}>
      <div className={styles.employeesCount}>{props.metadata.unavailableEmployees}</div>
      <div className={styles.progressBar}>
        <div className={styles.progress} style={{width: `${props.metadata.percentage}%`}}></div>
      </div>
    </div>
  )
}

export default AvailabilityCard
