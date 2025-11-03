import React, { useState, forwardRef, useImperativeHandle, useRef, useEffect, Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import Dialog from '@material-ui/core/Dialog'

import styles from './styles.module.scss'

import { getAIGenerationSettings, updateAIGenerationSettings } from '../../../../api'

import Button from '../../Button/Button'
import Checkbox from '../../../Core/AppCheckbox'

const formConfig = {
  hours_limit_per_day: {
    title: 'Work hours limit per day',
    type: 'number'
  },
  hours_limit_per_week: {
    title: 'Work hours limit per week',
    type: 'number'
  },
  hours_limit_per_7_days: {
    title: 'Work hours limit per 7 days in a row',
    type: 'number'
  },
  work_consecutive_days_week: {
    title: 'Can work consecutive days per week',
    type: 'number',
    divider: true,
  },
  night_hours: {
    title: 'Night hours',
    type: 'checkbox',
  },
  night_hours_limit: {
    title: 'No more night hours than',
    type: 'number',
    divider: true,
  },
  rest_times: {
    title: 'Rest times',
    type: 'checkbox',
  },
  minimum_rest_hours: {
    title: 'Minimum rest hours between work',
    type: 'number',
  },
  consecutive_non_break_hours: {
    title: 'Consecutive non-breakable non-working hours',
    type: 'number',
  },
  total_limit_per_7_days: {
    title: 'Total non-working hours per 7 days in a row',
    type: 'number',
    divider: true,
  },
  age18: {
    title: 'Apply rule for under 18 age, pregnant, breastfeeding',
    description: '(can’t work more than X hours per day, can’t work on Sundays, can’t work after 22:00 till 06:00)',
    type: 'checkbox',
  },
  generate_with_demand: {
    title: 'Generate with demand planning data included',
    type: 'checkbox',
  },
  generate_with_time_off: {
    title: 'Generate with time off data included',
    type: 'checkbox',
  },
  generate_with_accumulated_hours: {
    title: 'Generate with accumulated hours data and limits included',
    type: 'checkbox',
  },
}

const GenerationAIEventsSettings = forwardRef(({companyId, onSubmit}, ref) => {
  const { t } = useTranslation()

  const [settings, setSettings] = useState({
    hours_limit_per_day: 12,
    hours_limit_per_week: 52,
    hours_limit_per_7_days: 60,
    work_consecutive_days_week: 6,
    night_hours: false,
    night_hours_limit: 2,
    rest_times: false,
    minimum_rest_hours: 11,
    consecutive_non_break_hours: 12,
    total_limit_per_7_days: 48,
    age18: false,
    generate_with_demand: true,
    generate_with_time_off: false,
    generate_with_accumulated_hours: true,
  })
  const [open, setOpen] = useState(false)

  const shiftIdRef = useRef(null)

  useEffect(() => {
    getAIGenerationSettings(companyId).then(res => {
      console.log('settings ai -> ', res)
    })
  }, [])

  useImperativeHandle(ref, () => ({
    open: (shiftId) => {
      shiftIdRef.current = shiftId
      setOpen(true)
    }
  }))

  const handleChangeForm = (field) => (value) => {
    if (typeof value === 'string') {
      value = value.replace(/\D/g, '')
      value = value ? parseInt(value, 10) : ''
    }
    setSettings({
      ...settings,
      [field]: value,
    })
  }

  const handleBlur = (field) => (e) => {
    if (e.target.value === '') {
      handleChangeForm(field)(0)
    }
  }

  const handleSubmit = async () => {
    const res = await updateAIGenerationSettings(companyId, settings)
    console.log(res)
    if (res) {
      onSubmit(shiftIdRef.current)
      setOpen(false)
    }
  }

  return (
    <Dialog onClose={() => setOpen(false)} open={open} maxWidth="md">
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <div className={styles.icon}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={33}
              height={33}
              fill="none"
            >
              <path
                fill="#E2EBF4"
                fillOpacity={0.85}
                d="M16.108 32.191A16.2 16.2 0 0 0 32.2 16.087 16.212 16.212 0 0 0 16.092 0 16.2 16.2 0 0 0 0 16.087a16.216 16.216 0 0 0 16.108 16.104ZM7.99 17.88a1.132 1.132 0 0 1-1.146-1.162 1.123 1.123 0 0 1 1.146-1.129h6.956V6.242a1.137 1.137 0 0 1 1.146-1.145 1.137 1.137 0 0 1 1.146 1.146v10.476a1.13 1.13 0 0 1-1.146 1.161H7.99Z"
              />
            </svg>
          </div>
          <div className={styles.content}>
            <div className={styles.title}>{ t('Schedule Generation with AI') }</div>
            <div className={styles.label}>{ t('For employees with full work status:') }</div>
            {
              Object.entries(settings).map(([key, value], index) => {
                const config = formConfig[key]
                return (
                  <Fragment key={key}>
                    <div className={styles.row}>
                      {
                        (type => {
                          switch (type) {
                            case 'checkbox':
                              return (
                                <>
                                  <Checkbox checked={value} onChange={handleChangeForm(key)} />
                                  <div className={styles.label}>
                                    <div>{ t(config.title) }</div>
                                    {
                                      config.description && <div style={{fontSize: 10}}>{ t(config.description) }</div>
                                    }
                                  </div>
                                </>
                              )
                            case 'number':
                              return (
                                <>
                                  <div className={styles.label}>{ t(config.title) }:</div>
                                  <input
                                    value={value}
                                    onChange={e => handleChangeForm(key)(e.target.value)}
                                    className={styles.input}
                                    onBlur={handleBlur(key)}
                                    type="text" />
                                </>
                              )
                            default:
                              return null
                          }
                        })(config.type) 
                      }
                    </div>
                    {
                      config.divider && <div className={styles.divider} />
                    }
                  </Fragment>
                )
              })
            }
          </div>
        </div>
        <Button onClick={handleSubmit} size="large">
          { t('Generate') }
        </Button>
      </div>
    </Dialog>
  )
})

export default GenerationAIEventsSettings
