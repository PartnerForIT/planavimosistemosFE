import React, { useState, useRef } from 'react'
import cn from 'classnames'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import Popper from '@material-ui/core/Popper'
import Scrollbar from 'react-scrollbars-custom'
import { useTranslation } from 'react-i18next'

import styles from './styles.module.scss'

import Input from '../Input/Input'
import SearchIcon from '../../Icons/SearchIcon'
import Dropdown from '../Dropdown/CustomDropdown'
import StyledCheckbox from '../Checkbox/Checkbox'

const isChecked = (items) => {
  return items.every(item => {
    if (Array.isArray(item.children)) {
      return isChecked(item.children)
    }
    return Boolean(item.checked)
  })
}

const setCheckedToAll = (array = [], isChecked) => {
  const arrayCopy = array.length ? [...array] : []
  return arrayCopy.map((item) => {
    return {
      ...item,
      checked: isChecked,
      children: Array.isArray(item.children) ? setCheckedToAll(item.children, isChecked) : item.children,
    }
  })
}

const countCheckedEmployees = (items) => {
  let count = 0
  for (const item of items) {
    if ("isEmployee" in item && item.isEmployee) {
      if (item.checked) count++
    } else if ("children" in item) {
      count += countCheckedEmployees(item.children)
    }
  }
  return count
}

const countAllEmployees = (items) => {
  let count = 0

  for (const item of items) {
    if ("isEmployee" in item && item.isEmployee) {
      count++
    } else if ("children" in item) {
      count += countAllEmployees(item.children)
    }
  }
  return count;
}

const setChecked = (items, id, checked) => {
  return items.map(item => {
    if ("isEmployee" in item && item.isEmployee) {
      if (item.id === id) {
        return { ...item, checked };
      }
      return item;
    }

    if ("isGroup" in item && item.isGroup) {
      if (item.id === id) {
        return {
          ...item,
          children: updateAllEmployees(item.children, checked)
        };
      }
      return { ...item, children: setChecked(item.children, id, checked) };
    }

    if ("isSubGroup" in item && item.isSubGroup) {
      if (item.id === id) {
        return {
          ...item,
          children: updateAllEmployees(item.children, checked)
        }
      }
      return { ...item, children: setChecked(item.children, id, checked) };
    }

    return item
  })
}

const updateAllEmployees = (items, checked) => {
  return items.map(item => {
    if ("isEmployee" in item && item.isEmployee) {
      return { ...item, checked }
    }
    if ("children" in item) {
      return { ...item, children: updateAllEmployees(item.children, checked) };
    }
    return item;
  });
}

const filterData = (query, items) => {
  if (!query) return items;

  const searchLower = query.toLowerCase()

  const filterItems = (items) => {
    return items.map(item => {
      if (item.isGroup || item.isSubGroup) {
        const filteredSubItems = filterItems([...item.children])
        if (filteredSubItems.length > 0) {
          return { ...item, children: filteredSubItems }
        }
        return null
      }
      if ((item.label || item.title || item.name).toLowerCase().includes(searchLower)) {
        return item
      }
      return null
    }).filter(item => item !== null)
  }

  return filterItems([...items])
}

const CustomSelect = ({ placeholder, items, type = 'items', onChange }) => {
  const { t } = useTranslation()

  const [search, setSearch] = useState('')
  const [open, setOpen] = useState(false)

  const searchInputRef = useRef(null)
  const anchorRef = useRef(null)

  const handleInputChange = (e) => {
    setSearch(e.target.value)
  }

  const handleSelectAll = () => {
    const res = setCheckedToAll(items, true)
    onChange(res)
  }

  const handleSelectNone = () => {
    const res = setCheckedToAll(items, false)
    onChange(res)
  }

  const handleCheckboxChange = (item, willCheck) => {
    const res = setChecked(items, item.id, willCheck)
    onChange(res)
  }

  const filteredItems = filterData(search, items)
  const countSelected = countCheckedEmployees(items)
  const totalEmployees = countAllEmployees(items)

  return (
    <ClickAwayListener onClickAway={() => setOpen(false)}>
      <div className={styles.container}>
        <div role="input" ref={anchorRef} className={cn(styles.buttonWrapper, { [styles.active]: open })} onClick={() => setOpen(!open)}>
          <input
            type='text'
            value={countSelected ? `${countSelected} ${t(`${type} selected`)}` : ''}
            placeholder={placeholder}
            className={styles.buttonInput}
            readOnly />
        </div>
        <Popper
          open={open}
          anchorEl={anchorRef.current}
          placement="bottom-start"
          style={{ zIndex: 999 }}>
          <div className={styles.contentBox}>
            <Input
              ref={searchInputRef}
              icon={<SearchIcon />}
              placeholder={t('Search')}
              value={search}
              onChange={handleInputChange}
              fullWidth
            />
            <div className={styles.checkboxGroup} style={{}}>
              <div className={styles.headerRow}>
                <button
                  className={styles.button}
                  onClick={handleSelectAll}
                  disabled={countSelected === totalEmployees}
                >
                  {t('Select All')}
                </button>
                <button
                  className={styles.button}
                  onClick={handleSelectNone}
                  disabled={countSelected === 0}
                >
                  {t('Select None')}
                </button>
              </div>
              <div className={styles.content}>
                <Scrollbar
                  className={cn(styles.scrollableContent, 'styledDropdown')}
                  removeTracksWhenNotUsed
                  noScrollX={true}
                  trackXProps={{
                    renderer: ({ elementRef, ...restProps }) => (
                      <span
                        {...restProps}
                        ref={elementRef}
                        className={styles.scrollbarTrackX}
                      />
                    ),
                  }}
                  trackYProps={{
                    renderer: ({ elementRef, ...restProps }) => (
                      <span
                        {...restProps}
                        ref={elementRef}
                        className={styles.scrollbarTrackY}
                      />
                    ),
                  }}
                >
                  {
                    filteredItems.map((item, i) => {
                      if (!item.id) {
                        console.log(item)
                      }
                      if (item.isGroup || item.isSubGroup) {
                        return (
                          <Dropdown
                            key={item.id}
                            label={item.title}
                            currentItem={item}
                            checked={isChecked(item.children)}
                            items={item.children}
                            onChange={handleCheckboxChange}
                          />
                        )
                      }
                      return (
                        <StyledCheckbox
                          key={item.id}
                          label={item.title}
                          item={item}
                          id={item.id}
                          checked={item.checked}
                          disabled={item.disabled}
                          onChange={handleCheckboxChange}
                        />
                      )
                    })
                  }
                </Scrollbar>
              </div>
            </div>
          </div>
        </Popper>
      </div>
    </ClickAwayListener>
  )
}

export default CustomSelect
