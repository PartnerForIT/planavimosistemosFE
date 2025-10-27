import React, { useState, useEffect, useRef } from 'react'
import { Tooltip as ReactTooltip } from 'react-tooltip'
import { useTranslation } from 'react-i18next'
import cn from 'classnames'
import { useHistory } from 'react-router-dom'
import Moment from 'moment'
import { extendMoment } from 'moment-range'
import { useSelector } from 'react-redux'

import styles from './styles.module.scss'

import Button from '../../Core/Button/Button'
import EditIconFixedFill from '../../Icons/EditIconFixedFill'
import ArrowRightButton from '../../Icons/ArrowRightButton'
import AlertCircle from '../../Icons/AlertCircle'
import RequestBehalf from '../../Core/Dialog/RequestBehalf'
import PolicySymbol from '../PolicySymbol'
import DescriptionIcon from '../../Icons/DescriptionIcon'
import EmployeeActivity from '../EmployeeActivity'
import TitleBackIcon from '../../Icons/TitleBackIcon'
import GrownuSystemAvatar from '../../Icons/GrownuSystemAvatar'
import GrownuAdminAvatar from '../../Icons/GrownuAdminAvatar'
import avatar from '../../Icons/avatar.png'

import { getEmployeePolicies, getTimeOffEmployeeRequests, updateRequest, createRequest, getPolicyEmployee, removePolicyActivity, updatePolicyActivity } from '../../../api'

const moment = extendMoment(Moment)

const convertFormat = (companyFormat) => {
  if (!companyFormat) {
    return 'YYYY-MM-DD'
  }
  const keyMap = {
    'DD': 'DD',
    'MM': 'MM',
    'YY': 'YYYY',
  }
  return companyFormat.split('.').map(k => keyMap[k] || k).join('-')
}

const EmployeeView = ({ isMe, tab, companyId, timeOffId, policyId, employeeId, view, employee, timeOffs, holidays }) => {
  const { t } = useTranslation()
  const history = useHistory()
  const companyData = useSelector(state => state.company.companyInfo)

  const requestFormRef = useRef(null)

  const [expandedPolicyIds, setExpandedPolicyIds] = useState([])
  const [requests, setRequests] = useState([])
  const [policies, setPolicies] = useState([])
  const [activities, setActivities] = useState([])

  const currentPolicy = policies.find(({ id }) => id === policyId) || {}

  const policiesMap = policies.reduce((acc, policy) => ({
    ...acc,
    [policy.id]: policy,
  }), {})

  useEffect(() => {
    init()
  }, [timeOffs])

  useEffect(() => {
    if (view === 'activity' && timeOffId && policyId && employeeId) {
      getActivities()
    }
  }, [companyId, timeOffId, policyId, employeeId, view])

  const init = async () => {
    if (!Object.keys(timeOffs).length) {
      return
    }
    const [policiesRes, requestsRes] = await Promise.all([
      getEmployeePolicies(companyId, employeeId),
      getTimeOffEmployeeRequests(companyId, employeeId),
    ])
    setPolicies(policiesRes.map((p => ({ ...p, time_off: timeOffs[p.time_off_id] }))))
    setRequests(requestsRes)
  }

  const getActivities = async () => {
    const res = await getPolicyEmployee(companyId, timeOffId, policyId, employeeId)
    if (Array.isArray(res?.activities)) {
      setActivities(res.activities)
    }
  }

  const expandPolicy = (policyId, expand) => {
    setExpandedPolicyIds((prev) =>
      expand
        ? [...prev, policyId]
        : prev.filter((id) => id !== policyId)
    );
  }

  const handleSubmitRequest = async (data) => {
    const selectedPolicy = policies.find(({ id }) => id === data.policy_id)
    if (selectedPolicy) {
      requestFormRef.current.close()
      if (data.id) {
        await updateRequest(companyId, selectedPolicy.time_off_id, data.policy_id, data.id, data)
      } else {
        await createRequest(companyId, selectedPolicy.time_off_id, data.policy_id, data)
      }
      init(companyId, employeeId)
    }
  }

  const handleRequest = (params) => {
    requestFormRef.current.open(params)
  }

  const goEmployeeActivity = (policy) => {
    history.push({search: `?tab=${tab}&timeOffId=${policy.time_off_id}&policyId=${policy.id}&employeeId=${employeeId}&view=activity`})
  }

  const onRemoveActivity = async (activity) => {
    await removePolicyActivity(companyId, activity.time_off_id, activity.policy_id, activity.employee_id, activity.id)
    getActivities()
  }

  const onEditActivity = async (activity, data) => {
    await updatePolicyActivity(companyId, activity.time_off_id, activity.policy_id, activity.employee_id, activity.id, data)
    getActivities()
  }

  const renderApproverAvatar = (request) => {
    const { rejected_by, approver_1_name, approver_1_avatar, approver_2_name, approver_2_avatar } = request
    const avatars = []
    if (request.status === 'rejected' && rejected_by) {
      avatars.push({
        image: rejected_by === 'Super Admin' ? <GrownuAdminAvatar /> : <img src={request.rejected_by_avatar || avatar} alt='approver' className={styles.approverAvatar} />,
        label: rejected_by === 'Super Admin' ? t('Grownu support') : request.rejected_by_name,
      })
      return avatars
    }
    if (!approver_1_name && !approver_2_name) {
      avatars.push({
        image: <GrownuSystemAvatar />,
        label: t('Grownu support'),
      })
      return avatars
    }
    if (approver_1_name) {
      const avatar1 = {
        image: approver_1_name === 'Super Admin' ? <GrownuAdminAvatar /> : <img src={approver_1_avatar || avatar} alt='approver1' className={styles.approverAvatar} />,
        label: approver_1_name === 'Super Admin' ? t('Grownu support') : approver_1_name,
      }
      avatars.push(avatar1)
    }
    if (approver_2_name) {
      const avatar2 = {
        image: approver_2_name === 'Super Admin' ? <GrownuAdminAvatar /> : <img src={approver_2_avatar || avatar} alt='approver2' className={styles.approverAvatar} />,
        label: approver_2_name === 'Super Admin' ? t('Grownu support') : approver_2_name,
      }
      avatars.push(avatar2)
    }
    return avatars
  }

  return (
    <div className={styles.container}>
      <div>
        {
          employeeId && !isMe || view === 'activity'
            ? <div className={styles.breadcrumps}>
                <div className={styles.backButton} onClick={() => history.goBack()} data-tooltip-html={t("Back")} data-tooltip-id="back">
                  <TitleBackIcon />
                </div>
                { currentPolicy?.name } / { employee?.name } {view === 'activity' ? ` / ${t('Balance activity')}` : '' }
              </div>
            : null
        }
      </div>
      {
        (view => {
          switch (view) {
            case 'requests':
              return (
                <>
                  {
                    !isMe && employee
                      ? <div className={styles.section}>
                          <div className={styles.sectionTitle}>{t('Employee')}</div>
                          <div className={styles.employeeBlock}>
                            {
                              employee.photo && (
                                <div className={styles.avatarBlock}>
                                  <img
                                    src={employee.photo}
                                    alt='avatar'
                                    className={styles.avatar}
                                  />
                                </div>
                              )
                            }
                            <div>
                              <div className={styles.employeeName}>{employee.name} {employee.surname}</div>
                              <div className={styles.skillName}>{employee.skills}</div>
                            </div>
                            <div className={styles.buttonBlock}>
                              <Button
                                className={styles.button}
                                size="large"
                                primary
                                onClick={() => handleRequest()}
                              >
                                {t('Request on behalf')}
                              </Button>
                            </div>
                          </div>
                        </div>
                      : null
                  }
                  <div className={styles.section}>
                    <div className={styles.sectionHeader}>
                      <div className={styles.sectionTitle}>{t('Upcoming requests')} <span className={styles.secondary}>{requests.length}</span></div>
                      {
                        isMe
                          ? <Button
                            className={styles.button}
                            size="large"
                            primary
                            onClick={() => handleRequest()}
                          >
                            {t('Fill Request')}
                          </Button>
                          : null
                      }
                    </div>
                    <div>
                      {
                        requests.length > 0 ? (
                          <div className={styles.upcomingRequests}>
                            <div className={styles.upcomingRequestsHeader}>
                              <div className={styles.upcomingRequestsHeaderCol}>
                                {t('Request type')}
                              </div>
                              <div className={styles.upcomingRequestsHeaderCol}>
                                {t('Days')}
                              </div>
                              <div className={styles.upcomingRequestsHeaderCol}>
                                {t('When')}
                              </div>
                              <div className={styles.upcomingRequestsHeaderCol}>
                                {t('Requested on')}
                              </div>
                              <div className={styles.upcomingRequestsHeaderCol}>
                                {t('Status')}
                              </div>
                              <div className={styles.upcomingRequestsHeaderCol}></div>
                            </div>
                            {requests.map((request) => {
                              const policy = policiesMap[request.policy_id] || {};
                              const range = Array.from(moment.range(moment(request.from), moment(request.to)).by('days')).map(date => date.format('YYYY-MM-DD'))
                              const totalWorkingDays = range.reduce((acc, date) => {
                                if (holidays[date]) {
                                  return acc
                                }
                                const day = moment(date).day()
                                if (policy.time_off.work_days === 'any_day' || (day !== 0 && day !== 6)) {
                                  return acc + 1
                                }
                                return acc
                              }, 0)

                              return (
                                <div key={request.id} className={styles.upcomingRequestsRow}>
                                  <div className={styles.upcomingRequestsCol}>
                                    <div className={styles.tableName}>
                                      <PolicySymbol symbol={policy.symbol} color={policy.color} />
                                      {policy.name}
                                      {
                                        request.note
                                          ? <div className={styles.note} data-tooltip-html={request.note} data-tooltip-id='note'>
                                            <DescriptionIcon width={12} height={12} className={styles.noteIcon} />
                                          </div>
                                          : null
                                      }
                                    </div>
                                  </div>
                                  <div className={styles.upcomingRequestsCol}>
                                    {totalWorkingDays}
                                  </div>
                                  <div className={styles.upcomingRequestsCol}>
                                    {moment(request.from).format(convertFormat(companyData.date_format))} - {moment(request.to).format(convertFormat(companyData.date_format))}
                                  </div>
                                  <div className={styles.upcomingRequestsCol}>
                                    {moment(request.created_at).format(convertFormat(companyData.date_format))}
                                  </div>
                                  <div className={cn(styles.upcomingRequestsCol, styles.status)}>
                                    { renderApproverAvatar(request).map((avatar, i) => {
                                      return (
                                        <div key={i} data-tooltip-html={avatar.label} data-tooltip-id='emp_name'>{avatar.image}</div>
                                      )
                                    }) }
                                    <div className={cn(styles.upcomingRequestsStatus, {
                                      [styles.requestStatusApproved]: request.status === 'approved',
                                      [styles.requestStatusPending]: request.status === 'pending',
                                      [styles.requestStatusRejected]: request.status === 'rejected',
                                      [styles.requestStatusCancelled]: request.status === 'cancelled',
                                    })}>
                                      {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                                    </div>
                                  </div>
                                  <div className={styles.upcomingRequestsCol}>
                                    <div className={styles.upcomingRequestsButtons}>
                                      <div data-tooltip-html={t("Edit")} data-tooltip-id="tip_request">
                                        <Button
                                          className={styles.buttonEdit}
                                          size="little"
                                          onClick={() => {
                                            handleRequest(request)
                                          }}
                                        >
                                          <EditIconFixedFill />
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        ) : null
                      }
                    </div>
                  </div>
                  <div className={styles.section}>
                    <div className={styles.sectionTitle}>{t('Policies')} <span className={styles.secondary}>{policies.length}</span></div>
                    {
                      policies.length > 0 ? (
                        <div className={styles.policiesTable}>
                          <div className={styles.policiesTableHeader}>
                            <div className={styles.policiesTableHeaderCol}>
                            </div>
                            <div className={styles.policiesTableHeaderCol}>
                              {t('Policy')}
                            </div>
                            <div className={styles.policiesTableHeaderCol}>
                              {!expandedPolicyIds.length && (
                                t('Current cycle')
                              )}
                            </div>
                            <div className={cn(styles.policiesTableHeaderCol, styles.right)}>
                              {!expandedPolicyIds.length && (
                                t('Cycle allowance')
                              )}
                            </div>
                            <div className={cn(styles.policiesTableHeaderCol, styles.right)}>
                              {!expandedPolicyIds.length && (
                                t('Accrued')
                              )}
                            </div>
                            <div className={cn(styles.policiesTableHeaderCol, styles.right)}>
                              {t('Taken')}
                            </div>
                            <div className={cn(styles.policiesTableHeaderCol, styles.right)}>
                              {t('Balance')}
                            </div>
                          </div>
                          {
                            policies.map((policy) => {
                              const policyEmployeeDetails = policy.employees.find((emp) => emp.id === employeeId)
                              const isExpanded = expandedPolicyIds.includes(policy.id)
                              return (
                                <React.Fragment key={policy.id}>
                                  <div className={cn(styles.policiesTableRow, styles.pointer)} onClick={() => expandPolicy(policy.id, !isExpanded)}>
                                    <div className={cn(styles.policiesTableCol, styles.policiesTableColExpand)}>
                                      <div className={cn(styles.policiesTableExpand, { [styles.active]: isExpanded })}>
                                        <ArrowRightButton />
                                      </div>
                                    </div>
                                    <div className={styles.policiesTableCol}>
                                      <div className={styles.tableName}>
                                        <PolicySymbol symbol={policy.symbol} color={policy.color} />
                                        {policy.name}
                                      </div>
                                    </div>
                                    <div className={cn(styles.policiesTableCol, styles.policiesTableColGray, styles.nowrap)}>
                                      {!expandedPolicyIds.length
                                        ? `${policyEmployeeDetails?.current_cycle_start ? policyEmployeeDetails?.current_cycle_start : ''} ${policyEmployeeDetails?.current_cycle_end ? `- ${policyEmployeeDetails?.current_cycle_end}` : ''}`
                                        : null
                                      }
                                    </div>
                                    <div className={cn(styles.policiesTableCol, styles.policiesTableColGray, styles.right)}>
                                      {!expandedPolicyIds.length && (
                                        policyEmployeeDetails?.cycle_allowance
                                      )}
                                    </div>
                                    <div className={cn(styles.policiesTableCol, styles.policiesTableColGray, styles.right)}>
                                      {!expandedPolicyIds.length && (
                                        policyEmployeeDetails?.accrued_amount_this_cycle
                                      )}
                                    </div>
                                    <div className={cn(styles.policiesTableCol, styles.right)}>
                                      {policyEmployeeDetails?.taken_this_cycle}
                                    </div>
                                    <div className={cn(styles.policiesTableCol, styles.right)}>
                                      {policyEmployeeDetails?.balance}
                                    </div>
                                  </div>

                                  {isExpanded && (
                                    <div className={styles.expandedRow}>
                                      <div className={styles.expandedContent}>
                                        <div className={styles.expandedInfo}>
                                          <div>
                                            <strong>{t('Cycle period')}:</strong>
                                            <div>{policyEmployeeDetails?.current_cycle_start} — {policyEmployeeDetails?.current_cycle_end}</div>
                                          </div>
                                          <div>
                                            <strong>{t('Allowance type')}:</strong>
                                            <div>{policyEmployeeDetails?.cycle_type_text}</div>
                                          </div>
                                          <div></div>
                                          <div></div>
                                        </div>
                                        <div className={styles.expandedInfo}>
                                          <div>
                                            <strong>{t('Cycle allowance')}:</strong>
                                            <div>{policyEmployeeDetails?.cycle_allowance}</div>
                                          </div>
                                          <div>
                                            <strong>{t('Accrued')}:</strong>
                                            <div>{policyEmployeeDetails?.accrued_amount_this_cycle}</div>
                                          </div>
                                          <div>
                                            <strong>{t('Adjusted by admin')}:</strong>
                                            <div>todo</div>
                                          </div>
                                          <div>
                                            <strong>{t('Days booked')}:</strong>
                                            <div>{policyEmployeeDetails?.total_booked}</div>
                                          </div>
                                        </div>
                                        <div className={styles.carryoverInfo}>
                                          {
                                            policyEmployeeDetails?.carryovers && policyEmployeeDetails.carryovers.length > 0 && (
                                              <div className={styles.carryoverList}>
                                                {policyEmployeeDetails.carryovers.map((carryover) => (
                                                  <div key={carryover.id} className={styles.carryoverItem}>
                                                    <AlertCircle /> {t("{{days}} days carryover on {{when}} have an expiration date of {{expire}}", { days: carryover.amount, when: carryover.carryover_date, expire: carryover.expire_at })}
                                                  </div>
                                                ))}
                                              </div>
                                            )
                                          }
                                        </div>
                                        <div className={styles.actionsRow}>
                                          <div></div>
                                          <div className={styles.actionsRowButtons}>
                                            <Button
                                              onClick={() => { goEmployeeActivity(policy); }}
                                              primary
                                            >
                                              {t('Activity')}
                                            </Button>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </React.Fragment>
                              );
                            })}
                        </div>
                      ) : null
                    }
                  </div>
                </>
              )
            case 'activity':
              return (
                employee
                  ? <EmployeeActivity
                      employee={employee}
                      activePolicy={currentPolicy}
                      activities={activities}
                      onRemoveActivity={onRemoveActivity}
                      onEditActivity={onEditActivity}
                    />
                  : null
              )
          }
        })(view)
      }
      <RequestBehalf
        ref={requestFormRef}
        title={t('Fill Request')}
        onSubmit={handleSubmitRequest}
        handleClose={() => { }}
        buttonTitle={t('Submit')}
        employees={[{ ...employee, request_behalves: requests }]}
        policies={policies}
        initialValue={{}}
        singleRequest
        {...(currentPolicy ? {activeTimeOff: currentPolicy.time_off} : null)}
      />
      <ReactTooltip
        id='note'
        effect='solid'
        className={styles.tooltip}
      />
      <ReactTooltip
        id='back'
        effect='solid'
        style={{backgroundColor: '#000', color: '#fff'}}
        place='top'
        className={styles.tooltip}
      />
      <ReactTooltip
        id='emp_name'
        effect='solid'
        opacity={1}
        className={styles.tooltip_emp}
      />
    </div>
  )
}

export default EmployeeView
