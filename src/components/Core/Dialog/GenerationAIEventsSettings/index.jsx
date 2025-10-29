import React, { useState, forwardRef, useImperativeHandle, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import Dialog from '@material-ui/core/Dialog'

import styles from './styles.module.scss'

import Button from '../../Button/Button'

const GenerationAIEventsSettings = forwardRef(({onSubmit}, ref) => {
  const { t } = useTranslation()
  
  const [settings, setSettings] = useState({})
  const [open, setOpen] = useState(false)

  const shiftIdRef = useRef(null)

  useImperativeHandle(ref, () => ({
    open: (shiftId) => {
      shiftIdRef.current = shiftId
      setOpen(true)
    }
  }))

  const handleSubmit = () => {
    onSubmit(shiftIdRef.current)
    setOpen(false)
  }

  return (
    <Dialog onClose={() => setOpen(false)} open={open}>
      <div className={styles.container}>
        <Button onClick={handleSubmit} size="large">
          { t('Generate') }
        </Button>
      </div>
    </Dialog>
  )
})

export default GenerationAIEventsSettings
