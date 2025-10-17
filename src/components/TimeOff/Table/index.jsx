import React, { useState } from 'react'
import cn from 'classnames'
import { Tooltip } from 'react-tooltip'

import styles from './styles.module.scss'

import TriangleIcon from '../../Icons/TriangleIcon'
import CogwheelIcon from '../../Icons/CogwheelIcon'
import StyledCheckbox from '../../Core/Checkbox/Checkbox'

const Table = ({data, columns: initialColumns, renderCell, renderCellHeader}) => {
  const [expandedSections, setExpandedSections] = useState([])
  const [columns, setColumns] = useState(initialColumns.map(col => ({...col, checked: true})))

  const handleExpand = (section, isExpanded) => {
    if (isExpanded) {
      setExpandedSections(expandedSections.filter(s => s !== section))
      return
    }
    setExpandedSections([...expandedSections, section])
  }

  const handleToggleCheckbox = (col) => (e) => {
    setColumns(prev => prev.map(c => c.accessor === col.accessor ? {...c, checked: !c.checked} : c))
  }

  const generateGrid = () => {
    return columns.filter(c => c.checked).map((col) => col.width ? `${col.width}px` : 'minmax(150px, 1fr)').join(' ')
  }

  return (
    <div className={styles.tableContainer}>
      <div className={styles.table}>
        <div className={styles.content}>
          <div className={cn(styles.header, styles.row)} style={{gridTemplateColumns: generateGrid()}}>
            {
              columns.filter(c => c.checked).map(col => {
                return (
                  <div key={col.accessor} className={cn(styles.cell, col.className)}>
                    { renderCellHeader(col) }
                  </div>
                )
              })
            }
          </div>
          <div className={styles.body}>
            {
              data.map(([section, requests]) => {
                const isExpanded = expandedSections.includes(section)
                const isPendingSection = section === 'Pending'
                return (
                  <div key={section} className={cn(styles.section, { [styles.active]: isExpanded })}>
                    <div className={cn(styles.sectionHeader, { [styles.pending]: isPendingSection })} onClick={() => handleExpand(section, isExpanded)}>
                      <TriangleIcon className={cn(styles.icon)} />
                      {section} ({requests.length})
                    </div>
                    {
                      isExpanded && requests.map((row, i) => {
                        return (
                          <div key={i} className={cn(styles.row)} style={{gridTemplateColumns: generateGrid()}}>
                            {
                              columns.filter(c => c.checked).map((col, idx) => {
                                let value = row
                                col.accessor.split('.').forEach(key => {
                                  value = value ? value[key] : null
                                })
                                return (
                                  <div key={idx} className={cn(styles.cell, col.className)}>
                                    { renderCell ? renderCell(value, row, col) : value }
                                  </div>
                                ) 
                              })
                            }
                          </div>
                        ) 
                      })
                    }
                  </div>
                )
              })
            }
          </div>
        </div>
      </div>
      <div className={styles.toolbar}>
        <div className={styles.settingsButton} data-tooltip-id="table_tootip">
          <CogwheelIcon />
        </div>
      </div>
      <Tooltip
        id="table_tootip"
        openOnClick={true}
        border="1px solid #0085ff"
        className={styles.tooltip}>
        <div className={styles.tooltipContent}>
          {
            columns.filter(c => c.label).map((col, idx) => {
              return (
                <div key={idx} className={styles.tooltipRow}>
                  <StyledCheckbox
                    checked={col.checked}
                    onChange={handleToggleCheckbox(col)}/>
                  <div className={styles.label}>{col.label}</div>
                </div> 
              )
            })
          }
        </div>
      </Tooltip>
    </div>
  )
}

export default Table
