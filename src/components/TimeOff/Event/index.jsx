import React from 'react'
import { useTranslation } from 'react-i18next'
import { fade } from '@material-ui/core/styles/colorManipulator'
import moment from 'moment'
import cn from 'classnames'

import TimeOffSymbol1 from '../../Icons/TimeOffSymbol1'
import TimeOffSymbol2 from '../../Icons/TimeOffSymbol2'
import TimeOffSymbol3 from '../../Icons/TimeOffSymbol3'
import TimeOffSymbol4 from '../../Icons/TimeOffSymbol4'
import TimeOffSymbol5 from '../../Icons/TimeOffSymbol5'
import TimeOffSymbol6 from '../../Icons/TimeOffSymbol6'
import TimeOffSymbol7 from '../../Icons/TimeOffSymbol7'
import TimeOffSymbol8 from '../../Icons/TimeOffSymbol8'
import TimeOffSymbol9 from '../../Icons/TimeOffSymbol9'

import styles from './styles.module.scss'


const DEFAULT_COLOR = '#1685FD'

const AttentionIcon = ({color, ...props}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={19}
      height={19}
      fill="none"
      {...props}
    >
      <g clipPath="url(#a)">
        <path fill={color} d="M9.5 19a9.5 9.5 0 1 0 0-19 9.5 9.5 0 0 0 0 19Z" />
        <path
          stroke="#fff"
          d="M9.5 18.703A9.203 9.203 0 1 0 9.5.297a9.203 9.203 0 0 0 0 18.406Z"
        />
        <path
          fill="#fff"
          d="M8.996 4.367a.594.594 0 0 1 1.007 0l4.869 7.786a.595.595 0 0 1-.504.909H4.631a.594.594 0 0 1-.504-.909l4.87-7.786Z"
        />
        <path
          stroke={color}
          strokeLinecap="round"
          strokeWidth={1.2}
          d="M9.5 7.62v1.694"
        />
      </g>
      <defs>
        <clipPath id="a">
          <path fill="#fff" d="M0 0h19v19H0z" />
        </clipPath>
      </defs>
    </svg>
  )
}

const Event = ({event, view}) => {
  const { t } = useTranslation()
  const activeRange = view.getCurrentData().dateProfile.activeRange
  const viewRange = moment(activeRange.end).diff(moment(activeRange.start), 'days')
  const eventRange = moment(event.end).diff(moment(event.start), 'days') + 1
  const dayRange = view.type === 'day' ? 23 : Math.min(eventRange, viewRange)
  const cellWidthPercentage = 100 / dayRange
  const rightCells = Math.floor(100/cellWidthPercentage/2) - 1

  const eventProps = event.extendedProps
  const statusColor = (status => {
    switch(status) {
      case 'approved': return '#34C759'
      case 'pending': return '#FF9500'
      case 'rejected': return '#FF3B30'
      default: return '#34C759'
    }
  })(eventProps.status)

  const tooltipContent = `
    <div style="font-size: 13px; display: flex; flex-direction: column; gap: 4px;">
      <div style="display: flex; gap: 4px;">
        <span style="color: #7c7c7c;">${t('From')}:</span>
        <b style="color: #000;">${eventProps.from}</b>
        <span style="color: #7c7c7c;">${t('To')}:</span>
        <b style="color: #000;">${eventProps.to}</b>
      </div>
      <div style="display: flex; gap: 4px;">
        <span style="color: #7c7c7c;">${t('Policy')}:</span>
        <b style="color: #000;">${eventProps.policy?.name}</b>
      </div>
      <div style="display: flex; gap: 4px;">
        <span style="color: #7c7c7c;">${t('Status')}:</span>
        <b style="color: ${statusColor}; text-transform: capitalize;">${eventProps.status}</b>
      </div>
      ${
        eventProps.note
          ? `<div style="display: flex; gap: 4px;">
              <span style="color: #7c7c7c;">${t('Note')}:</span>
              <b style="color: #000;">${eventProps.note}</b>
            </div>`
          : ''
      }
    </div>
  `

  return (
    <div
      className={styles.eventContent}
      data-tooltip-id="time_off"
      data-tooltip-html={tooltipContent}>
      {
        ((symbol, color) => {
          switch(symbol) {
            case '1': return <TimeOffSymbol1 fill={color} className={styles.policyIcon} />
            case '2': return <TimeOffSymbol2 fill={color} className={styles.policyIcon} />
            case '3': return <TimeOffSymbol3 fill={color} className={styles.policyIcon} />
            case '4': return <TimeOffSymbol4 fill={color} className={styles.policyIcon} />
            case '5': return <TimeOffSymbol5 fill={color} className={styles.policyIcon} />
            case '6': return <TimeOffSymbol6 fill={color} className={styles.policyIcon} />
            case '7': return <TimeOffSymbol7 fill={color} className={styles.policyIcon} />
            case '8': return <TimeOffSymbol8 fill={color} className={styles.policyIcon} />
            case '9': return <TimeOffSymbol9 fill={color} className={styles.policyIcon} />
            default: return <TimeOffSymbol1 fill={color} className={styles.policyIcon} />
          }
        })(eventProps.policy?.symbol, fade(eventProps.policy?.color || DEFAULT_COLOR, 0.5))
      }
      {
        eventProps.status === 'rejected' || eventProps.status === 'pending'
          ? <AttentionIcon
              style={{right: `${rightCells * cellWidthPercentage + (100 / dayRange / 2)}%`}}
              color={eventProps.status === 'rejected' ? '#FD4646' : '#FFBD06'}
              className={cn(styles.attentionIcon, {[styles.absolute]: dayRange === 1})} />
          : null
      }
    </div>
  )
}

export default Event
