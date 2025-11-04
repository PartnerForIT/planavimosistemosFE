import React, { forwardRef, useImperativeHandle, useState } from 'react'
import cn from 'classnames'
import moment from 'moment'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import styles from './DemandToolSidebar.module.scss'

import useCompanyInfo from '../../hooks/useCompanyInfo'

const DemandToolSidebar = forwardRef(({active}, ref) => {
  const { t } = useTranslation()
  const activeDemandId = useSelector(state => state.schedule.activeDemandId)

  const { getDateFormat } = useCompanyInfo()
  const dateFormat = getDateFormat({
    'YY.MM.DD': 'YYYY-MM-DD',
    'DD.MM.YY': 'DD-MM-YYYY',
    'MM.DD.YY': 'MM-DD-YYYY',
  })

  const [data, setData] = useState(null)

  const locale = localStorage.getItem('i18nextLng') || 'en'

  useImperativeHandle(ref, () => ({
    open: (data) => {
      console.log('open demand tool sidebar', data)
      setData(data)
    },
    close: () => {
      console.log('close demand tool sidebar')
      // setIsOpen(false)
    }
  }))

  return (
    <div className={cn(styles.container, {[styles.active]: Boolean(activeDemandId)})}>
      {
        data
          ? <div className={styles.content}>
              <div className={styles.editButton}>{t('Edit')}</div>
              <div className={styles.title}>{moment(data.dateString, 'DD-MM-YYYY').format(dateFormat)}</div>
              <div className={styles.title}>{moment(data.dateString, 'DD-MM-YYYY').locale(locale).format('dddd')}</div>
              <div className={styles.demandShiftsCount}>
                <div>{Object.values(data.demandData).reduce((acc, shifts) => acc + shifts.length, 0)}</div>
              </div>
            </div>
          : null
      }
    </div>
  )
})

export default DemandToolSidebar
