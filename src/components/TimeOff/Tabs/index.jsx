import React from 'react'
import cn from 'classnames'

import styles from './styles.module.scss'

const Tabs = ({options, selected, onChange}) => {
  const activeIndex = options.findIndex(option => option.key === selected)
  return (
    <div className={styles.container}>
      <div className={styles.badge} style={{transform: `translateX(${activeIndex * 100}%)`}}>
        <div className={styles.inner} />
      </div>
      {
        options.map(option => {
          const isSelected = option.key === selected
          return (
            <div
              key={option.key}
              className={cn(styles.option, {[styles.active]: isSelected})}
              onClick={() => onChange(option.key)}>
              {option.title}
            </div>
          )
        })
      }
    </div>
  )
}

export default Tabs
