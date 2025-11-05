import React, { useState } from 'react'
import cn from 'classnames'
import { useSelector } from 'react-redux'

import styles from './DemandToolCell.module.scss'

const DemandToolCell = ({ event, resourceId, onSelect }) => {
  const id = `${resourceId}_${event.dateString}`
  const activeDemandId = useSelector(state => state.schedule.activeDemandId)
  const isActive = activeDemandId === id

  const demandShiftsCount = Object.values(event.jobTypes || {}).reduce((acc, shifts) => acc + Object.keys(shifts).length, 0)
  const totalShifts = event.shiftEvents.length
  const percentage = Math.min(totalShifts ? totalShifts * 100 / demandShiftsCount : 0, 100)

  return (
    <div className={cn(styles.container, {[styles.active]: isActive})} onClick={onSelect ? () => onSelect(id, event) : null}>
      <div className={styles.count}>{demandShiftsCount}</div>
      <div className={styles.progressBar}>
        <div className={styles.progress} style={{width: `${percentage}%`}}></div>
      </div>
    </div>
  )
}

export default DemandToolCell
