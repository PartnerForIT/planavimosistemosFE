import React from 'react'
import classNames from 'classnames'
import StyledCheckbox from '../Checkbox/Checkbox'
import styles from './CheckboxGroupRaw.module.scss'

export default function CheckboxGroup({ className, items, onChange }) {
  return (
    <div className={classNames(styles.checkboxGroup, className)}>
      <div className={classNames(styles.contentBox)}>
        {
          items.map((item, idx) => (
            <StyledCheckbox
              key={(item.label || item.name || item.title) + idx.toString()}
              label={(item.label || item.name || item.title)}
              checked={Boolean(item.checked)}
              disabled={item.disabled}
              onChange={() => onChange(item, Boolean(item.checked))}
            />
          ))
        }
      </div>
    </div>
  );
}
