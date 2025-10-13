import React from 'react'
import cn from 'classnames'
import { useTranslation } from 'react-i18next'

import styles from './styles.module.scss'

import PolicySymbol from '../PolicySymbol'
import DescriptionIcon from '../../Icons/DescriptionIcon'
import EditIconFixedFill from '../../Icons/EditIconFixedFill'
import CheckIcon from '../../Icons/CheckIcon'
import RejectIcon from '../../Icons/RejectIcon'
import StyledCheckbox from '../../Core/Checkbox/Checkbox'

const RequestTableRow = ({request, onEdit, onSelect, onChangeRequestStatus}) => {
  const { t } = useTranslation()
  console.log('request', request)
  return (
    <div className={cn(styles.row)}>
      <div className={cn(styles.cell, styles.center)}>
        <StyledCheckbox
          id={request.id}
          checked={request.checked}
          onChange={onSelect(request)} />
      </div>
      <div className={cn(styles.cell, styles.actions)}>
        <div data-tooltip-html={t("Edit")} data-tooltip-id="note" className={styles.icon} onClick={() => onEdit(request)}>
          <EditIconFixedFill />
        </div>
        { request.status !== 'approved' && (
          <div data-tooltip-html={t("Approve")} data-tooltip-id="note" className={cn(styles.icon, styles.approve)} onClick={() => onChangeRequestStatus(request, 'approved', [request.employee_id])}>
            <CheckIcon />
          </div>
        )}
        { request.status !== 'rejected' && (
          <div data-tooltip-html={t("Reject")} data-tooltip-id="note" className={cn(styles.icon, styles.reject)} onClick={() => onChangeRequestStatus(request, 'rejected', [request.employee_id])}>
            <RejectIcon />
          </div>
        )}
      </div>
      <div className={styles.cell}>
        <div className={cn(styles.status, styles[request.status])}>
          { request.status.charAt(0).toUpperCase() + request.status.slice(1) }
        </div>
      </div>
      <div className={styles.cell}>
        { request.employee.title }
      </div>
      <div className={cn(styles.cell, styles.policy)}>
        <PolicySymbol symbol={request.policy.symbol} color={request.policy.color} />
        {request.policy.name}
        {
          request.note
            ? <div className={styles.note} data-tooltip-html={request.note} data-tooltip-id='note'>
                <DescriptionIcon width={12} height={12} className={styles.noteIcon} />
              </div>
            : null
        }
      </div>
      <div className={styles.cell}>
        { request.totalRestDays }
      </div>
      <div className={styles.cell}>
        { request.from } - { request.to }
      </div>
      <div className={styles.cell}>
        { request.created_at }
      </div>
      <div className={styles.cell}>
        { request.employee.groups }
      </div>
      <div className={styles.cell}>
        { request.employee.subgroups }
      </div>
      <div className={styles.cell}>
        { request.employee.place }
      </div>
      <div className={styles.cell}>
        { request.approver_1_name }
      </div>
      <div className={styles.cell}>
        { request.approver_2_name }
      </div>
    </div>
  )
}

export default RequestTableRow
