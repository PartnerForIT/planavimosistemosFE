import React, { useState, useRef } from 'react'
import cn from 'classnames'
import { useTranslation } from 'react-i18next'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import Popper from '@material-ui/core/Popper'

import styles from './styles.module.scss'

const Select = ({options, value, placeholder, renderOption, renderSelected, injectedElements, onSelect}) => {
  const { t } = useTranslation()

  const [open, setOpen] = useState(false)
  const anchorRef = useRef(null)

  const selected = options.flatMap(s => s.data).find(option => option.id === value)

  const handleSelect = (item) => () => {
    onSelect(item)
    setOpen(false)
  }

  return (
    <ClickAwayListener onClickAway={() => setOpen(false)}>
      <div className={styles.container}>
        <div className={styles.selected} ref={anchorRef} onClick={() => setOpen(!open)}>
          {
            value
              ? renderSelected ? renderSelected(selected) : selected.name
              : placeholder || t('Select an option')
          }
        </div>
        <Popper open={open} anchorEl={anchorRef.current} placement='bottom-start' style={{ zIndex: 999 }}>
          <div className={styles.sections}>
            {
              options.map((section, i) => {
                return (
                  <div className={styles.section} key={section.id || i}>
                    <div className={styles.sectionTitle}>{section.name}</div>
                    <div className={styles.items}>
                      {
                        section.data.map((item, j) => {
                          return (
                            <div
                              key={item.id || j}
                              className={cn(styles.item, { [styles.selected]: item.id === value })}
                              onClick={handleSelect(item)}>
                              {
                                renderOption ? renderOption(item) : item.name
                              }
                            </div>
                          )
                        })
                      }
                    </div>
                  </div>
                )
              })
            }
          </div>
          {
            injectedElements
              ? injectedElements()
              : null
          }
        </Popper>
      </div>
    </ClickAwayListener>
  )
}

export default Select
