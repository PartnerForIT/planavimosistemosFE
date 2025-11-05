import React, { useState, useRef, useEffect } from 'react'
import cn from 'classnames'
import { useTranslation } from 'react-i18next'
import { Tooltip } from 'react-tooltip'
import Scrollbar from 'react-scrollbars-custom'

import styles from './styles.module.scss'

import AddJobType from '../Table/AddJobType'
import InputNumber from '../Table/InputNumber'
import Input from '../../../../components/Core/Input/Input'
import SearchIcon from '../../../../components/Icons/SearchIcon'
import Checkbox from '../../../../components/Core/Checkbox/Checkbox'
import Button from '../../../../components/Core/Button/Button'
import TimeRangePicker from '../TimeRangePicker'

const trackYProps = {
  renderer: ({ elementRef, ...restProps }) => (
    <span
      {...restProps}
      ref={elementRef}
      className={cn('trackY', styles.scrollbarTrackY)}
    />
  ),
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

const Wrapper = ({active, data, onClose, ...props}) => {
  const shiftsCount = Object.values(data?.jobTypes || {}).reduce((acc, shifts) => acc + Object.keys(shifts).length, 0)
  return (
    <div className={cn(styles.container, {[styles.active]: active})}>
      <div className={styles.header}>
        <div className={styles.title}>{data?.weekIndex+1}/{props?.weeksCount}</div>
        <div className={styles.title}>{data?.label}</div>
        <div className={styles.jobsCount}>
          { shiftsCount }
        </div>
      </div>
      {
        data
          ? <DemanToolForm data={data} {...props} />
          : null
      }
      <div className={styles.closeButton} onClick={() => onClose(data.weekIndex, data, false)}>
        <ChevronIcon />
      </div>
    </div>
  )
}

const SkillContent = ({skills, onChange}) => {
  const { t } = useTranslation()
  const [query, setQuery] = useState('')
  const [selectedSkills, setSelectedSkills] = useState({})

  const handleChangeCheckbox = (skillId, checked) => {
    setSelectedSkills(prev => ({
      ...prev,
      [skillId]: checked,
    }))
  }

  const handleSubmit = () => {
    onChange(skills.filter(skill => selectedSkills[skill.id]))
  }

  return (
    <div className={styles.skillContent}>
      <div className={styles.title}>{ t('Add skill') }</div>
      <Input
        icon={<SearchIcon />}
        placeholder={t('Search by Job Type')}
        value={query}
        name='search'
        fullWidth
        onChange={e => setQuery(e.target.value)} />
      <Scrollbar
        noScrollX
        trackYProps={trackYProps}
        removeTracksWhenNotUsed
        className={styles.skillsContainer}
      >
        {
          skills.filter(s => s.name.toLowerCase().includes(query.toLowerCase())).map((item) => {
            return (
              <div key={item.id} className={styles.skillItem}>
                <Checkbox
                  onChange={handleChangeCheckbox}
                  checked={selectedSkills[item.id] || false}
                  label={item.name}
                  id={item.id}
                />
              </div>
            )
          })
        }
      </Scrollbar>
      <Button fillWidth onClick={handleSubmit}>
        { t('Add Skill') }
      </Button> 
    </div>
  )
}

export const DemanToolForm = ({data, jobTypes, skills, onChange}) => {
  const { t } = useTranslation()

  const tooltipRef = useRef()

  const [selectedData, setSelectedData] = useState({shiftIndex: null, jobTypeId: null})

  const jobTypesMap = jobTypes.reduce((acc, jobType) => ({...acc, [jobType.id]: jobType}), {})
  const selectedSkills = data.jobTypes[selectedData.jobTypeId]?.[selectedData.shiftIndex]?.skills || {}
  const EMPTY_SHIFT = {
    start: data.defaultTimes.start || '08:00',
    end: data.defaultTimes.end || '18:00',
    skills: {},
  }

  const handleAddJobType = (jobTypes) => {
    const updatedJobTypes = jobTypes.reduce((acc, jobType) => {
      return {
        ...acc,
        [jobType.id]: Array.from({length: jobType.value || 1}).map(() => EMPTY_SHIFT).reduce((acc, shift, index) => ({...acc, [index]: shift}), {}),
      }
    }, data.jobTypes)
    onChange(data.weekIndex, {...data, jobTypes: updatedJobTypes})
  }

  const handleChangeShiftsCount = (jobTypeId, value) => {
    const updatedJobTypes = Object.entries(data.jobTypes).reduce((acc, [jobId, shifts]) => {
      if (jobId === jobTypeId) {
        return {
          ...acc,
          [jobId]: Object.fromEntries(
            Array.from({length: value}).map((_, index) => [index, shifts[index] || EMPTY_SHIFT])
          )
        }
      }
      return acc
    }, data.jobTypes)

    console.log('updatedJobTypes', updatedJobTypes)
    
    onChange(data.weekIndex, {...data, jobTypes: updatedJobTypes})
  }

  const handleChangeSkills = (skills) => {
    const updatedSkills = {...selectedSkills, ...skills.reduce((acc, skill) => ({...acc, [skill.id]: {id: skill.id, name: skill.name}}), {})}
    const updatedJobtypes = Object.entries(data.jobTypes).reduce((acc, [jobTypeId, shifts]) => {
      if (jobTypeId === selectedData.jobTypeId) {
        return {
          ...acc,
          [jobTypeId]: {
            ...shifts,
            [selectedData.shiftIndex]: {
              ...shifts[selectedData.shiftIndex],
              skills: updatedSkills,
            }
          }
        }
      }
      return acc
    }, data.jobTypes)
    onChange(data.weekIndex, {...data, jobTypes: updatedJobtypes})
    tooltipRef.current.close()
  }

  const handleRemoveSkill = (jobTypeId, shiftIndex, skillId) => {
    const updatedSkills = {...data.jobTypes[jobTypeId][shiftIndex].skills}
    delete updatedSkills[skillId]
    const updatedJobtypes = Object.entries(data.jobTypes).reduce((acc, [jTypeId, shifts]) => {
      if (jTypeId === jobTypeId) {
        return {
          ...acc,
          [jTypeId]: {
            ...shifts,
            [shiftIndex]: {
              ...shifts[shiftIndex],
              skills: updatedSkills,
            }
          }
        }
      }
      return acc
    }, data.jobTypes)
    onChange(data.weekIndex, {...data, jobTypes: updatedJobtypes})
  }

  const handleChangeTime = ({cellId, time}) => {
    const [jobTypeId, shiftIndex] = cellId.split('_')
    const updatedShift = {
      ...data.jobTypes[jobTypeId][shiftIndex],
      start: time.start,
      end: time.end,
    }
    const updatedJobtypes = Object.entries(data.jobTypes).reduce((acc, [jTypeId, shifts]) => {
      if (jTypeId === jobTypeId) {
        return {
          ...acc,
          [jTypeId]: {
            ...shifts,
            [shiftIndex]: updatedShift,
          }
        }
      }
      return acc
    }, data.jobTypes)
    onChange(data.weekIndex, {...data, jobTypes: updatedJobtypes})
  }

  return (
    <div className={styles.form}>
      <div className={styles.addJobButton}>
        <AddJobType
          allJobTypes={jobTypes.filter(jobType => !data.jobTypes[jobType.id])}
          onSubmit={handleAddJobType}
          modalClassName={styles.addJobModal} />
      </div>
      <div className={styles.content}>
        {
          Object.entries(data.jobTypes).map(([jobTypeId, shifts]) => {
            return (
              <div key={jobTypeId} className={styles.jobTypeContainer}>
                <div className={styles.jobType}>
                  <div>{ jobTypesMap[jobTypeId].title }</div>
                  <InputNumber
                    value={Object.keys(shifts).length}
                    onChange={value => handleChangeShiftsCount(jobTypeId, value)} />
                </div>
                <div className={styles.shiftsContainer}>
                  {
                    Object.entries(shifts).map(([shiftIndex, shift]) => {
                      return (
                        <div key={shiftIndex} className={styles.shift}>
                          <div className={styles.shiftIndex}>{Number(shiftIndex) + 1}.</div>
                          <div className={styles.shiftContent}>
                            <div className={styles.shiftHeader}>
                              <TimeRangePicker
                                value={{
                                  start: shift.start,
                                  end: shift.end,
                                }}
                                cellId={`${jobTypeId}_${shiftIndex}`}
                                onChange={handleChangeTime} />
                              <div className={styles.addSkillButton} data-tooltip-id="skills_tootip" onClick={() => setSelectedData({jobTypeId: jobTypeId, shiftIndex: Number(shiftIndex)})}>
                                <div>{ t('Skills') }</div>
                                <div className={styles.skillButtonIcon}>+</div>
                              </div>
                            </div>
                            <div className={styles.shiftSkills}>
                              {
                                Object.entries(shift.skills || {}).map(([skillId, skill]) => {
                                  return (
                                    <div key={skillId} className={styles.skill} onClick={() => handleRemoveSkill(jobTypeId, shiftIndex, skillId)}>
                                      { skill.name } &times;
                                    </div>
                                  )
                                })
                              }
                            </div>
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
      <Tooltip
        id="skills_tootip"
        ref={tooltipRef}
        openOnClick={true}
        arrowColor="transparent"
        opacity={1}
        arrowSize={0}
        border="1px solid #0085ff"
        className={styles.tooltip}>
        <SkillContent
          skills={skills.filter(s => !selectedSkills[s.id])}
          onChange={handleChangeSkills} />
      </Tooltip>
    </div>
  )
}

export default Wrapper
