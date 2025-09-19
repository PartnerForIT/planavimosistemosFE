import React, { useState, forwardRef, useImperativeHandle } from 'react'
import cn from 'classnames'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Sector } from 'recharts'
import { fade } from '@material-ui/core/styles/colorManipulator'
import { useTranslation } from 'react-i18next'
import moment from 'moment'

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

const ChevronIcon = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={12}
      height={20}
      viewBox="0 0 12 20"
      fill="none"
      {...props}
    >
      <path
        stroke="#1685FC"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={3}
        d="m2 2 8 8-8 8" />
    </svg>
  )
}

const ArrowIcon = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={9}
      height={8}
      fill="none"
      {...props}
    >
      <path
        fill="#999DA8"
        d="M.63 4.667H6.85L4.78 6.862a.695.695 0 0 0 0 .943.61.61 0 0 0 .445.195.61.61 0 0 0 .445-.195L8.816 4.47a.695.695 0 0 0 0-.942L5.669.195a.605.605 0 0 0-.89 0 .695.695 0 0 0 0 .943L6.85 3.333H.63C.282 3.333 0 3.632 0 4c0 .368.282.667.63.667Z"
      />
    </svg>
  )
}

const ProfileIcon = ({color = '#292D32', ...props}) => {
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

const PieTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const p = payload[0];
  const seg = p.payload.seg;
  return (
    <div className={styles.pieTooltip}>
      {seg.type} — {seg.count}
    </div>
  );
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

  const [expandedPolicies, setExpandedPolicies] = useState([])

  useImperativeHandle(ref, () => ({
    open: (data) => {
      setState({isOpen: true, data: data, activeIndex: -1})
    },
    close: close,
  }))

  const close = () => {
    setState({isOpen: false, data: {segments: []}, activeIndex: -1})
    setExpandedPolicies([])
    if (onClose) {
      onClose()
    }
  }

  return (
    <div className={cn(styles.container, {[styles.active]: isOpen})}>
      <div className={styles.scrollable}>
        <div className={styles.titleContainer}>
          <div className={styles.title}>{data.date}</div>
        </div>
        <div style={{height: 300, position: 'relative', width: '100%'}}>
          <div className={styles.onLeaveContainer}>
            <div className={styles.onLeave}>{ data.onLeave }</div>
            <div className={styles.description}>{ t('on leave') }</div>
          </div>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data.segments}
                dataKey="value"
                nameKey="name"
                innerRadius={70}
                outerRadius={110}
                paddingAngle={0}
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
                  <Cell key={`c-${index}`} fill={activeIndex === index ? entry.fill : fade(entry.fill, 0.4)} />
                ))}
              </Pie>
              <Tooltip content={<PieTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className={styles.policiesContainer}>
          {
            data.segments.map((entry, index) => {
              console.log(entry)
              const avatarsToRender = entry.seg.employees.slice(0, AVATARS_COUNT)
              const isExpanded = expandedPolicies.includes(entry.id)
              return (
                <div key={index} className={styles.card} style={{backgroundColor: fade(entry.fill, 0.1)}}>
                  <div className={styles.cardHeader} onClick={() => setExpandedPolicies(prev => isExpanded ? prev.filter(e => e !== entry.id) : [...prev, entry.id])}>
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
                    <div className={styles.expandButton}>
                      <ChevronIcon width={9} height={16} style={{transform: `rotate(${isExpanded ? 270 : 90}deg)`}} />
                    </div>
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
                  <div className={cn(styles.cardContent, {[styles.expanded]: isExpanded})}>
                    {
                      entry.seg.employees.map((emp, i) => {
                        return (
                          <div key={i} className={styles.employeeRow}>
                            <div className={styles.employeeRowHeader}>
                              <div className={styles.avatar}>
                                {
                                  emp.photo
                                    ? <img src={emp.photo} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                                    : <ProfileIcon width={52} height={52} color={emp.color} />
                                }
                              </div>
                              <div>
                                <div className={styles.employeeName}>{emp.name} {emp.surname}</div>
                                <div className={styles.employeeRole}>{emp.role}</div>
                              </div>
                            </div>
                            <div className={styles.employeesDatesContainer}>
                              <div className={styles.employeeDate}>{moment(emp.event.start).format('ddd, MMM DD')}</div>
                              <ArrowIcon />
                              <div className={styles.employeeDate}>{moment(emp.event.end).format('ddd, MMM DD')}</div>
                            </div>
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
        <div className={styles.closeButton} onClick={close}>
          <ChevronIcon />
        </div>
      </div>
    </div>
  )
})

export default PolicySideBar
