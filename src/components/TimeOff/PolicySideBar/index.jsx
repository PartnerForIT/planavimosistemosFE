import React, { useState, forwardRef, useImperativeHandle } from 'react'
import cn from 'classnames'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Sector } from 'recharts'
import { fade } from '@material-ui/core/styles/colorManipulator'
import { useTranslation } from 'react-i18next'

import styles from './styles.module.scss'

import TimeOffSymbol1 from '../../Icons/TimeOffSymbol1'
import TimeOffSymbol2 from '../../Icons/TimeOffSymbol2'
import TimeOffSymbol3 from '../../Icons/TimeOffSymbol3'
import TimeOffSymbol4 from '../../Icons/TimeOffSymbol4'
import TimeOffSymbol5 from '../../Icons/TimeOffSymbol5'
import TimeOffSymbol6 from '../../Icons/TimeOffSymbol6'
import TimeOffSymbol7 from '../../Icons/TimeOffSymbol7'
import TimeOffSymbol8 from '../../Icons/TimeOffSymbol8'
import TimeOffSymbol9 from '../../Icons/TimeOffSymbol9'

const AVATARS_COUNT = 3

const ActiveSector = (props) => {
  const { outerRadius, fill } = props
  return (
    <g>
      <Sector {...props} outerRadius={outerRadius + 8} />
      <Sector {...props} innerRadius={outerRadius + 10} outerRadius={outerRadius + 14} fill={fill} opacity={0.25} />
    </g>
  )
}

export const ProfileIcon = ({color = '#292D32', ...props}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={800}
      height={800}
      fill="none"
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill={color}
        d="M12 22.01c5.523 0 10-4.477 10-10s-4.477-10-10-10-10 4.477-10 10 4.477 10 10 10Z"
        opacity={0.4}
      />
      <path
        fill={color}
        d="M12 6.94c-2.07 0-3.75 1.68-3.75 3.75 0 2.03 1.59 3.68 3.7 3.74h.18a3.743 3.743 0 0 0 3.62-3.74c0-2.07-1.68-3.75-3.75-3.75ZM18.78 19.36A9.976 9.976 0 0 1 12 22.01c-2.62 0-5-1.01-6.78-2.65.24-.91.89-1.74 1.84-2.38 2.73-1.82 7.17-1.82 9.88 0 .96.64 1.6 1.47 1.84 2.38Z"
      />
    </svg>
  )
}

const PolicySideBar = forwardRef(({onClose}, ref) => {
  const { t } = useTranslation()

  const [{ data, isOpen, activeIndex }, setState] = useState({
    isOpen: false,
    data: {
      segments: [],
    },
    activeIndex: -1,
  })

  useImperativeHandle(ref, () => ({
    open: (data) => {
      setState({isOpen: true, data: data, activeIndex: -1})
    },
    close: close,
  }))

  const close = () => {
    setState({isOpen: false, data: {segments: []}, activeIndex: -1})
    if (onClose) {
      onClose()
    }
  }

  

  return (
    <div className={cn(styles.container, {[styles.active]: isOpen})}>
      <div>
        <div className={styles.title}>{data.date}</div>
      </div>
      <div style={{height: 300, position: 'relative', width: '100%'}}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data.segments}
              dataKey="value"
              nameKey="name"
              innerRadius={70}
              outerRadius={110}
              paddingAngle={0}
              stroke="#fff"
              strokeWidth={0}
              isAnimationActive
              animationBegin={0}
              animationDuration={800}
              animationEasing="ease-out"
              activeIndex={activeIndex}
              activeShape={(p) => <ActiveSector {...p} />}
              onMouseEnter={(_, idx) => setState(prev => ({...prev, activeIndex: idx}))}
              onMouseLeave={() => setState(prev => ({...prev, activeIndex: -1}))}
            >
              {data.segments.map((entry, index) => (
                <Cell key={`c-${index}`} fill={activeIndex === index ? fade(entry.fill, 0.8) : entry.fill} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className={styles.onLeaveContainer}>
          <div className={styles.onLeave}>{ data.onLeave }</div>
          <div className={styles.description}>{ t('on leave') }</div>
        </div>
      </div>
      <div className={styles.policiesContainer}>
        {
          data.segments.map((entry, index) => {
            const avatarsToRender = entry.seg.employees.slice(0, AVATARS_COUNT)
            return (
              <div key={index} className={styles.card} style={{backgroundColor: fade(entry.fill, 0.1)}}>
                <div className={styles.cardHeader}>
                  {
                    (symbol => {
                      switch(symbol) {
                        case '1': return <TimeOffSymbol1 fill={entry.fill} className={styles.policyIcon} />
                        case '2': return <TimeOffSymbol2 fill={entry.fill} className={styles.policyIcon} />
                        case '3': return <TimeOffSymbol3 fill={entry.fill} className={styles.policyIcon} />
                        case '4': return <TimeOffSymbol4 fill={entry.fill} className={styles.policyIcon} />
                        case '5': return <TimeOffSymbol5 fill={entry.fill} className={styles.policyIcon} />
                        case '6': return <TimeOffSymbol6 fill={entry.fill} className={styles.policyIcon} />
                        case '7': return <TimeOffSymbol7 fill={entry.fill} className={styles.policyIcon} />
                        case '8': return <TimeOffSymbol8 fill={entry.fill} className={styles.policyIcon} />
                        case '9': return <TimeOffSymbol9 fill={entry.fill} className={styles.policyIcon} />
                        default: return <TimeOffSymbol1 fill={entry.fill} className={styles.policyIcon} />
                      }
                    })(entry.symbol)
                  }
                  <div className={styles.title} style={{color: entry.fill}}>{entry.name}</div>
                </div>
                <div className={styles.avatarContainer}>
                  {
                    avatarsToRender.map((emp, i) => {
                      return (
                        <div key={i} className={styles.avatar}>
                          {
                            emp.photo
                              ? <img src={emp.photo} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                              : <ProfileIcon width={52} height={52} color={emp.color} style={{position: 'absolute'}} />
                          }
                          
                        </div>
                      )
                    })
                  }
                  {
                    entry.seg.employees.length > AVATARS_COUNT
                    ? <div className={styles.blur}>
                        {entry.seg.employees.length - AVATARS_COUNT}
                      </div>
                    : null
                  }
                </div>
              </div>
            )
          })
        }
      </div>
      <div className={styles.closeButton} onClick={close}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={12}
          height={20}
          fill="none"
        >
          <path
            stroke="#1685FC"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={3}
            d="m2 2 8 8-8 8" />
        </svg>
      </div>
    </div>
  )
})

export default PolicySideBar
