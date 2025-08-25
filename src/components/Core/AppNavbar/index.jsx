import React, { useRef, useEffect, useState } from 'react'
import cn from 'classnames'

import styles from './styles.module.scss'

const AppNavbar = ({options, selected, onSelect}) => {
  const activeIndex = options.findIndex(el => el.key === selected)

  const optionRefs = useRef([])

  const [tabConfig, setTabConfig] = useState({width: 0, left: 0})

  useEffect(() => {
    const elementsDimensions = optionRefs.current.map(el => el.offsetWidth)
    const left = elementsDimensions.slice(0, activeIndex).reduce((acc, width) => acc + width, 0)
    setTabConfig({left: left, width: elementsDimensions[activeIndex]})
  }, [activeIndex])

  return (
    <div className={styles.container}>
      {
        options.map((option, i) => {
          const isActive = option.key === selected
          return (
            <div key={option.key} ref={ref => optionRefs.current[i] = ref} className={cn(styles.option, {[styles.active]: isActive})} onClick={() => onSelect(option.key)}>
              <div className={styles.title}>{ option.title }</div>
              {
                option.badge
                  ? <div className={styles.badge}>
                      <div className={styles.badgeTitle}>{option.badge}</div>
                    </div>
                  : null
              }
            </div>
          )
        })
      }
      <div className={styles.tab} style={{width: tabConfig.width, transform: `translateX(${tabConfig.left}px)`}}>
      </div>
    </div>
  )
}

export default AppNavbar
