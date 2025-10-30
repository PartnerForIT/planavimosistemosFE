import React from 'react'
import cn from 'classnames'

import styles from './styles.module.scss'

const Checkbox = ({checked, onChange}) => {
  return (
    <div className={cn(styles.container, {[styles.checked]: checked})} onClick={() => onChange(!checked)}>
      <div className={styles.badge} />
    </div>
  )
}

export default Checkbox
