import React, { useEffect, useState, useRef } from 'react'
import { Tooltip as ReactTooltip } from 'react-tooltip'
import { useTranslation } from 'react-i18next'

import styles from './styles.module.scss'

import { getCompanyTimeOffPolicies, getCompanyTimeOffs } from '../../../api'

import Select from '../Select'
import PolicySymbol from '../PolicySymbol'
import DescriptionIcon from '../../Icons/DescriptionIcon'

const MyEmployeesSection = ({ companyId, employee }) => {
  const employeeId = employee.id
  const { t } = useTranslation()

  const tooltipRef = useRef(null)

  const [policySections, setPolicySections] = useState([])
  const [selectedPolicy, setSelectedPolicy] = useState('')

  useEffect(() => {
    init()
  }, [])

  const init = async () => {
    const [timeOffsRes, policiesRes] = await Promise.all([
      getCompanyTimeOffs(companyId),
      getCompanyTimeOffPolicies(companyId)
    ])

    if (Array.isArray(timeOffsRes) && Array.isArray(policiesRes?.policies)) {
      const policiesMap = policiesRes.policies.reduce((acc, policy) => {
        const formattedPolicy = {
          id: policy.id,
          name: policy.name,
          description: policy.description,
          employees: policy.employees,
          symbol: policy.symbol,
          color: policy.color,
        }
        return {
          ...acc,
          [policy.time_off_id]: acc[policy.time_off_id] ? [...acc[policy.time_off_id], formattedPolicy] : [formattedPolicy]
        }
      })
      
      const timeOffs = timeOffsRes.map((timeOff) => ({
        id: timeOff.id,
        name: timeOff.name,
        description: timeOff.description,
        data: policiesMap[timeOff.id] || [],
      }), {})
      setPolicySections(timeOffs)
    }
  }

  const handleSelectPolicy = (policy) => {
    setSelectedPolicy(policy.id)
  }

  const renderPolicyOption = (policy, isSelected) => {
    return (
      <div className={styles.policyOption}>
        <PolicySymbol symbol={policy.symbol} color={policy.color} />
        {policy.name}
        {
          policy.description && !isSelected
            ? <div className={styles.description} data-tooltip-html={policy.description} data-tooltip-id="description">
                <DescriptionIcon width={12} height={12} className={styles.noteIcon} />
              </div>
            : null
        }
      </div>
    )
  }

  return (
    <div className={styles.screen}>
      <div className={styles.selectContainer}>
       <Select
        placeholder={t('Select a policy')}
        options={policySections}
        value={selectedPolicy}
        renderSelected={props => renderPolicyOption(props, true)}
        renderOption={renderPolicyOption}
        injectedElements={() => (
          <ReactTooltip
            id="description"
            effect="solid"
            className={styles.tooltip} />
        )}
        onSelect={handleSelectPolicy} /> 
      </div>
      <div className={styles.content}>
      </div>
    </div>
  )
}

export default MyEmployeesSection
