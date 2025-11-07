import React, { forwardRef, useImperativeHandle, useState, useEffect } from 'react'
import cn from 'classnames'
import moment from 'moment'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import { useDispatch } from 'react-redux'

import { jobTypesSelector } from '../../store/jobTypes/selectors'
import { getCompanySkills } from '../../api'

import styles from './DemandToolSidebar.module.scss'

import useCompanyInfo from '../../hooks/useCompanyInfo'
import { DemanToolForm } from '../Schedule/Shift/DemandToolForm'
import DemandToolView from './DemandToolView'

const DemandToolSidebar = forwardRef(({onClose}, ref) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { id: companyId } = useParams()
  const activeDemandId = useSelector(state => state.schedule.activeDemandId)
  const allJobTypes = useSelector(jobTypesSelector)
  

  const { getDateFormat } = useCompanyInfo()
  const dateFormat = getDateFormat({
    'YY.MM.DD': 'YYYY-MM-DD',
    'DD.MM.YY': 'DD-MM-YYYY',
    'MM.DD.YY': 'MM-DD-YYYY',
  })

  const [data, setData] = useState(null)
  const [skills, setSkills] = useState([])
  const [mode, setMode] = useState('view')

  const locale = localStorage.getItem('i18nextLng') || 'en'

  useEffect(() => {
    getCompanySkills(companyId).then(res => {
      if (Array.isArray(res?.skills)) {
        setSkills(res.skills)
      }
    })
  }, [companyId])

  useImperativeHandle(ref, () => ({
    open: (data) => {
      setData({
        ...data,
        defaultTimes: {
          start: moment(data.defaultTimes.start, 'HH:mm:ss').format('HH:mm'),
          end: moment(data.defaultTimes.end, 'HH:mm:ss').format('HH:mm'),
        }
      })
    },
    close: () => {
      console.log('close demand tool sidebar')
      // setIsOpen(false)
    }
  }))

  const handleChange = (weekIndex, data) => {
    setData(prev => ({...prev, jobTypes: data.jobTypes}))
  }

  const toggleMode = () => {
    setMode(prev => prev === 'view' ? 'edit' : 'view')
  }

  const handleClose = () => {
    setMode('view')
    dispatch({type: 'SET_ACTIVE_DEMAND_ID', id: activeDemandId})
  }

  return (
    
      <div className={cn(styles.container, {[styles.active]: Boolean(activeDemandId)})}>
        {
          activeDemandId
            ? <ClickAwayListener onClickAway={handleClose}>
                {
                  data
                    ? <div className={styles.content}>
                        <div className={styles.editButton} onClick={toggleMode}>{mode === 'view' ? t('Edit') : t('Save & Close')}</div>
                        <div className={styles.title}>{moment(data.dateString, 'DD-MM-YYYY').format(dateFormat)}</div>
                        <div className={styles.title}>{moment(data.dateString, 'DD-MM-YYYY').locale(locale).format('dddd')}</div>
                        <div className={styles.demandShiftsCount}>
                          <div>{Object.values(data.jobTypes).reduce((acc, shifts) => acc + Object.keys(shifts).length, 0)}</div>
                        </div>
                        {
                          mode === 'view'
                            ? <DemandToolView
                                skills={skills}
                                jobTypes={allJobTypes}
                                data={data} />
                            : <DemanToolForm
                                skills={skills}
                                jobTypes={allJobTypes}
                                data={{...data, weekIndex: data.weekNumber - 1}}
                                onChange={handleChange} />
                        }
                      </div>
                    : null
                }
              </ClickAwayListener>
            : null
        }
      </div>
  )
})

export default DemandToolSidebar
