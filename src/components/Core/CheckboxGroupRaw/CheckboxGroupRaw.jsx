import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import StyledCheckbox from '../Checkbox/Checkbox';
import styles from './CheckboxGroupRaw.module.scss';

export default function CheckboxGroup({ items, onChange }) {
  const [itemsArray, setItemsArray] = useState([]);

  useEffect(() => {
    setItemsArray(items.map((item) => ({ ...item, checked: !!item.checked })));
  }, [items]);

  return (
    <div className={classNames(styles.checkboxGroup)}>
      <div className={classNames(styles.contentBox)}>
        {
          itemsArray.map((item, idx) => (
            <StyledCheckbox
              key={item.label + idx.toString()}
              label={item.label}
              checked={item.checked}
              disabled={item.disabled}
              onChange={() => onChange(item)}
            />
          ))
        }
      </div>
    </div>
  );
}
